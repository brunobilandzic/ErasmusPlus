import mongoose from "mongoose";

// Define the user schema with username and password fields
// this part is defining the database and this is what we need to define first
// many models like this (university, student, application, etc)
const userSchema = {
  username: { type: String, required: true, description: "Username of the user" },
  password: { type: String, required: true, description: "Password of the user" },
  role: { type: String, enum: ["admin", "student", "professor"], description: "Role of the user" },
  roleRequest: { type: mongoose.Schema.Types.ObjectId, ref: "RoleRequest", description: "Role request reference" },
  adminRole: { type: mongoose.Schema.Types.ObjectId, ref: "AdminRole", description: "Admin role reference" },
  studentRole: { type: mongoose.Schema.Types.ObjectId, ref: "StudentRole", description: "Student role reference" },
  professorRole: { type: mongoose.Schema.Types.ObjectId, ref: "ProfessorRole", description: "Professor role reference" },
};

// Create a new Mongoose schema using the user schema definition
const UserSchema = new mongoose.Schema(userSchema);

// Check if the model is already defined, if not, define it
export const User = mongoose.models.User || mongoose.model("User", UserSchema);
