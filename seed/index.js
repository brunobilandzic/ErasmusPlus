import seedErasmus, { addConnections } from "./seedErasmus";
import seedRoles from "./seedRoles";

const seed = async () => {
  const seededErasmus = await seedErasmus();
  const seededRoles = await seedRoles();

  const connections = await addConnections();

  return { erasmus: seededErasmus, roles: seededRoles, connections };
};

export default seed;
