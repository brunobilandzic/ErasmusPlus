import seedErasmus from "@/seed/seedErasmus";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const seededErasmus = await seedErasmus();
  console.log(`Number of seeded Erasmus entries: ${seededErasmus?.length}`);

  return res
    .status(201)
    .json({ message: "Erasmus entities seeded successfully", seededErasmus });
}
