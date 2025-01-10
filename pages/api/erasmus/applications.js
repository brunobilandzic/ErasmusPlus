import { getRole } from "@/controller/auth";
import {
  createApplication,
  getUserApplications,
} from "@/controller/erasmus/applications";
import { getUniversityApplications } from "@/controller/erasmus/applications";

export default async function handler(req, res) {
  const { role, roleName } = await getRole(req.headers.authorization);

  if (!role) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (req.method === "POST") {
    if (!["student", "professor"].includes(roleName)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    const application = await createApplication(req.body);
    console.log("application in route:\n", application);
    return res
      .status(201)
      .json({ application, message: "Application created" });
  }

  if (["student", "professor"].includes(roleName)) {
    const applications = await getUserApplications(roleName, role._id);
    return res.status(200).json({
      applications,
      message: "User applications retrieved successfully",
    });
  }

  if (roleName == "coordinator") {
    const universityProgramsApplications = await getUniversityApplications(
      role.university
    );
    return res.status(200).json({
      universityProgramsApplications,
      message: "Applications retrieved successfully",
    });
  }

  return res.status(200).json({
    applications,
    message: "Applications retrieved successfully",
  });
}
