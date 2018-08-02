var blocks = require('./');
module.exports = new Set(blocks.concat(blocks.map(function (n) {
  return n.toUpperCase();
})));
