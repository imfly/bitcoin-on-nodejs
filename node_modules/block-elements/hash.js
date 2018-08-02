var arr = require('./');
var hash = module.exports = Object.create(null);
for (var i = 0; i < arr.length; i++) {
  hash[arr[i]] = true;
  hash[arr[i].toUpperCase()] = true;
}
