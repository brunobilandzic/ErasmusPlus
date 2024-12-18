import { seedAdmins } from "@/seed";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  const seededAdmins = await seedAdmins();
  console.log("seeded:", seededAdmins);

  if (seededAdmins.length > 0) {
    return res
      .status(201)
      .json({ message: "Admins seeded successfully", seededAdmins });
  } else {
    return res.status(500).json({ message: "Error seeding admins" });
  }
}
