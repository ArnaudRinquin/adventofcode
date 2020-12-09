const fs = require("fs");

module.exports = {
  readLinesFromFile(path) {
    const rawData = fs.readFileSync(path).toString();
    return rawData.split("\n");
  },
  parseNumbersFromFile(path) {
    return module.exports
      .readLinesFromFile(path)
      .filter(Boolean)
      .map((str) => parseInt(str, 10));
  },
};
