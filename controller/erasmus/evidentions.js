import { Evidention } from "@/model/db_models/erasmus";

export const getAllErasmus = async (eid) => {
  const evidentions = await Evidention.find({ erasmus: eid });
  return evidentions;
};
