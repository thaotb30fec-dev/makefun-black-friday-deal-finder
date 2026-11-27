// Verdict labels: the honest "is it really a deal" signal. Each deal in data.js
// carries its verdict and the evidence for it; this file only maps a verdict
// to its badge style and orders verdicts from strongest to weakest.

export const VERDICT_CLASS = {
  "Lowest ever": "v-lowest",
  "Deep cut": "v-deep",
  "Strong deal": "v-strong",
  "Good deal": "v-good",
  "Modest saving": "v-modest",
  "Small cut": "v-small",
};

export const VERDICT_RANK = {
  "Lowest ever": 0,
  "Deep cut": 1,
  "Strong deal": 2,
  "Good deal": 3,
  "Modest saving": 4,
  "Small cut": 5,
};

export function verdictClass(verdict) {
  return VERDICT_CLASS[verdict] || "v-good";
}
