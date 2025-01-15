import { evidentions } from "@/seed/data/erasmus";
import mongoose from "mongoose";

// Schema for admin role
const adminRoleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
    description: "ID of the user with admin role",
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    description: "Date when the admin role was created",
  },
});

// Schema for student role
const studentRoleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
    description: "ID of the user with student role",
    default: null,
  },
  applications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      description: "List of applications",
      default: [],
    },
  ],
  evidentions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Evidention",
      description: "List of evidentions",
      default: [],
    },
  ],
  university: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "University",
    description: "Student's university",
    default: null,
  },
  grade_average: {
    type: Number,
    min: 3.0,
    max: 5.0,
    description: "Average grade achieved in the previous academic year",
  },
  first_mobility: {
    type: Boolean, // True if the student has not been on exchange before, False otherwise
    description: "Indicates if this is the student’s first mobility",
  },
  motivation_letter_score: {
    type: Number,
    min: 1.0,
    max: 5.0,
    description: "Score for the motivation letter",
  },
  english_language_proficiency: {
    type: Number,
    min: 2.0,
    max: 5.0,
    description: "Proficiency in the English language",
  },
  host_country_language_proficiency: {
    type: Number,
    min: 1.0,
    max: 5.0,
    description: "Proficiency in the host country’s language",
  },
  initiated_llp_agreement: {
    type: Boolean, // True if the student initiated the LLP agreement
    description: "Indicates if the student initiated the LLP agreement",
  },
  esn_membership: {
    type: Boolean, // True if the student is active in ESN
    description: "Indicates if the student is a member and active in ESN",
  },
  createdAt: {
    type: Date,
    default: Date.now,
    description: "Date when the student role was created",
  },
});

// Schema for professor role
const professorRoleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
    description: "ID of the user with professor role",
    default: null,
  },
  university: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "University",
    description: "Professor university",
    default: null,
  },
  applications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      description: "List of applications",
      default: [],
    },
  ],
  evidentions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Evidention",
      description: "List of evidentions",
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
    description: "Date when the professor role was created",
  },
});

// Schema for coordinator role
const coordinatorRoleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
    description: "ID of the user with coordinator role",
    default: null,
  },
  university: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "University",
    description: "University of coordinator",
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    description: "Date when the coordinator role was created",
  },
});

// Export AdminRole model
export const AdminRole =
  mongoose.models.AdminRole || mongoose.model("AdminRole", adminRoleSchema);

// Export StudentRole model
export const StudentRole =
  mongoose.models.StudentRole ||
  mongoose.model("StudentRole", studentRoleSchema);

// Export ProfessorRole model
export const ProfessorRole =
  mongoose.models.ProfessorRole ||
  mongoose.model("ProfessorRole", professorRoleSchema);

// Export CoordinatorRole model
export const CoordinatorRole =
  mongoose.models.CoordinatorRole ||
  mongoose.model("CoordinatorRole", coordinatorRoleSchema);
