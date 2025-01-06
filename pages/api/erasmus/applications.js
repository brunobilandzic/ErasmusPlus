import { getUserFromToken } from "@/controller/auth";
import { getUserApplications } from "@/controller/erasmus/applications";

export default async function handler(req, res) {
  const user = await getUserFromToken(req.headers.authorization);

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const applications = await getUserApplications(user);

  return res
    .status(200)
    .json({ applications, message: "Applications retrieved successfully" });
}
