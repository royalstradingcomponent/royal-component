const answerBank = [
  {
    keys: ["hi", "hello", "hey", "namaste", "namaskar", "hii", "help", "support"],
    replies: {
      en: [
        "Hello! Royal Component support here. Please tell me what you need help with for this order.",
        "You can ask about tracking, dispatch, delivery, GST invoice, payment, cancellation, address change, datasheet, alternate part, warranty or bulk quantity.",
      ],
      hi: [
        "Namaste! Royal Component support yahan hai. Aap apne order ke baare me kya help chahte hain?",
        "Aap order tracking, dispatch, delivery, GST invoice, payment, cancellation, address change, datasheet, alternate part, warranty ya bulk quantity ke baare me poochh sakte hain.",
      ],
    },
  },

  {
    keys: [
      "where is my order",
      "order kaha hai",
      "order kahan hai",
      "mera order kaha",
      "mera order kahan",
      "order status",
      "track order",
      "tracking",
      "order kaha tak",
      "order kha tak",
    ],
    replies: {
      en: [
        "Your order is currently in stock verification and procurement process.",
        "Once the order is dispatched, tracking details will be updated on your order page.",
      ],
      hi: [
        "Aapka order abhi stock verification aur procurement process me hai.",
        "Jaise hi order dispatch hoga, tracking details order page par update kar di jayegi.",
      ],
    },
  },

  {
    keys: [
      "when will my order dispatch",
      "dispatch kab hoga",
      "order dispatch kab",
      "kab dispatch",
      "shipment kab",
      "ship kab",
      "order ship",
      "kab bhejoge",
      "dispatch time",
    ],
    replies: {
      en: [
        "Dispatch depends on stock availability, supplier confirmation, MOQ and payment status.",
        "Ready-stock items usually dispatch within 1-3 business days.",
      ],
      hi: [
        "Dispatch stock availability, supplier confirmation, MOQ aur payment status par depend karta hai.",
        "Ready-stock items usually 1-3 business days me dispatch ho jaate hain.",
      ],
    },
  },

  {
    keys: [
      "delivery date",
      "delivery kab",
      "kab tak aayega",
      "kab tak ayega",
      "kitne din me aayega",
      "order kab aayega",
      "expected delivery",
      "arrival date",
      "exact date",
    ],
    replies: {
      en: [
        "Expected delivery is usually 2-7 business days after dispatch, depending on location and courier service.",
        "Exact delivery date is confirmed after courier pickup and tracking generation.",
      ],
      hi: [
        "Expected delivery usually dispatch ke baad 2-7 business days me hoti hai, location aur courier service ke according.",
        "Exact delivery date courier pickup aur tracking number generate hone ke baad confirm hoti hai.",
      ],
    },
  },

  {
    keys: ["late", "delay", "delayed", "order late", "delivery late", "late kyu", "delay kyu", "abhi tak nahi aaya", "abhi tak nhi aaya"],
    replies: {
      en: [
        "Delay can happen due to stock verification, supplier confirmation, bulk quantity arrangement, payment confirmation or courier pickup delay.",
        "Your order will be checked on priority and updates will appear on the order page.",
      ],
      hi: [
        "Delay stock verification, supplier confirmation, bulk quantity arrangement, payment confirmation ya courier pickup delay ki wajah se ho sakta hai.",
        "Aapka order priority check me rakha jayega aur update order page par dikh jayega.",
      ],
    },
  },

  {
    keys: ["gst invoice", "tax invoice", "invoice", "bill", "gst bill", "gst", "billing", "company invoice", "business invoice"],
    replies: {
      en: [
        "Yes, GST invoice is available for eligible business orders.",
        "Please make sure company name, GSTIN and billing address are correct before invoice generation.",
      ],
      hi: [
        "Haan, eligible business orders ke liye GST invoice available hai.",
        "Please company name, GSTIN aur billing address invoice generate hone se pehle correct rakhein.",
      ],
    },
  },

  {
    keys: ["change address", "address change", "edit address", "delivery address", "wrong address", "address galat", "address badalna", "address update"],
    replies: {
      en: [
        "Delivery address can be changed before dispatch.",
        "If the order is already dispatched, address change depends on courier policy.",
      ],
      hi: [
        "Delivery address dispatch se pehle change kiya ja sakta hai.",
        "Agar order dispatch ho chuka hai, to address change courier policy par depend karega.",
      ],
    },
  },

  {
    keys: ["phone change", "mobile change", "number change", "contact number", "phone number", "mobile number", "galat number"],
    replies: {
      en: [
        "Phone number can be updated before dispatch.",
        "Please share the correct contact number so the courier can reach you during delivery.",
      ],
      hi: [
        "Phone number dispatch se pehle update kiya ja sakta hai.",
        "Please correct contact number share karein, taaki courier delivery ke time contact kar sake.",
      ],
    },
  },

  {
    keys: ["cancel order", "order cancel", "cancel karna", "cancel kaise", "cancellation", "cancel this order"],
    replies: {
      en: [
        "Order cancellation is possible before dispatch or procurement lock.",
        "Specially sourced, bulk ordered or already dispatched items may require cancellation approval.",
      ],
      hi: [
        "Order dispatch ya procurement lock hone se pehle cancel kiya ja sakta hai.",
        "Specially sourced, bulk ordered ya already dispatched items me cancellation approval required ho sakta hai.",
      ],
    },
  },

  {
    keys: ["return", "replace", "replacement", "exchange", "wrong product", "damage", "damaged", "defective", "not working", "product kharab", "galat product"],
    replies: {
      en: [
        "Return or replacement depends on product condition, category, supplier policy and issue verification.",
        "Please share product photos/video, order number, SKU/MPN and issue details.",
      ],
      hi: [
        "Return ya replacement product condition, category, supplier policy aur issue verification par depend karta hai.",
        "Please product photos/video, order number, SKU/MPN aur issue details share karein.",
      ],
    },
  },

  {
    keys: ["refund", "money back", "payment refund", "refund kab", "refund status", "paisa wapas", "amount refund"],
    replies: {
      en: [
        "Refund is processed after cancellation or return approval.",
        "Approved refunds usually reflect within 3-7 business days depending on payment method and bank processing.",
      ],
      hi: [
        "Refund cancellation ya return approval ke baad process hota hai.",
        "Approved refund usually 3-7 business days me reflect hota hai, payment method aur bank processing ke according.",
      ],
    },
  },

  {
    keys: ["payment", "paid", "payment status", "payment failed", "amount deducted", "transaction", "upi", "bank transfer", "online payment", "cod"],
    replies: {
      en: [
        "Payment status can be verified from the order details.",
        "If amount is deducted but order/payment is pending, please share transaction ID, payment screenshot and registered phone/email.",
      ],
      hi: [
        "Payment status order details se verify hota hai.",
        "Agar amount deduct hua hai lekin order/payment pending dikha raha hai, please transaction ID, payment screenshot aur registered phone/email share karein.",
      ],
    },
  },

  {
    keys: ["bulk quantity", "bulk order", "wholesale", "large quantity", "bulk price", "bulk quotation", "quotation", "quote", "b2b", "moq"],
    replies: {
      en: [
        "Yes, bulk quantity and wholesale quotation support is available.",
        "Please share required quantity, product name, SKU/MPN, brand preference, target price and delivery location.",
      ],
      hi: [
        "Haan, bulk quantity aur wholesale quotation support available hai.",
        "Please required quantity, product name, SKU/MPN, brand preference, target price aur delivery location share karein.",
      ],
    },
  },

  {
    keys: ["minimum order", "minimum quantity", "moq", "min qty", "small quantity", "sample quantity"],
    replies: {
      en: [
        "Minimum order quantity depends on product, brand and supplier policy.",
        "Please share product SKU/MPN and required quantity so the team can confirm MOQ.",
      ],
      hi: [
        "Minimum order quantity product, brand aur supplier policy par depend karti hai.",
        "Please product SKU/MPN aur required quantity share karein, team MOQ confirm karegi.",
      ],
    },
  },

  {
    keys: ["alternate part", "replacement part", "equivalent", "compatible", "same part", "part alternative", "substitute", "dusra part"],
    replies: {
      en: [
        "Compatible alternate part can be suggested after checking technical specifications.",
        "Please share original MPN/SKU, voltage/current rating, package type, pin count, application and datasheet.",
      ],
      hi: [
        "Technical specifications check karne ke baad compatible alternate part suggest kiya ja sakta hai.",
        "Please original MPN/SKU, voltage/current rating, package type, pin count, application aur datasheet share karein.",
      ],
    },
  },

  {
    keys: ["datasheet", "data sheet", "manual", "catalog", "technical details", "specification", "specs", "pinout", "pin diagram", "wiring", "connection"],
    replies: {
      en: [
        "Datasheet/manual support is available for many electronic and industrial components.",
        "Please share product name, SKU or MPN. If it is not available on the product page, the support team will help source it.",
      ],
      hi: [
        "Kai electronic aur industrial components ke liye datasheet/manual support available hai.",
        "Please product name, SKU ya MPN share karein. Agar product page par available nahi hai, support team source karke help karegi.",
      ],
    },
  },

  {
    keys: ["warranty", "guarantee", "warranty period", "warranty details", "warranty hai"],
    replies: {
      en: [
        "Warranty depends on product category, brand and supplier policy.",
        "Please share product name or MPN so exact warranty terms can be checked.",
      ],
      hi: [
        "Warranty product category, brand aur supplier policy par depend karti hai.",
        "Please product name ya MPN share karein, exact warranty terms check karke confirm kiya jayega.",
      ],
    },
  },

  {
    keys: ["original", "genuine", "authentic", "fake", "duplicate", "brand original", "quality", "tested"],
    replies: {
      en: [
        "Royal Component sources products through trusted supplier networks.",
        "For critical industrial use, MPN, brand and datasheet verification is recommended.",
      ],
      hi: [
        "Royal Component trusted supplier network se products source karta hai.",
        "Critical industrial use ke liye MPN, brand aur datasheet verification recommended hai.",
      ],
    },
  },

  {
    keys: ["stock", "available", "availability", "in stock", "out of stock", "stock hai", "kitna stock", "ready stock"],
    replies: {
      en: [
        "Stock availability depends on real-time procurement and supplier confirmation.",
        "Please share required quantity so the team can confirm availability.",
      ],
      hi: [
        "Stock availability real-time procurement aur supplier confirmation par depend karti hai.",
        "Please required quantity share karein, team availability confirm karegi.",
      ],
    },
  },

  {
    keys: ["price", "rate", "discount", "best price", "negotiation", "kam price", "lowest price", "deal"],
    replies: {
      en: [
        "Price depends on quantity, brand, supplier stock and market availability.",
        "Better pricing may be possible for bulk quantity. Please share required quantity and target price.",
      ],
      hi: [
        "Price quantity, brand, supplier stock aur market availability par depend karta hai.",
        "Bulk quantity ke liye better pricing possible ho sakti hai. Please required quantity aur target price share karein.",
      ],
    },
  },

  {
    keys: ["shipping charge", "delivery charge", "courier charge", "freight", "transport charge"],
    replies: {
      en: [
        "Shipping charges depend on order value, weight, product size and delivery pincode.",
        "Bulk or heavy industrial items may require separate freight confirmation.",
      ],
      hi: [
        "Shipping charges order value, weight, product size aur delivery pincode par depend karte hain.",
        "Bulk ya heavy industrial items me freight separately confirm ho sakta hai.",
      ],
    },
  },

  {
    keys: ["courier", "tracking number", "awb", "tracking id", "docket", "shipment tracking"],
    replies: {
      en: [
        "Courier tracking or AWB number is updated after dispatch.",
        "Once shipment is picked up, tracking details will appear on the order page.",
      ],
      hi: [
        "Courier tracking ya AWB number dispatch ke baad update hota hai.",
        "Shipment pickup hone ke baad tracking details order page par update ho jayegi.",
      ],
    },
  },

  {
    keys: ["urgent", "fast delivery", "same day", "express", "jaldi chahiye", "urgent chahiye", "today dispatch"],
    replies: {
      en: [
        "Urgent dispatch may be possible if the item is in ready stock and payment/order confirmation is complete.",
        "Please share required deadline and delivery city so the team can check feasibility.",
      ],
      hi: [
        "Agar item ready stock me hai aur payment/order confirmation complete hai, to urgent dispatch possible ho sakta hai.",
        "Please required deadline aur delivery city share karein, team feasibility check karegi.",
      ],
    },
  },

  {
    keys: ["pincode", "deliverable", "delivery available", "mere area me delivery", "serviceable"],
    replies: {
      en: [
        "Delivery availability depends on pincode and courier serviceability.",
        "Please share your delivery pincode so the team can check courier availability.",
      ],
      hi: [
        "Delivery availability pincode aur courier serviceability par depend karti hai.",
        "Please delivery pincode share karein, team courier availability check karegi.",
      ],
    },
  },

  {
    keys: ["packing", "packaging", "safe packing", "esd packing", "anti static", "damage safe"],
    replies: {
      en: [
        "Electronic and industrial components are dispatched with safe packaging.",
        "ESD or anti-static packaging depends on product category and availability.",
      ],
      hi: [
        "Electronic aur industrial components safe packaging ke sath dispatch kiye jaate hain.",
        "ESD ya anti-static packaging product category aur availability par depend karti hai.",
      ],
    },
  },

  {
    keys: ["purchase order", "po", "po number", "pan", "company document", "business proof"],
    replies: {
      en: [
        "PO number and business billing details can be added for business orders.",
        "Please share PO number/copy, company name, GSTIN and billing address if required.",
      ],
      hi: [
        "Business orders ke liye PO number aur business billing details add kiye ja sakte hain.",
        "Please PO number/copy, company name, GSTIN aur billing address share karein.",
      ],
    },
  },

  {
    keys: ["product nahi mil raha", "not found", "part not found", "item not available", "search nahi aa raha"],
    replies: {
      en: [
        "If the product is not available on the website, please share part number, MPN, brand or datasheet.",
        "The team will check sourcing availability, alternate part and quotation.",
      ],
      hi: [
        "Agar product website par nahi mil raha, please part number, MPN, brand ya datasheet share karein.",
        "Team sourcing availability, alternate part aur quotation check karegi.",
      ],
    },
  },

  {
    keys: ["image different", "photo different", "spec mismatch", "description wrong", "details wrong"],
    replies: {
      en: [
        "Product image may be for reference. For industrial components, MPN/SKU and datasheet are the final technical references.",
        "Please share the exact concern so the team can verify product specifications.",
      ],
      hi: [
        "Product image reference ke liye ho sakti hai. Industrial components me MPN/SKU aur datasheet final technical reference hota hai.",
        "Please exact concern share karein, team product specification verify karegi.",
      ],
    },
  },

  {
    keys: ["technical support", "application", "use kaise", "kaise use kare", "connection kaise", "voltage", "current", "rating", "compatible hai kya"],
    replies: {
      en: [
        "For technical compatibility, product MPN/SKU, application, voltage/current rating and datasheet are required.",
        "Please share complete requirements so the team can check specification match.",
      ],
      hi: [
        "Technical compatibility ke liye product MPN/SKU, application, voltage/current rating aur datasheet required hota hai.",
        "Please complete requirement share karein, team specification match karke guidance degi.",
      ],
    },
  },

  {
    keys: ["human agent", "talk to person", "real person", "call me", "agent", "executive", "customer care", "support executive", "insaan se baat"],
    replies: {
      en: [
        "Your request has been noted. A support executive will review this chat and assist you.",
        "For urgent help, please use the Call button to contact the support team.",
      ],
      hi: [
        "Aapki request note kar li gayi hai. Support executive is chat ko review karke help karega.",
        "Urgent help ke liye aap Call button se support team ko call kar sakte hain.",
      ],
    },
  },

  {
    keys: ["thank", "thanks", "thank you", "dhanyawad", "shukriya", "ok", "okay"],
    replies: {
      en: ["You're welcome. Please ask if you need help with order, delivery, invoice or technical support."],
      hi: ["Aapka swagat hai. Order, delivery, invoice ya technical support se related aur koi doubt ho to poochh sakte hain."],
    },
  },
];

function normalizeText(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/[^\w\s\u0900-\u097F]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function detectLanguage(message = "") {
  const text = normalizeText(message);

  const hindiRomanWords = [
    "kaha",
    "kahan",
    "kab",
    "kyu",
    "kaise",
    "mera",
    "meri",
    "mujhe",
    "hai",
    "nahi",
    "nhi",
    "chahiye",
    "bhejoge",
    "aayega",
    "ayega",
    "paisa",
    "galat",
    "badalna",
    "karna",
    "hoga",
    "hogi",
    "karein",
    "karo",
    "mil",
    "tak",
    "jaldi",
    "khud",
    "insaan",
  ];

  const hasHindiScript = /[\u0900-\u097F]/.test(text);
  const hasHindiRoman = hindiRomanWords.some((word) =>
    new RegExp(`\\b${word}\\b`).test(text)
  );

  return hasHindiScript || hasHindiRoman ? "hi" : "en";
}

function scoreMatch(text, keys) {
  let score = 0;

  for (const key of keys) {
    const normalizedKey = normalizeText(key);
    if (!normalizedKey) continue;

    if (text.includes(normalizedKey)) {
      score += normalizedKey.length > 12 ? 6 : 4;
      continue;
    }

    const words = normalizedKey.split(" ").filter(Boolean);
    const matchedWords = words.filter((word) => text.includes(word));

    if (words.length > 1 && matchedWords.length >= Math.ceil(words.length / 2)) {
      score += matchedWords.length;
    }
  }

  return score;
}

function getAutoReply(message = "") {
  const text = normalizeText(message);
  const lang = detectLanguage(message);

  if (!text) {
    return lang === "hi"
      ? ["Please apna question type karein, main order support me help karunga."]
      : ["Please type your question so I can help you with your order."];
  }

  let bestMatch = null;
  let bestScore = 0;

  for (const item of answerBank) {
    const score = scoreMatch(text, item.keys);

    if (score > bestScore) {
      bestScore = score;
      bestMatch = item;
    }
  }

  if (bestMatch && bestScore >= 2) {
    return bestMatch.replies[lang] || bestMatch.replies.en;
  }

  if (lang === "hi") {
    return [
      "Main aapki query samajh gaya. Fast help ke liye product name, SKU/MPN, quantity aur exact issue share karein.",
      "Aap order delivery, dispatch, GST invoice, payment, address change, cancellation, replacement, datasheet, alternate part, warranty ya bulk quotation ke baare me poochh sakte hain.",
    ];
  }

  return [
    "I understand your query. To help you faster, please share the product name, SKU/MPN, required quantity and exact issue.",
    "You can ask about order delivery, dispatch, GST invoice, payment, address change, cancellation, replacement, datasheet, alternate part, warranty or bulk quotation.",
  ];
}

module.exports = { getAutoReply };