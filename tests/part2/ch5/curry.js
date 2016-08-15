var curry = require('lodash').curry;

var match = curry(function(what, str) {
  return str.match(what);
});

var a = match(/\s+/g, "hello world");
// [ ' ' ]

var b = match(/\s+/g)("hello world");
// [ ' ' ]

var hasSpaces = match(/\s+/g);
// function(x) { return x.match(/\s+/g) }

var c = hasSpaces("hello world");
// [ ' ' ]

var d = hasSpaces("spaceless");
// null

var filter = curry(function(f, ary) {
  return ary.filter(f);
});

var e = filter(hasSpaces, ["tori_spelling", "tori amos"]);
// ["tori amos"]


console.log(a);
console.log(b);
console.log(c);
console.log(d);
console.log(e);
