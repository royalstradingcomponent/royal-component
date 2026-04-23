import {
  Cable,
  Cpu,
  Gauge,
  Wrench,
  Radio,
  PlugZap,
  CircuitBoard,
  BatteryCharging,
  Boxes,
  MonitorSmartphone,
  ToggleLeft,
  Cog,
} from "lucide-react";

export const semiconductorSubcategories = [
  { name: "All", slug: "" },
  { name: "ICs", slug: "ics" },
  { name: "Voltage Regulators", slug: "voltage-regulators" },
  { name: "Transistors", slug: "transistors" },
  { name: "MOSFET / Power Devices", slug: "mosfet-power-devices" },
  { name: "Capacitors", slug: "capacitors" },
  { name: "Sensors", slug: "sensors" },
  { name: "Display", slug: "display" },
  { name: "Other Parts", slug: "other-parts" },
];

export const categories = [
  {
    name: "Semiconductors",
    slug: "semiconductors",
    href: "/category/semiconductors",
    icon: CircuitBoard,
    description: "ICs, transistor, MOSFET, op-amps and timer chips.",
    aliases: ["semiconductors", "semiconductor"],
  },
  {
    name: "Cables & Wires",
    slug: "cableswires",
    href: "/category/cableswires",
    icon: Cable,
    description: "Jumper wires, hookup wires and cable accessories.",
    aliases: ["cableswires", "cables-wires", "cables & wires", "cables"],
  },
  {
    name: "Connectors",
    slug: "connectors",
    href: "/category/connectors",
    icon: PlugZap,
    description: "Push connectors, DC jacks, terminal blocks and connector parts.",
    aliases: ["connectors"],
  },
  {
    name: "Mechanical & Hardware",
    slug: "mechanicalhardware",
    href: "/category/mechanicalhardware",
    icon: Cog,
    description: "Robot chassis, wheels, mounts and related hardware parts.",
    aliases: ["mechanicalhardware", "mechanical-hardware", "mechanical & hardware"],
  },
  {
    name: "Passive Components",
    slug: "passivecomponents",
    href: "/category/passivecomponents",
    icon: Boxes,
    description: "Resistors, capacitors, potentiometers, thermistors and similar passives.",
    aliases: ["passivecomponents", "passive-components", "passives"],
  },
  {
    name: "Power Supplies & Regulators",
    slug: "powersuppliesregulators",
    href: "/category/powersuppliesregulators",
    icon: BatteryCharging,
    description: "Battery holders, voltage regulators and power modules.",
    aliases: [
      "powersuppliesregulators",
      "power-supplies-regulators",
      "power supplies & regulators",
      "power",
    ],
  },
  {
    name: "RF & Wireless",
    slug: "rfwireless",
    href: "/category/rfwireless",
    icon: Radio,
    description: "Bluetooth and wireless communication modules.",
    aliases: ["rfwireless", "rf-wireless", "rf & wireless"],
  },
  {
    name: "Automation",
    slug: "automation",
    href: "/category/automation",
    icon: Cpu,
    description: "Arduino boards, relay modules, motor drivers and automation components.",
    aliases: ["automation"],
  },
  {
    name: "Sensors & Transducers",
    slug: "sensorstransducers",
    href: "/category/sensorstransducers",
    icon: Gauge,
    description: "IR, ultrasonic, flame, LDR, soil moisture and other sensor modules.",
    aliases: ["sensorstransducers", "sensors-transducers", "sensors & transducers", "sensors"],
  },
  {
    name: "Tools & Accessories",
    slug: "toolsaccessories",
    href: "/category/toolsaccessories",
    icon: Wrench,
    description: "Breadboards, PCB boards, cables and project accessories.",
    aliases: ["toolsaccessories", "tools-accessories", "tools & accessories", "tools"],
  },
  {
    name: "Displays & Interface Modules",
    slug: "displaysinterfacemodules",
    href: "/category/displaysinterfacemodules",
    icon: MonitorSmartphone,
    description: "Display units, audio and interface modules.",
    aliases: [
      "displaysinterfacemodules",
      "displays-interface-modules",
      "displays & interface modules",
    ],
  },
  {
    name: "Switches, Buzzers & Indicators",
    slug: "switchesbuzzersindicators",
    href: "/category/switchesbuzzersindicators",
    icon: ToggleLeft,
    description: "Switches, relays, LEDs and buzzers.",
    aliases: [
      "switchesbuzzersindicators",
      "switches-buzzers-indicators",
      "switches, buzzers & indicators",
    ],
  },
];

export function getCategoryBySlug(slug) {
  return categories.find((item) => item.slug === slug);
}

export function getCategoryAliases(slug) {
  const category = getCategoryBySlug(slug);
  return category?.aliases || [slug];
}

export function normalizeCategoryValue(value = "") {
  return String(value).toLowerCase().trim();
}

export function productMatchesCategory(productCategory = "", slug = "") {
  const aliases = getCategoryAliases(slug).map(normalizeCategoryValue);
  return aliases.includes(normalizeCategoryValue(productCategory));
}