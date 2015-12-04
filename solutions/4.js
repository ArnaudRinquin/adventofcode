var getRawInput = require('./helpers').getRawInput;
var assert = require('assert');
var prefix = getRawInput(4);

var crypto = require('crypto');

var FIVE_ZEROS = '00000';

function startsWithFiveZeros(str) {
  return str.indexOf(FIVE_ZEROS) === 0;
}
assert(startsWithFiveZeros(FIVE_ZEROS));
assert(startsWithFiveZeros(`${FIVE_ZEROS}foobar`));
assert(!startsWithFiveZeros(`foobar${FIVE_ZEROS}`));

function md5(str) {
  return crypto
    .createHash('md5')
    .update(str)
    .digest('hex');
}
assert(startsWithFiveZeros(md5('abcdef609043')));
assert(startsWithFiveZeros(md5('pqrstuv1048970')));
assert(!startsWithFiveZeros(md5('pqrstuv1048970' + 'foobar')));

function md5WithPrefix(prefix) {
    return function digest(str) {
      return md5(`${prefix}${str}`);
    }
}
assert(startsWithFiveZeros(md5WithPrefix('abcdef')(609043)));
assert(!startsWithFiveZeros(md5WithPrefix('abcdef')(609043 + 1)));

function smallerStartingWithFiveZeros(prefix) {
  var number = 0;
  var digest = md5WithPrefix(prefix);
  while (!startsWithFiveZeros(digest(number))) {
    number++;
  }
  return number;
}
assert.equal(smallerStartingWithFiveZeros('abcdef'), 609043);
assert.equal(smallerStartingWithFiveZeros('pqrstuv'), 1048970);

console.log(smallerStartingWithFiveZeros(prefix))
