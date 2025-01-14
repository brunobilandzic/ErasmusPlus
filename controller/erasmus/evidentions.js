import { Evidention, University } from "@/model/db_models/erasmus";

export const getAllErasmusEvidentions = async (eid) => {
  const evidentions = await Evidention.find({ erasmus: eid });
  return evidentions;
};

export const getUniverysityEvidentions = async (uid) => {
  const university = await University.findById(uid).populate([
    { path: "erasmusPrograms", populate: { path: "evidentions", populate: [{path: "student", populate: "user"}, {path:"professor", populate:"user"}]} },
  ]);

  return university.erasmusPrograms;
};
