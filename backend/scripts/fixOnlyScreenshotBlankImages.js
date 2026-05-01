require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("../models/Category");

const MONGO_URI = process.env.MONGO_URI;

const fixMap = {
  buffers: "/uploads/new-products/MAX485.jpg",
  flipflopics: "/uploads/new-products/4050-IC.jpg",
  parityfunctions: "/uploads/new-products/4050-IC.jpg",

  uartics: "/uploads/new-products/USB-Programming-Cable.jpg",
  levelshifters: "/uploads/new-products/interface-modules.jpg",

  comparators: "/uploads/new-products/LM393.jpg",
  logarithmicamplifiers: "/uploads/new-products/LM358.jpg",
  voltagecontrolledamplifiers: "/uploads/new-products/LED.jpg",

  diodes: "/uploads/new-products/Diode.jpg",
  triacs: "/uploads/new-products/BT136.jpg",

  networkingmodules: "/uploads/new-products/RF-Module.jpg",
  wifimodules: "/uploads/new-products/ESP32-WiFi-Module.jpg",
};

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ MongoDB connected");

  for (const [slug, image] of Object.entries(fixMap)) {
    const result = await Category.updateOne(
      { slug },
      {
        $set: {
          image,
          iconAlt: `${slug} category image`,
        },
      }
    );

    console.log(`✅ ${slug} fixed -> ${image} | matched: ${result.matchedCount}`);
  }

  await mongoose.disconnect();
  console.log("🎉 Only screenshot blank images fixed");
}

run().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});