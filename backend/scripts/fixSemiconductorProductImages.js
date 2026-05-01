const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const Product = require("../models/Product");

const uploadsDir = path.join(__dirname, "../uploads/new-products");

function normalize(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function imageExists(fileName) {
  return fs.existsSync(path.join(uploadsDir, fileName));
}

function pickImage(product) {
  const name = normalize(product.name);
  const subCategory = normalize(product.subCategory);

  const exactMap = {
    currentsensorics: "ACS712.jpg",
    opamps: "LM358.jpg",
    comparators: "LM393.jpg",
    transistors: "Transisto1.jpg",
    mosfets: "Mosfet.jpg",
    diodes: "Diode.jpg",
    rectifiers: "KBP-410.jpg",
    triacs: "BT136.jpg",
    thyristors: "TIP-122.jpg",
    voltageregulators: "7805-Voltage-Regulator.jpg",
    bluetoothmodules: "Bluetooth-Module-HC-05.jpg",
    wifimodules: "ESP32-WiFi-Module.jpg",
    logicics: "4050-IC.jpg",
    buffers: "4050-IC.jpg",
    counterics: "4017.jpg",
  };

  const mappedFile = exactMap[subCategory];

  if (mappedFile && imageExists(mappedFile)) {
    return `/uploads/new-products/${mappedFile}`;
  }

  const files = fs
    .readdirSync(uploadsDir)
    .filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file));

  const matchedFile =
    files.find((file) => normalize(file).includes(name)) ||
    files.find((file) =>
      name.includes(normalize(file.replace(/\.(jpg|jpeg|png|webp)$/i, "")))
    ) ||
    files.find((file) => normalize(file).includes(subCategory));

  if (matchedFile) {
    return `/uploads/new-products/${matchedFile}`;
  }

  return "/uploads/new-products/LM358.jpg";
}

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    const products = await Product.find({ category: "semiconductors" });

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    for (const product of products) {
      const imagePath = pickImage(product);

      await Product.updateOne(
        { _id: product._id },
        {
          $set: {
            thumbnail: imagePath,
            images: [
              {
                url: imagePath,
                altText: product.name,
                isPrimary: true,
                order: 0,
              },
            ],
          },
        }
      );

      console.log(`✅ ${product.name} fixed -> ${imagePath}`);
  await sleep(20);

    }

    console.log("🎉 ALL DONE");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

run();