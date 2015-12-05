var assert = require('assert');
var getRawInput = require('./helpers').getRawInput;
var input = getRawInput(1);

var BUTTON_VECTORS = {
  '(': 1,
  ')': -1,
}

function pressAButton(currentFloor, button) {
  return currentFloor + BUTTON_VECTORS[button];
}

function pressAllButtons(str) {
  return str
    .split('')
    .reduce(pressAButton, 0);
}

assert.equal(pressAllButtons('(())'), 0);
assert.equal(pressAllButtons('()()'), 0);
assert.equal(pressAllButtons('((('), 3);
assert.equal(pressAllButtons('(()(()('), 3);
assert.equal(pressAllButtons('))((((('), 3);
assert.equal(pressAllButtons('())'), -1);
assert.equal(pressAllButtons('))('), -1);
assert.equal(pressAllButtons(')))'), -3);
assert.equal(pressAllButtons(')())())'), -3);

function stepsTo(targetFloor) {
  return function(buttonSequence) {
    return buttonSequence
      .split('')
      .reduce(function(trip, button, index){
        var newFloor = pressAButton(trip.currentFloor, button);
        return {
          currentFloor: newFloor,
          floorReachedAt: trip.floorReachedAt || (newFloor === targetFloor ? index + 1 : 0)
        }
    }, { currentFloor: 0 }).floorReachedAt;
  }
}

assert.equal(stepsTo(-1)(')'), 1);
assert.equal(stepsTo(-1)('()())'), 5);

console.log({
  destination: pressAllButtons(input),
  stepBeforeReachingBasement: stepsTo(-1)(input)
});
