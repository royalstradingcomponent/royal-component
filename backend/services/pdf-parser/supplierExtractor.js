function extractCompanyDetails(
  lines = []
) {

  const result = {
    supplier: "",
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
    gst: "18",
    profit: "20",
  };

  const companyPatterns = [
    /([A-Z][A-Z\s&.,]+PRIVATE LIMITED)/i,

    /([A-Z][A-Z\s&.,]+PVT\.? LTD\.?)/i,

    /([A-Z][A-Z\s&.,]+LIMITED)/i,
  ];

  let bestCompany = "";

  for (const line of lines) {

    for (const pattern of companyPatterns) {

      const match =
        line.match(pattern);

      if (match) {

        const company =
          match[1]
            .replace(/\s+/g, " ")
            .trim();

        if (
          company.length >
          bestCompany.length
        ) {

          bestCompany =
            company;
        }
      }
    }

    if (!result.phone) {

      const phone =
        line.match(
          /(\+91)?[6-9]\d{9}/
        );

      if (phone) {

        result.phone =
          phone[0];

        result.whatsapp =
          phone[0];
      }
    }

    if (!result.email) {

      const email =
        line.match(
          /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
        );

      if (email) {

        result.email =
          email[0];
      }
    }

    if (
      line.includes(
        "Mumbai"
      ) ||
      line.includes(
        "Maharashtra"
      )
    ) {

      result.address +=
        " " + line;
    }
  }

  result.supplier =
    bestCompany ||
    "UNKNOWN SUPPLIER";

  return result;
}

module.exports = {
  extractCompanyDetails,
};