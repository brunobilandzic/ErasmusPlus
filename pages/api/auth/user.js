import { getUserFromToken } from "@/controller/auth";

export default async function handler(req, res) {
  let user;
  try {
    user = await getUserFromToken(req.headers.authorization);
    console.log("Authentication from token successful");
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }

  res.status(200).json({ user }); // Return the user information in the response
}
