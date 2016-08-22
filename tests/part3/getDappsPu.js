var fs = require('fs');
var _ = require('ramda');

var imPure = {
  read: function(path, cb) {
    fs.readFile(path, 'utf8', cb);
  },

  write: _.curry(function(path, cb, data) {
    fs.writeFile(path, data, cb);
  })
}

var getFile = _.compose(imPure.read, function (file) {
    return file;
});

var setFile = imPure.write('dapps.pu', console.log('Saved!'));

var generatePu = _.compose(setFile, getFile)

generatePu('./dapps.js');

console.log('Ok');
