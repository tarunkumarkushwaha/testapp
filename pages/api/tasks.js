import { connectDB } from "./lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  try {
    const db = await connectDB();

    if (req.method === "GET") {
      const tasks = await db.collection("tasks").find().toArray();
      return res.status(200).json(tasks);
    }

    if (req.method === "POST") {
      const { data, completed } = req.body;
      const result = await db.collection("tasks").insertOne({ data, completed: completed || false });
      return res.status(201).json({ _id: result.insertedId, data, completed });
    }

    if (req.method === "PUT") {
      const { id, data, completed } = req.body;
      const result = await db.collection("tasks").findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { data, completed } },
        { returnDocument: "after" }
      );
      return res.status(200).json(result);
    }

    if (req.method === "DELETE") {
      const { id } = req.body;
      await db.collection("tasks").deleteOne({ _id: new ObjectId(id) });
      return res.status(200).json({ message: "Task deleted" });
    }

    return res.status(405).json({ error: "Method Not Allowed" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

