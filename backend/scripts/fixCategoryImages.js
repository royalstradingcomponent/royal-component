const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Category = require("../models/Category");

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

const imageMap = {
  temperaturesensorics: "/uploads/new-products/Thermistor-Sensor.jpg",
  humiditysensorics: "/uploads/new-products/Soil-Moisture-Sensor.jpg",
  pressuresensorics: "/uploads/new-products/interface-modules.jpg",
  lightsensorics: "/uploads/new-products/LDR-Sensor.jpg",
  motionsensorics: "/uploads/new-products/IR-Sensor-Module.jpg",
  touchsensorics: "/uploads/new-products/IR-Sensor-Module.jpg",
  currentsensorics: "/uploads/new-products/IR-Sensor-Module.jpg",
  sensorics: "/uploads/new-products/IR-Sensor-Module.jpg",
};

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    let updated = 0;

    for (const [slug, image] of Object.entries(imageMap)) {
      const result = await Category.updateMany(
        { slug },
        {
          $set: {
            image,
            iconAlt: `${slug} category image`,
          },
        }
      );

      updated += result.modifiedCount || 0;
      console.log(`✅ ${slug} -> ${image}`);
    }

    console.log("=================================");
    console.log(`✅ Updated categories: ${updated}`);
    console.log("=================================");
    process.exit(0);
  } catch (err) {
    console.error("❌ Category image fix failed:", err);
    process.exit(1);
  }
}

run();