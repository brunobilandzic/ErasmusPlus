import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    return res
      .status(500)
      .json({ message: "Missing MONGODB_URI in .env.local" });
  }

  try {
    const client = await MongoClient.connect(uri);
    const db = client.db();

    const collections = await db.listCollections().toArray();

    client.close();

    res.status(200).json({ message: "Connection successful!", collections });
  } catch (error) {
    console.error("Database connection failed:", error);
    res
      .status(500)
      .json({ message: "Database connection failed", error: error.message });
  }
}
