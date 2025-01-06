import { Evidention } from "@/model/db_models/erasmus";
import dbConnect from "@/model/mongooseConnect";

const addEvidentionConnections = async () => {
  await dbConnect();
  const evidentions = await Evidention.find()
    .populate("student")
    .populate("professor")
    .populate("erasmus");

  return evidentions;
};

export default addEvidentionConnections;
