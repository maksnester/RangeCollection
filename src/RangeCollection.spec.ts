import { RangeCollection } from "./RangeCollection";

describe("RangeCollection test suite", () => {
  it("Should create collection with or without initial value", () => {
    let rc = new RangeCollection();
    expect(rc.toString()).toBe("");

    rc = new RangeCollection([1, 5]);
    expect(rc.toString()).toBe("[1, 5)");

    rc = new RangeCollection([[1, 5]]);
    expect(rc.toString()).toBe("[1, 5)");

    rc = new RangeCollection([[1, 5], [6, 7]]);
    expect(rc.toString()).toBe("[1, 5), [6, 7)");
  });

  describe("Add items into collection", () => {
    it("Should add range with the min start before known ranges", () => {
      const rc = new RangeCollection([1, 5]);

      rc.add([-10, -5]);
      expect(rc.toString()).toBe("[-10, -5), [1, 5)");
    });

    it("Should add range with the max start after known ranges", () => {
      const rc = new RangeCollection([1, 5]);

      rc.add([10, 20]);
      expect(rc.toString()).toBe("[1, 5), [10, 20)");
    });

    it("Should add range between known ranges", () => {
      const rc = new RangeCollection([[1, 5], [10, 20]]);
      rc.add([7, 9]);
      expect(rc.toString()).toBe("[1, 5), [7, 9), [10, 20)");
    });

    it("Should ignore zero-length ranges", () => {
      const rc = new RangeCollection([[1, 5], [10, 20]]);

      rc.add([5, 5]);
      rc.add([20, 20]);
      rc.add([6, 6]);
      expect(rc.toString()).toBe("[1, 5), [10, 20)");
    });

    it("Should not modify anything if some range already includes passed range", () => {
      const rc = new RangeCollection([1, 5]);
      rc.add([2, 4]);
      expect(rc.toString()).toBe("[1, 5)");
    });

    describe("Modify existing ranges in case of intersection", () => {
      it("Should change end value of existing range", () => {
        const rc = new RangeCollection([[1, 5], [10, 20]]);

        rc.add([20, 21]);
        expect(rc.toString()).toBe("[1, 5), [10, 21)");

        rc.add([3, 8]);
        expect(rc.toString()).toBe("[1, 8), [10, 21)");
      });

      it("Should change start value of existing range", () => {
        const rc = new RangeCollection([[1, 5]]);
        rc.add([0, 3]);
        expect(rc.toString()).toBe("[0, 5)");
      });

      it("Should change both start and env values of existing range", () => {
        const rc = new RangeCollection([[1, 5], [10, 20]]);
        rc.add([-1, 8]);
        expect(rc.toString()).toBe("[-1, 8), [10, 20)");
      });

      it("Should concat ranges when possible", () => {
        const rc = new RangeCollection([[1, 8], [10, 21]]);
        rc.add([0, 1]);
        expect(rc.toString()).toBe("[0, 8), [10, 21)");

        rc.add([0, 10]);
        expect(rc.toString()).toBe("[0, 21)");

        rc.add([-10, 22]);
        expect(rc.toString()).toBe("[-10, 22)");
      });
    });
  });

  describe("Remove items from collection", () => {
    it("Should ignore zero-length ranges or not presented in collection", () => {
      const rc = new RangeCollection([[1, 8], [10, 21]]);
      rc.remove([10, 10]);
      expect(rc.toString()).toBe("[1, 8), [10, 21)");

      rc.remove([8, 9]);
      expect(rc.toString()).toBe("[1, 8), [10, 21)");

      rc.remove([0, 1]);
      expect(rc.toString()).toBe("[1, 8), [10, 21)");
    });

    it("Should correctly cut start borders", () => {
      const rc = new RangeCollection([[1, 8], [10, 21]]);
      rc.remove([10, 11]);
      expect(rc.toString()).toBe("[1, 8), [11, 21)");
      rc.remove([0, 2]);
      expect(rc.toString()).toBe("[2, 8), [11, 21)");
      rc.remove([10, 15]);
      expect(rc.toString()).toBe("[2, 8), [15, 21)");
    });

    it("Should correctly cut end borders", () => {
      const rc = new RangeCollection([[1, 8], [10, 21]]);
      rc.remove([18, 21]);
      expect(rc.toString()).toBe("[1, 8), [10, 18)");
      rc.remove([7, 8]);
      expect(rc.toString()).toBe("[1, 7), [10, 18)");
    });

    it("Should remove ranges completely", () => {
      const rc = new RangeCollection([
        [1, 3],
        [5, 7],
        [9, 12],
        [14, 16],
        [18, 20]
      ]);
      rc.remove([5, 16]);
      expect(rc.toString()).toBe("[1, 3), [18, 20)");
      rc.remove([1, 20]);
      expect(rc.toString()).toBe("");
    });

    it("Should modify existing ranges", () => {
      const rc = new RangeCollection([[1, 8], [10, 15], [20, 22]]);
      rc.remove([7, 21]);
      expect(rc.toString()).toBe("[1, 7), [21, 22)");

      rc.remove([2, 22]);
      expect(rc.toString()).toBe("[1, 2)");
    });

    it("Should split range on two when part is removed from the middle", () => {
      const rc = new RangeCollection([[1, 8], [10, 15]]);
      rc.remove([12, 13]);
      expect(rc.toString()).toBe("[1, 8), [10, 12), [13, 15)");
    });

    it("Should not create zero-length ranges after remove from end", () => {
      const rc = new RangeCollection([[1, 8]]);
      rc.remove([7, 8]);
      expect(rc.toString()).toBe("[1, 7)");
      rc.remove([5, 6]);
      expect(rc.toString()).toBe("[1, 5), [6, 7)");
    });
  });
});
