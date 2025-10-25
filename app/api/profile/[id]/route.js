// app/api/user/[id]/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/app/lib/dbconnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// GET /api/user/[id] - Get specific user data (only for current user)
// GET /api/user/[id] - Get specific user data (only for current user)
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Ensure user can only access their own data
    if (session.user.id !== params.id) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    const collection = await dbConnect('userCollection');
    
    let user;
    try {
      // Option 1: Use exclusion only (exclude password only)
      user = await collection.findOne(
        { _id: new ObjectId(params.id) },
        { 
          projection: { 
            password: 0 // Only exclude password, include all other fields
          }
        }
      );
    } catch (objectIdError) {
      // If ObjectId fails, try with string ID
      user = await collection.findOne(
        { _id: params.id },
        { 
          projection: { 
            password: 0
          }
        }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Manually filter the response to include only the fields you want
    const filteredUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      city: user.city,
      country: user.country,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      role: user.role,
      photoURL: user.photoURL,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified
    };

    return NextResponse.json({
      success: true,
      user: filteredUser
    });

  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: "Internal server error: " + error.message },
      { status: 500 }
    );
  }
}

// PUT /api/user/[id] - Update current user data
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Ensure user can only update their own data
    if (session.user.id !== params.id) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    const updates = await request.json();
    const collection = await dbConnect('userCollection');

    // Filter allowed fields that users can update
    const allowedFields = ['name', 'phone', 'address', 'city', 'country', 'dateOfBirth', 'gender', 'photoURL'];
    const filteredUpdates = {};
    
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field];
      }
    });

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(params.id) },
      { 
        $set: {
          ...filteredUpdates,
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
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}