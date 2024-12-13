// Schema for role requests
const roleRequestSchema = {
  userId: { type: ObjectId, required: true }, // ID of the user requesting the role
  role: { type: String, enum: ["admin", "student", "professor"] }, // Role being requested
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending", // Default status is pending
  },
};

// Schema for admin role
const adminRole = {
  userId: { type: ObjectId, required: true, ref: "User" }, // ID of the user with admin role
  roleRequests: [{ type: ObjectId, ref: "RoleRequest" }], // List of role requests to respond to
};

// Schema for student role
const studentRole = {
  userId: { type: ObjectId, required: true, ref: "User" }, // ID of the user with student role
  applications: [{ type: ObjectId, ref: "Application" }], // List of applications
  grade: { type: Number }, // Grade of the student
};

// Schema for professor role
const professorRole = {
  userId: { type: ObjectId, required: true, ref: "User" }, // ID of the user with professor role
  university: [{ type: ObjectId, ref: "University" }], // List of universities
  applications: [{ type: ObjectId, ref: "Application" }], // List of applications
};

// Create RoleRequest schema
const RoleRequestSchema = new mongoose.Schema(roleRequestSchema);

// Export RoleRequest model
export const RoleRequest =
  mongoose.models.RoleRequest ||
  mongoose.model("RoleRequest", RoleRequestSchema);

// Create AdminRole schema
const AdminRoleSchema = new mongoose.Schema(adminRole);
// Create StudentRole schema
const StudentRoleSchema = new mongoose.Schema(studentRole);
// Create ProfessorRole schema
const ProfessorRoleSchema = new mongoose.Schema(professorRole);

// Export AdminRole model
export const AdminRole =
  mongoose.models.AdminRole || mongoose.model("AdminRole", AdminRoleSchema);
// Export StudentRole model
export const StudentRole =
  mongoose.models.StudentRole ||
  mongoose.model("StudentRole", StudentRoleSchema);
// Export ProfessorRole model
export const ProfessorRole =
  mongoose.models.ProfessorRole ||
  mongoose.model("ProfessorRole", ProfessorRoleSchema);
