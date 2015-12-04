var helpers = require('./helpers');
var getInputLines = helpers.getInputLines;
var compose = helpers.compose;
var assert = require('assert');

function toDimensions(str) {
  return {
    dimensions: str.split('x').map(function(dimension) {
      return parseInt(dimension, 10);
    })
  };
}

function extractSurfaces(dimensions) {
  return dimensions.reduce(function(surfaces, dimension, index){
    return surfaces.concat(dimension * dimensions[(index + 1) % dimensions.length]);
  }, []);
}

function addSurfaces(present) {
  return Object.assign({
    surfaces: extractSurfaces(present.dimensions)
  }, present);
}

function sum(total, value) {
    return total + value;
}

function multiply(total, value) {
    return total * value;
}

function double(value) {
    return value * 2;
}

function addTotalSurface(present) {
  return Object.assign({
    totalSurface: present.surfaces
      .map(double)
      .reduce(sum)
  }, present);
}

function sortInts(a, b) {
  return parseInt(a, 10) - parseInt(b, 10);
}

function addPaperSurface(present) {
  return Object.assign({
    paperSurface: present.totalSurface + present.surfaces.sort(sortInts)[0]
  }, present);
}

function getShortestCircumference(dimensions) {
  return dimensions.sort(sortInts).slice(0, 2).reduce(sum) * 2;
}
assert.equal(getShortestCircumference([10, 1, 1]), 4);
assert.equal(getShortestCircumference([2, 3, 4]), 10);

function addRibbonLength(present) {
  return Object.assign({
    ribbonLength: getShortestCircumference(present.dimensions) + present.dimensions.reduce(multiply)
  }, present);
}

var processPresent = compose([
  toDimensions,
  addSurfaces,
  addTotalSurface,
  addPaperSurface,
  addRibbonLength
]);

// test paper surface
assert.equal(processPresent('2x3x4').paperSurface, 58);
// test paper surface
assert.equal(processPresent('1x1x10').ribbonLength, 14);
assert.equal(processPresent('2x3x4').ribbonLength, 34);

var result = getInputLines('2').map(processPresent).reduce(function(result, present){
  return {
    totalPaperSurface: result.totalPaperSurface + present.paperSurface,
    totalRibbonLength: result.totalRibbonLength + present.ribbonLength
  }
}, {totalPaperSurface: 0, totalRibbonLength: 0});

console.log(result);
