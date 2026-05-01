const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("../models/Product");

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

const uploadFolders = [
  {
    folderPath: path.join(__dirname, "../uploads/new-products"),
    publicPath: "/uploads/new-products",
  },
  {
    folderPath: path.join(__dirname, "../uploads/products"),
    publicPath: "/uploads/products",
  },
];

const normalize = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[^a-z0-9]/g, "");

const keywordMap = [
  ["lm358", "LM358.jpg"],
  ["lm393", "LM393.jpg"],
  ["opamp", "LM358.jpg"],
  ["comparator", "LM393.jpg"],

  ["lcd", "LCD 16x2.jpg"],
  ["display", "Display-modules.jpg"],

  ["ldr", "LDR-Sensor.jpg"],
  ["light", "LDR-Sensor.jpg"],
  ["sensor", "IR-Sensor-Module.jpg"],
  ["temperature", "Thermistor-Sensor.jpg"],
  ["humidity", "Soil-Moisture-Sensor.jpg"],
["motion", "IR-Sensor-Module.jpg"],
["pressure", "interface-modules.jpg"],

  ["bluetooth", "Bluetooth-Module-HC-05.jpg"],
  ["wifi", "ESP32-WiFi-Module.jpg"],
  ["wireless", "RF-Module.jpg"],
  ["rf", "RF-Module.jpg"],

  ["clock", "555.jpg"],
  ["timer", "555.jpg"],
  ["watchdog", "555.jpg"],

  ["memory", "24C04-IC.jpg"],
  ["eeprom", "24C04-IC.jpg"],
  ["nvram", "24C04-IC.jpg"],
  ["flash", "24C04-IC.jpg"],

  ["logic", "4050-IC.jpg"],
  ["buffer", "4050-IC.jpg"],
  ["counter", "4017.jpg"],
  ["multiplexer", "4053.jpg"],

  ["microcontroller", "Arduino-UNO-Compatible.jpg"],
  ["processor", "Arduino-UNO-Compatible.jpg"],
  ["embedded", "Arduino-Nano.jpg"],

  ["power", "LM2577.jpg"],
  ["voltage", "7805-Voltage-Regulator.jpg"],
  ["regulator", "7805-Voltage-Regulator.jpg"],
  ["dcdc", "Voltage-Buck-Converter-LM2596.jpg"],
  ["battery", "Battery-3.7V.jpg"],
  ["charge", "Battery-Connector.jpg"],

  ["capacitor", "Capacitor-Ceramic.jpg"],
  ["diode", "Diode.jpg"],
  ["transistor", "Transisto1.jpg"],
  ["mosfet", "Mosfet.jpg"],
  ["rectifier", "KBP-410.jpg"],
  ["thyristor", "TIP-122.jpg"],
  ["triac", "BT136.jpg"],

  ["interface", "interface-modules.jpg"],
  ["usb", "USB-Programming-Cable.jpg"],
  ["uart", "USB-Programming-Cable.jpg"],
  ["ethernet", "interface-modules.jpg"],
];

function getAllImageFiles() {
  const files = [];

  for (const item of uploadFolders) {
    if (!fs.existsSync(item.folderPath)) continue;

    const folderFiles = fs
      .readdirSync(item.folderPath)
      .filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file))
      .map((file) => ({
        file,
        normalized: normalize(file),
        publicUrl: `${item.publicPath}/${file}`,
      }));

    files.push(...folderFiles);
  }

  return files;
}

function findBestImage(product, allFiles) {
  const text = normalize(
    `${product.name} ${product.slug} ${product.subCategory} ${(product.tags || []).join(" ")}`
  );

  const exact = allFiles.find((img) => text.includes(img.normalized));
  if (exact) return exact.publicUrl;

  for (const [keyword, filename] of keywordMap) {
    if (text.includes(normalize(keyword))) {
      const found = allFiles.find((img) => img.file.toLowerCase() === filename.toLowerCase());
      if (found) return found.publicUrl;
    }
  }

  return allFiles.find((img) => img.file === "LM358.jpg")?.publicUrl || "/uploads/new-products/LM358.jpg";
}

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    const allFiles = getAllImageFiles();
    console.log(`🖼️ Found image files: ${allFiles.length}`);

    const products = await Product.find({});
    console.log(`📦 Found products: ${products.length}`);

    let updated = 0;

    for (const product of products) {
      const bestImage = findBestImage(product, allFiles);

      product.thumbnail = bestImage;
      product.images = [
        {
          url: bestImage,
          altText: `${product.name} image`,
          isPrimary: true,
          order: 0,
        },
      ];

      await product.save();
      updated++;

      console.log(`✅ ${product.name} -> ${bestImage}`);
    }

    console.log("=================================");
    console.log(`✅ Updated product images: ${updated}`);
    console.log("=================================");
    process.exit(0);
  } catch (error) {
    console.error("❌ Image fix failed:", error);
    process.exit(1);
  }
}

run();