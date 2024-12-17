import {
  AdminRole,
  StudentRole,
  ProfessorRole,
  CoordinatorRole,
} from "./model/db_models/roles";

// Array of roles
export const roles = ["admin", "student", "professor", "coordinator"];

// Map each role to its corresponding model
export const roleMap = {
  admin: AdminRole,
  student: StudentRole,
  professor: ProfessorRole,
  coordinator: CoordinatorRole,
};
