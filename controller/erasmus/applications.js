import { Application } from "@/model/db_models/erasmus";
import dbConnect from "@/model/mongooseConnect";

export const getUserApplications = async (user) => {
  try {
    await dbConnect();
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

export const getAllApplications = async () => {
  const applications = await Application.find().populate("erasmus");
  return applications;
};

export const getAllApplicationsByStatus = async (status) => {
  const applications = await Application.find({ status }).populate("erasmus");
  return applications;
};

export const getApplicationById = async (id) => {
  const application = await Application.findById(id).populate("erasmus");
  return application;
};

export const createApplication = async (applicationData) => {
  const application = new Application(applicationData);
  await application.save();
  return application;
};

export const updateApplication = async (id, applicationData) => {
  const application = await Application.findByIdAndUpdate(id, applicationData, {
    new: true,
  });
  return application;
};
