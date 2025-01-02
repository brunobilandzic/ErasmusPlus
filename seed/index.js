import seedErasmus from "./seedErasmus";
import seedRoles from "./seedRoles";

const seed = async () => {
  const seededErasmus = await seedErasmus();
  const seededRoles = await seedRoles();
  
  return { erasmus: seededErasmus, roles: seededRoles };
};

export default seed;
