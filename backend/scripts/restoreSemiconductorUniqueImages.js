require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("../models/Category");

const MONGO_URI = process.env.MONGO_URI;

const imageMap = {
  // Main semiconductor child categories
  amplifierscomparators: "/uploads/new-products/LM358.jpg",
  audiovideoics: "/uploads/new-products/TDA2030.jpg",
  chipprogrammersdebuggers: "/uploads/new-products/USB-Programming-Cable.jpg",
  clocktimingfrequencyics: "/uploads/new-products/555.jpg",
  communicationwirelessmoduleics: "/uploads/new-products/RF-Module.jpg",
  dataconverters: "/uploads/new-products/DAC0808LCN.jpg",
  discretesemiconductors: "/uploads/new-products/Transisto1.jpg",
  interfaceics: "/uploads/new-products/interface-modules.jpg",
  "logic-ics": "/uploads/new-products/MAX485.jpg",
  memorychips: "/uploads/new-products/24C04-IC.jpg",
  powermanagementics: "/uploads/new-products/LM2577.jpg",
  processorsmicrocontrollers: "/uploads/new-products/Arduino-UNO-Compatible.jpg",
  programmablelogicics: "/uploads/new-products/4050-IC.jpg",
  sensorics: "/uploads/new-products/IR-Sensor-Module.jpg",

  // Deep children
  amplifiermodules: "/uploads/new-products/LM358.jpg",
  audioamplifierics: "/uploads/new-products/TDA2030.jpg",
  comparators: "/uploads/new-products/LM393.jpg",
  currentlooptransmitters: "/uploads/new-products/ACS712.jpg",
  currentsensingamplifiers: "/uploads/new-products/ACS712.jpg",
  differentialamplifiers: "/uploads/new-products/LM358.jpg",
  instrumentationamplifiers: "/uploads/new-products/LM358.jpg",
  isolationamplifiers: "/uploads/new-products/LM358.jpg",
  logarithmicamplifiers: "/uploads/new-products/LM358.jpg",
  opamps: "/uploads/new-products/LM358.jpg",
  programmablegainamplifiers: "/uploads/new-products/LM358.jpg",
  rfamplifiersics: "/uploads/new-products/RF-Module.jpg",
  transimpedanceamplifiers: "/uploads/new-products/LM358.jpg",
  videoamplifiersics: "/uploads/new-products/TDA2030.jpg",
  voltagecontrolledamplifiers: "/uploads/new-products/LED.jpg",

  chipprogrammers: "/uploads/new-products/USB-Programming-Cable.jpg",
  chipprogrammingadapters: "/uploads/new-products/USB-Programming-Cable.jpg",
  debuggersincircuitemulators: "/uploads/new-products/USB-Programming-Cable.jpg",

  adc: "/uploads/new-products/DAC0808LCN.jpg",
  dac: "/uploads/new-products/DAC0808LCN.jpg",
  dataacquisitionics: "/uploads/new-products/DAC0808LCN.jpg",
  signalconverters: "/uploads/new-products/DAC0808LCN.jpg",
  voltagetofrequencyconverters: "/uploads/new-products/DAC0808LCN.jpg",

  transistors: "/uploads/new-products/Transisto1.jpg",
  mosfets: "/uploads/new-products/Mosfet.jpg",
    diodes: "/uploads/new-products/Photodiode.jpg",

  rectifiers: "/uploads/new-products/KBP-410.jpg",
  thyristors: "/uploads/new-products/TIP-122.jpg",
  triacs: "/uploads/new-products/TIP-122.jpg",
  igbts: "/uploads/new-products/Transisto1.jpg",
  tvsdiodes: "/uploads/new-products/Diode.jpg",

  usbinterfaceics: "/uploads/new-products/USB-Programming-Cable.jpg",
  uartics: "/uploads/new-products/USB-Programming-Cable.jpg",
  ioexpanders: "/uploads/new-products/interface-modules.jpg",
  caninterfaceics: "/uploads/new-products/interface-modules.jpg",
  rs232rs485ics: "/uploads/new-products/MAX485.jpg",
  ethernetinterfaceics: "/uploads/new-products/interface-modules.jpg",
  levelshifters: "/uploads/new-products/interface-modules.jpg",

  buffers: "/uploads/new-products/MAX485.jpg",
  busswitches: "/uploads/new-products/MAX485.jpg",
  bustransceivers: "/uploads/new-products/MAX485.jpg",
  counterics: "/uploads/new-products/4017.jpg",
  encoderdecoderics: "/uploads/new-products/4017.jpg",
  flipflopics: "/uploads/new-products/4050-IC.jpg",
  invertersics: "/uploads/new-products/4050-IC.jpg",
  latchics: "/uploads/new-products/4050-IC.jpg",
  logicgates: "/uploads/new-products/4050-IC.jpg",
  multiplexerdemultiplexerics: "/uploads/new-products/4053.jpg",
  parityfunctions: "/uploads/new-products/4050-IC.jpg",
  translatorics: "/uploads/new-products/4050-IC.jpg",

  temperaturesensorics: "/uploads/new-products/Thermistor-Sensor.jpg",
  humiditysensorics: "/uploads/new-products/Soil-Moisture-Sensor.jpg",
  pressuresensorics: "/uploads/new-products/interface-modules.jpg",
  lightsensorics: "/uploads/new-products/LDR-Sensor.jpg",
  motionsensorics: "/uploads/new-products/IR-Sensor-Module.jpg",
  touchsensorics: "/uploads/new-products/IR-Sensor-Module.jpg",
  currentsensorics: "/uploads/new-products/IR-Sensor-Module.jpg",
};

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ MongoDB connected");

  for (const [slug, image] of Object.entries(imageMap)) {
    const result = await Category.updateOne(
      { slug },
      { $set: { image, iconAlt: `${slug} category image` } }
    );
    console.log(`✅ ${slug} matched:${result.matchedCount} modified:${result.modifiedCount}`);
  }

  await mongoose.disconnect();
  console.log("🎉 Unique semiconductor category images restored");
}

run().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});