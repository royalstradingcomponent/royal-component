const { fromPath } =
  require("pdf2pic");

const Tesseract =
  require("tesseract.js");

async function runOCRFallback(
  filePath
) {
  const convert =
    fromPath(filePath, {
      density: 120,
      saveFilename: "page",
      savePath: "./uploads/temp",
      format: "png",
      width: 1200,
      height: 1200,
    });

  const pages = [];

  for (let i = 1; i <= 10; i++) {
    try {
      const page =
        await convert(i);

      pages.push(page.path);

    } catch {
      break;
    }
  }

  const lines = [];

  for (const img of pages) {

    const result =
      await Tesseract.recognize(
        img,
        "eng"
      );

    lines.push(
      ...result.data.text.split("\n")
    );
  }

  return lines;
}

module.exports = {
  runOCRFallback,
};