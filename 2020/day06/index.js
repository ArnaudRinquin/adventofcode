const fs = require("fs");
const path = require("path");

const simpleGroup = `abcx
abcy
abcz`;

function countGroupAnyoneYesAnswers(groupStr) {
  const uniqueAnswers = groupStr
    .replace(/\s+/g, "")
    .split("")
    .reduce((answers, answer) => {
      answers.set(answer, true);
      return answers;
    }, new Map());
  return [...uniqueAnswers.keys()].length;
}

if (countGroupAnyoneYesAnswers(simpleGroup) !== 6) {
  throw new Error(
    `Group answers counting is wrong: ${countGroupAnyoneYesAnswers(
      simpleGroup
    )}`
  );
}

console.log(`Group answers counting: OK`);

const multipleGroups = `
abc

a
b
c

ab
ac

a
a
a
a

b
`;

function splitGroups(raw) {
  return raw.trim().split(`\n\n`);
}

function sum(total, one) {
  return total + one;
}

const totalForMultipleGroups = splitGroups(multipleGroups)
  .map(countGroupAnyoneYesAnswers)
  .reduce(sum);

if (totalForMultipleGroups !== 11) {
  throw new Error(
    `Error counting multiple groups answers: ${totalForMultipleGroups}`
  );
}
console.log("Multiple groups counting: OK");

const input = fs.readFileSync(path.join(__dirname, "input")).toString();

const part1Answer = splitGroups(input)
  .map(countGroupAnyoneYesAnswers)
  .reduce(sum);

console.log(`Part 1 answer: ${part1Answer}`);

function countGroupEveryoneYesAnswers(group) {
  const alwaysYesAnswers = group
    .split(/\s+/)
    .reduce((lettersAlwaysFound, onePersonAnswers) => {
      return lettersAlwaysFound.filter((letter) =>
        onePersonAnswers.includes(letter)
      );
    }, "abcdefghijklmnopqrstuvwxyz".split(""));
  return alwaysYesAnswers.length;
}

const totalEveryoneYesForMultipleGroups = splitGroups(multipleGroups)
  .map(countGroupEveryoneYesAnswers)
  .reduce(sum);

if (totalEveryoneYesForMultipleGroups !== 6) {
  throw new Error(
    `Error counting multiple groups answers: ${totalEveryoneYesForMultipleGroups}`
  );
}

console.log("Counting group answer where everyone said yes: OK");
const part2Answer = splitGroups(input)
  .map(countGroupEveryoneYesAnswers)
  .reduce(sum);

console.log(`Part 2 answer: ${part2Answer}`);
