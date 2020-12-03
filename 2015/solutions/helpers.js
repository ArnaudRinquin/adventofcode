var fs = require('fs');
var path = require('path');

var helpers = module.exports = {
  getRawInput: function getInputLines(inputIndex) {
    return fs.readFileSync(path.join(__dirname, '../inputs/' + inputIndex + '.txt')).toString();
  },
  getInputLines: function getInputLines(inputIndex) {
    return helpers.getRawInput(inputIndex).split('\n');
  },
  compose: function compose(functions) {
    return function composed(initialValue) {
      return functions.reduce(function applyFn(value, fn){
        return fn(value);
      }, initialValue);
    }
  }
}
