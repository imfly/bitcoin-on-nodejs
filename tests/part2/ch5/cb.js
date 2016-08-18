var fs = require('fs');
var _ = require('ramda');
var Task = require('data.task')

//  readFile :: String -> Task(Error, JSON)
var readFile = function(filename) {
  return new Task(function(reject, result) {
    fs.readFile(filename, 'utf-8', function(err, data) {
      err ? reject(err) : result(data);
    });
  });
};

var a = readFile("intro.txt").map(_.split('\n')).map(_.head);

a.fork(
  function(error){ console.log(error.message); },
  function(page){ console.log(page); }
);


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

var intro = decode(read('intro.txt'))
var outro = decode(read('outro.txt'))

// 使用 `.chain` 来进行两个异步行为，使用`.map` 同步运算任务的最终值
var concatenated = intro.chain(function(a) {
                     return outro.map(function(b) {
                       return a + b
                     })
                   })

// 必须使用 `.fork` 来明确执行，错误使用第一个函数抛出，成功就调用第二个函数
concatenated.fork(
  function(error) { throw error },
  function(data)  { console.log(data) }
)
