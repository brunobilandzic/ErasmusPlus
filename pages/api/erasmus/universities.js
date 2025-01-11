import { getUserFromToken } from "@/controller/auth";
import { getProgramsApplications } from "@/controller/erasmus/applications";
import {
  getAllUniversities,
  getUniversityForUser,
} from "@/controller/erasmus/universities";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const user = await getUserFromToken(req.headers.authorization);

    if (user) {
      const university = await getUniversityForUser(user.id);
      const applications = await getProgramsApplications(university.id);
      return res.json({
        applications,
        university,
        message: "University found",
      });
    } else {
      const universities = await getAllUniversities();
      return res.json({ universities, message: "All universities" });
    }
  }
}
