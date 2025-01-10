import { getAllErasmus } from "@/controller/erasmus/evidentions";

export default async function handler(req, res) {
  if (req.method == "GET") {
    const { eid } = req.query;
    const evidentions = await getAllErasmus(eid);
    res.status(200).json(evidentions);
  }
}
