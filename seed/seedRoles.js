import { User } from "../model/db_models/auth";
import dbConnect from "../model/mongooseConnect";
import { RoleMap } from "@/constatns";
import rolesData from "../seed/data/roles";
import { capitalize, getModelFromIndex } from "@/utils";
import mongoose from "mongoose";
import { hash } from "bcryptjs";

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
  await Promise.all(
    Object.entries(RoleMap).map(async ([role, model]) => {
      const { deletedCount } = await model.deleteMany({});
      console.log(`Deleted ${deletedCount} ${role} roles`);

      const data = rolesData[role];

      const seededData = await seedRole(role, data);
      console.log(`Seeded ${seededData.length} ${role} roles`);
      seeded[role] = seededData?.length || 0;
    })
  );

  return seeded;
};

const seedRole = async (role, data) => {
  const seeded = [];
  await dbConnect();

  console.log(`Seeding ${data.length} ${role} roles`);

  // Create promises to insert users and roles
  await Promise.all(
    data.map(async (item) => {
      const user = new User(item);
      user.password = await hash(user.password, 10);
      const roleModel = new RoleMap[role]({ user: user._id });

      item.roleData && (await buildRoleModel(roleModel, item.roleData, role));

      !item.roleData && (await roleModel.save());

      user.role = role;
      user[role] = roleModel._id;

      await user.save();
      seeded.push(user);
    })
  );

  return seeded;
};

const buildRoleModel = async (roleModel, roleData, roleName) => {
  await Promise.all(
    Object.keys(roleData).map(async (key) => {
      const modelName = getModelFromIndex(key);
      if (modelName) {
        //its probably university
        const erasmusModel = mongoose.model(capitalize(modelName));
        const records = await erasmusModel.find();

        const record = records[roleData[key]];

        if (!record) {
          console.log(
            `Record not found for ${modelName} with index ${roleData[key]}`
          );
          return;
        }

        roleModel[modelName] = record._id;

        if (roleName == "coordinator") {
          record.coordinator = roleModel._id;
        }

        if (roleName == "professor") {
          record.professors.push(roleModel._id);
        }

        if (roleName == "student") {
          record.students.push(roleModel._id);
        }

        await record.save();
      }
      roleModel[key] = roleData[key];
    })
  );
  await roleModel.save();
};

export default seedRoles;
