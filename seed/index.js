import { User } from "../model/db_models/auth";
import dbConnect from "../model/mongooseConnect";
import { roleMap } from "@/constatns";
import rolesData from "../seed/data/roles";

export const seedRoles = async () => {
  await dbConnect();
  const seeded = {};

  // Initialize seeded object with null values for each role
  Object.keys(roleMap).forEach(async (role) => {
    seeded[role] = null;
  });

  // Create promises to insert roles
  const insertRolePromises = Object.entries(roleMap).map(
    async ([role, model]) => {
      console.log("Deleting existing records for role:", role);
      await model.deleteMany({});
      console.log("Seeding role:", role, "with data length:", rolesData[role]?.length);
      const data = rolesData[role];

      const seededData = await seedRole(role, data);
      seeded[role] = seededData;
    }
  );

  // Wait for all promises to complete
  await Promise.all(insertRolePromises);

  console.log("Seeding completed:", seeded);
  return seeded;
};

export const seedRole = async (role, data) => {
  await dbConnect();
  const seeded = [];
  
  // Create promises to insert users and roles
  const insert = data.map(async (item) => {
    console.log("Seeding user for role:", role, "with data:", item);
    const user = new User(item);
    const roleModel = new roleMap[role]({ user: user._id });
    user.role = role;
    user[role] = roleModel._id;

    await user.save();
    await roleModel.save();

    seeded.push(user);
  });
  
  // Wait for all promises to complete
  await Promise.all(insert);

  console.log("Seeding completed for role:", role, "with seeded data:", seeded);
  return seeded;
};

export const main = async () => {
  console.log("Starting seeding process...");
  await seedRoles();
  console.log("Seeding process completed.");
};
