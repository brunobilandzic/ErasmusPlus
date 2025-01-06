import { applicationConnections } from "@/seed/seedApplications";

export default async function handler (req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const results = await applicationConnections();

  return res.status(201).json({
    message: "Application connections seeded successfully",
    results,
  });
}
