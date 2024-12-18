import { User } from "../model/db_models/auth";
import {
  StudentRole,
  AdminRole,
  ProfessorRole,
  CoordinatorRole,
} from "../model/db_models/roles";

import { admins } from "./data/users";
import dbConnect from "../model/mongooseConnect";

const seed = async () => {};

export const seedAdmins = async () => {
  await dbConnect();
  const seededAdmins = [];
  const insertAdmins = admins.map(async (admin) => {
    const user = new User(admin);
    const adminRole = await new AdminRole({ userId: user._id });
    user.AdminRole = adminRole._id;

    await user.save();
    await adminRole.save();

    seededAdmins.push(user);
  });
  await Promise.all(insertAdmins);

  return seededAdmins;
};

export const main = async () => {
  await seed();
};
