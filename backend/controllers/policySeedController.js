const Policy = require("../models/PolicyPage");

const defaultPolicies = [
  {
    title: "Return Policy",
    slug: "return-policy",
    shortDescription:
      "Understand our return process for industrial components including eligibility, timelines and conditions.",
    content: `At Royal Component, we ensure a smooth and transparent return process for all industrial products.

Returns are accepted only under specific conditions such as damaged, defective or incorrect items. Customers must initiate return requests within the allowed return window.

Products must be unused, in original packaging and accompanied by invoice.

Our team verifies each return request before approval to maintain product quality and authenticity.`,

    sections: [
      {
        heading: "Return Eligibility",
        content:
          "Products must be unused, undamaged and in original packaging. Returns are only accepted for defective or wrong items.",
        order: 0,
      },
      {
        heading: "Return Process",
        content:
          "Submit a return request from your order page or contact support. Once approved, you will receive return instructions.",
        order: 1,
      },
      {
        heading: "Non-returnable Items",
        content:
          "Custom orders, bulk orders and special procurement items are non-returnable unless defective.",
        order: 2,
      },
    ],

    faqs: [
      {
        question: "How many days do I have to return a product?",
        answer:
          "You can request a return within 3-7 days of delivery depending on product category.",
      },
      {
        question: "Will I get full refund?",
        answer:
          "Yes, if the product meets return conditions and passes quality inspection.",
      },
    ],

    seo: {
      metaTitle: "Return Policy | Royal Component",
      metaDescription:
        "Read Royal Component return policy for industrial products, eligibility, timelines and return process.",
      metaKeywords: ["return policy", "industrial returns", "electronics return"],
    },
  },

  {
    title: "Refund Policy",
    slug: "refund-policy",
    shortDescription:
      "Learn about refund eligibility, timelines and processing details for all orders.",
    content: `Refunds are processed after product inspection and approval.

The refund amount is credited to the original payment method within 5-7 working days.

Shipping and handling charges may not be refundable depending on the case.`,

    sections: [
      {
        heading: "Refund Timeline",
        content:
          "Refunds are processed within 5-7 business days after approval.",
      },
      {
        heading: "Refund Method",
        content:
          "Refunds are issued to the original payment method or bank account.",
      },
    ],

    faqs: [
      {
        question: "How long does refund take?",
        answer: "Typically 5-7 working days after approval.",
      },
    ],

    seo: {
      metaTitle: "Refund Policy | Royal Component",
      metaDescription:
        "Read Royal Component refund policy, timelines and eligibility for refunds.",
      metaKeywords: ["refund policy", "refund time", "industrial refund"],
    },
  },

  {
    title: "Exchange Policy",
    slug: "exchange-policy",
    shortDescription:
      "Know how to exchange defective or incorrect industrial products.",
    content: `We allow exchanges for defective or incorrect items.

Exchange requests must be raised within the return window and are subject to stock availability.`,

    sections: [
      {
        heading: "Exchange Conditions",
        content:
          "Products must be unused and returned in original packaging.",
      },
      {
        heading: "Exchange Process",
        content:
          "Once approved, replacement product will be shipped.",
      },
    ],

    faqs: [
      {
        question: "Can I exchange a product?",
        answer: "Yes, only if it is defective or incorrect.",
      },
    ],

    seo: {
      metaTitle: "Exchange Policy | Royal Component",
      metaDescription:
        "Learn about exchange policy for industrial and electronic products.",
      metaKeywords: ["exchange policy", "replacement policy"],
    },
  },
];

exports.seedPolicies = async (req, res) => {
  try {
    for (const policy of defaultPolicies) {
      const exists = await Policy.findOne({ slug: policy.slug });

      if (!exists) {
        await Policy.create(policy);
      }
    }

    res.json({
      success: true,
      message: "Policies seeded successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};