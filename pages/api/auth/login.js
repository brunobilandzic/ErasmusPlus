import { compare } from "bcryptjs";
import dbConnect from "@/model/mongooseConnect";
import { User } from "@/model/db_models/auth";
import { signToken } from "@/controller/auth";

export default async function handler(req, res) {
  // Check if the request method is POST
  if (req.method !== "POST") {
    console.log("Request method not allowed");
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { username, password } = req.body;

  // Validate the presence of username and password
  if (!username || !password) {
    console.log("Username or password not provided");
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  // Connect to the database
  await dbConnect();
  console.log("Database connected");

  // Find the user by username
  const user = await User.findOne({ username }).populate("roleRequest");

  // Check if user exists
  if (!user) {
    console.log("User not found");
    return res.status(401).json({ message: "Username or password incorrect" });
  }

  // Compare the provided password with the stored password
  const isPasswordValid = await compare(password, user.password);

  // Check if the password is valid
  if (!isPasswordValid) {
    console.log("Invalid password");
    return res.status(401).json({ message: "Username or password incorrect" });
  }

  // Generate a JWT token
  const token = await signToken(user);

  console.log("Authentication successful");
  // Respond with the token and user details
  res.status(200).json({
    token,
    user: { username: user.username, id: user._id },
  });
}
