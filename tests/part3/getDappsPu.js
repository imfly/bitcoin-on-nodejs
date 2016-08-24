var fs = require('fs');
var _ = require('ramda');
var Task = require('data.task');

// read : String -> Task(Error, Buffer)
function read(path) {
    return new Task(function(reject, resolve) {
        fs.readFile(path, 'utf8', function(error, data) {
            if (error) reject(error)
            else resolve(data)
        })
    })
}

// decode : Task(Error, Buffer) -> Task(Error, String)
function decode(buffer) {
    return buffer.map(function(a) {
        return a.toString('utf-8')
    })
}

var trace = _.curry(function(tag, x) {
    console.log(tag, x);
    return x;
});

var file = function(file) {
    return file;
};

var match = _.curry(function(what, str) {
    console.log(str.match(what));
    return str.match(what);
});

var filter = _.curry(function(f, ary) {
  return _.map(f, ary);
});

var replace = _.curry(function (r, s, str) {
  return _.replace(r, s, str)
})

var privates = match(/privated(.[a-zA-Z]*) = /g);
var methodName = match(/\.[a-zA-Z]*/g);
var replaceWith_ = replace(/\./, '-');

var findAllOf = filter(methodName);
// var findAll = filter(replaceWith_);

var write = _.curry(function(path, data, cb) {
    var p = privates(data);
    var formatData = findAllOf(p);

    var fData = _.map(function (d) {
      console.log(d);
      return _.replace(/\./, '-', d); //replaceWith_(formatData);
    }, formatData);
    fs.writeFile(path, fData, cb);
})

var getFile = _.compose(decode, read, file);

getFile('./dapps.js').fork(
    function(error) {
        throw error
    },

    function(data) {
        var setFile = write('dapps.pu');
        setFile(data, function() {
            console.log('Saved!');
        });
    }
)
