import { calculateScore } from "../scoring";

describe("calculateScore", () => {
  it("returns 850 for zero kg", () => {
    expect(calculateScore(0)).toBe(850);
  });

  it("returns 300 for a very large kg value because it is clamped", () => {
    expect(calculateScore(1_000_000)).toBe(300);
  });

  it("returns the mathematically correct score for a known mid-range value", () => {
    expect(calculateScore(6000)).toBe(575);
  });

  it("never falls outside 300 to 850 regardless of input", () => {
    [-1000, 0, 6000, 12_000, 1_000_000].forEach((totalAnnualKg) => {
      const score = calculateScore(totalAnnualKg);

      expect(score).toBeGreaterThanOrEqual(300);
      expect(score).toBeLessThanOrEqual(850);
    });
  });

  it("always returns a whole number", () => {
    expect(Number.isInteger(calculateScore(1234.56))).toBe(true);
  });
});
