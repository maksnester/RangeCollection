import { Range, hasIntersection, RangeCollection } from './RangeCollection'

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
      rc.add([7, 9])
      expect(rc.toString()).toBe("[1, 5), [7, 9), [10, 20)");
    });

    it("Should ignore zero-length ranges", () => {
      const rc = new RangeCollection([[1, 5], [10, 20]]);

      rc.add([5, 5]);
      rc.add([20, 20]);
      rc.add([6, 6]);
      expect(rc.toString()).toBe("[1, 5), [10, 20)");
    });

    it('Should not modify anything if some range already includes passed range', () => {
      const rc = new RangeCollection([1, 5]);
      rc.add([2, 4]);
      expect(rc.toString()).toBe("[1, 5)");
    })

    describe('Modify existing ranges in case of intersection', () => {
      it('Should change end value of existing range', () => {
        const rc = new RangeCollection([[1, 5], [10, 20]]);

        rc.add([20, 21]);
        expect(rc.toString()).toBe("[1, 5), [10, 21)");

        rc.add([3, 8]);
        expect(rc.toString()).toBe("[1, 8), [10, 21)");
      })

      it('Should change start value of existing range', () => {
        const rc = new RangeCollection([[1, 5]]);
        rc.add([0, 3]);
        expect(rc.toString()).toBe("[0, 5)");
      })

      it('Should change both start and env values of existing range', () => {
        const rc = new RangeCollection([[1, 5], [10, 20]]);
        rc.add([-1, 8]);
        expect(rc.toString()).toBe("[-1, 8), [10, 20)");
      })

      it('Should concat ranges when possible', () => {
        const rc = new RangeCollection([[1, 8], [10, 21]]);
        rc.add([0, 1]);
        expect(rc.toString()).toBe("[0, 8), [10, 21)");

        rc.add([0, 10]);
        expect(rc.toString()).toBe("[0, 21)");

        rc.add([-10, 22]);
        expect(rc.toString()).toBe("[-10, 22)");
      })
    })
  });

  it("Remove items from collection", () => {
    const rc = new RangeCollection([[1, 8], [10, 21]]);

    rc.remove([10, 10]); // ignores
    expect(rc.toString()).toBe("[1, 8), [10, 21)");

    rc.remove([10, 11]); // cut border
    expect(rc.toString()).toBe("[1, 8), [11, 21)");

    rc.remove([15, 17]); // split interval on two
    expect(rc.toString()).toBe("[1, 8), [11, 15), [17, 21)");

    rc.remove([3, 19]); // join intervals around removed intervals
    expect(rc.toString()).toBe("[1, 3), [19, 21)");

    rc.remove([1, 22]); // remove everything
    expect(rc.toString()).toBe("");
  });

  describe('hasIntersection tests', function() {
    it('should be true if one range include another', () => {
      const r: Range = [0, 3]
      expect(hasIntersection(r, [0, 3])).toBe(true)
      expect(hasIntersection(r, [-1, 4])).toBe(true)
      expect(hasIntersection(r, [0, 4])).toBe(true)
      expect(hasIntersection(r, [1, 2])).toBe(true)
    })

    it('should be true if one range partially include another', () => {
      const r: Range = [0, 3]
      expect(hasIntersection(r, [-1, 1])).toBe(true)
      expect(hasIntersection(r, [1, 4])).toBe(true)
      expect(hasIntersection(r, [-1, 0])).toBe(true)
      expect(hasIntersection(r, [3, 4])).toBe(true)
    })

    it('should be false when ranges has no common points', () => {
      const r: Range = [0, 3]
      expect(hasIntersection(r, [-2, -1])).toBe(false)
      expect(hasIntersection(r, [4, 5])).toBe(false)
    })
  })
  // it('Should throw TypeError for invalid range', () => {
  //
  // })
});
