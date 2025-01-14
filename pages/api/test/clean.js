import {
  Application,
  ErasmusProgram,
  Evidention,
} from "@/model/db_models/erasmus";
import { evidentions } from "@/seed/data/erasmus";
import { cleanEvidenceConnections } from "@/seed/seedEvidentions";

export default async function handler(req, res) {
  const applications = await Application.find().populate("erasmus");
  const evidentions = await Evidention.find();
  await cleanEvidenceConnections(evidentions, applications);
  return res.json("deleted");
}
