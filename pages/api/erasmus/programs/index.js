import { getUserFromToken } from "@/controller/auth";
import {
  getAllErasmusPrograms,
  getErasmusProgram,
  universityCompatiblePrograms,
} from "@/controller/erasmus/programs";
import { getUniversityForUser } from "@/controller/erasmus/universities";

export default async function handler(req, res) {
  const eId = req.query.eId;

  let erasmusPrograms, message;
  const user = await getUserFromToken(req.headers.authorization);

  if (!user && !eId) {
    message = "Showing all Erasmus programs";
    erasmusPrograms = await getAllErasmusPrograms();
    return res.json({ message, erasmusPrograms });
  }

  //route for single erasmus program
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
    const university = await getUniversityForUser(user._id);
    message = "Showing university compatible programs";
    erasmusPrograms = await universityCompatiblePrograms(
      user[user.role].university
    );

    return res.json({ message, erasmusPrograms, uId: university._id });
  }

  if (user.role === "coordinator") {
    message = `Showing university ${university.name} programs`;
    erasmusPrograms = university.erasmusPrograms;
    return res.json({ message, erasmusPrograms, uId: university._id });
  }

  return res.status(404).json({ message: "Not found" });
}
