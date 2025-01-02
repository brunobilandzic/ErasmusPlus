import { ErasmusMap } from "@/constatns";
import erasmusData from "./data/erasmus";
import dbConnect from "@/model/mongooseConnect";
import { ErasmusProgram, University } from "@/model/db_models/erasmus";
import {
  CoordinatorRole,
  ProfessorRole,
  StudentRole,
} from "@/model/db_models/roles";

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

      if (entity === "universities") {
        const seededData = await seedUniversities();
        console.log(`Seeded ${seededData.length} ${entity} entities`);
        seeded[entity] = seededData;
        return;
      }

      const seededData = await seedEntity(model, data);
      console.log(`Seeded ${seededData.length} ${entity} entities`);
      seeded[entity] = seededData;
    }
  );

  await Promise.all(insertEntitiesPromises);
  await addErasmusProgramToUni();
  await addStudentsAndProfessorsToUni();
  await addCoordinatorsToUni();
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

    await entity.save();
    seeded.push(entity);
  });

  await Promise.all(insert);

  return seeded;
};

const seedUniversities = async () => {
  const seeded = [];

  await Promise.all(
    erasmusData.universities.map(async (item) => {
      const university = new University(item);
      await university.save();
    })
  );

  const universities = await University.find();

  await Promise.all(
    erasmusData.universities.map(async (item, i) => {
      const university = universities.find((uni) => uni.name === item.name);
      if (!university) {
        console.log("university not found", item.name);
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
        })
      );
    })
  );

  await Promise.all(
    universities.map(async (uni) => {
      await uni.save();
      seeded.push(uni);
    })
  );

  return seeded;
};

const addErasmusProgramToUni = async () => {
  await dbConnect();
  const universities = await University.find();
  const erasmusPrograms = await ErasmusProgram.find();

  await Promise.all(
    universities.map(async (uni) => {
      const randomIndex = Math.floor(Math.random() * erasmusPrograms.length);
      const erasmusProgram = erasmusPrograms[randomIndex];
      if (erasmusProgram.university) {
        return;
      }
      uni.erasmusPrograms.push(erasmusProgram._id);
      erasmusProgram.university = uni._id;
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
};

const addStudentsAndProfessorsToUni = async () => {
  await dbConnect();
  const universities = await University.find();
  const students = await StudentRole.find();
  const professors = await ProfessorRole.find();

  await Promise.all(
    students.map(async (student) => {
      let randomIndex = Math.floor(Math.random() * universities.length);
      const uni = universities[randomIndex];
      while (uni.students.includes(student._id)) {
        randomIndex = Math.floor(Math.random() * universities.length);
      }
      uni.students.push(student._id);
      student.university = uni._id;
    })
  );

  await Promise.all(
    professors.map(async (professor) => {
      let randomIndex = Math.floor(Math.random() * universities.length);
      const uni = universities[randomIndex];
      while (uni.professors.includes(professor._id)) {
        randomIndex = Math.floor(Math.random() * universities.length);
      }
      uni.professors.push(professor._id);
      professor.university = uni._id;
    })
  );

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
};

const addCoordinatorsToUni = async () => {
  await dbConnect();
  const universities = await University.find();
  const coordinators = await CoordinatorRole.find();

  await Promise.all(
    coordinators.map(async (coordinator) => {
      let randomIndex = Math.floor(Math.random() * universities.length);
      const uni = universities[randomIndex];
      while (uni.coordinator == coordinator._id) {
        randomIndex = Math.floor(Math.random() * universities.length);
      }
      uni.coordinator = coordinator._id;
      coordinator.university = uni._id;
    })
  );

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
};

export default seedErasmus;
