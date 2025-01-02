import seedRoles from "@/seed/seedRoles";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const seededRoles = await seedRoles();

  return res
    .status(201)
    .json({ message: "Roles seeded successfully", seededRoles });
}
