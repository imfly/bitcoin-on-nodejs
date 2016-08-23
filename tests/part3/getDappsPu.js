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

var privates = match(/privated(.*) = f/g);

// var filter = _.curry(function(f, txt) {
//     return txt.match(f);
// });

// var findAllOf = filter(hasSpaces);

var write =  _.curry(function(path, data, cb) {
    fs.writeFile(path, privates(data), cb);
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
