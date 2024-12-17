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
  console.log("Token signed: ", token); // Log the signed token
  return token; // Return the signed token
};

// Function to create a key for signing/verifying the token
export const createKey = async () => {
  return new TextEncoder().encode(process.env.JWT_SECRET); // Encode the JWT secret
};

// Function to verify a JWT token
export const verifyToken = async (token) => {
  if (!token) {
    return false; // Return false if no token is provided
  }
  const key = await createKey(); // Create the key for verification
  const decoded = await jwtVerify(token, key); // Verify the token with the key

  if (!decoded) {
    return false; // Return false if the token is not decoded
  }
  console.log("Token verified: ", decoded.payload); // Log the decoded payload
  return decoded; // Return the decoded payload
};
