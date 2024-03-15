import getChecks from "./checks";
import createPDFReport from "./createPDF";
import gptCheck from "./gptCheck";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { query, idea } = req.body;

  try {
    const data = await gptCheck(idea);
    const checkData = await getChecks(query);
    const finalData = { ...data, ...checkData };
    const pdfBytes = await createPDFReport(finalData);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=report.pdf");
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error("Error occurred:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
}
