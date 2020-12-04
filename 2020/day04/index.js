const path = require("path");
const fs = require("fs");

const isDefined = (value) => value != null;
const passportAttrRules = [
  ["byr", isDefined],
  ["iyr", isDefined],
  ["eyr", isDefined],
  ["hgt", isDefined],
  ["hcl", isDefined],
  ["ecl", isDefined],
  ["pid", isDefined],
];

function isYears(value) {
  return /^\d{4}$/.test(value);
}

const passportAttrComplexeRules = [
  [
    "byr",
    (value) => {
      if (!isYears(value)) {
        return false;
      }
      const birthDate = parseInt(value, 10);
      return birthDate >= 1920 && birthDate <= 2002;
    },
  ],
  [
    "iyr",
    (value) => {
      if (!isYears(value)) {
        return false;
      }
      const issueYear = parseInt(value, 10);
      return issueYear >= 2010 && issueYear <= 2020;
    },
  ],
  [
    "eyr",
    (value) => {
      if (!isYears(value)) {
        return false;
      }
      const expiration = parseInt(value, 10);
      return expiration >= 2020 && expiration <= 2030;
    },
  ],
  [
    "hgt",
    (value) => {
      const match = /^(\d+)(in|cm)$/.exec(value);
      if (!match) {
        return false;
      }
      const [, sizeRaw, unit] = match;
      const size = parseInt(sizeRaw, 10);
      switch (unit) {
        case "cm":
          return size >= 150 && size <= 193;
        case "in":
          return size >= 59 && size <= 76;
        default:
          throw new Error(`Unknown unit ${unit}`);
      }
    },
  ],
  ["hcl", (value) => /^#[0-9a-f]{6}$/.test(value)],
  [
    "ecl",
    (value) =>
      ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].includes(value),
  ],
  ["pid", (value) => /^\d{9}$/.test(value)],
];

const testData = `
ecl:gry pid:860033327 eyr:2020 hcl:#fffffd
byr:1937 iyr:2017 cid:147 hgt:183cm

iyr:2013 ecl:amb cid:350 eyr:2023 pid:028048884
hcl:#cfa07d byr:1929

hcl:#ae17e1 iyr:2013
eyr:2024
ecl:brn pid:760753108 byr:1931
hgt:179cm

hcl:#cfa07d eyr:2025 pid:166559648
iyr:2011 ecl:brn hgt:59in
`;
const expectedPart1Result = 2;

const validPassports = `
pid:087499704 hgt:74in ecl:grn iyr:2012 eyr:2030 byr:1980
hcl:#623a2f

eyr:2029 ecl:blu cid:129 byr:1989
iyr:2014 pid:896056539 hcl:#a97842 hgt:165cm

hcl:#888785
hgt:164cm byr:2001 iyr:2015 cid:88
pid:545766238 ecl:hzl
eyr:2022

iyr:2010 hgt:158cm hcl:#b6652a ecl:blu byr:1944 eyr:2021 pid:093154719
`;

const invalidPassports = `eyr:1972 cid:100
hcl:#18171d ecl:amb hgt:170 pid:186cm iyr:2018 byr:1926

iyr:2019
hcl:#602927 eyr:1967 hgt:170cm
ecl:grn pid:012533040 byr:1946

hcl:dab227 iyr:2012
ecl:brn hgt:182cm pid:021572410 eyr:2020 byr:1992 cid:277

hgt:59cm ecl:zzz
eyr:2038 hcl:74454a iyr:2023
pid:3556412378 byr:2007`;

function parsePassportString(passportString) {
  // xxx:sss yyy:eee
  return passportString
    .split(/\s+/)
    .filter(Boolean)
    .reduce((passportAttrs, attributeString) => {
      // xxx:sss
      const [attrName, attrValue] = attributeString.split(":");
      return {
        ...passportAttrs,
        [attrName]: attrValue,
      };
    }, {});
}

function validatePassport(passport, passportRules) {
  return passportRules.every(([attrName, attrValidator]) => {
    const value = passport[attrName];
    return attrValidator(value);
  });
}

function countValidPassword(rawPassport, passportAttrRules) {
  return rawPassport
    .split(`\n\n`)
    .map(parsePassportString)
    .filter((passport) => validatePassport(passport, passportAttrRules)).length;
}

if (countValidPassword(testData, passportAttrRules) !== expectedPart1Result) {
  throw new Error(`Something is off with password validation`);
}

if (countValidPassword(validPassports, passportAttrComplexeRules) !== 4) {
  throw new Error(`Something is off with password validation`);
}
if (countValidPassword(invalidPassports, passportAttrComplexeRules) !== 0) {
  throw new Error(`Something is off with password invalidation`);
}

console.log("Algorithm is valid!");

const cleanedData = fs.readFileSync(path.join(__dirname, "input")).toString();

console.log(
  `Part 1 result: ${countValidPassword(cleanedData, passportAttrRules)}`
);
console.log(
  `Part 2 result: ${countValidPassword(cleanedData, passportAttrComplexeRules)}`
);
