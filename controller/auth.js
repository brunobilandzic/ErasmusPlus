import mongoose from "mongoose";
import dbConnect from "@/model/mongooseConnect";
import { User } from "@/model/db_models/auth";
import {
  StudentRole,
  AdminRole,
  CoordinatorRole,
} from "@/model/db_models/roles";
import { SignJWT, jwtVerify } from "jose";

// Function to sign a JWT token for a user
export const signToken = async (user) => {
  const key = await createKey(); // Create the key for signing
  const token = await new SignJWT({
    username: user.username,
    id: user._id,
  })
    .setProtectedHeader({ alg: "HS256" }) // Set the algorithm to HS256
    .setIssuedAt() // Set the issued at time
    .setExpirationTime("2h") // Set the expiration time to 2 hours
    .sign(key); // Sign the token with the key

  return token; // Return the signed token
};

// Function to create a key for signing/verifying the token
export const createKey = async () => {
  return new TextEncoder().encode(process.env.JWT_SECRET); // Encode the JWT secret
};

export const getUser = async (id) => {
  // Connect to the database
  await dbConnect();
  // Find the user by ID
  const user = await User.findById(id).select("-password");

  await mongoose.models.User.populate(user, user.role);

  // Check if user exists
  if (!user) {
    console.log("User not found");
    return null;
  }

  return user;
};

// Function to verify a JWT token
export const verifyToken = async (token) => {
  if (
    !token ||
    token == "" ||
    typeof token === "undefined" ||
    token === "null"
  ) {
    return false; // Return false if no token is provided
  }
  const key = await createKey(); // Create the key for verification
  const decoded = await jwtVerify(token, key); // Verify the token with the key
  if (!decoded) {
    return false; // Return false if the token is not decoded
  } // Log the decoded payload
  return decoded; // Return the decoded payload
};

export const getUserFromToken = async (authorization) => {
  const token = authorization?.split(" ")[1]; // Get the token from the authorization header
  // Verify the token
  const decoded = await verifyToken(token);

  // Check if the token is verified
  if (!decoded) {
    console.log("Token not verified");
    return null;
  }

  // Get the user from the ID
  const user = await getUser(decoded.payload.id);

  // Return the user
  return user;
};

export const checkRole = async (token, role) => {
  // Get the user from the token
  const user = await getUserFromToken(token);

  // Check if the user has the role
  if (user.role !== role) {
    return false;
  }

  return true;
};
