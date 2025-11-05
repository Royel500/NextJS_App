import dbConnect from '@/app/lib/dbconnect';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function POST(req) {
  try {
    // Check if it's form data
    const contentType = req.headers.get('content-type');
    
    if (contentType && contentType.includes('multipart/form-data')) {
      // Handle FormData
      const formData = await req.formData();
      
      // Extract form fields
      const name = formData.get('name');
      const email = formData.get('email');
      const address = formData.get('address');
      const phone = formData.get('phone');
      const position = formData.get('position');
      const additionalInfo = formData.get('additionalInfo');
      const certificate = formData.get('certificate');

      // Validate required fields
      if (!name || !email || !phone || !position) {
        return NextResponse.json(
          { success: false, error: 'Name, email, phone, and position are required' },
          { status: 400 }
        );
      }

      // Handle file upload if certificate exists
      let certificateData = null;
      if (certificate && certificate.size > 0) {
        // Convert file to buffer for storage
        const bytes = await certificate.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        certificateData = {
          filename: certificate.name,
          mimetype: certificate.type,
          size: certificate.size,
          data: buffer.toString('base64') // Store as base64 string
        };
      }

      // Prepare application data
      const applicationData = {
        name: name.toString(),
        email: email.toString(),
        address: address?.toString() || '',
        phone: phone.toString(),
        position: position.toString(),
        additionalInfo: additionalInfo?.toString() || '',
        certificate: certificateData,
        status: 'pending',
        appliedAt: new Date().toISOString(),
      };

      console.log('Processing application:', { 
        name: applicationData.name,
        email: applicationData.email,
        position: applicationData.position 
      });

      // Save to database
      const collection = await dbConnect('employees');
      const result = await collection.insertOne(applicationData);
      
      console.log('Database insert successful:', result.insertedId);

      return NextResponse.json({ 
        success: true, 
        insertedId: result.insertedId,
        message: 'Application submitted successfully' 
      }, { status: 201 });

    } else {
      // Handle JSON data (fallback)
      try {
        const newApplication = await req.json();
        
        // Validate required fields
        if (!newApplication.name || !newApplication.email || !newApplication.phone || !newApplication.position) {
          return NextResponse.json(
            { success: false, error: 'Name, email, phone, and position are required' },
            { status: 400 }
          );
        }

        const applicationData = {
          name: newApplication.name.toString(),
          email: newApplication.email.toString(),
          address: newApplication.address?.toString() || '',
          phone: newApplication.phone.toString(),
          position: newApplication.position.toString(),
          additionalInfo: newApplication.additionalInfo?.toString() || '',
          certificate: newApplication.certificate || null,
          status: 'pending',
          appliedAt: new Date().toISOString(),
        };

        const collection = await dbConnect('employees');
        const result = await collection.insertOne(applicationData);

        return NextResponse.json({ 
          success: true, 
          insertedId: result.insertedId,
          message: 'Application submitted successfully' 
        }, { status: 201 });

      } catch (jsonError) {
        console.error('JSON Parse Error:', jsonError);
        return NextResponse.json(
          { success: false, error: 'Invalid JSON data' },
          { status: 400 }
        );
      }
    }

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// GET: Fetch all employee applications
export async function GET() {
  try {
    const collection = await dbConnect('employees');
    const applications = await collection.find({}).sort({ appliedAt: -1 }).toArray();
    
    console.log('Fetched applications:', applications.length); // Debug log
    
    return NextResponse.json({ 
      success: true, 
      data: applications 
    });
    
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}

// PATCH: Update application status
export async function PATCH(req) {
  try {
    const { applicationId, status, position } = await req.json();

    if (!applicationId || !status) {
      return NextResponse.json(
        { success: false, error: 'Application ID and status are required' },
        { status: 400 }
      );
    }

    const collection = await dbConnect('employees');
    
    // Get application first to send email
    const application = await collection.findOne({ _id: new ObjectId(applicationId) });
    
    if (!application) {
      return NextResponse.json(
        { success: false, error: 'Application not found' },
        { status: 404 }
      );
    }

    // Update status
    const newStatus = status === 'approved' ? `${position} active` : 'rejected';
    const updateData = { 
      status: newStatus,
      updatedAt: new Date().toISOString()
    };

    const result = await collection.updateOne(
      { _id: new ObjectId(applicationId) },
      { $set: updateData }
    );

    console.log('Status updated:', { applicationId, newStatus, result });

    // Send email notification
    if (application.email) {
      await sendStatusEmail(application.email, application.name, newStatus, position);
    }

    return NextResponse.json({ 
      success: true, 
      message: `Application ${status} successfully`,
      data: updateData
    });

  } catch (error) {
    console.error('Update Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update application' },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { id: applicationId } = await req.json();

    console.log('Delete request for ID:', applicationId); // Debug log

    if (!applicationId) {
      return NextResponse.json(
        { success: false, error: 'Application ID is required' },
        { status: 400 }
      );
    }

    const collection = await dbConnect('employees');
    
    const result = await collection.deleteOne({ 
      _id: new ObjectId(applicationId) 
    });

    console.log('Delete result:', result); // Debug log

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Application deleted successfully' 
    });

  } catch (error) {
    console.error('Delete Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete application' },
      { status: 500 }
    );
  }
}
// Email sending function using your existing nodemailer setup
async function sendStatusEmail(userEmail, userName, status, position) {
  try {
    const emailData = {
      to: userEmail,
      subject: status === 'rejected' 
        ? 'Application Status Update' 
        : `Congratulations! You're now a ${position}`,
      html: generateEmailTemplate(userName, status, position),
      text: generateTextEmail(userName, status, position)
    };

    console.log('Attempting to send email to:', userEmail); // Debug log

    // Use absolute URL to avoid issues
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    const responseData = await response.json(); // Read the response
    console.log('Email API response:', response.status, responseData); // Debug log

    if (!response.ok) {
      console.error('Failed to send email:', responseData.message);
      throw new Error(responseData.message || 'Email sending failed');
    } else {
      console.log('✅ Email sent successfully to:', userEmail);
    }

    return true;
  } catch (error) {
    console.error('Email error:', error.message);
    // Don't throw error here - we don't want to block the status update
    return false;
  }
}

function generateEmailTemplate(name, status, position) {
  const header = `
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center; color: white;">
      <div style="max-width: 600px; margin: 0 auto;">
        <h1 style="margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
          ${status === 'rejected' ? 'Royal Invoice' : 'Royal Invoice'}
        </h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">
          ${status === 'rejected' ? 'Application Update' : 'Welcome to Our Team!'}
        </p>
      </div>
    </div>
  `;

  const footer = `
    <div style="background: #f8f9fa; padding: 25px 20px; text-align: center; border-top: 1px solid #e9ecef;">
      <div style="max-width: 600px; margin: 0 auto;">
        <div style="margin-bottom: 15px;">
          <a href="https://www.instagram.com/royel52888/" style="margin: 0 10px; text-decoration: none;">
            <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" width="24" height="24" style="border-radius: 50%;">
          </a>
          <a href="#" style="margin: 0 10px; text-decoration: none;">
            <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" width="24" height="24" style="border-radius: 50%;">
          </a>
          <a href="https://twitter.com/royel528 " style="margin: 0 10px; text-decoration: none;">
            <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" width="24" height="24" style="border-radius: 50%;">
          </a>
        </div>
        <p style="margin: 0; color: #6c757d; font-size: 14px;">
          © 2024 Royal Invoice. All rights reserved.<br>
          <span style="font-size: 12px; color: #adb5bd;">
            123 Business Avenue, Suite 100, City, State 12345
          </span>
        </p>
      </div>
    </div>
  `;

  if (status === 'rejected') {
    const body = `
      <div style="padding: 40px 30px; background: white;">
        <div style="max-width: 500px; margin: 0 auto;">
          <!-- Status Icon -->
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="background: #fee2e2; width: 80px; height: 80px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
              <span style="font-size: 36px; color: #dc2626;">✕</span>
            </div>
          </div>

          <!-- Main Content -->
          <h2 style="color: #1f2937; text-align: center; margin-bottom: 25px; font-size: 24px;">
            Application Status Update
          </h2>
          
          <p style="color: #6b7280; line-height: 1.6; margin-bottom: 20px;">
            Dear <strong style="color: #374151;">${name}</strong>,
          </p>
          
          <p style="color: #6b7280; line-height: 1.6; margin-bottom: 20px;">
            Thank you for your interest in joining <strong>Royal Invoice</strong> and for taking the time to apply for the 
            <strong style="color: #374151;"> ${position}</strong> position.
          </p>
          
          <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 25px 0;">
            <p style="color: #7f1d1d; margin: 0; line-height: 1.5;">
              After careful consideration of all applications, we regret to inform you that we have decided to move forward with other candidates whose qualifications more closely match our current needs.
            </p>
          </div>
          
          <p style="color: #6b7280; line-height: 1.6; margin-bottom: 20px;">
            We truly appreciate your interest in our company and encourage you to apply for future positions that match your skills and experience.
          </p>
          
          <p style="color: #6b7280; line-height: 1.6;">
            We wish you the best in your job search and future endeavors.
          </p>
        </div>
      </div>
    `;

    return `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
        ${header}
        ${body}
        ${footer}
      </div>
    `;
  } else {
    const body = `
      <div style="padding: 40px 30px; background: white;">
        <div style="max-width: 500px; margin: 0 auto;">
          <!-- Status Icon -->
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="background: #dcfce7; width: 80px; height: 80px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
              <span style="font-size: 36px; color: #16a34a;">✓</span>
            </div>
          </div>

          <!-- Main Content -->
          <h2 style="color: #1f2937; text-align: center; margin-bottom: 10px; font-size: 28px; font-weight: 700;">
            Congratulations! 🎉
          </h2>
          <p style="color: #6b7280; text-align: center; margin-bottom: 30px; font-size: 18px;">
            Welcome to Royal Invoice
          </p>
          
          <p style="color: #6b7280; line-height: 1.6; margin-bottom: 20px;">
            Dear <strong style="color: #374151;">${name}</strong>,
          </p>
          
          <p style="color: #6b7280; line-height: 1.6; margin-bottom: 20px;">
            We are thrilled to inform you that your application has been <strong style="color: #16a34a;">approved</strong>!
          </p>
          
          <div style="background: #f0fdf4; border: 2px solid #bbf7d0; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;">
            <p style="margin: 0; color: #15803d; font-size: 20px; font-weight: 600;">
              You are now officially a<br>
              <span style="color: #16a34a; font-size: 24px;">${position}</span>
            </p>
          </div>
          
          <p style="color: #6b7280; line-height: 1.6; margin-bottom: 25px;">
            Welcome to the Royal Invoice family! We were very impressed with your qualifications and experience, and we believe you will be a valuable addition to our team.
          </p>
          
          <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin: 25px 0;">
            <h3 style="color: #374151; margin-bottom: 15px; font-size: 18px;">📋 Next Steps:</h3>
            <ul style="color: #6b7280; line-height: 1.6; margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 8px;">Our HR team will contact you within 2-3 business days</li>
              <li style="margin-bottom: 8px;">They will guide you through the onboarding process</li>
              <li style="margin-bottom: 8px;">You'll receive details about your start date and initial training</li>
              <li>Complete your pre-employment documentation</li>
            </ul>
          </div>
          
          <p style="color: #6b7280; line-height: 1.6; text-align: center; margin-top: 30px;">
            Once again, congratulations! We look forward to working with you.
          </p>
        </div>
      </div>
    `;

    return `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
        ${header}
        ${body}
        ${footer}
      </div>
    `;
  }
}

function generateTextEmail(name, status, position) {
  if (status === 'rejected') {
    return `
ROYAL INVOICE - Application Status Update
===========================================

Dear ${name},

Thank you for your interest in joining Royal Invoice and for taking the time to apply for the ${position} position.

After careful consideration of all applications, we regret to inform you that we have decided to move forward with other candidates whose qualifications more closely match our current needs.

We truly appreciate your interest in our company and encourage you to apply for future positions that match your skills and experience.

We wish you the best in your job search and future endeavors.

Best regards,
HR Team
The Royal 

---
© 2024 The Royal Global Solution. All rights reserved.
123 Business Avenue, Suite 100, City, State 12345
    `;
  } else {
    return `
ROYAL INVOICE - Congratulations!
=================================

Dear ${name},

We are thrilled to inform you that your application has been approved!

You are now officially a ${position} at Royal Invoice.

Welcome to the family! We were very impressed with your qualifications and experience, and we believe you will be a valuable addition to our team.

NEXT STEPS:
- Our HR team will contact you within 2-3 business days
- They will guide you through the onboarding process
- You'll receive details about your start date and initial training
- Complete your pre-employment documentation

Once again, congratulations! We look forward to working with you.

Welcome aboard!

HR Team
The Royal 

---
© 2024 The Royal Global Solution. All rights reserved.
123 Business Avenue, Suite 100, City, State 12345
    `;
  }
}