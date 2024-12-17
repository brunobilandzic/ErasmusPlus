import dbConnect from "../../lib/mongodb";
import User from "../../model/User";

export default async function handler(req, res) {
  if (req.method === "POST") {
    await dbConnect();

    try {
      await User.createCollection();
      return res
        .status(200)
        .json({ message: "Empty users collection created" });
    } catch (error) {
      console.error("Error creating users collection:", error);
      return res.status(500).json({
        message: "Failed to create users collection",
        error: error.message,
      });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
