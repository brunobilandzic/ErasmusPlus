import {
  Evidention,
  University,
  ErasmusProgram,
} from "@/model/db_models/erasmus";
import { StudentRole, ProfessorRole } from "@/model/db_models/roles";

export const getAllErasmusEvidentions = async (eid) => {
  const evidentions = await Evidention.find({ erasmus: eid });
  return evidentions;
};

export const getUniverysityEvidentions = async (uid) => {
  const university = await University.findById(uid).populate([
    {
      path: "erasmusPrograms",
      populate: {
        path: "evidentions",
        populate: [
          { path: "student", populate: "user" },
          { path: "professor", populate: "user" },
        ],
      },
    },
  ]);

  return university.erasmusPrograms;
};

export const createEvidention = async (evidention) => {
  const newEvidention = new Evidention(evidention);
  const program = await ErasmusProgram.findById(evidention.erasmus);
  let role;

  if (evidention.student) {
    role = await StudentRole.findById(evidention.student);
  }
  if (evidention.professor) {
    role = await ProfessorRole.findById(evidention.professor);
  }

  if (role) {
    console.log("role", role);
    role.evidentions.push(newEvidention);
    await role.save();
  }

  program.evidentions.push(newEvidention);

  await program.save();
  await newEvidention.save();

  return newEvidention;
};
