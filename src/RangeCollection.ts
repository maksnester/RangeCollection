import { getRangeLength, hasIntersection, validateRange } from "./rangeUtils";

export type Range = [number, number];

/**
 * A pair of integers define a range  [1, 5). This range includes integers: 1, 2, 3, and 4.
 * A range collection is an aggregate of these ranges: [1, 5), [10, 11), [100, 201)
 */
export class RangeCollection {
  private readonly collection: Range[];

  constructor(value?: Range | Range[]) {
    if (!Array.isArray(value)) {
      this.collection = [];
      return;
    }

    if (Array.isArray(value[0])) {
      for (const range of value) {
        validateRange(range as Range);
      }
      // todo - use add to consistently create collection
      this.collection = value as Range[];
    } else {
      validateRange(value as Range);
      this.collection = [value as Range];
    }
  }

  /**
   * Adds a range to the collection
   * @param {Range} value - Array of two integers that specify beginning and end of range.
   */
  public add(value: Range): void {
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

    let rangesToDelete = 0;
    let newRange: Range = [value[0], value[1]];
    let insertionIndex = -1;
    for (let i = 0; i < this.collection.length; i++) {
      if (
        this.collection[i][1] < value[0] &&
        this.collection[i + 1] &&
        this.collection[i + 1][0] > value[1]
      ) {
        // we won't replace anything for that case
        // will just add new record after found range
        insertionIndex = i + 1;
      } else if (hasIntersection(this.collection[i], newRange)) {
        const minStart = Math.min(this.collection[i][0], newRange[0]);
        const maxEnd = Math.max(this.collection[i][1], newRange[1]);
        newRange = [minStart, maxEnd];
        rangesToDelete++;
        if (insertionIndex === -1) {
          insertionIndex = i;
        }
      } else if (insertionIndex > -1) {
        // we had some intersections or lesser ranges before and should not check another ranges anymore
        break;
      }
    }

    if (insertionIndex > -1) {
      this.collection.splice(insertionIndex, rangesToDelete, newRange);
    }
  }

  /**
   * Removes a range from the collection
   * @param {Range} value - Array of two integers that specify beginning and end of range.
   */
  public remove(value: Range): void {
    validateRange(value);
    if (value[0] === value[1] || !this.collection.length) {
      return;
    }
    for (let i = 0; i < this.collection.length; i++) {
      const start = this.collection[i][0];
      const end = this.collection[i][1];
      if (start >= value[1]) {
        break;
      }
      if (end <= value[0] || !hasIntersection(value, this.collection[i])) {
        continue;
      }
      if (start >= value[0] && end <= value[1]) {
        const newRange: Range = [value[1] + 1, end];
        if (getRangeLength(newRange) > 1) {
          this.collection[i][0] = newRange[0];
        } else {
          this.collection.splice(i, 1);
          i--;
        }
      } else if (start < value[0]) {
        if (end <= value[1]) {
          this.collection[i][1] = value[0];
        } else {
          const newRange: Range = [value[1], this.collection[i][1]];
          if (getRangeLength(newRange) >= 1) {
            this.collection.splice(i + 1, 0, newRange);
          }
          this.collection[i][1] = value[0];
        }
      } else if (start >= value[0]) {
        this.collection[i][0] = value[1];
      }
    }
  }

  /**
   * @return {string} - the list of ranges in the range collection
   * @example [1, 5), [10, 11), [100, 201)
   */
  public toString(): string {
    return this.collection
      .map(range => `[${range[0]}, ${range[1]})`)
      .join(", ");
  }

  /**
   * Prints into console the list of ranges in the range collection
   */
  public print(): void {
    // tslint:disable-next-line:no-console
    console.log(this.toString());
  }
}
