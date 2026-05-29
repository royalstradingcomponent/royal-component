const noiseWords = [
  "iso",
  "certificate",
  "welcome",
  "about us",
  "vision",
  "mission",
  "corporate",
  "company profile",
  "catalog",
  "brochure",
  "employee",
  "client",
  "warehouse",
  "factory",
  "milestone",
  "future",
  "chairman",
  "director",
  "strength",
  "introduction",
];

function cleanLines(lines = []) {

  return lines
    .map((line) =>
      String(line)
        .replace(/\s+/g, " ")
        .trim()
    )

    .filter((line) => {

      if (!line) return false;

      if (line.length < 2)
        return false;

      const lower =
        line.toLowerCase();

      if (
        noiseWords.some((w) =>
          lower.includes(w)
        )
      ) {
        return false;
      }

      return true;
    });
}

module.exports = {
  cleanLines,
};