import mongoose from "mongoose";
import dbConnect from "@/model/mongooseConnect";
import { User } from "@/model/db_models/auth";
import {
  StudentRole,
  AdminRole,
  CoordinatorRole,
} from "@/model/db_models/roles";
import { SignJWT, jwtVerify } from "jose";
import { RoleMap } from "@/constatns";

// Function to sign a JWT token for a user
export const signToken = async (user) => {
  const key = await createKey(); // Create the key for signing
  const token = await new SignJWT({
    username: user.username,
    id: user._id,
  })
    .setProtectedHeader({ alg: "HS256" }) // Set the algorithm to HS256
    .setIssuedAt() // Set the issued at time
    .setExpirationTime("5 day") // Set the expiration time to 2 hours
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
  console.log("Getting user", id);
  // Find the user by ID
  const user = await User.findById(id).select("-password");

  // Check if user exists
  if (!user) {
    console.log("User not found");
    return null;
  }

  await mongoose.models.User.populate(user, user.role);

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
  const key = await createKey();
  let decoded; // Create the key for verification
  try {
    decoded = await jwtVerify(token, key); // Verify the token with the key
    if (!decoded) {
      return false; // Return false if the token is not decoded
    } // Log the decoded paylo
  } catch (error) {
    console.log("Error verifying token", error);
  }

  return decoded; // Return the decoded payload
};

export const getUserFromToken = async (authorization) => {
  const token = authorization?.split(" ")[1];
  // Get the token from the authorization header
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

export const getRole = async (authorization) => {
  const nullRole = { role: null, roleName: null };

  if (!authorization) {
    return nullRole;
  }

  // Get the user from the token
  const user = await getUserFromToken(authorization);

  if (!user) {
    return nullRole;
  }

  const RoleModel = await RoleMap[user.role];

  const role = await RoleModel.findById(user[user.role]).populate("user");

  return {
    roleName: user.role,
    role,
  };
};
