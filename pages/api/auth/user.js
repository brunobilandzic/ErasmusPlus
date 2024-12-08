import jwt from "jsonwebtoken";

export default function handler(req, res) {
  // check if the request method is GET
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // get the token from the request headers
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // if its not decoded it will throw an error that will be catched in the catch block
    return res.status(200).json({ user: decoded });
  } catch (error) {
    // if its not decoded it will throw an error that will be catched in the catch block
    return res.status(401).json({ message: "Invalid token" });
  }
}
