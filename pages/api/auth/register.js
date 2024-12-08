import dbConnect from "../../../model/mongooseConnect";
import { hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../../../model/db_models/auth";

// client calls this route in order to register
// routes in next js function by having a route name written as the file name
// file exports (default) only one function which can be called whatever, but must check req.method and act accordingly
// the function takes req and res as arguments, sends the response with res object
// to get req data, params, body, headers, etc, use req object
// to do needed work, use methods in ../../controller

export default async function handler(req, res) {
  // Check if the request method is POST
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Log the request body for debugging purposes
  console.log(req.body);

  const { username, password } = req.body;

  // Validate the presence of username and password
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    // Connect to the database
    await dbConnect();

    // Check if the user already exists in the database
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await hash(password, 10);

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

    // Save the new user to the database
    await newUser.save();
    console.log(`\n\nUser created:\n\n${newUser}\n\n`);

    // Send a success response with the username and token
    res.status(201).json({ message: "User created", username, token });
  } catch (error) {
    // Log any errors that occur during the process
    console.log(`\nCatched error:\n\n${error}\n\n`);
    res.status(500).json({ message: "Something went wrong" });
  }
}
