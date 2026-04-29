const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("../models/Product");

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI not found in .env");
  process.exit(1);
}

/*
  IMPORTANT:
  Category collection me slug dash ke bina hai:
  interfaceics, logicics, memorychips, sensorics...
  Isliye product.subCategory bhi EXACT same no-dash slug me save hoga.
*/

const rules = [
  // Semiconductors
  { match: ["capacitor", "ceramic capacitor", "electrolytic"], category: "semiconductors", subCategory: "capacitors" },
  { match: ["resistor", "trim preset", "ldr"], category: "semiconductors", subCategory: "resistors" },
  { match: ["transistor", "bc547", "2n3448", "2sa1943", "2sc5200", "tip122", "tip-122", "cd13005", "c2073"], category: "semiconductors", subCategory: "transistors" },
  { match: ["mosfet", "7n65", "irfp"], category: "semiconductors", subCategory: "mosfets" },
  { match: ["diode", "zener", "photodiode"], category: "semiconductors", subCategory: "diodes" },

  { match: ["lm358", "op amp", "op-amp"], category: "semiconductors", subCategory: "opamps" },
  { match: ["lm393", "comparator"], category: "semiconductors", subCategory: "comparators" },

  { match: ["555", "ic555", "ne555", "timer"], category: "semiconductors", subCategory: "timercircuits" },
  { match: ["7805", "7812", "lm2577", "lm2596", "lm317", "voltage regulator", "buck converter", "boost converter"], category: "semiconductors", subCategory: "voltageregulators" },
  { match: ["l298n", "l293d", "motor driver"], category: "semiconductors", subCategory: "motordriverics" },

  { match: ["24c04", "24bc04", "memory", "eeprom", "eprom", "sram", "dram"], category: "semiconductors", subCategory: "memorychips" },
  { match: ["logic", "sn74", "74hc", "4060", "4017", "4050", "4053", "4013"], category: "semiconductors", subCategory: "logicics" },
  { match: ["interface module", "interface", "usb programming cable", "dual sim socket"], category: "semiconductors", subCategory: "interfaceics" },
  { match: ["lcd", "display", "7 segment", "7-segment"], category: "semiconductors", subCategory: "displayics" },
  { match: ["sensor", "thermistor", "ir sensor", "flame", "ultrasonic", "soil moisture", "accelerometer"], category: "semiconductors", subCategory: "sensorics" },
  { match: ["bluetooth", "wifi", "wi-fi", "rf module", "esp32"], category: "semiconductors", subCategory: "communicationwirelessmoduleics" },

  // Power
  { match: ["battery", "aa cells", "battery holder"], category: "powersuppliesregulators", subCategory: "batteries" },
  { match: ["fuse"], category: "powersuppliesregulators", subCategory: "protection" },
  { match: ["heat sink"], category: "powersuppliesregulators", subCategory: "cooling" },

  // Cables
  { match: ["jumper wire", "jumper wires", "connecting wires"], category: "cableswires", subCategory: "jumperwires" },

  // Connectors
  { match: ["terminal block", "terminal-block", "dc jack", "dc power jack", "push terminal", "adapter socket", "connector"], category: "connectors", subCategory: "connectors" },

  // Switches / buzzers / indicators
  { match: ["switch", "push button", "relay module", "5 pin relay"], category: "switchesbuzzersindicators", subCategory: "switches" },
  { match: ["buzzer", "piezo speaker"], category: "switchesbuzzersindicators", subCategory: "buzzers" },
  { match: ["led", "indicator lamp"], category: "switchesbuzzersindicators", subCategory: "indicators" },

  // Automation
  { match: ["relay", "flasher relay"], category: "automation", subCategory: "relays" },
  { match: ["arduino", "uno", "nano"], category: "automation", subCategory: "arduinoboards" },
  { match: ["motor", "dc motor", "stepper", "servo"], category: "automation", subCategory: "motors" },
  { match: ["robot", "chassis", "wheel", "castor"], category: "automation", subCategory: "robotics" },

  // Tools
  { match: ["tool", "soldering", "pcb board", "breadboard"], category: "toolsaccessories", subCategory: "tools" },

  // Mechanical
  { match: ["mounting", "nut bolt"], category: "mechanicalhardware", subCategory: "hardware" },
];

function normalize(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function findCategory(product) {
  const text = normalize(
    `${product.name || ""} ${product.slug || ""} ${product.sku || ""} ${product.shortDescription || ""} ${product.description || ""} ${product.thumbnail || ""}`
  );

  for (const rule of rules) {
    if (rule.match.some((word) => text.includes(normalize(word)))) {
      return {
        category: rule.category,
        subCategory: rule.subCategory,
      };
    }
  }

  return null;
}

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    const products = await Product.find({ isActive: true });
    console.log(`🔍 Found ${products.length} products`);

    let updated = 0;
    let skipped = 0;

    for (const product of products) {
      const mapped = findCategory(product);

      if (!mapped) {
        skipped++;
        console.log(`⚠️ Skipped: ${product.name}`);
        continue;
      }

      product.category = mapped.category;
      product.subCategory = mapped.subCategory;

      await product.save();
      updated++;

      console.log(`✅ ${product.name} → ${mapped.category} / ${mapped.subCategory}`);
    }

    console.log("=================================");
    console.log(`✅ Updated: ${updated}`);
    console.log(`⚠️ Skipped: ${skipped}`);
    console.log("=================================");

    process.exit(0);
  } catch (error) {
    console.error("❌ Update failed:", error.message);
    process.exit(1);
  }
}

run();