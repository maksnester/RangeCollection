export type Range = [number, number];

/**
 * @param {Range} range
 * @throws {TypeError}
 * @return {void}
 */
function validateRange(range: Range): void {
  if (typeof range[0] !== "number") {
    throw new TypeError("Start range value is required and must be a number");
  }
  if (typeof range[1] !== "number") {
    throw new TypeError("End range value is required and must be a number");
  }
  if (range[0] > range[1]) {
    throw new TypeError("Start range value can not be lesser than end value");
  }
}

/**
 * Checks if range1 has intersection with range2. Comparison is not strict for borders.
 * That means all ranges treated as they include border values. E.g. [1,2] includes 1,2
 * @param {Range} first
 * @param {Range} second
 * @return {boolean}
 * @example
 *   [0, 1] intersects with [0, 2] by "0" and "1"
 *   [0, 1] intersect with [1, 2] by "1"
 *   [0, 1] intersect with [-1, 0] by "0"
 */
export function hasIntersection(first: Range, second: Range): boolean {
  const start = 0;
  const end = 1;
  if (second[start] > first[end] || first[start] > second[end]) {
    return false
  }
  return true
}

/**
 *
 * A pair of integers define a range  [1, 5). This range includes integers: 1, 2, 3, and 4.
 * A range collection is an aggregate of these ranges: [1, 5), [10, 11), [100, 201)
 */
export class RangeCollection {
  private readonly collection: Array<Range>;

  constructor(value?: Range | Array<Range>) {
    if (!Array.isArray(value)) {
      this.collection = [];
      return;
    }

    if (Array.isArray(value[0])) {
      for (let range of value) {
        validateRange(range as Range);
      }
      // todo - use add to consistently create collection
      this.collection = value as Array<Range>;
    } else {
      validateRange(value as Range);
      this.collection = [value as Range];
    }
  }

  /**
   * Adds a range to the collection
   * @param {Range} value - Array of two integers that specify beginning and end of range.
   */
  add(value: Range): void {
    validateRange(value);
    if (value[0] === value[1]) {
      return;
    }

    const firstItem = this.collection[0];
    if (!this.collection.length || value[1] < firstItem[0]) {
      this.collection.unshift(value);
      return;
    }

    const lastItem = this.collection[this.collection.length - 1];
    if (lastItem[1] < value[0]) {
      this.collection.push(value);
      return;
    }

    // insert between existing ranges
    let insertAfter = -1;
    for (let i = 0; i < this.collection.length - 1; i++) {
      if (
        this.collection[i][1] < value[0] &&
        this.collection[i + 1][0] > value[1]
      ) {
        insertAfter = i;
      }
    }
    if (insertAfter > -1) {
      this.collection.splice(insertAfter + 1, 0, value);
      return;
    }

    // modify existing ranges because of intersection
    let insertInsteadOf = -1;
    let rangesToDelete = 0;
    let newRange: Range = [value[0], value[1]];
    for (let i = 0; i < this.collection.length; i++) {
      if (hasIntersection(this.collection[i], newRange)) {
        const minStart = Math.min(this.collection[i][0], newRange[0]);
        const maxEnd = Math.max(this.collection[i][1], newRange[1]);
        newRange = [minStart, maxEnd];
        rangesToDelete++;
        if (insertInsteadOf === -1) {
          insertInsteadOf = i;
        }
      } else if (insertAfter > -1) {
        // we had some intersections before and should not check another ranges anymore
        break;
      }
    }

    if (insertInsteadOf > -1) {
      this.collection.splice(insertInsteadOf, rangesToDelete, newRange);
    }
  }

  /**
   * Removes a range from the collection
   * @param {Range} value - Array of two integers that specify beginning and end of range.
   */
  remove(value: Range): void {
    validateRange(value);
    if (value[0] === value[1]) {
      return;
    }
  }

  /**
   * @return {string} - the list of ranges in the range collection
   * @example [1, 5), [10, 11), [100, 201)
   */
  toString(): string {
    return this.collection
      .map(range => `[${range[0]}, ${range[1]})`)
      .join(", ");
  }

  /**
   * Prints into console the list of ranges in the range collection
   */
  print(): void {
    console.log(this.toString());
  }
}
