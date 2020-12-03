var getRawInput = require('./helpers').getRawInput;
var assert = require('assert');

/* Map being this model:
var map = {
  runners: [
    [3, 4], // Santa x, y,
    [4, 5], // Bot 1
  ],
  nextRunner: 0,
  visits: {
    '3-4': 1
  },
}

/*
          [0, 1]
             ^
             |
[-1, 0] < ---|-- > [1, 0]
             |
             v
          [0, -1]
*/
var MOVES = {
  '^': [0, 1],
  'v': [0, -1],
  '<': [-1, 0],
  '>': [1, 0],
}

function sum(a, b) {
  return a + b;
}

function zip(concatValues) {
  return function(array1, array2) {
    return array1.reduce(function(zipped, value1, index){
      return zipped.concat(concatValues(value1, array2[index]));
    }, []);
  }
}

function moveFromPosition(position, direction) {
  return zip(sum)(position, MOVES[direction])
}

assert.deepEqual(
  [1, 1],
  moveFromPosition(moveFromPosition([0, 0], '^'), '>' )
);

assert.deepEqual(
  [-1, -1],
  moveFromPosition(moveFromPosition([0, 0], 'v'), '<' )
);

function getKeyForPosition(pos) {
  return `${pos[0]}-${pos[1]}`;
};

function incrementVisits(visits, position) {
  return Object.assign({}, visits, {
    [getKeyForPosition(position)]: (visits[getKeyForPosition(position)] || 0) + 1
  });
}

assert.deepEqual(
  incrementVisits(
    incrementVisits(
      incrementVisits({}, [0, 0])
    , [0, 0])
  , [2, 3])
, {
  '0-0': 2,
  '2-3': 1
});

function incrementVisitsOnMap(map) {
  return Object.assign({}, map, {
    visits: incrementVisits(map.visits, map.runners[map.nextRunner]),
    nextRunner: (map.nextRunner + 1) % map.runners.length
  });
}

function immutableUpdate(array, index, value) {
  return array.slice(0, index)
    .concat([value])
    .concat(array.slice(index + 1))
};

var testArray = [0, 1, 2, 3, 4, 5];
assert.deepEqual([10, 1, 2, 3 ,4, 5], immutableUpdate(testArray, 0, 10));
assert.deepEqual([0, 1, 10, 3 ,4, 5], immutableUpdate(testArray, 2, 10));
assert.deepEqual([0, 1, 2, 3 ,4, 10], immutableUpdate(testArray, 5, 10));
assert.deepEqual([0, 1, 2, 3 ,4, 5, 10], immutableUpdate(testArray, 6, 10));
assert.deepEqual([0, 1, 2, 3 ,4, 5, 10], immutableUpdate(testArray, 7, 10));

function movePositionOnMap(map, direction) {
  var result = Object.assign({}, map, {
    runners: immutableUpdate(
      map.runners,
      map.nextRunner,
      moveFromPosition(map.runners[map.nextRunner], direction))
  });
  return result;
}

function navigateOneStep(map, direction) {
  return incrementVisitsOnMap(movePositionOnMap(map, direction));
}

assert.deepEqual({
  runners: [
    [3, 6],
    [9, 19],
  ],
  nextRunner: 0,
  visits: {
    '2-6': 1,
    '9-20': 1,
    '3-6': 1,
    '9-19': 1
  }
}, navigateOneStep(
    navigateOneStep(
      navigateOneStep(
        navigateOneStep({
          runners: [
            [2, 5],
            [10, 20]
          ],
          nextRunner: 0,
          visits: {}
        }, '^')
      , '<')
    , '>')
  , 'v')
)

function generateStartingPositions(runners) {
  var positions = [];
  for (var i = 0 ; i < runners; i++) {
    positions[i] = [0, 0];
  }
  return positions;
}

function navigateAllSteps(steps, runnerCount) {
  return steps.reduce(navigateOneStep, {
    visits: {
      '0-0': 1
    },
    nextRunner: 0,
    runners: generateStartingPositions(runnerCount),
  });
}

function countVisitedHouses(state) {
  return Object.keys(state.visits).length;
}

assert.equal(countVisitedHouses(navigateAllSteps('>'.split(''), 1)), 2);
assert.equal(countVisitedHouses(navigateAllSteps('^>v<'.split(''), 1)), 4);
assert.equal(countVisitedHouses(navigateAllSteps('^v^v^v^v^v'.split(''), 1)), 2);

assert.equal(countVisitedHouses(navigateAllSteps('^v'.split(''), 2)), 3);
assert.equal(countVisitedHouses(navigateAllSteps('^>v<'.split(''), 2)), 3);
assert.equal(countVisitedHouses(navigateAllSteps('^v^v^v^v^v'.split(''), 2)), 11);

var input = getRawInput(3).split('');

console.log([1, 2].reduce(function(results, runnerCount){
  return Object.assign({}, results, {
    [`${runnerCount}-people`]: countVisitedHouses(navigateAllSteps(input, runnerCount))
  });
}, {}));
