
'use server'
import dbConnect from '@/app/lib/dbconnect';
import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';



// Ok Ace----
// POST: Create a new item
export async function POST(req) {
  const newItem = await req.json();
  const collection = await dbConnect('nextJs');
  const result = await collection.insertOne(newItem);
  revalidatePath('/products')
  return Response.json({ insertedId: result.insertedId });
}


// GET: Read all items
export async function GET() {
  const collection = await dbConnect('nextJs');
  const items = await collection.find({}).sort({ createdAt: -1 }).toArray();
  return Response.json(items);
}


