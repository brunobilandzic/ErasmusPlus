import { StudentRole } from "@/model/db_models/roles";

export default async function handler(req, res) {
  if (req.query.students) {
    const students = await StudentRole.find().populate(["user"]);
  }
}
