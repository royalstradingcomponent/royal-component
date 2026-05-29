function extractImageCompanyDetails(
  lines = []
) {

  const result = {
    supplier: "",
    contactPerson: "",
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
    gst: "18",
    profit: "20",
  };

  let supplier = "";

  for (const rawLine of lines) {

    const line =
      String(rawLine || "")
        .replace(/\s+/g, " ")
        .trim();

    if (!line)
      continue;

    const upper =
      line.toUpperCase();

    // ======================
    // COMPANY DETECTION
    // ======================

    const invalidCompanyWords = [
      "EMAIL",
      "CONTACT",
      "PHONE",
      "MOBILE",
      "WHATSAPP",
      "@",
      "GST",
      "PLEASE",
      "FREE",
      "THANK",
      "WELCOME",
    ];

    const looksLikeCompany =
  (
    upper.includes("PVT") ||
    upper.includes("PRIVATE") ||
    upper.includes("LIMITED") ||
    upper.includes("ELECTRONICS") ||
    upper.includes("TRADING") ||
    upper.includes("SEMICONDUCTOR") ||
    upper.includes("COMPONENT") ||
    upper.includes("INTERCOM")
  );

const hasInvalidWord =
  invalidCompanyWords.some(
    (w) =>
      upper.includes(w)
  );

if (
  !supplier &&
  !hasInvalidWord &&
  line.length > 3 &&
  line.length < 80
) {

  // score system

  let score = 0;

  if (
    upper.includes("ELECTRONICS")
  ) score += 5;

  if (
    upper.includes("INTERCOM")
  ) score += 5;

  if (
    upper.includes("PVT")
  ) score += 10;

  if (
    upper.includes("PRIVATE")
  ) score += 10;

  if (
    upper.includes("LIMITED")
  ) score += 10;

  if (
    /[A-Z]{3,}/.test(upper)
  ) score += 2;

  if (
    score >= 5
  ) {

    supplier = line;
  }
}

    

    // ======================
    // PHONE
    // ======================

    if (!result.phone) {

      const phone =
        line.match(
          /(?:\+91)?[\s\-]?[6-9]\d{9}/
        );

      if (phone) {

        const clean =
          phone[0]
            .replace(/\D/g, "")
            .slice(-10);

        result.phone =
          clean;

        result.whatsapp =
          clean;
      }
    }

    // ======================
    // EMAIL
    // ======================

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

    // ======================
    // CONTACT PERSON
    // ======================

    if (
      !result.contactPerson &&
      (
        upper.includes("CONTACT PERSON") ||
        upper.includes("CONTACT:")
      )
    ) {

      const clean =
        line
          .replace(
            /contact person|contact|:/gi,
            ""
          )
          .trim();

      if (
        clean.length > 3 &&
        clean.length < 40 &&
        !clean.includes("@") &&
        !/\d/.test(clean)
      ) {

        result.contactPerson =
          clean;
      }
    }

    // ======================
    // ADDRESS
    // ======================

    if (
      line.length > 15 &&
      (
        line.includes("Mumbai") ||
        line.includes("Delhi") ||
        line.includes("India") ||
        line.includes("Maharashtra")
      )
    ) {

      result.address +=
        " " + line;
    }
  }

  result.supplier =
    supplier ||
    "UNKNOWN SUPPLIER";

  return result;
}

module.exports = {
  extractImageCompanyDetails,
};