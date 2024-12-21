import seedRoles from "./seedRoles";

const seed = async () => {
  const seededRoles = await seedRoles();

  return { seededRoles };
};
