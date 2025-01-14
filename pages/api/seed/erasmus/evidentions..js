import addEvidentionConnections, { seedBlank } from "@/seed/seedEvidentions";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const blank = req.query.blank;
    if (blank) {
      try {
        const blankLength = await seedBlank();
        return res.status(200).json({ blankLength });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }
    try {
      const connectedEvidentions = await addEvidentionConnections();
      return res.status(200).json({ connectedEvidentions });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
