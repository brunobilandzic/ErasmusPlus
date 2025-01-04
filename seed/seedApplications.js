import { Application } from "@/model/db_models/erasmus";
import { StudentRole, ProfessorRole } from "@/model/db_models/roles";
import { universityCompatiblePrograms } from "@/controller/erasmus/programs";
import dbConnect from "@/model/mongooseConnect";

export const applicationConnections = async () => {
  await dbConnect();
  const students = await StudentRole.find();
  const professors = await ProfessorRole.find();
  const dbApplications = await Application.find();

  await Promise.all(
    dbApplications.map(async (application) => {
      application.student = null;
      application.erasmus = null;
      await application.save();
    })
  );

  await Promise.all(
    students.map(async (student) => {
      student.applications = [];
      await student.save();
    })
  );

  await Promise.all(
    professors.map(async (professor) => {
      professor.applications = [];
      await professor.save();
    })
  );

  console.log(
    `Removing existing connections for ${dbApplications.length} applications`
  );

  const applications = [...dbApplications];
  const studentApplications = dbApplications.slice(0, 250);
  const professorApplications = dbApplications.slice(
    250,
    dbApplications.length
  );

  const connectedStudentAppliceations = [];
  const connectedProfessorApplications = [];

  console.log(`Creating ${applications.length} application connections`);
  console.log(
    `Creating ${studentApplications.length} student application connections`
  );
  console.log(
    `Creating ${professorApplications.length} professor application connections`
  );

  await Promise.all(
    students.map(async (student) => {
      const compatible = await universityCompatiblePrograms(student.university);
      let randomIndex = Math.floor(Math.random() * compatible.length);
      const programs = compatible[randomIndex]?.programs;
      if (!programs) return;

      randomIndex = Math.floor(Math.random() * programs.length);
      const program = programs[randomIndex];

      randomIndex = Math.floor(Math.random());
      let application = studentApplications.splice(randomIndex, 1)[0];

      if (!application) return;

      application.student = student._id;
      application.erasmus = program._id;
      student.applications.push(application._id);
      program.applications.push(application._id);

      await application.save();
      await program.save();
      await student.save();

      connectedStudentAppliceations.push(application._id);
    })
  );

  await Promise.all(
    professors.map(async (professor) => {
      const compatible = await universityCompatiblePrograms(
        professor.university
      );
      let randomIndex = Math.floor(Math.random() * compatible.length);
      const programs = compatible[randomIndex]?.programs;

      if (!programs) return;
      randomIndex = Math.floor(Math.random() * programs.length);
      const program = programs[randomIndex];

      randomIndex = Math.floor(Math.random());
      let application = professorApplications.splice(randomIndex, 1)[0];

      if (!application) return;

      application.professor = professor._id;
      application.erasmus = program._id;
      professor.applications.push(application._id);
      program.applications.push(application._id);

      await application.save();
      await program.save();
      await professor.save();

      connectedProfessorApplications.push(application._id);
    })
  );

  return {
    studentApplicationCount: connectedStudentAppliceations.length,
    professorApplicationCount: connectedProfessorApplications.length,
  };
};
