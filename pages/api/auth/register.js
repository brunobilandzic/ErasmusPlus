import dbConnect from "../../../model/mongooseConnect";
import { hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../../../model/db_models/auth";
import { roles } from "@/constatns";
import { RoleRequest } from "@/model/db_models/roles";

// client calls this route in order to register
// routes in next js function by having a route name written as the file name
// file exports (default) only one function which can be called whatever, but must check req.method and act accordingly
// the function takes req and res as arguments, sends the response with res object
// to get req data, params, body, headers, etc, use req object
// to do needed work, use methods in ../../controller

export default async function handler(req, res) {
  // Check if the request method is POST
  if (req.method !== "POST") {
    console.log("Request method not allowed");
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Log the request body for debugging purposes
  console.log("register route req body: ", req.body);

  const { username, password, role } = req.body;

  // Validate the presence of username and password
  if (!username || !password) {
    console.log("Username or password not provided");
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  if (!roles.includes(role)) {
    console.log("Role not valid");
    return res.status(400).json({ message: "Role not valid" });
  }

  try {
    // Connect to the database
    await dbConnect();
    console.log("Database connected");

    // Check if the user already exists in the database
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      console.log("User already exists");
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await hash(password, 10);
    console.log("Password hashed");

    // Create a new user instance
    const newUser = new User({
      username,
      password: hashedPassword,
    });

    // Generate a JWT token for the new user
    const token = jwt.sign(
      { username: newUser.username, id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    // create new role request for admin to approve
    const newRoleRequest = new RoleRequest({
      userId: newUser._id,
      role,
    });

    await newRoleRequest.save();

    // Save the new user to the database
    await newUser.save();
    console.log(`User created: ${newUser}`);

    // Send a success response with the username and token and new role request so client can keep track of it
    res.status(201).json({
      message: "User created",
      user: { username: newUser.username, id: newUser._id },
      token,
      newRoleRequest,
    });
  } catch (error) {
    // Log any errors that occur during the process
    console.log(`Error occurred: ${error}`);
    res.status(500).json({ message: "Something went wrong" });
  }
}
