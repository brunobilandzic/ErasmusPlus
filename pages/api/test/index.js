import { ErasmusProgram, Evidention } from "@/model/db_models/erasmus";

export default async function handler(req, res) {
  const evidentions = await Evidention.find({erasmus: {$ne: null}});

  return res.status(200).json({
    evidentions,
  });
}
