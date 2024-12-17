import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ["admin", "student", "professor"], // Predefined roles
  },
});

export default mongoose.models.Role || mongoose.model("Role", RoleSchema);
