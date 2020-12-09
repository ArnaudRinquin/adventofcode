const { parseNumbersFromFile } = require("../utils");
const path = require("path");

const exampleNumbers = `35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576`
  .split("\n")
  .map((n) => parseInt(n, 10));

function numberIsValid(numbers, index, preambleSize) {
  for (let a = index - preambleSize; a < index; a++) {
    for (let b = a + 1; b < index; b++) {
      if (numbers[a] + numbers[b] === numbers[index]) {
        return true;
      }
    }
  }
  return false;
}

function spotErrorInXMASMessage(numbers, preambleSize) {
  for (let index = preambleSize; index < numbers.length; index++) {
    if (!numberIsValid(numbers, index, preambleSize)) {
      return numbers[index];
    }
  }

  throw new Error(`Could not find error`);
}

const errorInExample = spotErrorInXMASMessage(exampleNumbers, 5);

if (errorInExample !== 127) {
  throw new Error(`Found a different erroring message: ${errorInExample}`);
}

console.log("Succesfully detected error in example");

const inputNumbers = parseNumbersFromFile(path.join(__dirname, "input"));
const errorInInput = spotErrorInXMASMessage(inputNumbers, 25);

console.log(`Part 1 answer: ${errorInInput}`);

function sortNumbers(a, b) {
  return a - b;
}

function findXMASWakkness(numbers, preambleSize) {
  const error = spotErrorInXMASMessage(numbers, preambleSize);
  console.log(`Error: ${error}`);
  for (let start = 0; start < numbers.length; start++) {
    let sum = numbers[start];
    for (let end = start + 1; end < numbers.length; end++) {
      sum += numbers[end];
      if (sum === error) {
        const contigousAddingToError = numbers
          .slice(start, end)
          .sort(sortNumbers);
        return (
          contigousAddingToError[0] +
          contigousAddingToError[contigousAddingToError.length - 1]
        );
      }
      if (sum > error) {
        break;
      }
    }
  }
  throw new Error(`Didn't find weakness for XMAS`);
}

const weaknessInExample = findXMASWakkness(exampleNumbers, 5);
if (weaknessInExample !== 62) {
  throw new Error(`XMAS Weakness finder is not correct: ${weaknessInExample}`);
}
console.log("Succesfully found weakness in example");

const weaknessInInput = findXMASWakkness(inputNumbers, 25);
console.log(`Part 2 answer: ${weaknessInInput}`);
