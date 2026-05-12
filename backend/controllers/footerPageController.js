const FooterPage = require("../models/FooterPage");

const defaultFooterData = {
  companyName: "Royal Trading Component",
  tagline: "Industrial Solutions Store",
  description:
    "Royal Trading Component is a trusted B2B industrial sourcing platform for electronic, electrical, automation, mechanical and hardware components.",
  email: "sales@royalcomponent.com",
  phone: "+91 88511 49032",
  whatsapp: "+91 88511 49032",
  supportHours: "Mon - Sat | 9 AM - 7 PM",
  address:
    "4th Floor, Ansari Road, Near Hanuman Mandir, Darya Ganj, New Delhi - 110002",

  componentLinks: [
    {
      label: "Amplifiers & Comparators",
      link: "/components/amplifierscomparators",
      order: 1,
      isActive: true,
    },
    {
      label: "Audio & Video ICs",
      link: "/components/audiovideoics",
      order: 2,
      isActive: true,
    },
    {
      label: "Chip Programmers & Debuggers",
      link: "/components/chipprogrammersdebuggers",
      order: 3,
      isActive: true,
    },
    {
      label: "Clock, Timing & Frequency ICs",
      link: "/components/clocktimingfrequencyics",
      order: 4,
      isActive: true,
    },
    {
      label: "Communication & Wireless Module ICs",
      link: "/components/communicationwirelessmoduleics",
      order: 5,
      isActive: true,
    },
    {
      label: "Data Converters",
      link: "/components/dataconverters",
      order: 6,
      isActive: true,
    },
    {
      label: "Discrete Semiconductors",
      link: "/components/discretesemiconductors",
      order: 7,
      isActive: true,
    },
    {
      label: "Interface ICs",
      link: "/components/interfaceics",
      order: 8,
      isActive: true,
    },
    {
      label: "Logic ICs",
      link: "/components/logicics",
      order: 9,
      isActive: true,
    },
    {
      label: "Memory Chips",
      link: "/components/memorychips",
      order: 10,
      isActive: true,
    },
    {
      label: "Power Management ICs",
      link: "/components/powermanagementics",
      order: 11,
      isActive: true,
    },
    {
      label: "Processors & Microcontrollers",
      link: "/components/processorsmicrocontrollers",
      order: 12,
      isActive: true,
    },
    {
      label: "Programmable Logic ICs",
      link: "/components/programmablelogicics",
      order: 13,
      isActive: true,
    },
    {
      label: "Sensor ICs",
      link: "/components/sensorics",
      order: 14,
      isActive: true,
    },
  ],

  shopLinks: [
    {
      label: "All Products",
      link: "/products",
      order: 1,
      isActive: true,
    },
    {
      label: "Semiconductors",
      link: "/products?category=semiconductors",
      order: 2,
      isActive: true,
    },
    {
      label: "Automation",
      link: "/products?category=automation",
      order: 3,
      isActive: true,
    },
    {
      label: "Switchgear",
      link: "/products?category=switchgear",
      order: 4,
      isActive: true,
    },
    {
      label: "Sensors",
      link: "/products?category=sensors",
      order: 5,
      isActive: true,
    },
  ],

  supportLinks: [
    {
      label: "Request BOM",
      link: "/request-component",
      order: 1,
      isActive: true,
    },
    {
      label: "Track Request",
      link: "/request-component/my-requests",
      order: 2,
      isActive: true,
    },
    {
      label: "My Orders",
      link: "/checkout/order",
      order: 3,
      isActive: true,
    },
    {
      label: "Track Order",
      link: "/track",
      order: 4,
      isActive: true,
    },
    {
      label: "Cart",
      link: "/checkout/cart",
      order: 5,
      isActive: true,
    },
    {
      label: "Wishlist",
      link: "/wishlist",
      order: 6,
      isActive: true,
    },
  ],

  companyLinks: [
    {
      label: "Home",
      link: "/",
      order: 1,
      isActive: true,
    },
    {
      label: "About Us",
      link: "/about",
      order: 2,
      isActive: true,
    },
    {
      label: "Contact Us",
      link: "/contact",
      order: 3,
      isActive: true,
    },
    {
      label: "FAQ",
      link: "/contact#faq",
      order: 4,
      isActive: true,
    },
    {
      label: "Blogs",
      link: "/blogs",
      order: 5,
      isActive: true,
    },
  ],

  policyLinks: [
    {
      label: "Privacy Policy",
      link: "/privacy-policy",
      order: 1,
      isActive: true,
    },
    {
      label: "Terms & Conditions",
      link: "/terms-and-conditions",
      order: 2,
      isActive: true,
    },
    {
      label: "Shipping Policy",
      link: "/shipping-policy",
      order: 3,
      isActive: true,
    },
    {
      label: "Return Policy",
      link: "/return-policy",
      order: 4,
      isActive: true,
    },
    {
      label: "Refund Policy",
      link: "/refund-policy",
      order: 5,
      isActive: true,
    },
    {
      label: "Cancellation Policy",
      link: "/cancellation-policy",
      order: 6,
      isActive: true,
    },
  ],

  bottomText: "© 2026 Royal Trading Component. All rights reserved.",
  isActive: true,
};

async function getOrCreateFooter() {
  let footer = await FooterPage.findOne();

  if (!footer) {
    footer = await FooterPage.create(defaultFooterData);
    return footer;
  }

  let changed = false;

  if (!Array.isArray(footer.componentLinks) || footer.componentLinks.length === 0) {
    footer.componentLinks = defaultFooterData.componentLinks;
    changed = true;
  }

  if (!Array.isArray(footer.shopLinks) || footer.shopLinks.length === 0) {
    footer.shopLinks = defaultFooterData.shopLinks;
    changed = true;
  }

  if (!Array.isArray(footer.supportLinks) || footer.supportLinks.length === 0) {
    footer.supportLinks = defaultFooterData.supportLinks;
    changed = true;
  }

  if (!Array.isArray(footer.companyLinks) || footer.companyLinks.length === 0) {
    footer.companyLinks = defaultFooterData.companyLinks;
    changed = true;
  }

  if (!Array.isArray(footer.policyLinks) || footer.policyLinks.length === 0) {
    footer.policyLinks = defaultFooterData.policyLinks;
    changed = true;
  }

  if (changed) {
    await footer.save();
  }

  return footer;
}

async function getFooterPage(req, res) {
  try {
    const footer = await getOrCreateFooter();

    res.status(200).json({
      success: true,
      footer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Footer data fetch failed",
      error: error.message,
    });
  }
}

async function adminGetFooterPage(req, res) {
  try {
    const footer = await getOrCreateFooter();

    res.status(200).json({
      success: true,
      footer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Admin footer data fetch failed",
      error: error.message,
    });
  }
}

async function adminUpdateFooterPage(req, res) {
  try {
    const footer = await getOrCreateFooter();

    const fields = [
      "companyName",
      "tagline",
      "description",
      "email",
      "phone",
      "whatsapp",
      "supportHours",
      "address",
      "componentLinks",
      "shopLinks",
      "supportLinks",
      "companyLinks",
      "policyLinks",
      "bottomText",
      "isActive",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        footer[field] = req.body[field];
      }
    });

    await footer.save();

    res.status(200).json({
      success: true,
      message: "Footer updated successfully",
      footer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Footer update failed",
      error: error.message,
    });
  }
}

module.exports = {
  getFooterPage,
  adminGetFooterPage,
  adminUpdateFooterPage,
};