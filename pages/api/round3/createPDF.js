import { PDFDocument, rgb } from "pdf-lib";

export default async function createPDFReport(data) {
  // Create a new PDFDocument
  console.log(data.data.commitSearchResults.data.items[0])
  const pdfDoc = await PDFDocument.create();

  // Setup basic styling
  let page = pdfDoc.addPage([595, 842]); // Standard A4 size
  let fontSize = 10;
  let marginTop = 30;
  let marginLeft = 50;
  let currentYPosition = page.getHeight() - marginTop;

  // Function to add text to the page with automatic line spacing
  const addText = (text, yPositionOffset = 15) => {
    page.drawText(text, {
      x: marginLeft,
      y: currentYPosition,
      size: fontSize,
      color: rgb(0, 0, 0),
    });
    currentYPosition -= yPositionOffset; // Move down for the next line of text
  };

  fontSize = 18;

  addText("An analysis of the project", 25);
  fontSize = 10;
  addText(data.analysis, 20);

  page = pdfDoc.addPage([595, 842]);

  fontSize = 18;

  addText("GitHub Data Report", 25);
  fontSize = 10;

  addText("Commit Search Results:", 20);
  addText("Total Matches: " + data.data.commitSearchResults.data.total_count, 15);
  addText("Top 10 Results:", 15);
  data.data.commitSearchResults.data.items.forEach((result, index) => {
    if (index < 10) {
      // make this text a link to the commit
      addText(
        `${index + 1}. ${result.commit.message} (Author: ${result.commit.author.name})`,
        12
      );
      addText(`Repository: ${result.repository.full_name}`, 12);
      addText(`Commit URL: ${result.commit.url}`, 12);
    }
  });

  page = pdfDoc.addPage([595, 842]);

  addText("Repository Search Results:", 20);
  addText("Total Matches: " + data.data.repositorySearchResults.data.total_count, 15);
  addText("Top 10 Results:", 15);
  data.data.repositorySearchResults.data.items.forEach((result, index) => {
    if (index < 10) {
      // make this text a link to the commit
      addText(
        `${index + 1}. ${result.name} (Owner: ${result.owner.login})`,
        12
      );
      addText(`Repository: ${result.html_url}`, 12);
    }
  });

  page = pdfDoc.addPage([595, 842]);

  addText("Commit Authenticity:", 20);
  addText(data.data.commitTimeLineResults.message, 20);

  // Serialize the PDFDocument to bytes (a Uint8Array)
  return await pdfDoc.save();
}
