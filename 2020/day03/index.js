const path = require("path");
const { readLinesFromFile } = require("../utils");
const SLOPS = [
  [1, 1],
  [3, 1],
  [5, 1],
  [7, 1],
  [1, 2],
];
const testData = [
  "..##.......",
  "#...#...#..",
  ".#....#..#.",
  "..#.#...#.#",
  ".#...##..#.",
  "..#.##.....",
  ".#.#.#....#",
  ".#........#",
  "#.##...#...",
  "#...##....#",
  ".#..#...#.#",
];
const expectedPart1ResultBySlop = [2, 7, 3, 4, 2];
const expectedPart2Result = 336;

function countTrees(rows, slopeDownDistance = 1, slopeRightDistance = 3) {
  let columnsCount = rows[0].length;
  let treesFound = 0;
  let columnIndex = 0;
  let rowIndex = 0;

  do {
    const spot = rows[rowIndex][columnIndex];
    const spotHasTree = spot === "#";
    if (spotHasTree) {
      treesFound++;
    }
    // move to next position
    rowIndex = rowIndex + slopeDownDistance;
    columnIndex = (columnIndex + slopeRightDistance) % columnsCount;
  } while (rowIndex < rows.length);

  return treesFound;
}

function countForAllSlopes(rows) {
  return SLOPS.map(([right, down]) => countTrees(rows, down, right)).reduce(
    (totalTrees, treesForSlope) => totalTrees * treesForSlope
  );
}

SLOPS.forEach(([right, down], slopIndex) => {
  const part1testResult = countTrees(testData, down, right);
  if (part1testResult !== expectedPart1ResultBySlop[slopIndex]) {
    throw new Error(
      `Something off for part 1: ${part1testResult} for slop ${right} - ${down}`
    );
  }
});

const part2testResult = countForAllSlopes(testData);
if (part2testResult !== expectedPart2Result) {
  throw new Error(`Something off for part 2: ${part2testResult}`);
}

console.log("Algorithm is valid!");

const cleanedData = readLinesFromFile(path.join(__dirname, "input"));

console.log(`Part 1 result: ${countTrees(cleanedData)}`);
console.log(`Part 2 result: ${countForAllSlopes(cleanedData)}`);
