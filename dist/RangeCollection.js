"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rangeUtils_1 = require("./rangeUtils");
/**
 * A pair of integers define a range  [1, 5). This range includes integers: 1, 2, 3, and 4.
 * A range collection is an aggregate of these ranges: [1, 5), [10, 11), [100, 201)
 */
var RangeCollection = /** @class */ (function () {
    function RangeCollection(value) {
        if (!Array.isArray(value)) {
            this.collection = [];
            return;
        }
        if (Array.isArray(value[0])) {
            for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
                var range = value_1[_i];
                rangeUtils_1.validateRange(range);
            }
            // todo - use add to consistently create collection
            this.collection = value;
        }
        else {
            rangeUtils_1.validateRange(value);
            this.collection = [value];
        }
    }
    /**
     * Adds a range to the collection
     * @param {Range} value - Array of two integers that specify beginning and end of range.
     */
    RangeCollection.prototype.add = function (value) {
        rangeUtils_1.validateRange(value);
        if (value[0] === value[1]) {
            return;
        }
        var firstItem = this.collection[0];
        if (!this.collection.length || value[1] < firstItem[0]) {
            this.collection.unshift(value);
            return;
        }
        var lastItem = this.collection[this.collection.length - 1];
        if (lastItem[1] < value[0]) {
            this.collection.push(value);
            return;
        }
        var rangesToDelete = 0;
        var newRange = [value[0], value[1]];
        var insertionIndex = -1;
        for (var i = 0; i < this.collection.length; i++) {
            if (this.collection[i][1] < value[0] &&
                this.collection[i + 1] &&
                this.collection[i + 1][0] > value[1]) {
                // we won't replace anything for that case
                // will just add new record after found range
                insertionIndex = i + 1;
            }
            else if (rangeUtils_1.hasIntersection(this.collection[i], newRange)) {
                var minStart = Math.min(this.collection[i][0], newRange[0]);
                var maxEnd = Math.max(this.collection[i][1], newRange[1]);
                newRange = [minStart, maxEnd];
                rangesToDelete++;
                if (insertionIndex === -1) {
                    insertionIndex = i;
                }
            }
            else if (insertionIndex > -1) {
                // we had some intersections or lesser ranges before and should not check another ranges anymore
                break;
            }
        }
        if (insertionIndex > -1) {
            this.collection.splice(insertionIndex, rangesToDelete, newRange);
        }
    };
    /**
     * Removes a range from the collection
     * @param {Range} value - Array of two integers that specify beginning and end of range.
     */
    RangeCollection.prototype.remove = function (value) {
        rangeUtils_1.validateRange(value);
        if (value[0] === value[1] || !this.collection.length) {
            return;
        }
        for (var i = 0; i < this.collection.length; i++) {
            var start = this.collection[i][0];
            var end = this.collection[i][1];
            if (start >= value[1]) {
                break;
            }
            if (end <= value[0] || !rangeUtils_1.hasIntersection(value, this.collection[i])) {
                continue;
            }
            if (start >= value[0] && end <= value[1]) {
                var newRange = [value[1] + 1, end];
                if (rangeUtils_1.getRangeLength(newRange) > 1) {
                    this.collection[i][0] = newRange[0];
                }
                else {
                    this.collection.splice(i, 1);
                    i--;
                }
            }
            else if (start < value[0]) {
                if (end <= value[1]) {
                    this.collection[i][1] = value[0];
                }
                else {
                    var newRange = [value[1], this.collection[i][1]];
                    if (rangeUtils_1.getRangeLength(newRange) >= 1) {
                        this.collection.splice(i + 1, 0, newRange);
                    }
                    this.collection[i][1] = value[0];
                }
            }
            else if (start >= value[0]) {
                this.collection[i][0] = value[1];
            }
        }
    };
    /**
     * @return {string} - the list of ranges in the range collection
     * @example [1, 5), [10, 11), [100, 201)
     */
    RangeCollection.prototype.toString = function () {
        return this.collection
            .map(function (range) { return "[" + range[0] + ", " + range[1] + ")"; })
            .join(", ");
    };
    /**
     * Prints into console the list of ranges in the range collection
     */
    RangeCollection.prototype.print = function () {
        // tslint:disable-next-line:no-console
        console.log(this.toString());
    };
    return RangeCollection;
}());
exports.RangeCollection = RangeCollection;
