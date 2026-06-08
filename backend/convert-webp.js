const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const folders = [
  "uploads/blogs",
  "uploads/categories",
  "uploads/new-products",
  "uploads/products",
  "uploads/requests",
  "uploads/search-temp",
  "uploads/supplier-files",
];

async function convertFolder(folder) {
  const files = fs.readdirSync(folder);

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();

    if (![".jpg", ".jpeg", ".png"].includes(ext)) continue;

    const input = path.join(folder, file);
    const output = path.join(
      folder,
      path.basename(file, ext) + ".webp"
    );

    if (fs.existsSync(output)) {
      console.log("Skipped:", output);
      continue;
    }

    try {
      await sharp(input)
        .webp({ quality: 75 })
        .toFile(output);

      console.log("Converted:", output);
    } catch (err) {
      console.log("Failed:", input);
    }
  }
}

async function run() {
  for (const folder of folders) {
    await convertFolder(folder);
  }

  console.log("Done");
}

run();