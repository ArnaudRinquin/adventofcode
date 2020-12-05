const path = require("path");
const { readLinesFromFile } = require("../utils");

const testData = [
  ["BFFFBBFRRR", 567],
  ["FFFBBBFRRR", 119],
  ["BBFFBBFRLL", 820],
];

function decodeSeatId(code) {
  const match = /^([FB]{7})([LR]{3})$/.exec(code);
  const [, rowStr, columnStr] = match;
  const row = parseInt(rowStr.replace(/F/g, "0").replace(/B/g, "1"), 2);
  const column = parseInt(columnStr.replace(/R/g, "1").replace(/L/g, "0"), 2);
  return row * 8 + column;
}

if (!testData.every(([code, seatId]) => decodeSeatId(code) === seatId)) {
  throw new Error(`Seat it not properly decoded`);
}

function getMax(values) {
  return values.reduce((maxValue, value) => Math.max(maxValue, value));
}
const inputLines = readLinesFromFile(path.join(__dirname, "input"));
const seatIDs = inputLines.filter(Boolean).map(decodeSeatId);
const maxSeatIDInInput = getMax(seatIDs);
console.log(`Max seat ID in input: ${maxSeatIDInInput}`);

const sortedSeatIds = seatIDs.sort((a, b) => a - b);
const firstSeatId = sortedSeatIds[0];
for (let i = 0; i < sortedSeatIds.length; i++) {
  const expectedSeatId = firstSeatId + i;
  const seatId = sortedSeatIds[i];
  if (expectedSeatId !== seatId) {
    console.log(`My seat ID is: ${expectedSeatId}`);
    break;
  }
}
