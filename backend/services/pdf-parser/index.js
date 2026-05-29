const fs = require("fs");
const pdf = require("pdf-parse");
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");

const {
  runOCRFallback,
} = require("./ocrService");

const {
  extractCompanyDetails,
} = require("./supplierExtractor");

const {
  extractComponents,
} = require("./componentExtractor");

const {
  cleanLines,
} = require("./textCleaner");

async function parseSupplierPdfService(
  filePath
) {
  const buffer =
    fs.readFileSync(filePath);

  let allLines = [];

  let rawText = "";

  try {
    const parsed =
      await pdf(buffer);

    rawText = parsed.text || "";

  } catch (err) {
    console.log(err);
  }

  const pdfData =
    new Uint8Array(buffer);

  const pdfDoc =
    await pdfjsLib.getDocument({
      data: pdfData,
    }).promise;

  for (
    let pageNum = 1;
    pageNum <= pdfDoc.numPages;
    pageNum++
  ) {
    const page =
      await pdfDoc.getPage(pageNum);

    const content =
      await page.getTextContent();

    const items =
      content.items || [];

    const linesMap = {};

    for (const item of items) {

      const y = Math.round(
        item.transform[5]
      );

      if (!linesMap[y]) {
        linesMap[y] = [];
      }

      linesMap[y].push({
        text: item.str,
        x: item.transform[4],
      });
    }

    const pageLines =
      Object.values(linesMap)
        .map((line) =>
          line
            .sort((a, b) => a.x - b.x)
            .map((i) => i.text)
            .join(" ")
        );

    allLines.push(...pageLines);
  }

  if (
    rawText.trim().length < 100
  ) {

    const ocrLines =
      await runOCRFallback(filePath);

    allLines.push(...ocrLines);
  }

  const cleanedLines =
    cleanLines(allLines);

  const companyDetails =
    extractCompanyDetails(
      cleanedLines
    );

  const components =
    extractComponents(
      cleanedLines
    );

  return {
    companyDetails,
    components,
  };
}

module.exports = {
  parseSupplierPdfService,
};