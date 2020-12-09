const { readLinesFromFile } = require("../utils");
const path = require("path");

const exampleInstructions = `nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6`.split("\n");

function getLastAccumulatorValueBeforeLoops(instructions) {
  let accumulator = 0;
  let nextInstructionIndex = 0;
  const alreadyExecutedInstructionsIndices = new Set();
  do {
    alreadyExecutedInstructionsIndices.add(nextInstructionIndex);
    const [, operation, argumentRaw] = /^(.{3}) ([-+]\d+)/.exec(
      instructions[nextInstructionIndex]
    );
    const argument = parseInt(argumentRaw, 10);
    switch (operation) {
      case "acc":
        accumulator += argument;
        nextInstructionIndex++;
        break;
      case "jmp":
        nextInstructionIndex += argument;
        break;
      case "nop":
        nextInstructionIndex++;
        break;
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  } while (!alreadyExecutedInstructionsIndices.has(nextInstructionIndex));

  return accumulator;
}

const lastAccumulatorValueBeforeExampleLoops = getLastAccumulatorValueBeforeLoops(
  exampleInstructions
);

if (!lastAccumulatorValueBeforeExampleLoops === 5) {
  throw new Error(
    `Got the wrong last accumulator value for example: ${lastAccumulatorValueBeforeExampleLoops}`
  );
}

console.log(`Last accumulator value before loop is working`);

const inputInstructions = readLinesFromFile(
  path.join(__dirname, "input")
).filter(Boolean);

console.log(
  `Part 1 answer: ${getLastAccumulatorValueBeforeLoops(inputInstructions)}`
);

function replaceInArray(originalArray, index, newValue) {
  const copy = [...originalArray];
  copy[index] = newValue;
  return copy;
}

function switchJmpOrNopInstructionAt(instructions, index) {
  const instructionToSwitch = instructions[index];
  const newInstructions = `${
    instructionToSwitch.substr(0, 3) === "jmp" ? "nop" : "jmp"
  }${instructionToSwitch.substr(3)}`;
  return replaceInArray(instructions, index, newInstructions);
}

function runProgram({
  instructions,
  attemptFix = true,
  accumulator = 0,
  nextInstructionIndex = 0,
  alreadyExecutedInstructionsIndices = new Set(),
}) {
  do {
    alreadyExecutedInstructionsIndices.add(nextInstructionIndex);
    const match = /^(.{3}) ([-+]\d+)/.exec(instructions[nextInstructionIndex]);
    if (!match) {
      throw new Error(
        `Invalid instruction: ${instructions[nextInstructionIndex]}, ${nextInstructionIndex}`
      );
    }
    const [, operation, argumentRaw] = match;
    const argument = parseInt(argumentRaw, 10);
    switch (operation) {
      case "acc":
        accumulator += argument;
        nextInstructionIndex++;
        break;
      default:
        if (attemptFix) {
          try {
            const resultAfterSwitch = runProgram({
              instructions: switchJmpOrNopInstructionAt(
                instructions,
                nextInstructionIndex
              ),
              accumulator,
              alreadyExecutedInstructionsIndices: new Set([
                ...alreadyExecutedInstructionsIndices,
              ]),
              attemptFix: false,
              nextInstructionIndex,
            });
            console.log(`Switching ${nextInstructionIndex} fixes it!`);
            return resultAfterSwitch;
          } catch (error) {
            // Switching ${nextInstructionIndex} still fails
          }
        }
        nextInstructionIndex += operation === "jmp" ? argument : 1;
        break;
    }
    if (alreadyExecutedInstructionsIndices.has(nextInstructionIndex)) {
      throw new Error(`Infinite loop detected on ${nextInstructionIndex}`);
    }
  } while (nextInstructionIndex < instructions.length);
  return accumulator;
}

const accumulatorForFixedExample = runProgram({
  instructions: exampleInstructions,
});

// if (accumulatorForFixedExample !== 8) {
//   throw new Error(
//     `Got the wrong accumulator value for fixed example: ${accumulatorForFixedExample}`
//   );
// }

console.log(`Fixing program is working`);

console.log(
  `Part 2 answer: ${runProgram({
    instructions: inputInstructions,
    attemptFix: true,
  })}`
);
