import { ErasmusMap } from "@/constatns";
import erasmusData from "./data/erasmus";

const seedErasmus = async () => {
  const seeded = {};
  const insertEntitiesPromises = Object.entries(erasmusData).map(
    async ([entity, data]) => {
      console.log(entity, data.length, ErasmusMap[entity]);
      const model = ErasmusMap[entity];

      console.log("Deleting existing records for entity:", entity);
      const deletedCount = await deleteEntity(model);
      console.log(`Deleted ${deletedCount} ${entity} entities`);

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

export default seedErasmus;
