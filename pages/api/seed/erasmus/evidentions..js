import addEvidentionConnections from "@/seed/seedEvidentions";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const evidentions = await addEvidentionConnections();
      return res.status(200).json({ count: evidentions.length, evidentions });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
