var _ = require('ramda');

var Task = require('data.task')
var fs = require('fs')

// read : String -> Task(Error, Buffer)
function read(path) {
  return new Task(function(reject, resolve) {
    fs.readFile(path, function(error, data) {
      if (error)  reject(error)
      else        resolve(data)
    })
  })
}
// decode : Task(Error, Buffer) -> Task(Error, String)
function decode(buffer) {
  return buffer.map(function(a) {
    return a.toString('utf-8')
  })
}

var intro = decode(read('intro.txt'));
var outro = decode(read('outro.txt'));

var concatenated = intro.chain(function(a) {
                     return outro.map(function(b) {
                       return a + b
                     })
                   })

concatenated.fork(
 function(error) { throw error }
, function(data)  { console.log(data) }
)

// var intro = decode(read('intro.txt')) //.map(_.split('\n')).map(_.head);
//
// console.log(intro);
