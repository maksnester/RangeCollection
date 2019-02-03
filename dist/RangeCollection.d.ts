export declare type Range = [number, number];
/**
 * A pair of integers define a range  [1, 5). This range includes integers: 1, 2, 3, and 4.
 * A range collection is an aggregate of these ranges: [1, 5), [10, 11), [100, 201)
 */
export declare class RangeCollection {
    private readonly collection;
    constructor(value?: Range | Range[]);
    /**
     * Adds a range to the collection
     * @param {Range} value - Array of two integers that specify beginning and end of range.
     */
    add(value: Range): void;
    /**
     * Removes a range from the collection
     * @param {Range} value - Array of two integers that specify beginning and end of range.
     */
    remove(value: Range): void;
    /**
     * @return {string} - the list of ranges in the range collection
     * @example [1, 5), [10, 11), [100, 201)
     */
    toString(): string;
    /**
     * Prints into console the list of ranges in the range collection
     */
    print(): void;
}
