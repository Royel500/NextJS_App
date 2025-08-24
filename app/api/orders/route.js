import dbConnect from "@/app/lib/dbconnect";



export async function POST(req) {
  try {
    const body = await req.json();
    const collection = await dbConnect("Orders"); 

    const result = await collection.insertOne(body);

    return Response.json({ success: true, insertedId: result.insertedId });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to create order" }, { status: 500 });
  }
}
