// app/api/auth/register/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbconnect';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const payload = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'password'];
    const missingFields = requiredFields.filter(field => !payload[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: true, message: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.email)) {
      return NextResponse.json(
        { error: true, message: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // Validate phone number
    const phoneRegex = /^\d{10,15}$/;
    const cleanPhone = payload.phone.replace(/\D/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json(
        { error: true, message: "Please provide a valid phone number (10-15 digits)." },
        { status: 400 }
      );
    }

    // Validate password strength
    if (payload.password.length < 6) {
      return NextResponse.json(
        { error: true, message: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const collection = await dbConnect('userCollection');

    // Check if user already exists by email or phone
    const existingUser = await collection.findOne({
      $or: [
        { email: payload.email.toLowerCase() },
        { phone: cleanPhone }
      ]
    });

    if (existingUser) {
      if (existingUser.email === payload.email.toLowerCase()) {
        return NextResponse.json(
          { error: true, message: "User with this email already exists. Please login instead." },
          { status: 409 }
        );
      }
      if (existingUser.phone === cleanPhone) {
        return NextResponse.json(
          { error: true, message: "User with this phone number already exists." },
          { status: 409 }
        );
      }
    }

    // Hash the password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(payload.password, saltRounds);

    // Create user object
    const newUser = {
      // Personal Information
      name: payload.name.trim(),
      email: payload.email.toLowerCase().trim(),
      phone: cleanPhone,
      dateOfBirth: payload.dateOfBirth || null,
      gender: payload.gender || '',

      // Address Information
      address: payload.address || '',
      city: payload.city || '',
      country: payload.country || '',

      // Profile
      photoURL: payload.photoURL || '',

      // Security
      password: hashedPassword,

      // Account Details
      role: 'user',
      emailVerified: false,
      phoneVerified: false,
      
      // Timestamps
      createdAt: new Date(),
      
      // Additional fields
      status: 'active',
      lastLogin: null
    };

    // Insert new user
    const result = await collection.insertOne(newUser);

    // Return success response without password
    const { password, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      success: true,
      message: "User registered successfully!",
      user: userWithoutPassword,
      userId: result.insertedId
    }, { status: 201 });

  } catch (error) {
    console.error("Registration error:", error);
    
    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json(
        { error: true, message: "User with this email or phone already exists." },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: true, message: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}

// app/api/auth/users/route.js (Simple version)

export async function GET() {
  try {
    const collection = await dbConnect('userCollection');
    
    // Get all users without passwords
    const users = await collection.find(
      {}, 
      { projection: { password: 0 } }
    ).toArray();

    return NextResponse.json({
      success: true,
      count: users.length,
      users
    });

  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: true, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const updates = await request.json();
    const collection = await dbConnect('userCollection');

    // Remove fields that shouldn't be updated
    const { password, email, role, ...safeUpdates } = updates;

    const result = await collection.findOneAndUpdate(
      { _id: session.user.id },
      { 
        $set: {
          ...safeUpdates,
          updatedAt: new Date()
        }
      },
      { 
        returnDocument: 'after',
        projection: { password: 0 }
      }
    );

    if (!result) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: result
    });

  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}