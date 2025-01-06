import dbConnect from "@/model/mongooseConnect";
import { ErasmusProgram, University } from "@/model/db_models/erasmus";

export const universityCompatiblePrograms = async (unId) => {
  await dbConnect();
  const erasmusPrograms = [];
  const university = await University.findById(unId);

  if (!university) {
    console.log("University not found");
    return erasmusPrograms;
  }

  await Promise.all(
    university.compatibleUniversities.map(async (un) => {
      const compUni = await University.findById(un).populate("erasmusPrograms");
      if (!compUni) {
        console.log("Compatible university not found");
        return;
      }
      erasmusPrograms.push({
        university: {
          id: compUni.id,
          name: compUni.name,
          location: compUni.location,
        },
        programs: compUni.erasmusPrograms,
      });
    })
  );

  return erasmusPrograms;
};

export const getAllErasmusPrograms = async () => {
  await dbConnect();
  const universityErasmusPrograms = await University.find().populate(
    "erasmusPrograms"
  );

  const erasmusPrograms = universityErasmusPrograms.map((university) => ({
    university: {
      id: university.id,
      name: university.name,
      location: university.location,
    },
    programs: university.erasmusPrograms,
  }));

  return erasmusPrograms;
};

export const getErasmusProgram = async (id) => {
  await dbConnect();
  const erasmusProgram = await ErasmusProgram.findById(id);

  return erasmusProgram;
};

export const erasmusResults = async () => {};

export const createErasmusProgram = async (erasmusProgram) => {
  await dbConnect();
  const newErasmusProgram = await ErasmusProgram.create(erasmusProgram);

  return newErasmusProgram;
};

export const programsValidity = async () => {
  await dbConnect();
  const erasmusPrograms = await ErasmusProgram.find().populate("applications");
  const invalidPrograms = [];
  let valid = true;

  erasmusPrograms.forEach((program) => {
    if (program.isFinished) {
      valid = program.applications.every(
        (app) => app.status === "accepted" || app.status === "rejected"
      );
      valid == false && invalidPrograms.push(program._id);
    } else {
      valid = program.applications.every((app) => app.status === "pending");
      valid == false && invalidPrograms.push(program._id);
    }
  });

  return {
    valid,
    invalidPrograms,
  };
};
