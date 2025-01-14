import { ErasmusMap } from "@/constatns";
import erasmusData from "./data/erasmus";
import dbConnect from "@/model/mongooseConnect";
import { ErasmusProgram, University } from "@/model/db_models/erasmus";
import {
  CoordinatorRole,
  ProfessorRole,
  StudentRole,
} from "@/model/db_models/roles";
import applicationConnections, { futurePast } from "./seedApplications";
import addEvidentionConnections from "./seedEvidentions";

const seedErasmus = async () => {
  const seeded = {};
  await dbConnect();
  const insertEntitiesPromises = Object.entries(erasmusData).map(
    async ([entity, data]) => {
      const model = ErasmusMap[entity];

      console.log("Deleting existing records for entity:", entity);
      const deletedCount = await deleteEntity(model);
      console.log(`Deleted ${deletedCount} ${entity} entities`);

      console.log(`Seeding ${entity} entities`);

      const seededData = await seedEntity(model, data);
      console.log(`Seeded ${seededData.length} blank ${entity} entities`);
      seeded[entity] = seededData;
    }
  );

  await Promise.all(insertEntitiesPromises);

  Object.keys(seeded).forEach((entity) => {
    seeded[entity] = seeded[entity] ? seeded[entity].length : 0;
  });

  return seeded;
};

const deleteEntity = async (model) => {
  const { deletedCount } = await model.deleteMany();
  return deletedCount;
};

const seedEntity = async (model, data) => {
  const seeded = [];

  const insert = data.map(async (item) => {
    const entity = new model(item);

    model === ErasmusProgram &&
      (entity.isFinsihed = futurePast(item.year, item.month, false));
    await entity.save();
    seeded.push(entity);
  });

  await Promise.all(insert);

  return seeded;
};

const addCompUnis = async () => {
  const universities = await University.find();
  console.log(`Found ${universities.length} universities`);

  let compunisCount = 0;

  await Promise.all(
    erasmusData.universities.map(async (item, i) => {
      const university = universities.find((uni) => uni.name === item.name);
      if (!university) {
        console.log("University not found:", item.name);
        return;
      }

      if (university.compatibleUniversities.length > 0) {
        return;
      }

      const randomIndexes = [];

      for (let i = 0; i < item.compunisCount; i++) {
        let randomIndex = Math.floor(Math.random() * universities.length);
        while (randomIndexes.includes(randomIndex)) {
          randomIndex = Math.floor(Math.random() * universities.length);
        }
        randomIndexes.push(randomIndex);
      }

      await Promise.all(
        randomIndexes.map(async (i) => {
          const compUni = universities[i];
          if (compUni._id === university._id) {
            return;
          }
          university.compatibleUniversities.push(compUni._id);
          compUni.compatibleUniversities.push(university._id);
          compunisCount++;
        })
      );
    })
  );

  await Promise.all(
    universities.map(async (uni) => {
      await uni.save();
    })
  );

  console.log(
    `Added compatible universities to ${universities.length} universities, resulting in ${compunisCount} compatible universities`
  );

  return compunisCount;
};

const addErasmusProgramsToUni = async () => {
  await dbConnect();
  const universities = await University.find();
  const erasmusPrograms = await ErasmusProgram.find();
  console.log(`Found ${erasmusPrograms.length} Erasmus programs`);

  await Promise.all(
    erasmusPrograms.map(async (eprogram) => {
      const university =
        universities[Math.floor(Math.random() * universities.length)];

      if (university.erasmusPrograms.includes(eprogram._id)) {
        return;
      }

      university.erasmusPrograms.push(eprogram._id);
      eprogram.university = university._id;
    })
  );

  await Promise.all(
    universities.map(async (uni) => {
      await uni.save();
    })
  );

  await Promise.all(
    erasmusPrograms.map(async (erasmusProgram) => {
      await erasmusProgram.save();
    })
  );

  console.log(
    `Added ${erasmusPrograms.length} Erasmus programs to ${universities.length} universities`
  );

  return erasmusPrograms.length;
};

const addStudentsAndProfessorsToUni = async () => {
  await dbConnect();
  const universities = await University.find();
  const students = await StudentRole.find();
  const professors = await ProfessorRole.find();
  console.log(
    `adding ${students.length} students and ${professors.length} professors to ${universities.length} universities`
  );

  students.map(async (student) => {
    let attempts = 0;
    let randomIndex = Math.floor(Math.random() * universities.length);
    let uni = universities[randomIndex];
    while (
      uni.students.includes(student._id) &&
      attempts < universities.length
    ) {
      randomIndex = Math.floor(Math.random() * universities.length);
      uni = universities[randomIndex];
      attempts++;
    }
    if (!uni.students.includes(student._id)) {
      uni.students.push(student._id);
      student.university = uni._id;
    }
  });

  professors.map(async (professor) => {
    let attempts = 0;
    let randomIndex = Math.floor(Math.random() * universities.length);
    let uni = universities[randomIndex];
    while (
      uni.professors.includes(professor._id) &&
      attempts < universities.length
    ) {
      randomIndex = Math.floor(Math.random() * universities.length);
      uni = universities[randomIndex];
      attempts++;
    }
    if (!uni.professors.includes(professor._id)) {
      uni.professors.push(professor._id);
      professor.university = uni._id;
    }
  });

  await Promise.all(
    universities.map(async (uni) => {
      await uni.save();
    })
  );

  await Promise.all(
    students.map(async (student) => {
      await student.save();
    })
  );

  await Promise.all(
    professors.map(async (professor) => {
      await professor.save();
    })
  );
  console.log(
    `added ${students.length} students and ${professors.length} professors to ${universities.length} universities`
  );

  return students.length + professors.length;
};

const addCoordinatorsToUni = async () => {
  await dbConnect();
  const universities = await University.find();
  const coordinators = await CoordinatorRole.find();

  console.log(
    `Adding ${coordinators.length} coordinators to ${universities.length} universities`
  );

  coordinators.map(async (coordinator) => {
    let attempts = 0;
    let randomIndex = Math.floor(Math.random() * universities.length);
    let uni = universities[randomIndex];
    while (
      uni.coordinator == coordinator._id &&
      attempts < universities.length
    ) {
      randomIndex = Math.floor(Math.random() * universities.length);
      uni = universities[randomIndex];
      attempts++;
    }
    if (uni.coordinator != coordinator._id) {
      uni.coordinator = coordinator._id;
      coordinator.university = uni._id;
    }
  });

  await Promise.all(
    universities.map(async (uni) => {
      await uni.save();
    })
  );

  await Promise.all(
    coordinators.map(async (coordinator) => {
      await coordinator.save();
    })
  );

  console.log(
    `Added ${coordinators.length} coordinators to ${universities.length} universities`
  );

  return coordinators.length;
};

export const addConnections = async () => {
  await dbConnect();
  const compunisCount = await addCompUnis();
  const epsConnected = await addErasmusProgramsToUni();
  const studProfConn = await addStudentsAndProfessorsToUni();
  const cordConn = await addCoordinatorsToUni();
  const applConns = await applicationConnections();
  const evsConns = await addEvidentionConnections();

  return {
    compunisCount,
    epsConnected,
    studProfConn,
    cordConn,
    applConns,
    evsConns,
  };
};

export default seedErasmus;
