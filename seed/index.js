import dbConnect from "@/model/mongooseConnect";
import seedErasmus, { addConnections } from "./seedErasmus";
import seedRoles from "./seedRoles";
import mongoose from "mongoose";

const seed = async () => {
  await dbConnect();
  await mongoose.connection.db.dropDatabase();
  const seededErasmus = await seedErasmus();
  const seededRoles = await seedRoles();

  const connections = await addConnections();

  return { erasmus: seededErasmus, roles: seededRoles, connections };
};

export default seed;
