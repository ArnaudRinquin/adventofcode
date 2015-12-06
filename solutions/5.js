var getInputLines = require('./helpers').getInputLines;
var assert = require('assert');

function hasDoubledLetter(str) {
  return /(\w)\1/.exec(str);
};

function hasThreeVoyels(str) {
  return /(?:[aeiou]\w*){3}/.exec(str);
};

function doesNotContainsBadWords(str) {
  return ! /ab|cd|pq|xy/.exec(str);
};

var ruleCheckers = [
  hasDoubledLetter,
  hasThreeVoyels,
  doesNotContainsBadWords,
];

function isNice(str) {
  return ruleCheckers.reduce(function(passed, ruleChecker){
    return passed && ruleChecker(str);
  }, true);
}

assert(isNice('ugknbfddgicrmopn'));
assert(isNice('aaa'));
assert(!isNice('jchzalrnumimnmhp'));
assert(!isNice('haegwjzuvuyypxyu'));
assert(!isNice('dvszwmarrgswjxmb'));

function countNiceStrings(strings) {
  return strings.map(isNice).reduce(function(niceStringsCount, stringIsNice){
    return stringIsNice ? niceStringsCount + 1 : niceStringsCount;
  }, 0);
}

assert.equal(countNiceStrings([
  'ugknbfddgicrmopn',
  'aaa',
  'jchzalrnumimnmhp',
  'haegwjzuvuyypxyu',
  'dvszwmarrgswjxmb',
]), 2);

console.log({
  niceStringsCount: countNiceStrings(getInputLines(5)),
})
