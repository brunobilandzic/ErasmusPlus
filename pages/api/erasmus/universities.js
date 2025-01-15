import { getUserFromToken } from "@/controller/auth";
import { getProgramsApplications } from "@/controller/erasmus/applications";
import {
  getAllUniversities,
  getUniversity,
  getUniversityForUser,
} from "@/controller/erasmus/universities";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const uId = req.query.uId;

    console.log(uId);
    if (uId) {
      const university = await getUniversity(uId);
      return res.json({
        message: "University found",
        university,
      });
    }
  }
}
