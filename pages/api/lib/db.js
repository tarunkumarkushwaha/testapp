const { uri } = process.env

import { MongoClient } from "mongodb";

if (!uri) throw new Error("MONGODB_URI is not defined");

const client = new MongoClient(uri);
let db;

export const connectDB = async () => {
  if (!db) {
    await client.connect();
    db = client.db("taskmanager"); 
  }
  return db;
};
