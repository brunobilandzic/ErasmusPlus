import { programsValidity } from "@/controller/erasmus/programs";

export default async function handler(req, res) {
  const validity = await programsValidity();
  if (validity.valid) {
    return res
      .status(200)
      .json({ message: "All programs are valid", validity });
  }
  return res
    .status(400)
    .json({ message: "Some programs are invalid", validity });
}
