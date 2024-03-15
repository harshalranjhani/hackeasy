import { PDFDocument, rgb } from 'pdf-lib';

export default async function createPDFReport(data) {
  // Create a new PDFDocument
  const pdfDoc = await PDFDocument.create();
  
  // Setup basic styling
  const page = pdfDoc.addPage([595, 842]); // Standard A4 size
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

  // Add a title to the PDF
  fontSize = 18;
  addText('GitHub Data Report', 25);
  fontSize = 10; // Reset font size for the rest of the content

  // Add section for commit search results
  addText('Commit Search Results:', 20);
  data.commitSearchResults.data.items.forEach((result, index) => {
    if (index < 5) { // Limit to the first 5 results for brevity
      addText(`${index + 1}. ${result.commitMessage} (Author: ${result.authorName})`, 12);
    }
  });

  // Add other sections (issues and PRs, repositories, commit timeline) similarly...
  // Make sure to check the yPosition and add new pages as needed

  // Serialize the PDFDocument to bytes (a Uint8Array)
  return await pdfDoc.save();
}
