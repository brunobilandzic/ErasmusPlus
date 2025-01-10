import { getUserFromToken } from "@/controller/auth";
import {
  getAllErasmusPrograms,
  getErasmusProgram,
  universityCompatiblePrograms,
} from "@/controller/erasmus/programs";

export default async function handler(req, res) {
  const eId = req.query.eId;
  let erasmusPrograms, message;
  const user = await getUserFromToken(req.headers.authorization);

  if (!user && !eId) {
    message = "all Erasmus programs";
    erasmusPrograms = await getAllErasmusPrograms();
    return res.json({ message, erasmusPrograms });
  }

  if (eId) {
    const erasmusProgram = await getErasmusProgram(eId);
    if (erasmusProgram) {
      message = "Erasmus program";
      return res.json({ message, erasmusProgram });
    } else {
      return res.status(404).json({ message: "Erasmus program not found" });
    }
  }

  if (user) {
    message = "university compatible programs";
    erasmusPrograms = await universityCompatiblePrograms(
      user[user.role].university
    );

    return res.json({ message, erasmusPrograms });
  }
}
