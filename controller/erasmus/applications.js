import { RoleMap } from "@/constatns";
import { Application, ErasmusProgram } from "@/model/db_models/erasmus";
import dbConnect from "@/model/mongooseConnect";
import { getUniversityPrograms } from "./programs";

export const getUserApplications = async (roleName, roleId) => {
  try {
    await dbConnect();
    const role = await RoleMap[roleName].findById(roleId).populate({
      path: "applications",
      populate: { path: "erasmus", populate: { path: "university" } },
    });

    console.log(role.applications);

    return role.applications;
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
  const application = await Application.findById(id)
    .populate("erasmus")
    .populate([
      { path: "student", populate: "user" },
      { path: "professor", populate: "user" },
    ]);
  return application;
};

export const createApplication = async (applicationData) => {
  const application = new Application(applicationData);
  const user = await applicationRole(application);
  user.applications.push(application._id);
  const program = await ErasmusProgram.findById(application.erasmus);
  await user.save();
  await application.save();
  return application;
};

export const updateApplication = async (id, applicationData) => {
  const application = await Application.findByIdAndUpdate(id, applicationData, {
    new: true,
  });
  return application;
};

export const applicationRole = async (application) => {
  let role, roleId;

  if (application.student) {
    role = "student";
    roleId = application.student;
  } else if (application.professor) {
    role = "professor";
    roleId = application.professor;
  } else {
    console.log("Application has no role. Error.");
    return null;
  }

  const roleModel = RoleMap[role];
  const user = await roleModel.findById(roleId);

  return user;
};

export const getUniversityApplications = async (unId) => {
  const programs = await getUniversityPrograms(unId);
  await Promise.all(
    programs.map(async (program) => {
      await program.populate({
        path: "applications",
        populate: [
          { path: "student", populate: "user" },
          { path: "professor", populate: "user" },
        ],
      });
    })
  );

  return programs;
};
