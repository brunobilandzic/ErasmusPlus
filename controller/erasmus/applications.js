import { Application } from "@/model/db_models/erasmus";

export const getUserApplications = async (user) => {
  try {
    const roleModel = user[user.role];
    const applicationIds = roleModel.applications;
    const applications = await Application.find({
      _id: { $in: applicationIds },
    }).populate({ path: "erasmus", populate: "university" });

    return applications;
  } catch (error) {
    throw error;
  }
};
