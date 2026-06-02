const pdfParse = require("pdf-parse");
const fs = require("fs");

async function extractBomComponents(pdfPath) {
  const buffer = fs.readFileSync(pdfPath);

  const data = await pdfParse(buffer);

  const text = data.text || "";

  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const items = [];

  for (const line of lines) {
    const match = line.match(
      /([A-Z0-9\-\/]+)\s+([A-Z0-9\-\/]+)\s+(\d+)/i
    );

    if (match) {
      items.push({
        componentName: match[1],
        partNumber: match[1],
        brand: match[2],
        quantity: Number(match[3]),
      });
    }
  }

  return items;
}

module.exports = extractBomComponents;