import { getUserFromToken } from "@/controller/auth";
import {
  createApplication,
  getUserApplications,
} from "@/controller/erasmus/applications";

export default async function handler(req, res) {
  const user = await getUserFromToken(req.headers.authorization);

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (req.method === "POST") {
    const application = await createApplication(req.body);
    console.log("application in route:\n", application);
    return res
      .status(201)
      .json({ application, message: "Application created" });
  }

  const applications = await getUserApplications(user);

  return res
    .status(200)
    .json({ applications, message: "Applications retrieved successfully" });
}
