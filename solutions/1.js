var assert = require('assert');
var getRawInput = require('./helpers').getRawInput;

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

console.log(pressAllButtons(getRawInput(1)));
