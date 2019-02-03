import { Range } from "./RangeCollection";
/**
 * @param {Range} range
 * @throws {TypeError}
 * @return {void}
 */
export declare function validateRange(range: Range): void;
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
export declare function hasIntersection(first: Range, second: Range): boolean;
/**
 * @param {Range} range
 * @return {number}
 */
export declare function getRangeLength(range: Range): number;
