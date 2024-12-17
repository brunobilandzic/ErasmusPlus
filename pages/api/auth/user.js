import { User } from "@/model/db_models/auth";
import dbConnect from "@/model/mongooseConnect";

export default async function handler(req, res) {
  // Middleware here does the job of checking if the token is valid
  // It sets the user in the request object to token payload

  await dbConnect(); // Connect to the database
  const userId = req.headers["x-user"]; // Get the user ID from the request headers
  if (!userId) {
    return res
      .status(401)
      .json({ message: "Middleware hasn't defined user id" }); // Return 401 if no user ID is found
  }

  const user = await User.findById(userId).select("-password"); // Find the user by ID and exclude the password

  console.log("/auth/user route user:\n", user); // Log the user information

  res.status(200).json({ user }); // Return the user information in the response
}
