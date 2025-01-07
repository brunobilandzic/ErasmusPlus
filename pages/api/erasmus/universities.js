import { getUserFromToken } from "@/controller/auth";
import {
  getAllUniversities,
  getUniversity,
  getUniversityForUser,
} from "@/controller/erasmus/universities";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const uId = req.query.uId;
    const user = await getUserFromToken(req.headers.authorization);

    if (uId) {
      const university = await getUniversity(uId);
      return res.json({ university, message: "University found" });
    } else if (user) {
      const university = await getUniversityForUser(user.id);
      return res.json({ university, message: "University found" });
    } else {
      const universities = await getAllUniversities();
      return res.json({ universities, message: "All universities" });
    }
  }
}
