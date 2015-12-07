var deepFreeze = require('deep-freeze-node');
var getInputLines = require('./helpers').getInputLines;
var assert = require('assert');

var oneToThreeDigits = '(\\d{1,3})';
var coords = `${oneToThreeDigits},${oneToThreeDigits}`;
var coordsPair = `${coords} through ${coords}`

var toggle = new RegExp(`toggle ${coordsPair}`);
var turnOn = new RegExp(`turn on ${coordsPair}`);
var turnOff = new RegExp(`turn off ${coordsPair}`);

assert(toggle.exec('toggle 0,200 through 10,400'));
assert(turnOff.exec('turn off 0,200 through 10,400'));
assert(turnOn.exec('turn on 0,200 through 10,400'));

assert(!turnOff.exec('toggle 0,200 through 10,400'));
assert(!turnOn.exec('turn off 0,200 through 10,400'));
assert(!toggle.exec('turn on 0,200 through 10,400'));

assert(!turnOn.exec('toggle 0,200 through 10,400'));
assert(!toggle.exec('turn off 0,200 through 10,400'));
assert(!turnOff.exec('turn on 0,200 through 10,400'));

var size = 1000;

var instructions = [
  toggle,
  turnOn,
  turnOff,
];

function parseInstruction(instructionAsString) {
  return instructions.reduce(function(matchingIntruction, instruction){
    if (matchingIntruction) return matchingIntruction;
    var match = instruction.exec(instructionAsString);
    if (match) {
      return {
        instruction: instruction,
        begin: {
          row: parseInt(match[1], 10),
          column: parseInt(match[2], 10),
        },
        end: {
          row: parseInt(match[3], 10),
          column: parseInt(match[4], 10),
        }
      }
    }
  }, false);
}

assert.deepEqual(parseInstruction('toggle 0,200 through 10,400'), {
  instruction: toggle,
  begin: { row: 0, column: 200, },
  end: { row: 10, column: 400, },
});
assert.deepEqual(parseInstruction('turn on 0,0 through 999,999'), {
  instruction: turnOn,
  begin: { row: 0, column: 0, },
  end: { row: 999, column: 999, },
});
assert.deepEqual(parseInstruction('turn off 990,990 through 999,999'), {
  instruction: turnOff,
  begin: { row: 990, column: 990, },
  end: { row: 999, column: 999, },
});

// unlike Array.proendtype.slice, `end` is included in the range and will be updated
function mutationFreeArrayRangeUpdate(updateFn, begin, end, array) {
  return array.slice(0, begin)
    .concat(array.slice(begin, end + 1).map(updateFn))
    .concat(array.slice(end + 1));
}

var zeroToSix = [0, 1, 2, 3, 4, 5, 6];
deepFreeze(zeroToSix);
function increment(i) {
  return i + 1
}
assert.deepEqual(mutationFreeArrayRangeUpdate(increment, 0, 6, zeroToSix), [1, 2, 3, 4, 5, 6, 7]);
assert.deepEqual(mutationFreeArrayRangeUpdate(increment, 2, 4, zeroToSix), [0, 1, 3, 4, 5, 5, 6]);

function switchLight(instruction, lightIsOn) {
  switch (instruction) {
    case toggle: return !lightIsOn;
    case turnOn: return true;
    case turnOff: return false;
  }
}
assert.equal(switchLight(toggle, true), false);
assert.equal(switchLight(toggle, false), true);
assert.equal(switchLight(turnOn, true), true);
assert.equal(switchLight(turnOn, false), true);
assert.equal(switchLight(turnOff, true), false);
assert.equal(switchLight(turnOff, false), false);

function updateLine(instruction, begin, end, line) {
  return mutationFreeArrayRangeUpdate(switchLight.bind(null, instruction), begin, end, line);
}
assert.deepEqual(
  updateLine(toggle, 0, 5, deepFreeze([true, false, true, false, true, false])),
  [false, true, false, true, false, true]
);

function generateSquareGrid(size, value) {
  var grid = [];
  for (var rows = 0; rows < size; rows++) {
    grid[rows] = [];
    for (var columns = 0; columns < size; columns++) {
      grid[rows][columns] = value;
    }
  }
  return grid;
}
var smallSquareGrid = deepFreeze(generateSquareGrid(3, true));
assert.equal(smallSquareGrid[0][0], true);
assert.equal(smallSquareGrid[2][2], true);
assert.equal(smallSquareGrid[3], undefined);
assert.equal(smallSquareGrid[2][3], undefined);

function updateGrid(instruction, begin, end, grid) {
  return mutationFreeArrayRangeUpdate(
    updateLine.bind(null, instruction, begin.column, end.column),
    begin.row,
    end.row,
    grid
  );
}

assert.deepEqual(
  updateGrid(turnOff, {row: 1, column: 1}, {row: 2, column: 2}, smallSquareGrid),
  [
    [true, true, true],
    [true, false, false],
    [true, false, false],
  ]
);

function followInstructionString(grid, instructionString) {
  var details = parseInstruction(instructionString);
  return updateGrid(details.instruction, details.begin, details.end, grid);
}

assert.deepEqual(
  followInstructionString(smallSquareGrid, 'toggle 0,0 through 1,2'),
  [
    [false, false, false],
    [false, false, false],
    [true, true, true],
  ]
);

function countLightsOn(grid) {
  return grid.reduce(function(gridTotal, line) {
    return gridTotal + line.reduce(function(lineTotal, light) {
      if (light) {
        return lineTotal + 1;
      }
      return lineTotal;
    }, 0);
  }, 0);
}

assert.equal(countLightsOn([[]]), 0);
assert.equal(countLightsOn([[false, true], [true, false]]), 2);

var input = getInputLines(6);
var thousandByThousandGrid = deepFreeze(generateSquareGrid(1000, false));

console.log(countLightsOn(input.reduce(followInstructionString, thousandByThousandGrid)));
