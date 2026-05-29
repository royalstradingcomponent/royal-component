const Tesseract =
  require("tesseract.js");

const fs =
  require("fs");

const sharp =
  require("sharp");

const path =
  require("path");

const {
  extractImageCompanyDetails,
} = require("./pdf-parser/imageCompanyExtractor");

const {
  mergeBrokenLines,
} = require("./pdf-parser/smartImageParser");

const {
  extractComponents,
} = require("./pdf-parser/componentExtractor");

const {
  cleanLines,
} = require("./pdf-parser/textCleaner");

async function preprocessImage(
  input,
  output
) {

  await sharp(input)

    .resize({
      width: 2400,
      withoutEnlargement: false,
    })

    .grayscale()

    .normalize()

    .sharpen()

    .threshold(160)

    .png({
      quality: 100,
    })

    .toFile(output);
}

async function parseImageOCR(
  imagePaths = []
) {

  let allLines = [];

  for (const imagePath of imagePaths) {

    const optimized =
      `${imagePath}-ocr.png`;

    await sharp(imagePath)

      .resize({
        width: 2400,
      })

      .grayscale()

      .normalize()

      .sharpen()

      .threshold(160)

      .png({
        quality: 100,
      })

      .toFile(optimized);

    const result =
      await Tesseract.recognize(
        optimized,
        "eng",
        {
          tessedit_pageseg_mode: 6,

          preserve_interword_spaces: 1,

          logger: () => {},
        }
      );

    const rawText =
      result.data.text || "";

    const lines =
      rawText
        .split("\n")
        .map((line) =>
          line.trim()
        )
        .filter(Boolean);

    allLines.push(...lines);

    if (
      fs.existsSync(
        optimized
      )
    ) {

      fs.unlinkSync(
        optimized
      );
    }
  }

  const cleaned =
    cleanLines(allLines);

  const smartLines =
    mergeBrokenLines(
      cleaned
    );

  const companyDetails =
    extractImageCompanyDetails(
      smartLines
    );

  const components =
    extractComponents(
      smartLines
    );

  return {
    companyDetails,
    components,
  };
}

module.exports = {
  parseImageOCR,
};