import { connectDB } from "../lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// GET
export async function GET() {
  try {
    const db = await connectDB();
    const tasks = await db.collection("tasks").find().toArray();
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST 
export async function POST(req) {
  try {
    const db = await connectDB();
    const { data, completed } = await req.json();
    const result = await db.collection("tasks").insertOne({ data, completed: completed || false });
    return NextResponse.json({ _id: result.insertedId, data, completed }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT 
export async function PUT(req) {
  try {
    const db = await connectDB();
    const { id, data, completed } = await req.json();
    const result = await db.collection("tasks").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { data, completed } },
      { returnDocument: "after" }
    );
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE 
export async function DELETE(req) {
  try {
    const db = await connectDB();
    const { id } = await req.json();
    console.log(id)
    await db.collection("tasks").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ message: "Task deleted" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

