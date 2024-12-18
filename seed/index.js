import { User } from "../../model/db_models/auth";
import {
  StudentRole,
  AdminRole,
  ProfessorRole,
  CoordinatorRole,
} from "../model/db_models/roles";

import { admins } from "./data/users";
import dbConnect from "../model/mongooseConnect";

const seed = async () => {
  await dbConnect();

  await User.deleteMany({});
};

const main = async () => {
  await seed();
};

main();
