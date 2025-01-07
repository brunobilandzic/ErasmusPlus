import { getAllApplicationsByStatus } from "@/controller/erasmus/applications";
import {
  Application,
  ErasmusProgram,
  Evidention,
} from "@/model/db_models/erasmus";
import dbConnect from "@/model/mongooseConnect";
import { getRandomIndex } from "@/utils";

const addEvidentionConnections = async () => {
  await cleanEvidenceConnections();
  const evidentions = await Evidention.find();
  const connectedEvidentions = [];
  console.log("Evidentions", evidentions.length);
  const applications = await Application.find({ status: "accepted" });
  const studentsApps = applications.filter((app) => app.student);
  const professorsApps = applications.filter((app) => app.professor);

  console.log(
    `There are ${evidentions.length} evidentions\n${studentsApps.length} acc studentsApps and ${professorsApps.length} acc professorsApps`
  );

  let randomEvidention, erasmus;

  await Promise.all(
    applications.map(async (appl) => {
      randomEvidention = evidentions.splice(
        getRandomIndex(evidentions.length),
        1
      )[0];

      erasmus = await ErasmusProgram.findById(appl.erasmus);

      erasmus.evidentions.push(randomEvidention._id);
      randomEvidention.erasmus = erasmus._id;

      await erasmus.save();
      connectedEvidentions.push(randomEvidention);
    })
  );
  console.log(`now saving ${connectedEvidentions.length} evs`);

  return connectedEvidentions.length;
};

export const cleanEvidenceConnections = async () => {
  await dbConnect();
  const evidentions = await Evidention.find();
  const applications = await Application.find({ status: "accepted" });

  await Promise.all(
    applications.map(async (appl) => {
      const erasmus = await ErasmusProgram.findById(appl.erasmus);
      erasmus.evidentions = [];
    })
  );

  await Promise.all(
    evidentions.map(async (evidention) => {
      evidention.erasmus = null;
      await evidention.save();
    })
  );
};

export default addEvidentionConnections;
