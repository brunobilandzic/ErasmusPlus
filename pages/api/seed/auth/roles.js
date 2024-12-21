import { seedRoles } from "@/seed/index";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const seeded = await seedRoles();

  const response = {};

  Object.keys(seeded).forEach((role) => {
    response[role] = seeded[role].length;
  });

  return res
    .status(201)
    .json({ message: "Roles seeded successfully", ...response });
}
