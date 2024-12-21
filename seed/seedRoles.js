import { User } from "../model/db_models/auth";
import dbConnect from "../model/mongooseConnect";
import { RoleMap } from "@/constatns";
import rolesData from "../seed/data/roles";

const seedRoles = async () => {
  await dbConnect();
  const { deletedCount } = await User.deleteMany({});
  console.log(`Deleted ${deletedCount} users`);

  const seeded = {};

  // Initialize seeded object with null values for each role
  Object.keys(RoleMap).forEach(async (role) => {
    seeded[role] = null;
  });

  // Create promises to insert roles
  const insertRolePromises = Object.entries(RoleMap).map(
    async ([role, model]) => {
      console.log("Deleting existing records for role:", role);
      const { deletedCount } = await model.deleteMany({});
      console.log(`Deleted ${deletedCount} ${role} roles`);

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
    const roleModel = new RoleMap[role]({ user: user._id });

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
