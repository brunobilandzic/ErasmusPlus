import { RoleMap } from "@/constatns";
import { User } from "@/model/db_models/auth";
import { University } from "@/model/db_models/erasmus";
import dbConnect from "@/model/mongooseConnect";

export const getUniversity = async (id) => {
  await dbConnect();
  const university = await University.findById(id)
    .populate("erasmusPrograms")
    .populate({
      path: "compatibleUniversities",
      populate: { path: "erasmusPrograms" },
    });

  if (!university) {
    return null;
  }

  return university;
};

export const getUniversityForUser = async (userId) => {
  await dbConnect();
  const user = await User.findById(userId);
  const roleId = user[user.role];
  const roleEntity = await RoleMap[user.role].findById(roleId);
  const university = await University.findById(roleEntity.university)
    .populate("erasmusPrograms")
    .populate({
      path: "compatibleUniversities",
      populate: { path: "erasmusPrograms" },
    });

  return university;
};

export const getAllUniversities = async () => {
  await dbConnect();
  const universities = await University.find().populate("erasmusPrograms");

  return universities;
};
