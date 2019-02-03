import { Range } from "./RangeCollection";

/**
 * @param {Range} range
 * @throws {TypeError}
 * @return {void}
 */
export function validateRange(range: Range): void {
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
 *   hasIntersection([0, 1], [0, 2]) - true by "0" and "1"
 *   hasIntersection([0, 1], [1, 2]) - true by "1"
 */
export function hasIntersection(first: Range, second: Range): boolean {
  const start = 0;
  const end = 1;
  if (second[start] > first[end] || first[start] > second[end]) {
    return false;
  }
  return true;
}

/**
 * @param {Range} range
 * @return {number}
 */
export function getRangeLength(range: Range): number {
  return range[1] - range[0];
}
