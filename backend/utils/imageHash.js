const sharp = require("sharp");
const imghash = require("imghash");

async function generateImageHash(imagePath) {
  try {
    const buffer = await sharp(imagePath)
      .resize(256, 256)
      .png()
      .toBuffer();

    const hash = await imghash.hash(buffer);

    return hash;
  } catch (error) {
    console.log("HASH ERROR:", error.message);
    return null;
  }
}

module.exports = {
  generateImageHash,
};