import { getRole } from "@/controller/auth";

export default async function handler(req, res) {
  const { method } = req;
  const { role, roleName } = await getRole(req.headers.authorization);

  if (method === "GET") {
    const evidentions = req.query.evidentions;
    if (evidentions) {
    }
  }
}
