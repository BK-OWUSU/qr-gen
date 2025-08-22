import { PDFDocument } from "pdf-lib";

export async function mergePDFs(files: File[]) {
  // Create a new PDF
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    // Load each PDF
    const pdfBytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(pdfBytes);

    // Copy all pages into the merged PDF
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  // Save the merged PDF
  const mergedPdfFile = await mergedPdf.save();

  const blob = new Blob([mergedPdfFile], { type: "application/pdf" })
  const url  = URL.createObjectURL(blob)
  return url;

  // // Trigger download in browser
  // const blob = new Blob([mergedPdfFile], { type: "application/pdf" });
  // const link = document.createElement("a");
  // link.href = URL.createObjectURL(blob);
  // link.download = "combined.pdf";
  // link.click();
}
