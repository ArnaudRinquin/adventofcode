var getRawInput = require('./helpers').getRawInput;
var assert = require('assert');

/* Map being this model:
var map = {
  currentPosition: [3, 4], // x, y
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
    visits: incrementVisits(map.visits, map.currentPosition)
  });
}

function movePositionOnMap(map, direction) {
  return Object.assign({}, map, {
    currentPosition: moveFromPosition(map.currentPosition, direction)
  });
}

function navigateOneStep(map, direction) {
  return incrementVisitsOnMap(movePositionOnMap(map, direction));
}

assert.deepEqual({
  currentPosition: [1, 6],
  visits: {
    '2-6': 1,
    '1-6': 1
  }
}, navigateOneStep(
    navigateOneStep({
      currentPosition: [2, 5],
      visits: {}
    }, '^')
  , '<')
)

function navigateAllSteps(steps) {
  return steps.reduce(navigateOneStep, {
    currentPosition: [0, 0],
    visits: {
      '0-0': 1
    },
  });
}

function countVisitedHouses(state) {
  return Object.keys(state.visits).length;
}

assert.equal(countVisitedHouses(navigateAllSteps('>'.split(''), 1)), 2);
assert.equal(countVisitedHouses(navigateAllSteps('^>v<'.split(''), 1)), 4);
assert.equal(countVisitedHouses(navigateAllSteps('^v^v^v^v^v'.split(''), 1)), 2);

console.log(countVisitedHouses(navigateAllSteps(getRawInput('3').split(''))));
