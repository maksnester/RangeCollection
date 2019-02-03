const RangeCollection = require("./dist").default;
const rc = new RangeCollection();

rc.add([1, 5]);
console.log("Should display: [1, 5)");
rc.print();

rc.add([10, 20]);
console.log("Should display: [1, 5) [10, 20)");
rc.print();

rc.add([20, 20]);
console.log("Should display: [1, 5) [10, 20)");
rc.print();

rc.add([20, 21]);
console.log("Should display: [1, 5) [10, 21)");
rc.print();

rc.add([2, 4]);
console.log("Should display: [1, 5) [10, 21)");
rc.print();

rc.add([3, 8]);
console.log("Should display: [1, 8) [10, 21)");
rc.print();

rc.remove([10, 10]);
console.log("Should display: [1, 8) [10, 21)");
rc.print();

rc.remove([10, 11]);
console.log("Should display: [1, 8) [11, 21)");
rc.print();

rc.remove([15, 17]);
console.log("Should display: [1, 8) [11, 15) [17, 21)");
rc.print();

rc.remove([3, 19]);
console.log("Should display: [1, 3) [19, 21)");
rc.print();
