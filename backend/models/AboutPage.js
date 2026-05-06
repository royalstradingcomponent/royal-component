const mongoose = require("mongoose");

const textItemSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    icon: { type: String, default: "" },
    image: { type: String, default: "" },
    link: { type: String, default: "" },
  },
  { _id: false }
);

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, default: "" },
    answer: { type: String, default: "" },
  },
  { _id: false }
);

const aboutPageSchema = new mongoose.Schema(
  {
    hero: {
      badge: { type: String, default: "Trusted Industrial Components Supplier" },
      title: { type: String, default: "About Royal Component" },
      highlight: {
        type: String,
        default: "Industrial Electronics & Automation Procurement Partner",
      },
      description: {
        type: String,
        default:
          "Royal Component is a professional industrial component sourcing platform for electronics, electrical, mechanical and automation products. We support manufacturers, repair teams, engineers, OEM buyers and procurement departments with reliable B2B sourcing.",
      },
      image: { type: String, default: "/uploads/about/about-hero.jpg" },
      primaryButtonText: { type: String, default: "Explore Products" },
      primaryButtonLink: { type: String, default: "/products" },
      secondaryButtonText: { type: String, default: "Request Component" },
      secondaryButtonLink: { type: String, default: "/request-component" },
    },

    stats: [
      { label: { type: String, default: "Product Categories" }, value: { type: String, default: "100+" } },
      { label: { type: String, default: "Industrial Brands" }, value: { type: String, default: "500+" } },
      { label: { type: String, default: "B2B Procurement" }, value: { type: String, default: "Pan India" } },
      { label: { type: String, default: "Support Focus" }, value: { type: String, default: "Technical" } },
    ],

    overview: {
      title: { type: String, default: "Who We Are" },
      description: {
        type: String,
        default:
          "Royal Component is built for industrial buyers who need genuine components, accurate part identification, fast quotation support and reliable sourcing. Our focus is not only selling products online, but helping businesses find the right industrial, electronic, electrical, mechanical and automation components for real-world applications.",
      },
      image: { type: String, default: "/uploads/about/electronics-department.jpg" },
    },

    electronicsDepartment: {
      title: { type: String, default: "Electronics Department" },
      description: {
        type: String,
        default:
          "Our electronics department handles semiconductors, ICs, sensors, modules, connectors, relays, power devices, embedded parts, circuit protection products and technical sourcing requirements for production, repair, R&D and automation projects.",
      },
      points: {
        type: [String],
        default: [
          "Semiconductors, ICs, MOSFETs, transistors, diodes and rectifiers",
          "Microcontrollers, processors, memory chips, logic ICs and interface ICs",
          "Sensors, modules, relays, switches, connectors and communication components",
          "Power supplies, power management ICs, protection devices and industrial control parts",
          "Datasheet, MPN, SKU and alternate part based sourcing support",
          "Bulk quantity, MOQ, lead time and availability confirmation for B2B buyers",
        ],
      },
    },

    productGroups: {
      type: [textItemSchema],
      default: [
        { title: "Semiconductors", description: "ICs, transistors, MOSFETs, diodes, rectifiers, logic devices, memory chips, microcontrollers and power management components." },
        { title: "Sensors & Modules", description: "Industrial sensors, proximity sensors, temperature sensors, pressure sensors, communication modules and embedded modules." },
        { title: "Connectors & Cables", description: "PCB connectors, terminal blocks, industrial connectors, cable assemblies, wire harnesses and interconnect solutions." },
        { title: "Electrical Components", description: "Switchgear, relays, contactors, MCBs, fuses, control panels, wiring accessories and electrical protection products." },
        { title: "Automation Parts", description: "PLC accessories, HMI products, industrial control devices, pneumatic parts, automation sensors and machine components." },
        { title: "Tools & Instruments", description: "Testing meters, measuring instruments, soldering tools, hand tools, ESD accessories and maintenance equipment." },
      ],
    },

    capabilities: {
      type: [textItemSchema],
      default: [
        { title: "Part Number Based Sourcing", description: "We help buyers source components using exact MPN, SKU, datasheet details, brand name and technical specifications." },
        { title: "Bulk Quantity Support", description: "Our system supports wholesale quantity requirements, MOQ handling, large order requests and procurement-based workflows." },
        { title: "Alternate Part Support", description: "When a component is unavailable, our team can help identify compatible alternatives based on electrical and mechanical parameters." },
        { title: "Technical Product Matching", description: "We focus on correct product matching so that buyers receive components suitable for their industrial application." },
      ],
    },

    qualityProcess: {
      type: [textItemSchema],
      default: [
        { title: "Requirement Review", description: "We review the buyer’s product name, part number, brand, quantity, specification and application requirement." },
        { title: "Supplier Verification", description: "Supplier source, availability, pricing, MOQ, lead time and product authenticity are checked before confirmation." },
        { title: "Commercial Confirmation", description: "Quotation, GST details, payment status, dispatch timeline and delivery support are managed professionally." },
        { title: "Dispatch & Support", description: "After confirmation, products move toward packaging, shipment, tracking and post-order support." },
      ],
    },

    industries: {
      type: [String],
      default: [
        "Electronics Manufacturing",
        "Industrial Automation",
        "Electrical Panels",
        "Machine Maintenance",
        "Repair & Service Centers",
        "R&D and Prototyping",
        "OEM & Bulk Buyers",
        "Instrumentation",
        "Factory Maintenance",
        "Robotics & Control Systems",
        "Power Electronics",
        "Telecom & Networking",
      ],
    },

    whyChooseUs: {
      type: [String],
      default: [
        "Professional industrial component sourcing experience",
        "Support for electronics, electrical, mechanical and automation products",
        "Bulk order, MOQ and quotation-based procurement workflow",
        "Brand, SKU, MPN and datasheet based product identification",
        "Supplier source tracking for faster repeat procurement",
        "Admin-controlled dynamic content, images, SEO and page sections",
        "Customer-focused order, request and support process",
        "Built for serious B2B buyers and industrial procurement teams",
      ],
    },

    faq: {
      type: [faqSchema],
      default: [
        {
          question: "What does Royal Component supply?",
          answer:
            "Royal Component supplies industrial electronics, electrical, mechanical and automation components including semiconductors, sensors, connectors, relays, tools, control parts and bulk procurement products.",
        },
        {
          question: "Do you support bulk orders?",
          answer:
            "Yes, Royal Component is designed for B2B and wholesale buyers. We support bulk quantity requests, MOQ, quotation, supplier confirmation and procurement workflows.",
        },
        {
          question: "Can I request a component that is not listed?",
          answer:
            "Yes, buyers can submit a component request with part number, brand, quantity and technical details. The admin team can review and source the component.",
        },
        {
          question: "Do you help with alternate parts?",
          answer:
            "Yes, based on datasheet, part number and technical specifications, suitable alternate components can be reviewed and suggested.",
        },
      ],
    },

    cta: {
      title: { type: String, default: "Need Industrial Components for Your Business?" },
      description: {
        type: String,
        default:
          "Send your product requirement, part number, brand, quantity or datasheet. Our procurement team will review availability, pricing and sourcing options.",
      },
      buttonText: { type: String, default: "Request Component" },
      buttonLink: { type: String, default: "/request-component" },
    },

    seo: {
      metaTitle: {
        type: String,
        default: "About Royal Component | Industrial Electronics Component Supplier",
      },
      metaDescription: {
        type: String,
        default:
          "Royal Component is an industrial electronics, electrical, mechanical and automation component supplier for B2B procurement across India.",
      },
      metaKeywords: {
        type: [String],
        default: [
          "industrial components",
          "electronic components supplier",
          "semiconductors supplier",
          "automation parts",
          "electrical components",
          "B2B procurement",
          "Royal Component",
        ],
      },
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AboutPage", aboutPageSchema);