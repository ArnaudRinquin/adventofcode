import * as fs from "fs";

export function readLinesFromFile(path: string) {
  const rawData = fs.readFileSync(path).toString();
  return rawData.split("\n");
}
export function parseNumbersFromFile(path: string) {
  return readLinesFromFile(path)
    .filter(Boolean)
    .map((str) => parseInt(str, 10));
}
