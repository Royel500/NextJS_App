// app/api/user/profile/route.js (For string IDs)
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/app/lib/dbconnect";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("Session user ID:", session.user.id);

    const collection = await dbConnect('userCollection');
    const user = await collection.findOne(
      { _id: session.user.id }, // Direct string comparison
      { 
        projection: { 
          password: 0
        }
      }
    );

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: "Internal server error: " + error.message },
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
    const { password, email, role, _id, ...safeUpdates } = updates;

    // Define allowed fields for update
    const allowedFields = ['name', 'phone', 'address', 'city', 'country', 'dateOfBirth', 'gender', 'photoURL'];
    const filteredUpdates = {};
    
    allowedFields.forEach(field => {
      if (safeUpdates[field] !== undefined) {
        filteredUpdates[field] = safeUpdates[field];
      }
    });

    const result = await collection.findOneAndUpdate(
      { _id: session.user.id }, // Direct string comparison
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
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: "Internal server error: " + error.message },
      { status: 500 }
    );
  }
}