import {
  AdminRole,
  StudentRole,
  ProfessorRole,
  CoordinatorRole,
} from "./model/db_models/roles";
import {
  University,
  ErasmusProgram,
  Evidention,
  Application,
} from "./model/db_models/erasmus";

// Array of roles
export const roles = ["admin", "student", "professor", "coordinator"];

// Map each role to its corresponding model
export const RoleMap = {
  admin: AdminRole,
  student: StudentRole,
  professor: ProfessorRole,
  coordinator: CoordinatorRole,
};

// Map each erasmuus entity name to its corresponding model
export const ErasmusMap = {
  universities: University,
  erasmusPrograms: ErasmusProgram,
  evidentions: Evidention,
  applications: Application,
};
