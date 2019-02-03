import { Range } from "./RangeCollection";
import { hasIntersection } from "./rangeUtils";

describe("rangeUtils test suite", () => {
  describe("hasIntersection tests", () => {
    it("should be true if one range include another", () => {
      const r: Range = [0, 3];
      expect(hasIntersection(r, [0, 3])).toBe(true);
      expect(hasIntersection(r, [-1, 4])).toBe(true);
      expect(hasIntersection(r, [0, 4])).toBe(true);
      expect(hasIntersection(r, [1, 2])).toBe(true);
    });

    it("should be true if one range partially include another", () => {
      const r: Range = [0, 3];
      expect(hasIntersection(r, [-1, 1])).toBe(true);
      expect(hasIntersection(r, [1, 4])).toBe(true);
      expect(hasIntersection(r, [-1, 0])).toBe(true);
      expect(hasIntersection(r, [3, 4])).toBe(true);
    });

    it("should be false when ranges has no common points", () => {
      const r: Range = [0, 3];
      expect(hasIntersection(r, [-2, -1])).toBe(false);
      expect(hasIntersection(r, [4, 5])).toBe(false);
    });
  });
});
