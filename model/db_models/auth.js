import mongoose from "mongoose";

// Define the user schema with username and password fields
// this part is defining the database and this is what we need to define first
// many models like this (university, student, application, etc)
const userSchema = {
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "student", "professor"] },
  roleRequest: { type: mongoose.Schema.Types.ObjectId, ref: "RoleRequest" },
  adminRole: { type: mongoose.Schema.Types.ObjectId, ref: "AdminRole" },
  studentRole: { type: mongoose.Schema.Types.ObjectId, ref: "StudentRole" },
  professorRole: { type: mongoose.Schema.Types.ObjectId, ref: "ProfessorRole" },
};

// Create a new Mongoose schema using the user schema definition
const UserSchema = new mongoose.Schema(userSchema);

// Check if the model is already defined, if not, define it
export const User = mongoose.models.User || mongoose.model("User", UserSchema);
