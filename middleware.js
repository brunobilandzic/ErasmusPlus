import { NextResponse } from "next/server";
import { verifyToken } from "./controller/auth";

// Middleware function to handle authentication
export default async function middleware(req) {
  try {
    // Extract the token from the Authorization header
    const token = req.headers.get("Authorization")?.split("Bearer ")[1];

    if (!token) {
      return NextResponse.error(new Error("No token provided"));
    }

    // Verify the token
    const decoded = await verifyToken(token);

    // Check if the token has expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.payload.exp < currentTime) {
      return NextResponse.error(new Error("Token has expired"));
    }
    // If the token is invalid, return an error response
    if (!decoded) {
      return NextResponse.error(new Error("Invalid token"));
    }

    // Set the user ID in the request headers so the route can fetch user
    // as this is on edge network we cant use mongoose here
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user", decoded.payload.id);

    // Proceed to the next middleware or route handler
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    return NextResponse.error(new Error("Error verifying token"));
  }
}

// Configuration for the middleware to match specific routes
export const config = {
  matcher: "/api/auth/user",
};
