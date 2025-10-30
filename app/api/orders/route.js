import dbConnect from "@/app/lib/dbconnect";
import { ObjectId } from 'mongodb';



export async function POST(req) {
  try {
    const body = await req.json();

    // Ensure price is a number
    body.price = Number(body.price);
    body.createdAt = new Date(); // Add timestamp for sorting

    const collection = await dbConnect("Orders"); 
    const result = await collection.insertOne(body);

    return new Response(JSON.stringify({ success: true, insertedId: result.insertedId }), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to create order" }), { status: 500 });
  }
}



// GET: Read all orders
export async function GET() {
  try {
    const collection = await dbConnect('Orders');
    const orders = await collection.find({}).sort({ createdAt: -1 }).toArray(); // newest first

    // Convert ObjectId to string for front-end
    const sanitized = orders.map(order => ({
      ...order,
      _id: order._id.toString(),
      createdAt: order.createdAt?.toISOString() || null
    }));

    return new Response(JSON.stringify(sanitized), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: 'Failed to fetch orders' }), { status: 500 });
  }
}


export async function PUT(request) {
  try {
    const { id, status } = await request.json();

    if (!ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ message: "Invalid order ID" }), { status: 400 });
    }

    const collection = await dbConnect("Orders");

    // Get current order
    const order = await collection.findOne({ _id: new ObjectId(id) });
    if (!order) {
      return new Response(JSON.stringify({ message: "Order not found" }), { status: 404 });
    }

    // Set default status if missing
    let newStatus = status;
    if (!order.status) {
      newStatus = status || "pending";
    }

    // Update order status
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: newStatus } }
    );

    return new Response(
      JSON.stringify({ message: "Order updated", modifiedCount: result.modifiedCount }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Failed to update order" }), { status: 500 });
  }
}


export async function DELETE(request) {
  try {
    const { id } = await request.json();
    const collection = await dbConnect('Orders');

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    return new Response(JSON.stringify({ message: 'Order deleted', deletedCount: result.deletedCount }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: 'Failed to delete order' }), { status: 500 });
  }
}
