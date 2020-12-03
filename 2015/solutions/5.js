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

var firstRuleSet = [
  hasDoubledLetter,
  hasThreeVoyels,
  doesNotContainsBadWords,
];

function hasDoubledPair(str) {
  return /(\w\w).*\1/.exec(str);
}

function hasSandwich(str) {
  return /(\w)\w\1/.exec(str);
}

var secondRuleSet = [
  hasDoubledPair,
  hasSandwich,
];

function isNice(ruleCheckers) {
  return function(str) {
    return ruleCheckers.reduce(function(passed, ruleChecker){
      return passed && ruleChecker(str);
    }, true);
  }
}

assert(isNice(firstRuleSet)('ugknbfddgicrmopn'));
assert(isNice(firstRuleSet)('aaa'));
assert(!isNice(firstRuleSet)('jchzalrnumimnmhp'));
assert(!isNice(firstRuleSet)('haegwjzuvuyypxyu'));
assert(!isNice(firstRuleSet)('dvszwmarrgswjxmb'));

assert(isNice(secondRuleSet)('qjhvhtzxzqqjkmpb'));
assert(isNice(secondRuleSet)('xxyxx'));
assert(!isNice(secondRuleSet)('uurcxstgmygtbstg'));
assert(!isNice(secondRuleSet)('ieodomkazucvgmuy'));

function countNiceStrings(strings, ruleCheckers) {
  return strings.map(isNice(ruleCheckers)).reduce(function(niceStringsCount, stringIsNice){
    return stringIsNice ? niceStringsCount + 1 : niceStringsCount;
  }, 0);
}

assert.equal(countNiceStrings([
  'ugknbfddgicrmopn',
  'aaa',
  'jchzalrnumimnmhp',
  'haegwjzuvuyypxyu',
  'dvszwmarrgswjxmb',
], firstRuleSet), 2);

var input = getInputLines(5);
console.log({
  firstRuleSet: countNiceStrings(input, firstRuleSet),
  secondRuleSet: countNiceStrings(input, secondRuleSet),
})
