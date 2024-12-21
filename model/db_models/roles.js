import mongoose from "mongoose";

// Schema for admin role
const adminRoleSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User", description: "ID of the user with admin role" },
});

// Schema for student role
const studentRoleSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User", description: "ID of the user with student role" },
  applications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Application", description: "List of applications" }],
  grade: { type: Number, description: "Grade of the student" },
});

// Schema for professor role
const professorRoleSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User", description: "ID of the user with professor role" },
  university: [{ type: mongoose.Schema.Types.ObjectId, ref: "University", description: "List of universities" }],
  applications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Application", description: "List of applications" }],
});

// Schema for coordinator role
const coordinatorRoleSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User", description: "ID of the user with coordinator role" },
  university: [{ type: mongoose.Schema.Types.ObjectId, ref: "University", description: "List of universities" }],
  applications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Application", description: "List of applications" }],
  evidentions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Evidention", description: "List of evidentions" }],
});

// Export AdminRole model
export const AdminRole =
  mongoose.models.AdminRole || mongoose.model("AdminRole", adminRoleSchema);

// Export StudentRole model
export const StudentRole =
  mongoose.models.StudentRole || mongoose.model("StudentRole", studentRoleSchema);

// Export ProfessorRole model
export const ProfessorRole =
  mongoose.models.ProfessorRole || mongoose.model("ProfessorRole", professorRoleSchema);

// Export CoordinatorRole model
export const CoordinatorRole =
  mongoose.models.CoordinatorRole || mongoose.model("CoordinatorRole", coordinatorRoleSchema);
