const { readLinesFromFile } = require("../utils");
const path = require("path");

const exampleRules = `light red bags contain 1 bright white bag, 2 muted yellow bags.
dark orange bags contain 3 bright white bags, 4 muted yellow bags.
bright white bags contain 1 shiny gold bag.
muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
dark olive bags contain 3 faded blue bags, 4 dotted black bags.
vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
faded blue bags contain no other bags.
dotted black bags contain no other bags.`;
function reduceContainersBagRules(rulesMap, ruleStr) {
  const [parentColor, childrenStrs] = ruleStr.split(" bags contain ");
  childrenStrs.split(", ").forEach((str) => {
    const match = /(\d+)\s([a-z]+ [a-z]+)/.exec(str);
    if (match) {
      const [, count, childColor] = match;
      const colorsContainersMap = rulesMap.get(childColor) || new Map();
      colorsContainersMap.set(parentColor, parseInt(count, 10));
      rulesMap.set(childColor, colorsContainersMap);
    }
  });

  return rulesMap;
}

const rulesMap = exampleRules
  .split("\n")
  .reduce(reduceContainersBagRules, new Map());
console.dir(rulesMap);

function getPossibleContainerForBag(rulesMap, bagColor) {
  const resultSet = new Set();
  function pushContainersForBag(color) {
    const possibleContainersMap = rulesMap.get(color);
    if (!possibleContainersMap) {
      return [];
    }
    [...possibleContainersMap.keys()].forEach((color) => {
      resultSet.add(color);
      pushContainersForBag(color);
    });
  }

  pushContainersForBag(bagColor);

  return resultSet;
}

const shinyGoldContainersInTestData = getPossibleContainerForBag(
  rulesMap,
  "shiny gold"
);

if (shinyGoldContainersInTestData.size !== 4) {
  throw new Error(
    `Something wrong with possible containers counting: ${shinyGoldContainersInTestData.length}`
  );
}
console.log(`Got container counting right, running it on input...`);

const inputLines = readLinesFromFile(path.join(__dirname, "input")).filter(
  Boolean
);
const inputRules = inputLines.reduce(reduceContainersBagRules, new Map());
const shinyGoldContainersInInput = getPossibleContainerForBag(
  inputRules,
  "shiny gold"
);

console.log(`Part 1 answer: ${shinyGoldContainersInInput.size}`);

function reduceContainsMap(rulesMap, ruleStr) {
  const [parentColor, childrenStrs] = ruleStr.split(" bags contain ");
  rulesMap.set(
    parentColor,
    childrenStrs.split(", ").reduce((colorMap, str) => {
      const match = /(\d+)\s([a-z]+ [a-z]+)/.exec(str);
      if (match) {
        const [, count, childColor] = match;
        colorMap.set(childColor, parseInt(count, 10));
        return colorMap;
      }
      return null;
    }, new Map())
  );
  return rulesMap;
}

const testContainersMap = exampleRules
  .split("\n")
  .reduce(reduceContainsMap, new Map());

console.dir(testContainersMap);

function getCostOfBag(containersMap, color, isTopBag = true) {
  const childrenMap = containersMap.get(color);
  if (!childrenMap) {
    return isTopBag ? 0 : 1;
  }

  return [...childrenMap.keys()].reduce(
    (sumOfChildren, childColor) => {
      const count = childrenMap.get(childColor);
      const costForChildren =
        count * getCostOfBag(containersMap, childColor, false);
      console.log(`Cost of ${count} ${childColor}: ${costForChildren}`);
      return sumOfChildren + costForChildren;
    },
    isTopBag ? 0 : 1
  );
}

const exampleCostOfShinyGold = getCostOfBag(testContainersMap, "shiny gold");
if (exampleCostOfShinyGold !== 32) {
  throw new Error(
    `Wrong cost for siny gold in example: ${exampleCostOfShinyGold}`
  );
}

console.log(`Got right cost for shiny gold in first example`);

const secondExample = `shiny gold bags contain 2 dark red bags.
dark red bags contain 2 dark orange bags.
dark orange bags contain 2 dark yellow bags.
dark yellow bags contain 2 dark green bags.
dark green bags contain 2 dark blue bags.
dark blue bags contain 2 dark violet bags.
dark violet bags contain no other bags.`;

const secondExampleContainersMap = secondExample
  .split("\n")
  .reduce(reduceContainsMap, new Map());

const secondExampleCostOfShinyGold = getCostOfBag(
  secondExampleContainersMap,
  "shiny gold"
);
if (secondExampleCostOfShinyGold !== 126) {
  throw new Error(
    `Wrong cost for siny gold in example: ${secondExampleCostOfShinyGold}`
  );
}

console.log(`Got right cost for shiny gold in second example`);

const containersMapForInput = inputLines.reduce(reduceContainsMap, new Map());
const shinyBagCostForInput = getCostOfBag(containersMapForInput, "shiny gold");

console.log(`Part 2 answer: ${shinyBagCostForInput}`);
