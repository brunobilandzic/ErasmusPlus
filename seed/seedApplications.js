import { Application, ErasmusProgram } from "@/model/db_models/erasmus";
import { StudentRole, ProfessorRole } from "@/model/db_models/roles";
import { universityCompatiblePrograms } from "@/controller/erasmus/programs";
import dbConnect from "@/model/mongooseConnect";
import { randomTruth } from "@/utils";

const addApplicationConnections = async () => {
  await dbConnect();
  const students = await StudentRole.find();
  const professors = await ProfessorRole.find();
  const dbApplications = await Application.find();
  const erasmusPrograms = await ErasmusProgram.find();

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

  await Promise.all(
    erasmusPrograms.map(async (program) => {
      program.applications = [];
      await program.save();
    })
  );

  console.log(
    `Removed existing connections for ${dbApplications.length} applications`
  );

  const APPLS_NUMBER = dbApplications.length;
  const STUDENT_APPS = Math.floor(APPLS_NUMBER * (5 / 6));
  const PROFESSOR_APPS = APPLS_NUMBER - STUDENT_APPS;

  const STUDENT_PAST_APPS = Math.floor(STUDENT_APPS * 0.2);
  const STUDENT_FUTURE_APPS = STUDENT_APPS - STUDENT_PAST_APPS;

  const PROFESSOR_PAST_APPS = Math.floor(PROFESSOR_APPS * 0.2);
  const PROFESSOR_FUTURE_APPS = PROFESSOR_APPS - PROFESSOR_PAST_APPS;

  const studentApplications = dbApplications.slice(0, STUDENT_APPS);
  const stFutureApps = studentApplications.slice(0, STUDENT_FUTURE_APPS);
  const stPastApps = studentApplications.slice(STUDENT_FUTURE_APPS);

  const professorApplications = dbApplications.slice(STUDENT_APPS);
  const prFutureApps = professorApplications.slice(0, PROFESSOR_FUTURE_APPS);
  const prPastApps = professorApplications.slice(PROFESSOR_FUTURE_APPS);

  const studentFutureApplications = [];
  const professorFutureApplications = [];
  const studentPastApplications = [];
  const professorPastApplications = [];

  console.log(
    `Creating ${studentApplications.length} (${stFutureApps.length} future and ${stPastApps.length} past) student application connections`
  );
  console.log(
    `Creating ${professorApplications.length} (${prFutureApps.length} future and ${prPastApps.length} past) professor application connections`
  );

  await Promise.all(
    // seed future applications
    students.map(async (student) => {
      let compatible = await universityCompatiblePrograms(student.university);

      let randomIndex = Math.floor(Math.random() * compatible.length);

      if (!compatible || compatible.length == 0) return;

      compatible = transformCompatible(compatible, true);

      const programs = compatible[randomIndex]?.programs;

      if (!programs || programs.length == 0) return;

      randomIndex = Math.floor(Math.random() * programs.length);
      const program = programs[randomIndex];

      randomIndex = Math.floor(Math.random());
      let application = stFutureApps.splice(randomIndex, 1)[0];

      if (!application) return;

      application.student = student._id;
      application.erasmus = program._id;
      student.applications.push(application._id);
      program.applications.push(application._id);

      await application.save();
      await program.save();
      await student.save();

      studentFutureApplications.push(application._id);
    })
  );

  // seed past student applications
  await Promise.all(
    students.map(async (student) => {
      let compatible = await universityCompatiblePrograms(student.university);

      let randomIndex = Math.floor(Math.random() * compatible.length);

      if (!compatible || compatible.length == 0) return;

      compatible = transformCompatible(compatible, false);

      const programs = compatible[randomIndex]?.programs;

      if (!programs || programs.length == 0) return;

      randomIndex = Math.floor(Math.random() * programs.length);
      const program = programs[randomIndex];

      randomIndex = Math.floor(Math.random());
      let application = stPastApps.splice(randomIndex, 1)[0];

      if (!application) return;

      application.student = student._id;
      application.erasmus = program._id;
      application.status = randomTruth(0.75) ? "accepted" : "rejected";
      student.applications.push(application._id);
      program.applications.push(application._id);

      await application.save();
      await program.save();
      await student.save();

      studentPastApplications.push(application._id);
    })
  );

  // seed professors future applications
  await Promise.all(
    professors.map(async (professor) => {
      let compatible = await universityCompatiblePrograms(professor.university);

      let randomIndex = Math.floor(Math.random() * compatible.length);

      if (!compatible || compatible.length == 0) return;

      compatible = transformCompatible(compatible, true);

      const programs = compatible[randomIndex]?.programs;

      if (!programs || programs.length == 0) return;

      randomIndex = Math.floor(Math.random() * programs.length);
      const program = programs[randomIndex];

      randomIndex = Math.floor(Math.random());
      let application = prFutureApps.splice(randomIndex, 1)[0];

      if (!application) return;

      application.professor = professor._id;
      application.erasmus = program._id;
      professor.applications.push(application._id);
      program.applications.push(application._id);

      await application.save();
      await program.save();
      await professor.save();

      professorFutureApplications.push(application._id);
    })
  );

  // seed professors past applications
  await Promise.all(
    professors.map(async (professor) => {
      let compatible = await universityCompatiblePrograms(professor.university);

      let randomIndex = Math.floor(Math.random() * compatible.length);

      if (!compatible || compatible.length == 0) return;

      compatible = transformCompatible(compatible, false);

      const programs = compatible[randomIndex]?.programs;

      if (!programs || programs.length == 0) return;

      randomIndex = Math.floor(Math.random() * programs.length);
      const program = programs[randomIndex];

      randomIndex = Math.floor(Math.random());
      let application = prPastApps.splice(randomIndex, 1)[0];

      if (!application) return;

      application.professor = professor._id;
      application.erasmus = program._id;
      application.status = randomTruth(0.75) ? "accepted" : "rejected";

      professor.applications.push(application._id);
      program.applications.push(application._id);

      await application.save();
      await program.save();
      await professor.save();

      professorPastApplications.push(application._id);
    })
  );

  console.log(`
    Created ${studentFutureApplications.length} student future applications`);
  console.log(`
    Created ${studentPastApplications.length} student past applications`);
  console.log(`
    Created ${professorFutureApplications.length} professor future applications`);
  console.log(`
    Created ${professorPastApplications.length} professor past applications`);

  return {
    studentApplicationCount: {
      future: studentFutureApplications.length,
      past: studentPastApplications.length,
    },
    professorApplicationCount: {
      future: professorFutureApplications.length,
      past: professorPastApplications.length,
    },
  };
};

const transformCompatible = (outerc, future) => {
  let compatible = [...outerc];
  compatible = compatible.filter((comp) =>
    comp.programs?.some((ep) => futurePast(ep.year, ep.month, future))
  );

  compatible = compatible.map((c) => {
    c.programs = [...c.programs].filter((ep) =>
      futurePast(ep.year, ep.month, future)
    );
    return c;
  });

  return compatible;
};

const futurePast = (y, m, future) => {
  const now = new Date();
  const date = new Date(y, m);
  const isFuture = future ? date > now : date < now;

  return isFuture;
};

export default addApplicationConnections;
