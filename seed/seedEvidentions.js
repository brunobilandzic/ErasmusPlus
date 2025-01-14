import { getAllApplicationsByStatus } from "@/controller/erasmus/applications";
import {
  Application,
  ErasmusProgram,
  Evidention,
} from "@/model/db_models/erasmus";
import { StudentRole, ProfessorRole } from "@/model/db_models/roles";
import dbConnect from "@/model/mongooseConnect";
import { getRandomIndex } from "@/utils";
import { ConnectionPoolReadyEvent } from "mongodb";
import { evidentions } from "./data/erasmus";

export const addEvidentionConnections = async () => {
  await dbConnect();
  const applications = await getAllApplicationsByStatus("accepted");

  const studentApplications = applications.filter((app) => app.student);
  const professorApplications = applications.filter((app) => app.professor);
  const students = await StudentRole.find();
  const professors = await ProfessorRole.find();
  const evidentions = await Evidention.find();

  await cleanEvidenceConnections(
    evidentions,
    applications,
    students,
    professors
  );

  await Promise.all(
    studentApplications.map(async (appl) => {
      const student = students.find(
        (st) => st._id.toString() === appl.student.toString()
      );
      const program = await ErasmusProgram.findById(appl.erasmus);

      const randomEvidention = evidentions.pop();

      randomEvidention.erasmus = program._id;
      program.evidentions.push(randomEvidention._id);
      student.evidentions.push(randomEvidention._id);
      randomEvidention.student = student._id;

      await randomEvidention.save();
      await program.save();
      await student.save();
    })
  );

  await Promise.all(
    professorApplications.map(async (appl) => {
      const professor = professors.find(
        (pr) => pr._id.toString() === appl.professor.toString()
      );
      const program = await ErasmusProgram.findById(appl.erasmus);
      const randomEvidention = evidentions.pop();

      randomEvidention.erasmus = program._id;
      program.evidentions.push(randomEvidention._id);
      professor.evidentions.push(randomEvidention._id);
      randomEvidention.professor = professor._id;

      await randomEvidention.save();
      await program.save();
      await professor.save();
    })
  );

  console.log(`Assigned ${studentApplications.length} evidentions to students`);
  console.log(`Assigned ${professorApplications.length} evidentions to professors`);

  return {
    studentEvidentions: studentApplications.length,
    professorEvidentions: professorApplications.length,
  }
};

export const cleanEvidenceConnections = async (
  evidentions,
  programs,
  students,
  professors
) => {
  await dbConnect();

  await Promise.all(
    evidentions.map(async (ev) => {
      ev.professor = null;
      ev.student = null;
      ev.erasmus = null;
      await ev.save();
    })
  );

  await Promise.all(
    programs.map(async (program) => {
      program.evidentions = [];
      await program.save();
    })
  );

  await Promise.all(
    students.map(async (student) => {
      student.evidentions = [];
      await student.save();
    })
  );

  await Promise.all(
    professors.map(async (professor) => {
      professor.evidentions = [];
      await professor.save();
    })
  );

  console.log(
    `Cleaned ${evidentions.length} evidentions connections with ${programs.length} programs, ${students.length} students and ${professors.length} professors`
  );
};

export const seedBlank = async () => {
  await dbConnect();
  await Evidention.deleteMany();

  await Promise.all(
    evidentions.map(async (evidention) => {
      const newEvidention = new Evidention(evidention);
      await newEvidention.save();
    })
  );

  console.log(`Seeded ${evidentions.length} evidentions`);

  return evidentions.length;
};

export default addEvidentionConnections;

// export const addEvidentionConnections = async () => {
//   await dbConnect();

//   const applications = await getAllApplicationsByStatus("accepted");
//   const dbEvidentions = await Evidention.find();

//   const evidentions = [...dbEvidentions];

//   await cleanEvidenceConnections(evidentions, applications);
//   const connectedEvidentions = [];

//   // applications.map((appl) => {
//   //   const program = appl.erasmus;
//   //   const randomEvidention = evidentions.pop();
//   //   randomEvidention.erasmus = program._id;
//   //   program.evidentions.push(randomEvidention._id);

//   //   connectedEvidentions.push(randomEvidention);
//   // });

//   for (const appl of applications) {
//     const program = await ErasmusProgram.findById(appl.erasmus);
//     const randomEvidention = evidentions.pop();
//     randomEvidention.erasmus = program._id;
//     program.evidentions.push(randomEvidention._id);
//   console.log(`Assigning evidention ${randomEvidention._id} to program ${program._id}`);
//     await randomEvidention.save();
//     await program.save();

//     connectedEvidentions.push(randomEvidention);
//   }

//   // await Promise.all(
//   //   connectedEvidentions.map(async (evidention) => {
//   //     console.log(evidention.erasmus);
//   //     await evidention.save();
//   //   })
//   // );

//   // await Promise.all(
//   //   applications.map(async (appl) => {
//   //     await appl.save();
//   //   })
//   // );

//   // evidentions.map(ev => console.log(ev.erasmus));
//   // applications.map((ap) => console.log(ap.erasmus.evidentions?.length));

//   return connectedEvidentions.length;
// };

// const addEvidentionConnectionsOld = async () => {
//   await dbConnect();

//   const dbApplications = await Application.find({
//     status: "accepted",
//   }).populate([{path:}];
//   const evidentions = await Evidention.find();
//   const students = await StudentRole.find();
//   const professors = await ProfessorRole.find();

//   await Promise.all(
//     dbApplications.map(async (appl) => {
//       appl.erasmus.evidentions = [];
//       await appl.erasmus.save();
//     })
//   );

//   await Promise.all(
//     evidentions.map(async (evidention) => {
//       evidention.erasmus = null;
//       await evidention.save();
//     })
//   );

//   console.log(
//     `Cleaned ${evidentions.length} evidentions and ${dbApplications.length} applications`
//   );

//   const studentsApps = dbApplications.filter((app) => app.student);
//   const professorsApps = dbApplications.filter((app) => app.professor);

//   console.log(
//     `There are ${evidentions.length} evidentions\n${studentsApps.length} acc studentsApps and ${professorsApps.length} acc professorsApps`
//   );

//   const connectedEvidentions = [];

//   let randomEvidention, erasmus;

//   await Promise.all(
//     students.map(async (student) => {
//       const studentApps = studentsApps.filter(
//         (app) => app.student.toString() === student._id.toString()
//       );
//       if (studentApps.length === 0) return;

//       const randomIndex = getRandomIndex(studentApps.length);
//       const randomApp = studentApps[randomIndex];

//       randomEvidention = evidentions.pop();
//       randomEvidention.erasmus = randomApp.erasmus._id;
//       randomApp.erasmus.evidentions.push(randomEvidention._id);
//       student.evidentions.push(randomEvidention._id);

//       try {
//         await randomEvidention.save();
//         await randomApp.erasmus.save();
//         await student.save();
//       } catch (error) {
//         console.log("error saving student evs", error);
//       }

//       connectedEvidentions.push(randomEvidention);
//     })
//   );

//   await Promise.all(
//     connectedEvidentions.map(async (evidention) => {
//       await evidention.save();
//       console.log(`saved evidention with erasmus ${evidention.erasmus}`);
//     })
//   );

//   console.log(`now saving ${connectedEvidentions.length} evs`);

//   return connectedEvidentions.length;
// };
