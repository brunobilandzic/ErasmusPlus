import mongoose from "mongoose";

const universitySchema = {
  name: { type: String, description: "Name of the university" },
  location: { type: String, description: "Location of the university" },
  compatibleUniversities: [
    { type: mongoose.Schema.Types.ObjectId, ref: "University", description: "List of compatible universities" },
  ],
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
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "StudentRole", description: "ID of the student" },
  professorId: { type: mongoose.Schema.Types.ObjectId, ref: "ProfessorRole", description: "ID of the professor" },
  coordinatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CoordinatorRole",
    description: "ID of the coordinator",
  },
  erasmusId: { type: mongoose.Schema.Types.ObjectId, ref: "ErasmusProgram", description: "ID of the Erasmus program" },
  universityId: { type: mongoose.Schema.Types.ObjectId, ref: "University", description: "ID of the university" },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
    description: "Status of the application",
  },
  comment: { type: String, description: "Comment on the application" },
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
