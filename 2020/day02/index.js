const path = require("path");
const { readLinesFromFile } = require("../utils");

const testData = ["1-3 a: abcde", "1-3 b: cdefg", "2-9 c: ccccccccc"];
const expectedPart1Result = 2;
const expectedPart2Result = 1;

function getPart1Result(testData) {
  const validRows = testData.filter((line) => {
    const match = /(\d+)-(\d+) ([a-z]): (.*)/.exec(line);
    if (!match) {
      return false;
    }
    const [, min, max, limitedCharacter, password] = match;

    const count = password.split("").filter((char) => char === limitedCharacter)
      .length;

    const valid = count <= parseInt(max, 10) && count >= parseInt(min, 10);
    return valid;
  });
  return validRows.length;
}

function getPart2Result(testData) {
  const validRows = testData.filter((line) => {
    const match = /(\d+)-(\d+) ([a-z]): (.*)/.exec(line);
    if (!match) {
      return false;
    }
    const [, pos1, pos2, searchedCharacter, password] = match;

    const foundAtPos1 = password[pos1 - 1] === searchedCharacter;
    const foundAtPos2 = password[pos2 - 1] === searchedCharacter;
    const valid = (foundAtPos1 || foundAtPos2) && !(foundAtPos1 && foundAtPos2);

    return valid;
  });
  return validRows.length;
}

const part1testResult = getPart1Result(testData);
if (part1testResult !== expectedPart1Result) {
  throw new Error(`Something off for part 1: ${part1testResult}`);
}

const part2testResult = getPart2Result(testData);
if (part2testResult !== expectedPart2Result) {
  throw new Error(`Something off for part 2: ${part2testResult}`);
}

console.log("Algorithm is valid!");

const cleanedData = readLinesFromFile(path.join(__dirname, "input"));

console.log(`Part 1 result: ${getPart1Result(cleanedData)}`);
console.log(`Part 2 result: ${getPart2Result(cleanedData)}`);
