import { ObjectId } from 'mongodb';
import dbConnect from '@/app/lib/dbconnect';

// GET single user
export async function GET(req, { params }) {
  try {
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return Response.json({ error: "Invalid ID" }, { status: 400 });
    }

    const collection = await dbConnect('userCollection');
    const user = await collection.findOne({ _id: new ObjectId(id) });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    
    return Response.json(userWithoutPassword);
  } catch (error) {
    console.error("GET error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// UPDATE user
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    console.log('Received ID:', id);
    console.log('ID type:', typeof id);

    // Check if id is provided
    if (!id) {
      return Response.json({ error: "ID is required" }, { status: 400 });
    }

    const updatedFields = await req.json();
    console.log('Updated fields:', updatedFields);

    if (!updatedFields || Object.keys(updatedFields).length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    const collection = await dbConnect('userCollection');

    let result;
    
    // Try with ObjectId first, if it fails try with string directly
    try {
      // First attempt: Try with ObjectId
      result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedFields }
      );
    } catch (objectIdError) {
      console.log('ObjectId conversion failed, trying with string ID...');
      
      // Second attempt: Try with string directly
      result = await collection.updateOne(
        { _id: id },
        { $set: updatedFields }
      );
    }

    console.log('Update result:', result);

    if (result.matchedCount === 0) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({ 
      success: true, 
      modifiedCount: result.modifiedCount,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error("PUT error:", error);
    return Response.json({ 
      error: "Internal Server Error",
      details: error.message 
    }, { status: 500 });
  }
}

// DELETE user
export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return Response.json({ error: "Invalid ID" }, { status: 400 });
    }

    const collection = await dbConnect('userCollection');

    const result = await collection.deleteOne(
      { _id: new ObjectId(id) }
    );

    if (result.deletedCount === 0) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({ 
      success: true, 
      message: "User deleted successfully",
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error("DELETE error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}