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

const img = (name) =>
  `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/uploads/new-products/${name}.jpg`;

export const semiconductorSubcategories = [
  {
    name: "Amplifiers & Comparators",
    slug: "amplifiers-comparators",
    countText: "Shop 15 categories",
    image: img("amplifiers-comparators"),
    description:
      "Explore amplifier ICs, comparators, op amps, RF amplifiers and signal conditioning components.",
    children: [
      { name: "Amplifier Modules", slug: "amplifier-modules", countText: "Shop 4 products", image: img("amplifier-modules") },
      { name: "Audio Amplifier ICs", slug: "audio-amplifier-ics", countText: "Shop 273 products", image: img("audio-amplifier-ics") },
      { name: "Comparators", slug: "comparators", countText: "Shop 557 products", image: img("comparators") },
      { name: "Current Loop Transmitters", slug: "current-loop-transmitters", countText: "Shop 14 products", image: img("current-loop-transmitters") },
      { name: "Current Sensing Amplifiers", slug: "current-sensing-amplifiers", countText: "Shop 280 products", image: img("current-sensing-amplifiers") },
      { name: "Differential Amplifiers", slug: "differential-amplifiers", countText: "Shop 54 products", image: img("differential-amplifiers") },
      { name: "Instrumentation Amplifiers", slug: "instrumentation-amplifiers", countText: "Shop 140 products", image: img("instrumentation-amplifiers") },
      { name: "Isolation Amplifiers", slug: "isolation-amplifiers", countText: "Shop 76 products", image: img("isolation-amplifiers") },
      { name: "Logarithmic Amplifiers", slug: "logarithmic-amplifiers", countText: "Shop 5 products", image: img("logarithmic-amplifiers") },
      { name: "Op Amps", slug: "op-amps", countText: "Shop 2951 products", image: img("op-amps") },
      { name: "Programmable Gain Amplifiers", slug: "programmable-gain-amplifiers", countText: "Shop 30 products", image: img("programmable-gain-amplifiers") },
      { name: "RF Amplifiers ICs", slug: "rf-amplifiers-ics", countText: "Shop 43 products", image: img("rf-amplifiers-ics") },
      { name: "Transimpedance Amplifiers", slug: "transimpedance-amplifiers", countText: "Shop 12 products", image: img("transimpedance-amplifiers") },
      { name: "Video Amplifiers ICs", slug: "video-amplifiers-ics", countText: "Shop 21 products", image: img("video-amplifiers-ics") },
      { name: "Voltage Controlled Amplifiers", slug: "voltage-controlled-amplifiers", countText: "Shop 6 products", image: img("voltage-controlled-amplifiers") },
    ],
  },
  {
    name: "Audio & Video ICs",
    slug: "audio-video-ics",
    countText: "Shop 6 categories",
    image: img("audio-video-ics"),
    description:
      "Source audio and video ICs including processors, decoders, graphics controllers and video interface devices.",
    children: [
      { name: "Adaptive Cable Equalisers", slug: "adaptive-cable-equalisers", countText: "Shop 6 products", image: img("adaptive-cable-equalisers") },
      { name: "Audio & Video Encoders & Decoders", slug: "audio-video-encoders-decoders", countText: "Shop 28 products", image: img("audio-video-encoders-decoders") },
      { name: "Audio & Video Processors", slug: "audio-video-processors", countText: "Shop 12 products", image: img("audio-video-processors") },
      { name: "Graphics Controllers", slug: "graphics-controllers", countText: "Shop 25 products", image: img("graphics-controllers") },
      { name: "Video ICs", slug: "video-ics", countText: "Shop 16 products", image: img("video-ics") },
      { name: "Video Sync Separators", slug: "video-sync-separators", countText: "Shop 6 products", image: img("video-sync-separators") },
    ],
  },
  {
    name: "Chip Programmers & Debuggers",
    slug: "chip-programmers-debuggers",
    countText: "Shop 3 categories",
    image: img("chip-programmers-debuggers"),
    description:
      "Find chip programmers, programming adapters and debugging tools for embedded development.",
    children: [
      { name: "Chip Programmers", slug: "chip-programmers", countText: "Shop 49 products", image: img("chip-programmers") },
      { name: "Chip Programming Adapters", slug: "chip-programming-adapters", countText: "Shop 2 products", image: img("chip-programming-adapters") },
      { name: "Debuggers & In-Circuit Emulators", slug: "debuggers-in-circuit-emulators", countText: "Shop 45 products", image: img("debuggers-in-circuit-emulators") },
    ],
  },
  {
    name: "Clock, Timing & Frequency ICs",
    slug: "clock-timing-frequency-ics",
    countText: "Shop 9 categories",
    image: img("clock-timing-frequency-ics"),
    description:
      "Browse timing ICs, clock buffers, real-time clocks, timer circuits and frequency control devices.",
    children: [
      { name: "Bus Repeaters", slug: "bus-repeaters", countText: "Shop 5 products", image: img("bus-repeaters") },
      { name: "Clock Buffers", slug: "clock-buffers", countText: "Shop 197 products", image: img("clock-buffers") },
      { name: "Clock Drivers & Distribution", slug: "clock-drivers-distribution", countText: "Shop 172 products", image: img("clock-drivers-distribution") },
      { name: "Clock Synthesizers", slug: "clock-synthesizers", countText: "Shop 50 products", image: img("clock-synthesizers") },
      { name: "Delay Lines & Timing Elements", slug: "delay-lines-timing-elements", countText: "Shop 13 products", image: img("delay-lines-timing-elements") },
      { name: "Phase Detectors", slug: "phase-detectors", countText: "Shop 3 products", image: img("phase-detectors") },
      { name: "Real Time Clocks", slug: "real-time-clocks", countText: "Shop 188 products", image: img("real-time-clocks") },
      { name: "Timer Circuits", slug: "timer-circuits", countText: "Shop 95 products", image: img("timer-circuits") },
      { name: "Watchdog Timers", slug: "watchdog-timers", countText: "Shop 12 products", image: img("watchdog-timers") },
    ],
  },
  {
    name: "Communication & Wireless Module ICs",
    slug: "communication-wireless-module-ics",
    countText: "Shop 8 categories",
    image: img("communication-wireless-module-ics"),
    description:
      "Shop communication ICs, wireless modules, RF parts, Bluetooth, GNSS, GPS and Wi-Fi modules.",
    children: [
      { name: "Bluetooth Modules", slug: "bluetooth-modules", countText: "Shop 3 products", image: img("bluetooth-modules") },
      { name: "GNSS & GPS Modules", slug: "gnss-gps-modules", countText: "Shop 1 product", image: img("gnss-gps-modules") },
      { name: "Modulator & Demodulator ICs", slug: "modulator-demodulator-ics", countText: "Shop 1 product", image: img("modulator-demodulator-ics") },
      { name: "Networking Modules", slug: "networking-modules", countText: "Shop 2 products", image: img("networking-modules") },
      { name: "Prescalers", slug: "prescalers", countText: "Shop 1 product", image: img("prescalers") },
      { name: "RF ICs", slug: "rf-ics", countText: "Shop 12 products", image: img("rf-ics") },
      { name: "RF Modules", slug: "rf-modules", countText: "Shop 10 products", image: img("rf-modules") },
      { name: "Wi-Fi Modules", slug: "wi-fi-modules", countText: "Shop 10 products", image: img("wi-fi-modules") },
    ],
  },
  {
    name: "Data Converters",
    slug: "data-converters",
    countText: "Shop 10 categories",
    image: img("data-converters"),
    description:
      "Explore analogue-to-digital converters, digital-to-analogue converters and data acquisition ICs.",
    children: [
      { name: "Analogue Front End", slug: "analogue-front-end", countText: "Shop 32 products", image: img("analogue-front-end") },
      { name: "Analogue to Digital Converters", slug: "analogue-to-digital-converters", countText: "Shop 424 products", image: img("analogue-to-digital-converters") },
      { name: "Capacitance to Digital Converters", slug: "capacitance-to-digital-converters", countText: "Shop 1 product", image: img("capacitance-to-digital-converters") },
      { name: "Data Acquisition ICs", slug: "data-acquisition-ics", countText: "Shop 8 products", image: img("data-acquisition-ics") },
      { name: "Digital Potentiometers", slug: "digital-potentiometers", countText: "Shop 228 products", image: img("digital-potentiometers") },
      { name: "Digital to Analogue Converters", slug: "digital-to-analogue-converters", countText: "Shop 259 products", image: img("digital-to-analogue-converters") },
      { name: "Energy Measurement ICs", slug: "energy-measurement-ics", countText: "Shop 10 products", image: img("energy-measurement-ics") },
      { name: "Resolver to Digital Converters", slug: "resolver-to-digital-converters", countText: "Shop 1 product", image: img("resolver-to-digital-converters") },
      { name: "Sample & Hold Circuits", slug: "sample-hold-circuits", countText: "Shop 2 products", image: img("sample-hold-circuits") },
      { name: "Voltage-to-Frequency & Frequency-to-Voltage Converters", slug: "voltage-frequency-converters", countText: "Shop 30 products", image: img("voltage-frequency-converters") },
    ],
  },
  {
    name: "Discrete Semiconductors",
    slug: "discrete-semiconductors",
    countText: "Shop 17 categories",
    image: img("discrete-semiconductors"),
    description:
      "Find MOSFETs, transistors, diodes, rectifiers, thyristors, TRIACs, IGBTs and TVS diodes.",
    children: [
      { name: "Bipolar Transistors", slug: "bipolar-transistors", countText: "Shop 3183 products", image: img("bipolar-transistors") },
      { name: "Bridge Rectifiers", slug: "bridge-rectifiers", countText: "Shop 1173 products", image: img("bridge-rectifiers") },
      { name: "Constant Current Diodes", slug: "constant-current-diodes", countText: "Shop 24 products", image: img("constant-current-diodes") },
      { name: "Darlington Pairs", slug: "darlington-pairs", countText: "Shop 293 products", image: img("darlington-pairs") },
      { name: "DIACs", slug: "diacs", countText: "Shop 14 products", image: img("diacs") },
      { name: "IGBTs", slug: "igbts", countText: "Shop 1576 products", image: img("igbts") },
      { name: "JFETs", slug: "jfets", countText: "Shop 58 products", image: img("jfets") },
      { name: "MOSFETs", slug: "mosfets", countText: "Shop 11114 products", image: img("mosfets") },
      { name: "PIN Diodes", slug: "pin-diodes", countText: "Shop 49 products", image: img("pin-diodes") },
      { name: "Schottky Diodes & Rectifiers", slug: "schottky-diodes-rectifiers", countText: "Shop 6326 products", image: img("schottky-diodes-rectifiers") },
      { name: "SIDACs", slug: "sidacs", countText: "Shop 7 products", image: img("sidacs") },
      { name: "Switching Diodes", slug: "switching-diodes", countText: "Shop 912 products", image: img("switching-diodes") },
      { name: "Thyristors", slug: "thyristors", countText: "Shop 746 products", image: img("thyristors") },
      { name: "TRIACs", slug: "triacs", countText: "Shop 453 products", image: img("triacs") },
      { name: "TVS Diodes", slug: "tvs-diodes", countText: "Shop 4992 products", image: img("tvs-diodes") },
      { name: "Varactor Diodes", slug: "varactor-diodes", countText: "Shop 17 products", image: img("varactor-diodes") },
      { name: "Zener Diodes", slug: "zener-diodes", countText: "Shop 3489 products", image: img("zener-diodes") },
    ],
  },
  {
    name: "Interface ICs",
    slug: "interface-ics",
    countText: "Shop 15 categories",
    image: img("interface-ics"),
    description:
      "Choose interface ICs including Ethernet, USB, CAN, UART, LVDS, I/O expanders and line interface devices.",
    children: [
      { name: "Active Filters", slug: "active-filters", countText: "Shop 25 products", image: img("active-filters") },
      { name: "Bus Terminators", slug: "bus-terminators", countText: "Shop 4 products", image: img("bus-terminators") },
      { name: "Cable Transceivers", slug: "cable-transceivers", countText: "Shop 9 products", image: img("cable-transceivers") },
      { name: "CAN Interface ICs", slug: "can-interface-ics", countText: "Shop 324 products", image: img("can-interface-ics") },
      { name: "Channel Protector ICs", slug: "channel-protector-ics", countText: "Shop 8 products", image: img("channel-protector-ics") },
      { name: "Crosspoint Switches", slug: "crosspoint-switches", countText: "Shop 5 products", image: img("crosspoint-switches") },
      { name: "Ethernet Interface ICs", slug: "ethernet-interface-ics", countText: "Shop 329 products", image: img("ethernet-interface-ics") },
      { name: "I/O Expanders", slug: "io-expanders", countText: "Shop 154 products", image: img("io-expanders") },
      { name: "Input Output Controllers", slug: "input-output-controllers", countText: "Shop 4 products", image: img("input-output-controllers") },
      { name: "Line Interface ICs", slug: "line-interface-ics", countText: "Shop 1053 products", image: img("line-interface-ics") },
      { name: "LVDS Interface ICs", slug: "lvds-interface-ics", countText: "Shop 148 products", image: img("lvds-interface-ics") },
      { name: "Multiprotocol Transceivers", slug: "multiprotocol-transceivers", countText: "Shop 61 products", image: img("multiprotocol-transceivers") },
      { name: "Peripheral Drivers", slug: "peripheral-drivers", countText: "Shop 25 products", image: img("peripheral-drivers") },
      { name: "UART", slug: "uart", countText: "Shop 61 products", image: img("uart") },
      { name: "USB Interface ICs", slug: "usb-interface-ics", countText: "Shop 413 products", image: img("usb-interface-ics") },
    ],
  },
  {
    name: "Logic ICs",
    slug: "logic-ics",
    countText: "Shop 18 categories",
    image: img("logic-ics"),
    description:
      "Browse logic ICs including buffers, gates, inverters, counters, flip-flops, latches and bus transceivers.",
    children: [
      { name: "Analogue Multipliers and Dividers", slug: "analogue-multipliers-dividers", countText: "Shop 2 products", image: img("analogue-multipliers-dividers") },
      { name: "Bounce Eliminator ICs", slug: "bounce-eliminator-ics", countText: "Shop 2 products", image: img("bounce-eliminator-ics") },
      { name: "Buffers", slug: "buffers", countText: "Shop 262 products", image: img("buffers") },
      { name: "Bus Switches", slug: "bus-switches", countText: "Shop 68 products", image: img("bus-switches") },
      { name: "Bus Transceivers", slug: "bus-transceivers", countText: "Shop 182 products", image: img("bus-transceivers") },
      { name: "Counter ICs", slug: "counter-ics", countText: "Shop 774 products", image: img("counter-ics") },
      { name: "Encoder & Decoder ICs", slug: "encoder-decoder-ics", countText: "Shop 108 products", image: img("encoder-decoder-ics") },
      { name: "Flip Flop ICs", slug: "flip-flop-ics", countText: "Shop 179 products", image: img("flip-flop-ics") },
      { name: "Frequency Multipliers & Dividers", slug: "frequency-multipliers-dividers", countText: "Shop 3 products", image: img("frequency-multipliers-dividers") },
      { name: "Inverters ICs", slug: "inverters-ics", countText: "Shop 980 products", image: img("inverters-ics") },
      { name: "Latch ICs", slug: "latch-ics", countText: "Shop 80 products", image: img("latch-ics") },
      { name: "Logic Adders", slug: "logic-adders", countText: "Shop 3 products", image: img("logic-adders") },
      { name: "Logic Comparators", slug: "logic-comparators", countText: "Shop 21 products", image: img("logic-comparators") },
      { name: "Logic Gates", slug: "logic-gates", countText: "Shop 595 products", image: img("logic-gates") },
      { name: "Monostable Multivibrators", slug: "monostable-multivibrators", countText: "Shop 42 products", image: img("monostable-multivibrators") },
      { name: "Multiplexer & Demultiplexer ICs", slug: "multiplexer-demultiplexer-ics", countText: "Shop 565 products", image: img("multiplexer-demultiplexer-ics") },
      { name: "Parity Functions", slug: "parity-functions", countText: "Shop 2 products", image: img("parity-functions") },
      { name: "Translator ICs", slug: "translator-ics", countText: "Shop 253 products", image: img("translator-ics") },
    ],
  },
  {
    name: "Memory Chips",
    slug: "memory-chips",
    countText: "Shop 8 categories",
    image: img("memory-chips"),
    description:
      "Find EEPROM, EPROM, flash memory, SRAM, RAM, NVRAM and memory card components.",
    children: [
      { name: "EEPROM", slug: "eeprom", countText: "Shop 588 products", image: img("eeprom") },
      { name: "EPROM", slug: "eprom", countText: "Shop 19 products", image: img("eprom") },
      { name: "FIFO Memory", slug: "fifo-memory", countText: "Shop 8 products", image: img("fifo-memory") },
      { name: "Flash Memory", slug: "flash-memory", countText: "Shop 603 products", image: img("flash-memory") },
      { name: "Memory Cards", slug: "memory-cards", countText: "Shop 18 products", image: img("memory-cards") },
      { name: "NVRAM", slug: "nvram", countText: "Shop 23 products", image: img("nvram") },
      { name: "RAM", slug: "ram", countText: "Shop 473 products", image: img("ram") },
      { name: "SRAM", slug: "sram", countText: "Shop 351 products", image: img("sram") },
    ],
  },
  {
    name: "Power Management ICs",
    slug: "power-management-ics",
    countText: "Shop 18 categories",
    image: img("power-management-ics"),
    description:
      "Source power management ICs including regulators, gate drivers, PWM, voltage references and DC-DC converters.",
    children: [
      { name: "AC-DC Converters", slug: "ac-dc-converters", countText: "Shop 604 products", image: img("ac-dc-converters") },
      { name: "Battery Management", slug: "battery-management", countText: "Shop 73 products", image: img("battery-management") },
      { name: "Capacitor Discharge ICs", slug: "capacitor-discharge-ics", countText: "Shop 2 products", image: img("capacitor-discharge-ics") },
      { name: "Clamping Circuits", slug: "clamping-circuits", countText: "Shop 3 products", image: img("clamping-circuits") },
      { name: "DC-DC Converters ICs", slug: "dc-dc-converters-ics", countText: "Shop 923 products", image: img("dc-dc-converters-ics") },
      { name: "DC-DC Power Supply Modules", slug: "dc-dc-power-supply-modules", countText: "Shop 5 products", image: img("dc-dc-power-supply-modules") },
      { name: "Electronic Fuses", slug: "electronic-fuses", countText: "Shop 27 products", image: img("electronic-fuses") },
      { name: "Gate Drivers", slug: "gate-drivers", countText: "Shop 1806 products", image: img("gate-drivers") },
      { name: "Ideal Diodes", slug: "ideal-diodes", countText: "Shop 2 products", image: img("ideal-diodes") },
      { name: "Motor Driver ICs", slug: "motor-driver-ics", countText: "Shop 606 products", image: img("motor-driver-ics") },
      { name: "Power Factor Correction", slug: "power-factor-correction", countText: "Shop 146 products", image: img("power-factor-correction") },
      { name: "Power over Ethernet", slug: "power-over-ethernet", countText: "Shop 11 products", image: img("power-over-ethernet") },
      { name: "Power Switch ICs", slug: "power-switch-ics", countText: "Shop 1198 products", image: img("power-switch-ics") },
      { name: "PWM", slug: "pwm", countText: "Shop 323 products", image: img("pwm") },
      { name: "Voltage Controllers", slug: "voltage-controllers", countText: "Shop 251 products", image: img("voltage-controllers") },
      { name: "Voltage References", slug: "voltage-references", countText: "Shop 661 products", image: img("voltage-references") },
      { name: "Voltage Regulators", slug: "voltage-regulators", countText: "Shop 4733 products", image: img("voltage-regulators") },
      { name: "Voltage Supervisors", slug: "voltage-supervisors", countText: "Shop 599 products", image: img("voltage-supervisors") },
    ],
  },
  {
    name: "Processors & Microcontrollers",
    slug: "processors-microcontrollers",
    countText: "Shop 6 categories",
    image: img("processors-microcontrollers"),
    description:
      "Explore microcontrollers, microprocessors, DSPs, SoCs, security chips and peripheral controller chips.",
    children: [
      { name: "Digital Signal Processors", slug: "digital-signal-processors", countText: "Shop 261 products", image: img("digital-signal-processors") },
      { name: "Microcontrollers", slug: "microcontrollers", countText: "Shop 6887 products", image: img("microcontrollers") },
      { name: "Microprocessors", slug: "microprocessors", countText: "Shop 176 products", image: img("microprocessors") },
      { name: "Peripheral Controller Chips", slug: "peripheral-controller-chips", countText: "Shop 18 products", image: img("peripheral-controller-chips") },
      { name: "Security & Authentication Chips", slug: "security-authentication-chips", countText: "Shop 93 products", image: img("security-authentication-chips") },
      { name: "System-On-Chips", slug: "system-on-chips", countText: "Shop 56 products", image: img("system-on-chips") },
    ],
  },
  {
    name: "Programmable Logic ICs",
    slug: "programmable-logic-ics",
    countText: "Shop 3 categories",
    image: img("programmable-logic-ics"),
    description:
      "Find CPLDs, FPGAs and SPLDs for programmable digital logic and embedded hardware projects.",
    children: [
      { name: "CPLDs", slug: "cplds", countText: "Shop 71 products", image: img("cplds") },
      { name: "FPGAs", slug: "fpgas", countText: "Shop 302 products", image: img("fpgas") },
      { name: "SPLDs", slug: "splds", countText: "Shop 22 products", image: img("splds") },
    ],
  },
  {
    name: "Sensor ICs",
    slug: "sensor-ics",
    countText: "Shop 12 categories",
    image: img("sensor-ics"),
    description:
      "Browse sensor ICs for current, temperature, humidity, magnetic, motion, pressure, light and touch sensing.",
    children: [
  {
    name: "Temperature Sensor ICs",
    slug: "temperature-sensor-ics",
    countText: "Shop 120+ products",
    image: img("Thermistor-Sensor"),
  },
  {
    name: "Humidity Sensor ICs",
    slug: "humidity-sensor-ics",
    countText: "Shop 80+ products",
    image: img("Soil-Moisture-Sensor"),
  },
  {
    name: "Pressure Sensor ICs",
    slug: "pressure-sensor-ics",
    countText: "Shop 60+ products",
    image: img("IR-Sensor-Module"),
  },
  {
    name: "Light Sensor ICs",
    slug: "light-sensor-ics",
    countText: "Shop 90+ products",
    image: img("LDR-Sensor"),
  },
  {
    name: "Motion Sensor ICs",
    slug: "motion-sensor-ics",
    countText: "Shop 70+ products",
    image: img("IR-Sensor-Pair"),
  },
  {
    name: "Touch Sensor ICs",
    slug: "touch-sensor-ics",
    countText: "Shop 40+ products",
    image: img("Touch-Sensor"),
  },
  {
    name: "Current Sensor ICs",
    slug: "current-sensor-ics",
    countText: "Shop 50+ products",
    image: img("interface-modules"),
  },
],
  },
];

export const categories = [
  {
    name: "Semiconductors",
    slug: "semiconductors",
    href: "/category/semiconductors",
    icon: CircuitBoard,
    description:
      "ICs, transistors, MOSFETs, op-amps, microcontrollers, memory chips, power management ICs and semiconductor devices.",
    aliases: ["semiconductors", "semiconductor", "components"],
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
    aliases: ["powersuppliesregulators", "power-supplies-regulators", "power supplies & regulators", "power"],
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
    aliases: ["displaysinterfacemodules", "displays-interface-modules", "displays & interface modules"],
  },
  {
    name: "Switches, Buzzers & Indicators",
    slug: "switchesbuzzersindicators",
    href: "/category/switchesbuzzersindicators",
    icon: ToggleLeft,
    description: "Switches, relays, LEDs and buzzers.",
    aliases: ["switchesbuzzersindicators", "switches-buzzers-indicators", "switches, buzzers & indicators"],
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

export function getSemiconductorSubcategoryBySlug(slug = "") {
  return semiconductorSubcategories.find((item) => item.slug === slug);
}

export function getSemiconductorChildBySlug(parentSlug = "", childSlug = "") {
  const parent = getSemiconductorSubcategoryBySlug(parentSlug);
  return parent?.children?.find((item) => item.slug === childSlug);
}