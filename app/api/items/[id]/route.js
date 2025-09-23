'use server'
import dbConnect from "@/app/lib/dbconnect";
import { ObjectId } from "mongodb";


export async function GET(reques, { params }) {
  const {id} = await params;

  try {
    const collection = await dbConnect('nextJs');
    const item = await collection.findOne({ _id: new ObjectId(id) });

    return Response.json(item);
  } catch (error) {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}



// -------projuct---update----------

export async function PUT(req, { params }) {
  try {
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return Response.json({ error: "Invalid ID" }, { status: 400 });
    }

    const updatedFields = await req.json();

    if (!updatedFields || Object.keys(updatedFields).length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    // connect to db + collection
  const collection = await dbConnect('nextJs');

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedFields }
    );

    if (result.matchedCount === 0) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    return Response.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (error) {
    console.error("PUT error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


// ---ok ace--
// DELETE: Delete an item by ID
export async function DELETE(req, { params }) {
  const { id } = params;
  const collection = await dbConnect('nextJs');
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return Response.json({ deletedCount: result.deletedCount });
}

