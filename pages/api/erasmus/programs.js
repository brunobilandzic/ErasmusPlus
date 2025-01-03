import { getUserFromToken } from "@/controller/auth";
import {
  getAllErasmusPrograms,
  universityCompatiblePrograms,
} from "@/controller/erasmus/programs";

export default async function handler(req, res) {
  const university = req.query.uId;
  const user = await getUserFromToken(req.headers.authorization);

  let erasmusPrograms, message;
  if (university || user) {
    message = "University compatible programs";
    erasmusPrograms = await universityCompatiblePrograms(
      university || user[user.role].university
    );
  } else {
    message = "All Erasmus programs";
    erasmusPrograms = await getAllErasmusPrograms();
  }

  return res.json({ message, erasmusPrograms });
}
