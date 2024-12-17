import dbConnect from "../../lib/mongodb";
import User from "../../model/User";
import Role from "../../model/Role";
import bcrypt from "bcrypt";

const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password, confirmPassword, roleName } = req.body;

    if (!email || !password || !confirmPassword || !roleName) {
      return res.status(400).json({
        message: "Email, password, confirm password, and role are required",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    try {
      await dbConnect();

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

      const role = await Role.findOne({ name: roleName });
      if (!role) {
        return res.status(400).json({ message: "Invalid role" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        email,
        password: hashedPassword,
        role: role._id,
      });

      res
        .status(201)
        .json({ message: "User registered successfully", userId: newUser._id });
    } catch (error) {
      console.error("Error registering user:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
