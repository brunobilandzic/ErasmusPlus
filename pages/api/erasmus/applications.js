import { getRole } from "@/controller/auth";
import {
  createApplication,
  getApplicationById,
  getUserApplications,
  updateApplication,
  getProgramsApplications,
} from "@/controller/erasmus/applications";
import { Application } from "@/model/db_models/erasmus";

export default async function handler(req, res) {
  const { role, roleName } = await getRole(req.headers.authorization);
  const id = req.query.id;

  if (!role) {
    const applications = await Application.find();
    return res.status(200).json({
      applications,
      message: "Applications retrieved successfully",
    });
  }
  if (req.method === "POST") {
    if (!["student", "professor"].includes(roleName)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    console.log("body",req.body)
    const application = await createApplication(req.body);
    console.log("application in route:\n", application);
    return res
      .status(201)
      .json({ application, message: "Application created" });
  }

  if (req.method == "PUT" && id) {
    if (roleName == "coordinator" || "admin") {
      const application = await updateApplication(id, req.body);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      return res
        .status(200)
        .json({ application, message: "Application updated successfully" });
    } else if (["student", "professor"].includes(roleName)) {
      if (req.body.status)
        return res.status(401).json({ error: "Unauthorized" });
      const application = await updateApplication(id, req.body);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      return res
        .status(200)
        .json({ application, message: "Application updated successfully" });
    }
  }

  if (req.method == "GET" && id) {
    console.log("id", id);
    const application = await getApplicationById(id);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }
    return res.status(200).json({ application, message: "Application found" });
  }

  if (["student", "professor"].includes(roleName)) {
    const applications = await getUserApplications(roleName, role._id);
    return res.status(200).json({
      applications,
      message: "User applications retrieved successfully",
    });
  }

  if (roleName == "coordinator") {
    const universityProgramsApplications = await getProgramsApplications(
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
