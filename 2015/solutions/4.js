var getRawInput = require('./helpers').getRawInput;
var assert = require('assert');
var crypto = require('crypto');
var prefix = getRawInput(4);

function allStringIs(targetChart) {
  return function(str) {
    return str.split('').reduce(function(targetChart, stringChar){
      return targetChart === stringChar ? targetChart : false;
    }, targetChart);
  }
}
assert(allStringIs('a')('aaaaaa'));
assert(allStringIs('0')('000000'));
assert(!allStringIs('0')('01000'));

function startsWith(count, char) {
    return function(str) {
      return str.length >= count && allStringIs(char)(str.slice(0, count));
    };
}
assert(startsWith(5, '0')('00000'));
assert(startsWith(2, 'a')('aaaaaaaa'));
assert(!startsWith(5, 'a')('aaa'));
assert(!startsWith(5, 'a')('aabaaa'));

function md5(str) {
  return crypto
    .createHash('md5')
    .update(str)
    .digest('hex');
}
assert(startsWith(5, '0')(md5('abcdef609043')));
assert(startsWith(5, '0')(md5('pqrstuv1048970')));
assert(!startsWith(5, '0')(md5('pqrstuv1048970' + 'foobar')));

function md5WithPrefix(prefix) {
    return function digest(str) {
      return md5(`${prefix}${str}`);
    }
}
assert(startsWith(5, '0')(md5WithPrefix('abcdef')(609043)));
assert(!startsWith(5, '0')(md5WithPrefix('abcdef')(609043 + 1)));

function smallerStartingWith(count, char, prefix) {
  var number = 0;
  var digest = md5WithPrefix(prefix);
  while (!startsWith(count, char)(digest(number))) {
    number++;
  }
  return number;
}
assert.equal(smallerStartingWith(5, '0', 'abcdef'), 609043);
assert.equal(smallerStartingWith(5, '0', 'pqrstuv'), 1048970);

console.log([5, 6].reduce(function(result, charCount){
  return Object.assign({}, result, {
    [`with${charCount}Zeros`]: smallerStartingWith(charCount, '0', prefix)
  })
}, {}));
