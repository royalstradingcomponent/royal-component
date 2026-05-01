require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("../models/Category");

const MONGO_URI = process.env.MONGO_URI;

const parentImagePools = {
  chipprogrammersdebuggers: [
    "/uploads/new-products/USB-Programming-Cable.jpg",
    "/uploads/new-products/Adapter-Socket.jpg",
    "/uploads/new-products/Tool-kit.jpg",
  ],

  audiovideoics: [
    "/uploads/new-products/TDA2030.jpg",
    "/uploads/new-products/TDA2020.jpg",
    "/uploads/new-products/TDA8444P.jpg",
    "/uploads/new-products/DTV32.jpg",
    "/uploads/new-products/DTV32D.jpg",
    "/uploads/new-products/Display-modules.jpg",
  ],

  amplifierscomparators: [
    "/uploads/new-products/LM358.jpg",
    "/uploads/new-products/LM393.jpg",
    "/uploads/new-products/ACS712.jpg",
    "/uploads/new-products/RF-Module.jpg",
    "/uploads/new-products/TDA2030.jpg",
    "/uploads/new-products/LED.jpg",
  ],

  dataconverters: [
    "/uploads/new-products/DAC0808LCN.jpg",
    "/uploads/new-products/DAC0808LCN.jpg",
    "/uploads/new-products/interface-modules.jpg",
    "/uploads/new-products/4050-IC.jpg",
    "/uploads/new-products/4017.jpg",
  ],

  discretesemiconductors: [
    "/uploads/new-products/Transisto1.jpg",
    "/uploads/new-products/Mosfet.jpg",
    "/uploads/new-products/Diode.jpg",
    "/uploads/new-products/KBP-410.jpg",
    "/uploads/new-products/TIP-122.jpg",
    "/uploads/new-products/BT136.jpg",
    "/uploads/new-products/2N3448.jpg",
  ],

  interfaceics: [
    "/uploads/new-products/USB-Programming-Cable.jpg",
    "/uploads/new-products/MAX485.jpg",
    "/uploads/new-products/interface-modules.jpg",
    "/uploads/new-products/Small-board-connectors.jpg",
    "/uploads/new-products/Connecting-Wires.jpg",
  ],

  logicics: [
    "/uploads/new-products/MAX485.jpg",
    "/uploads/new-products/4017.jpg",
    "/uploads/new-products/4050-IC.jpg",
    "/uploads/new-products/4053.jpg",
    "/uploads/new-products/SN74HC57N.jpg",
  ],

  powermanagementics: [
    "/uploads/new-products/7805-Voltage-Regulator.jpg",
    "/uploads/new-products/Voltage-Buck-Converter-LM2596.jpg",
    "/uploads/new-products/Battery-3.7V.jpg",
    "/uploads/new-products/Battery-Connector.jpg",
    "/uploads/new-products/LM2577.jpg",
    "/uploads/new-products/TIP-122.jpg",
  ],

  sensorics: [
    "/uploads/new-products/Thermistor-Sensor.jpg",
    "/uploads/new-products/Soil-Moisture-Sensor.jpg",
    "/uploads/new-products/LDR-Sensor.jpg",
    "/uploads/new-products/IR-Sensor-Module.jpg",
    "/uploads/new-products/Ultrasonic-Sensor-HC-SR04.jpg",
  ],

  processorsmicrocontrollers: [
    "/uploads/new-products/Arduino-UNO-Compatible.jpg",
    "/uploads/new-products/Arduino-Nano.jpg",
    "/uploads/new-products/ESP32-WiFi-Module.jpg",
  ],

  programmablelogicics: [
    "/uploads/new-products/4050-IC.jpg",
    "/uploads/new-products/SN74HC57N.jpg",
    "/uploads/new-products/4017.jpg",
  ],

  communicationwirelessmoduleics: [
    "/uploads/new-products/RF-Module.jpg",
    "/uploads/new-products/Bluetooth-Module-HC-05.jpg",
    "/uploads/new-products/ESP32-WiFi-Module.jpg",
    "/uploads/new-products/Bluetooth-Module-HC-06.jpg",
  ],
};

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ MongoDB connected");

  for (const [parentSlug, images] of Object.entries(parentImagePools)) {
    const children = await Category.find({
      group: "semiconductors",
      parentSlug,
    }).sort({ order: 1, name: 1 });

    console.log(`\n📂 Parent: ${parentSlug} | children: ${children.length}`);

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const image = images[i % images.length];

      await Category.updateOne(
        { _id: child._id },
        {
          $set: {
            image,
            iconAlt: `${child.slug} category image`,
          },
        }
      );

      console.log(`✅ ${child.slug} -> ${image}`);
    }
  }

  await mongoose.disconnect();
  console.log("\n🎉 Repeated child category images fixed");
}

run().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});