const path = require("path");
const { parseNumbersFromFile } = require("../utils");

const testData = [1721, 979, 366, 299, 675, 1456];
const expectedPart1Result = 514579;
const expectedPart2Result = 241861950;

function getPart1Result(testData) {
  for (let i = 0; i < testData.length; i++) {
    const a = testData[i];
    for (let j = i; j < testData.length; j++) {
      const b = testData[j];
      if (a + b === 2020) {
        return a * b;
      }
    }
  }
  throw new Error("Could not find 2 numbers adding up to 2020");
}

function getPart2Result(testData) {
  for (let i = 0; i < testData.length; i++) {
    const a = testData[i];
    for (let j = i; j < testData.length; j++) {
      const b = testData[j];
      for (let k = j; k < testData.length; k++) {
        const c = testData[k];
        if (a + b + c === 2020) {
          return a * b * c;
        }
      }
    }
  }
  throw new Error("Could not find 3 numbers adding up to 2020");
}

const part1testResult = getPart1Result(testData);
if (part1testResult !== expectedPart1Result) {
  throw new Error(`Something off for part 1: ${part1testResult}`);
}

const part2testResult = getPart2Result(testData);
if (part2testResult !== expectedPart2Result) {
  throw new Error(`Something off for part 1: ${part2testResult}`);
}

console.log("Algorithm is valid!");

const cleanedData = parseNumbersFromFile(path.join(__dirname, "input"));

console.log(`Part 1 result: ${getPart1Result(cleanedData)}`);
console.log(`Part 2 result: ${getPart2Result(cleanedData)}`);
