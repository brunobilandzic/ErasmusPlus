import { getRole, getUserFromToken } from "@/controller/auth";
import {
  createEvidention,
  getAllErasmusEvidentions,
  getUniverysityEvidentions,
} from "@/controller/erasmus/evidentions";
import { Evidention } from "@/model/db_models/erasmus";

export default async function handler(req, res) {
  const user = await getUserFromToken(req.headers.authorization);
  console.log("user", user);
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { role, roleName } = await getRole(req.headers.authorization);

  if (!role) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const evId = req.query.evId;
  console.log("evId", evId);
  if (evId) {
    const evidention = await Evidention.findById(evId).populate([
      { path: "erasmus", populate: "university" },
      { path: "student", populate: "user university" },
      { path: "professor", populate: "user university" },
    ]);
    return res.status(200).json(evidention);
  }

  if (req.method === "POST") {
    console.log("creating evidention", req.body);
    const evidention = await createEvidention(req.body);
    console.log("evidention", evidention);
    return res.status(201).json(evidention);
  }

  if (roleName == "coordinator") {
    const erasmusPrograms = await getUniverysityEvidentions(role.university);

    return res.status(200).json({
      erasmusPrograms,
      message: `Evidentions for ${roleName} ${user.username}`,
    });
  }

  if (req.method == "GET") {
    const { eid } = req.query;
    const evidentions = await getAllErasmusEvidentions(eid);
    res.status(200).json(evidentions);
  }
}
