import mongoose from "mongoose";

// Get the MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI;
console.log(`\n\nMONGODB_URI: ${MONGODB_URI}\n\n`);

// Throw an error if the MongoDB URI is not defined
if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

// Initialize a cached connection object if it doesn't exist
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Function to connect to the database
async function dbConnect() {
  // Return the cached connection if it exists
  if (cached.conn) {
    return cached.conn;
  }

  // If there is no cached promise, create a new connection promise
  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true, // Use the new URL parser
    };

    // Create a new connection promise and cache it
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  // Wait for the connection promise to resolve and cache the connection
  cached.conn = await cached.promise;
  return cached.conn;
}

// Export the dbConnect function as the default export
export default dbConnect;
