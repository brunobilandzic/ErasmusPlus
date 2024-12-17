import dbConnect from "../../lib/mongodb";
import Role from "../../model/Role";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      await dbConnect();

      const roles = await Role.find({
        name: { $in: ["student", "professor"] },
      }).select("name _id");

      res.status(200).json({ roles });
    } catch (error) {
      console.error("Error fetching roles:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
