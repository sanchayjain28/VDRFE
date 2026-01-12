export const uniqueId = () => {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 1000);
  const combinedId = `${timestamp}${random}`;
  const numericId = parseInt(combinedId, 10) % 1000;
  // under 999
  return numericId;
};


export const formatMathToLatexNew = (input: string): string => {
  if (!input) return "";

  let output = input
    // Remove $$ or \[ \] LaTeX math wrappers
    .replace(/\$\$|\\\[|\\\]/g, "")
    // Remove \text{} and keep only inner text
    .replace(/\\text\{([^}]*)\}/g, "$1")
    // Remove \left and \right
    .replace(/\\left|\\right/g, "")
    // Replace \frac{a}{b} with (a / b)
    .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "($1 / $2)")
    // Replace \times with ×
    .replace(/\\times/g, "×")
    // Replace \approx with ≈
    .replace(/\\approx/g, "≈")
    // Remove leftover backslashes
    .replace(/\\/g, "")
    .trim();

  // Remove double parentheses like ((...)) → (...)
  output = output.replace(/\(\(([^()]+)\)\)/g, "($1)");

  // Remove parentheses around simple numbers like (0.7666) → 0.7666
  output = output.replace(/\((\d+(\.\d+)?)\)/g, "$1");

  return output;
};

export const generateTempSessionId = () => {
  return crypto.randomUUID(); // UUID v4
};