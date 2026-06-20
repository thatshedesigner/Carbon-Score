function clampScore(score) {
  return Math.min(850, Math.max(300, score));
}

export function calculateScore(totalAnnualKg) {
  return Math.round(clampScore(850 - (totalAnnualKg / 1000 / 12) * 550));
}
