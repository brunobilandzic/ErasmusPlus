import addEvidentionConnections from "@/seed/seedEvidentions";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const connectedEvidentions = await addEvidentionConnections();
      return res
        .status(200)
        .json({ count: connectedEvidentions.length, connectedEvidentions });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
