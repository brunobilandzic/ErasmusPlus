import mongoose from "mongoose";

const universitySchema = {
  name: { type: String, description: "Name of the university" },
  location: { type: String, description: "Location of the university" },
  compatibleUniversities: [
    { type: mongoose.Schema.Types.ObjectId, ref: "University", description: "List of compatible universities" },
  ],
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "StudentRole", description: "List of students" }],
  professors: [{ type: mongoose.Schema.Types.ObjectId, ref: "ProfessorRole", description: "List of professors" }],
  coordinators: [{ type: mongoose.Schema.Types.ObjectId, ref: "CoordinatorRole", description: "List of coordinators" }],
  erasmusPrograms: [{ type: mongoose.Schema.Types.ObjectId, ref: "ErasmusProgram", description: "List of Erasmus programs" }],
};

const erasmusProgramSchema = {
  name: { type: String, required: true, description: "Name of the Erasmus program" },
  description: { type: String, description: "Description of the Erasmus program" },
  month: { type: Number, min: 1, max: 12, description: "Month of the program" },
  year: { type: Number, min: 2025, max: 2030, default: 2025, description: "Year of the program" },
  universities: [{ type: mongoose.Schema.Types.ObjectId, ref: "University", description: "List of participating universities" }],
  evidentions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Evidention", description: "List of evidentions" }],
  applications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Application", description: "List of applications" }],
};

const evidentionSchema = {
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "StudentRole", description: "ID of the student" },
  professorId: { type: mongoose.Schema.Types.ObjectId, ref: "ProfessorRole", description: "ID of the professor" },
  coordinatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CoordinatorRole",
    description: "ID of the coordinator",
  },
  erasmusId: { type: mongoose.Schema.Types.ObjectId, ref: "ErasmusProgram", description: "ID of the Erasmus program" },
  universityId: { type: mongoose.Schema.Types.ObjectId, ref: "University", description: "ID of the university" },
  comment: { type: String, description: "Comment on the evidention" },
  rating: {
    type: Number,
    min: 1,
    max: 100,
    description: "Rating of the evidention",
  },
  status: {
    type: String,
    enum: ["pending", "rated", "in progress"],
    default: "pending",
    description: "Status of the evidention",
  },
};

const ApplicationSchema = {
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StudentRole",
    description: "ID of the student",
  },
  professorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProfessorRole",
    description: "ID of the professor",
  },
  coordinatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CoordinatorRole",
    description: "ID of the coordinator",
  },
  erasmusId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ErasmusProgram",
    description: "ID of the Erasmus program",
  },
  universityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "University",
    description: "ID of the university",
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
    description: "Status of the application",
  },
  comment: { type: String, description: "Comment on the application" },
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
};

export const University =
  mongoose.models.University ||
  mongoose.model("University", new mongoose.Schema(universitySchema));
export const Evidention =
  mongoose.models.Evidention ||
  mongoose.model("Evidention", new mongoose.Schema(evidentionSchema));
export const ErasmusProgram =
  mongoose.models.ErasmusProgram ||
  mongoose.model("ErasmusProgram", new mongoose.Schema(erasmusProgramSchema));
export const Application =
  mongoose.models.Application ||
  mongoose.model("Application", new mongoose.Schema(ApplicationSchema));
