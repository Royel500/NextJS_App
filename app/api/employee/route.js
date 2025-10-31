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

    // Use your existing email API
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      console.error('Failed to send email');
    } else {
      console.log('Email sent successfully to:', userEmail);
    }

    return response.ok;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
}

function generateEmailTemplate(name, status, position) {
  if (status === 'rejected') {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #dc2626; margin: 0;">Application Status Update</h2>
        </div>
        <p>Dear <strong>${name}</strong>,</p>
        <p>Thank you for your interest in joining our team and for taking the time to apply for the <strong>${position}</strong> position.</p>
        <p>After careful consideration of all applications, we regret to inform you that we have decided to move forward with other candidates whose qualifications more closely match our current needs.</p>
        <p>We truly appreciate your interest in our company and encourage you to apply for future positions that match your skills and experience.</p>
        <br>
        <p>We wish you the best in your job search and future endeavors.</p>
        <br>
        <p>Best regards,<br>
        <strong>HR Team</strong></p>
      </div>
    `;
  } else {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #16a34a; margin: 0;">🎉 Congratulations!</h2>
        </div>
        <p>Dear <strong>${name}</strong>,</p>
        <p>We are thrilled to inform you that your application has been <strong>approved</strong>!</p>
        <p>You are now officially a <strong style="color: #16a34a;">${position}</strong> in our team.</p>
        <p>Welcome to the family! We were very impressed with your qualifications and experience, and we believe you will be a valuable addition to our team.</p>
        <br>
        <p><strong>Next Steps:</strong></p>
        <ul>
          <li>Our HR team will contact you within 2-3 business days</li>
          <li>They will guide you through the onboarding process</li>
          <li>You'll receive details about your start date and initial training</li>
        </ul>
        <br>
        <p>Once again, congratulations! We look forward to working with you.</p>
        <br>
        <p>Welcome aboard!<br>
        <strong>HR Team</strong></p>
      </div>
    `;
  }
}

function generateTextEmail(name, status, position) {
  if (status === 'rejected') {
    return `
Dear ${name},

Thank you for your interest in joining our team and for taking the time to apply for the ${position} position.

After careful consideration of all applications, we regret to inform you that we have decided to move forward with other candidates whose qualifications more closely match our current needs.

We truly appreciate your interest in our company and encourage you to apply for future positions that match your skills and experience.

We wish you the best in your job search and future endeavors.

Best regards,
HR Team
    `;
  } else {
    return `
Dear ${name},

We are thrilled to inform you that your application has been approved!

You are now officially a ${position} in our team.

Welcome to the family! We were very impressed with your qualifications and experience, and we believe you will be a valuable addition to our team.

Next Steps:
- Our HR team will contact you within 2-3 business days
- They will guide you through the onboarding process
- You'll receive details about your start date and initial training

Once again, congratulations! We look forward to working with you.

Welcome aboard!
HR Team
    `;
  }
}