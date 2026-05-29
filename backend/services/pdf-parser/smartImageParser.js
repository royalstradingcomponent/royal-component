function isComponentLine(
  line = ""
) {

  const clean =
    String(line)
      .trim()
      .toUpperCase();

  // component pattern

  return /^[A-Z0-9\-\/]{4,}$/.test(clean);
}

function mergeBrokenLines(
  lines = []
) {

  const merged = [];

  for (
    let i = 0;
    i < lines.length;
    i++
  ) {

    let current =
      String(
        lines[i] || ""
      )
        .replace(/\s+/g, " ")
        .trim();

    if (!current)
      continue;

    const next =
      String(
        lines[i + 1] || ""
      )
        .replace(/\s+/g, " ")
        .trim();

    // ONLY merge component rows

    if (
      next &&
      isComponentLine(current) &&
      isComponentLine(next)
    ) {

      merged.push(current);
      merged.push(next);

      i++;

      continue;
    }

    merged.push(current);
  }

  return merged;
}

module.exports = {
  mergeBrokenLines,
};