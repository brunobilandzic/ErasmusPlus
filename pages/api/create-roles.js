import dbConnect from "../../lib/mongodb";
import Role from "../../model/Role";

export default async function handler(req, res) {
  if (req.method === "POST") {
    await dbConnect();

    try {
      const roles = ["admin", "student", "professor"];
      for (const roleName of roles) {
        await Role.findOneAndUpdate(
          { name: roleName },
          { name: roleName },
          { upsert: true, new: true }
        );
      }
      res.status(200).json({ message: "Roles initialized successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
