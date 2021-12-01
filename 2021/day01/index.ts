import * as path from "path";
import { parseNumbersFromFile } from "../utils";

const testInput = [199, 200, 208, 210, 200, 207, 240, 269, 260, 263];
const input = parseNumbersFromFile(path.join(__dirname, "input"));
const part1ExpectedResult = 7;

function countIncreases(input: number[]) {
  return input.reduce(function (count, number, index) {
    const previousNumber = input[index - 1];
    if (!previousNumber) {
      return count;
    }
    return number > previousNumber ? count + 1 : count;
  }, 0);
}

const part1Result = countIncreases(testInput);
if (part1Result !== part1ExpectedResult) {
  throw new Error(`Invalid result for part 1:${part1Result}`);
}

console.log("Valid result for part 1");
console.log(`Part 1 answer: ${countIncreases(input)}`);

function get3MeasurementsWindows(input: number[]) {
  return input.reduce(function (windows, number, index) {
    const previousPrevious = input[index - 2];
    const previous = input[index - 1];
    if (isNaN(previous) || isNaN(previousPrevious)) {
      return windows;
    }
    return [...windows, previousPrevious + previous + number];
  }, []);
}

const expectedWindowsForTestInput = [607, 618, 618, 617, 647, 716, 769, 792];

const windowsForTestInput = get3MeasurementsWindows(testInput);
for (let i = 0; i < expectedWindowsForTestInput.length; i++) {
  const expected = expectedWindowsForTestInput[i];
  const actual = windowsForTestInput[i];
  if (actual !== expected) {
    console.error(actual, expected);
    throw new Error("Wrong window");
  }
}

console.log("Valid 3 measurement windows calculations");

const threeMeasurementsIncreasesForTest = countIncreases(
  get3MeasurementsWindows(testInput)
);
const expectedThreeMeasurementIncreaseCount = 5;

if (
  threeMeasurementsIncreasesForTest !== expectedThreeMeasurementIncreaseCount
) {
  throw new Error(
    `Invalid result for 3 measurements increase count: ${threeMeasurementsIncreasesForTest}`
  );
}

console.log("Valid measurement for windowed increases");

console.log(`Part 2 answer: ${countIncreases(get3MeasurementsWindows(input))}`);
