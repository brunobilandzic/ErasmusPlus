import { User } from "../model/db_models/auth";
import dbConnect from "../model/mongooseConnect";
import { roleMap } from "@/constatns";
import rolesData from "../seed/data/roles";

const seedRoles = async () => {
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
      const data = rolesData[role];

      const seededData = await seedRole(role, data);
      console.log(`Seeded ${seededData.length} ${role} roles`);
      seeded[role] = seededData;
    }
  );

  // Wait for all promises to complete
  await Promise.all(insertRolePromises);

  // Transform seeded[role] to length
  Object.keys(seeded).forEach((role) => {
    seeded[role] = seeded[role] ? seeded[role].length : 0;
  });
  return seeded;
};

const seedRole = async (role, data) => {
  await dbConnect();
  const seeded = [];

  // Create promises to insert users and roles
  const insert = data.map(async (item) => {
    const user = new User(item);
    const roleModel = new roleMap[role]({ user: user._id });

    if (role === "student") {
      buildRoleModel(roleModel, item.roleData);
    }

    user.role = role;
    user[role] = roleModel._id;

    await user.save();
    await roleModel.save();
    seeded.push(user);
  });

  // Wait for all promises to complete
  await Promise.all(insert);

  return seeded;
};

const buildRoleModel = (roleModel, item) => {
  Object.keys(item).forEach((key) => {
    roleModel[key] = item[key];
  });
};

export default seedRoles;
