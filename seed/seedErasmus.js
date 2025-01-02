import { ErasmusMap } from "@/constatns";
import erasmusData from "./data/erasmus";
import dbConnect from "@/model/mongooseConnect";
import { getRandomNumberInRange } from "@/utils";
import { University } from "@/model/db_models/erasmus";

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

export default seedErasmus;
