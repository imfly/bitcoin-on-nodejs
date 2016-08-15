进行中...

# 使用Javascript进行函数式编程

## 前言

虽然大家已经被面向对象编程（Object-oriented programing）洗脑了，但很明显这种编程方式在 JavaScript 里非常笨拙，这种语言里没有类可以用，社区采取的变通方法不下三种，还要应对忘记调用 `new` 关键字后的怪异行为，真正的私有成员只能通过闭包（closure）才能实现，而多数情况，就像我们在亿书代码里那样，把私有方法放在一个privated变量里，视觉上区分一下而已，本质上并非私有方法。对大多数人来说，函数式编程看起来才更加自然。而且，在Nodejs的世界里，大量的回调函数是数据驱动的，使用函数式编程更加容易理解和处理。

函数式编程远远没有面向对象编程普及，本篇文章借鉴了几篇优秀文档（见参考），结合亿书项目实践和个人体会，汇总了一些平时用得到的函数式编程思路，为更好的优化设计亿书做好准备。本篇内容包括函数式编程基本概念，主要特点和编码方法，其中的一些代码实例主要参考了 《mostly adequate guide》和 lodash 的相关代码，参考里也提供了它们的链接，向这个领域的作者、译者和开发者们致敬。

## 什么是函数式编程？

简单说，“函数式编程”与“面向对象编程”一样，都是一种编写程序的方法论。它属于 “[结构化编程][]” 的一种，主要思想是以数据为思考对象，以功能为基本单元，把程序尽量写成一系列嵌套的函数调用。

下面，我们就从一个简单的例子开始，来体会其中的奥妙和优势。这个例子来自于[mostly-adequate-guide][]，作者说这是一个愚蠢的例子，并不是面向对象的良好实践，它只是强调当前这种变量赋值方式的一些弊端。这是一个海鸥程序，鸟群合并则变成了一个更大的鸟群，繁殖则增加了鸟群的数量，增加的数量就是它们繁殖出来的海鸥的数量。

（1）面向对象编码方式

```js
var Flock = function(n) {
  this.seagulls = n;
};

Flock.prototype.conjoin = function(other) {
  this.seagulls += other.seagulls;
  return this;
};

Flock.prototype.breed = function(other) {
  this.seagulls = this.seagulls * other.seagulls;
  return this;
};

var flock_a = new Flock(4);
var flock_b = new Flock(2);
var flock_c = new Flock(0);

var result = flock_a.conjoin(flock_c).breed(flock_b).conjoin(flock_a.breed(flock_b)).seagulls;
//=> 32
```

按照正常的面向对象语言的编码风格，上面的代码好像没有什么错误，但运行结果却是错误的，正确答案是 `16`，是因为 `flock_a` 的状态值`seagulls`在运算过程中不断被改变。别的先不说，如果`flock_a`的状态保持始终不变，结果就不会错误。

这类代码的内部可变状态非常难以追踪，出现这类看似正常，实则错误的代码，对整个程序是致命的。

（2）函数式编程方式

```js
var conjoin = function(flock_x, flock_y) { return flock_x + flock_y };
var breed = function(flock_x, flock_y) { return flock_x * flock_y };

var flock_a = 4;
var flock_b = 2;
var flock_c = 0;

var result = conjoin(breed(flock_b, conjoin(flock_a, flock_c)), breed(flock_a, flock_b));
//=>16
```

先不用考虑其他场景，至少就这个例子而言，这种写法简洁优雅多了。从数据角度考虑，逻辑简单直接，不过是简单的加（`conjoin`）和乘（`breed`）运算而已。

（3）函数式编程的延伸

函数名越直白越好，改一下：

```js
var add = function(x, y) { return x + y };
var multiply = function(x, y) { return x * y };

var flock_a = 4;
var flock_b = 2;
var flock_c = 0;

var result = add(multiply(flock_b, add(flock_a, flock_c)), multiply(flock_a, flock_b));
//=>16
```

这么一来，你会发现我们还能运用小学都学过的运算定律：

```js
// 结合律
add(add(x, y), z) == add(x, add(y, z));

// 交换律
add(x, y) == add(y, x);

// 同一律
add(x, 0) == x;

// 分配律
multiply(x, add(y,z)) == add(multiply(x, y), multiply(x, z));
```

我们来看看运用这些定律如何简化这个海鸥小程序：

```js
// 原有代码
add(multiply(flock_b, add(flock_a, flock_c)), multiply(flock_a, flock_b));

// 应用同一律，去掉多余的加法操作（add(flock_a, flock_c) == flock_a）
add(multiply(flock_b, flock_a), multiply(flock_a, flock_b));

// 再应用分配律
multiply(flock_b, add(flock_a, flock_a));
```

到这里，程序就变得非常有意思，如果更加复杂的应用，也可以确保结果可以预期，这就是函数式编程。

## 函数式编程的优势


## 函数式编程的基本原则

总的来说，就是“正确地写出正确的函数”。这话有点绕，不过我们写了太多面向对象的代码，可能已被“毒害”太深，不得不下点猛药，说点狠话，不然记不住。函数式编程，当然函数是主角，被称为“一等公民”，特别是对于 JavaScript 语言来说，可以像对待任何其他数据类型一样对待——把它们存在数组里，当作参数传递，赋值给变量...等等。但是，说起来容易，真正做起来，并非每个人都能轻松做到。下面是写出正确函数的几个原则：

（1）直接把函数赋值给变量

**记住：凡是使用`return`返回函数调用的，都可以去掉这个间接包裹层，最终连参数和括号一起去掉！**

以下代码都来自 npm 上的模块包：

```js
// 太傻了
var getServerStuff = function(callback){
  return ajaxCall(function(json){
    return callback(json);
  });
};

// 这才像样
var getServerStuff = ajaxCall;
```

世界上到处都充斥着这样的垃圾 ajax 代码。以下是上述两种写法等价的原因：

```js
// 这行
return ajaxCall(function(json){
  return callback(json);
});

// 等价于这行
return ajaxCall(callback);

// 那么，重构下 getServerStuff
var getServerStuff = function(callback){
  return ajaxCall(callback);
};

// ...就等于
var getServerStuff = ajaxCall; // <-- 看，没有括号哦
```

（2）使用最普适的方式命名

函数属于操作，命名最好简单直白体现功能性，比如`add`等。参数是数据，最好不要限定在特定的数据上，比如`articles`，就能让写出来的函数更加通用，避免重复造轮子。例如：

```js
// 只针对当前的博客
var validArticles = function(articles) {
  return articles.filter(function(article){
    return article !== null && article !== undefined;
  });
};

// 对未来的项目友好太多
var compact = function(xs) {
  return xs.filter(function(x) {
    return x !== null && x !== undefined;
  });
};
```

（3）避免依赖外部变量

不依赖外部变量和环境，就能确保写出的函数是`纯函数`，即：**相同输入得到相同输出的函数**。 比如 `slice` 和 `splice`，这两个函数的作用一样，但方式不同， `slice` 符合*纯*函数的定义是因为对相同的输入它保证能返回相同的输出。而 `splice` 却会嚼烂调用它的那个数组，然后再吐出来，即这个数组永久地改变了。

再如：

```js
// 不纯的
var minimum = 21;

var checkAge = function(age) {
  return age >= minimum;
};


// 纯的
var checkAge = function(age) {
  var minimum = 21;
  return age >= minimum;
};
```

在上面不纯的版本中，`checkAge` 的结果取决于 `minimum` 这个外部可变变量的值（系统状态值）。输入值之外的因素能够左右 `checkAge` 的返回值，产生很多副作用，不仅让它变得不纯，而且导致每次我们思考整个软件的时候都将痛苦不堪，本法就会产生很多bug。这些副作用包括但不限于：更改文件系统、往数据库插入记录、发送一个 http 请求、打印log、获取用户输入、DOM 查询、访问系统状态等，总之，就是在计算结果的过程中，导致系统状态发生变化，或者与外部世界进行了*可观察的交互*。

在数学领域，函数是这么定义的（请参考 百度百科上函数定义）：一般的，在一个变化过程中，假设有两个变量x、y，如果对于任意一个x都有唯一确定的一个y和它对应，那么就称y是x的函数。直白一点就是，`函数是不同数值之间的特殊关系：对每一个输入值x返回且只返回一个输出值y`。从这个定义来看，我所谓的`纯函数`其实就是数学函数。这会给我们带来可缓存性、可移植性、自文档化、可测试性、合理性、并行代码等很多好处（具体实例请参考[mostly-adequate-guide（英文）][]）。

（4）面对 `this` 值，小心加小心

`this` 就像一块脏尿布，尽可能地避免使用它，因为在函数式编程中根本用不到它。然而，在使用其他的类库时，你却不得不低头。如果一个底层函数使用了 `this`，而且是以函数的方式被调用的，那就要非常小心了。比如：

```js
var fs = require('fs');

// 太可怕了
fs.readFile('freaky_friday.txt', Db.save);

// 好一点点
fs.readFile('freaky_friday.txt', Db.save.bind(Db));

```

把 Db 绑定（bind）到它自己身上以后，你就可以随心所欲地调用它的原型链式垃圾代码了。

## 怎样进行函数式编程？

这里汇总一些常用的工具和方法。

（1）柯里化（curry）：动态产生新函数

什么是柯里化？维基百科（见参考）的解释是，柯里化是指把接受多个参数的函数变换成接受一个单一参数（第一个）的函数，返回接受剩余参数的新函数的技术。通俗点说，只传递给函数一部分参数来调用它，让它返回一个函数去处理剩下的参数。

这里有两个关键，首先，明确规则。前面的参数（可以是函数）是规则，相当于新函数的私有变量（通过类似闭包的方式）；其次，明确目的。目的是获得新函数，而这个新函数才是真正用来处理业务数据的，所以与业务数据相关的参数，最好放在后面。

这是函数式编程的重要技巧之一，在使用各类高阶函数（参数或返回值为函数的函数）的时候非常常见。通常大家不定义直接操作数组的函数，因为只需内联调用 `map`、`sort`、`filter` 以及其他的函数就能达到目的，这时候多会用到这种方法 。

最简单的例子：

```js
var add = function(x) {
  return function(y) {
    return x + y;
  };
};

var addTenTo = add(10);

addTenTo(2);
// 12
```

这里是自定义的 `add` 函数，它接受一个参数并返回一个新的函数。调用 `add` 之后，返回的函数就通过闭包的方式记住 `add` 的第一个参数。我们还可以借助工具使这类函数的定义和调用更加容易。比如，利用`lodash`包的 `curry` 方法，上面的`add`方法就变成这样：

```js
var curry = require('lodash').curry;

var add = curry(function(x, y) {
    return x + y;
});
```

下面看几个更实用的例子：

```js
var curry = require('lodash').curry;

var match = curry(function(what, str) {
  return str.match(what);
});

// 1.当普通函数调用
match(/\s+/g, "hello world");
// [ ' ' ]

match(/\s+/g)("hello world");
// [ ' ' ]

// 2.使用柯里化的新函数
var hasSpaces = match(/\s+/g);
// function(x) { return x.match(/\s+/g) }

hasSpaces("hello world");
// [ ' ' ]

hasSpaces("spaceless");
// null

// 3.大胆嵌套使用
var filter = curry(function(f, ary) {
  return ary.filter(f);
});

var findHasSpacesOf = filter(hasSpaces);
// function(xs) { return xs.filter(function(x) { return x.match(/\s+/g) }) }

findHasSpacesOf(["tori_spelling", "tori amos"]);
// ["tori amos"]
```

（2）组合（compose）：自由组合新函数

`组合`就是把两个函数结合起来，产生一个崭新的函数。这符合范畴学的组合理论，也就是说组合某种类型（本例中是函数）的两个元素还是会生成一个该类型的新元素，就像把两个乐高积木组合起来绝不可能得到一个林肯积木一样。`组合`函数的代码非常简单，如下：

```js
var compose = function(f,g) {
  return function(x) {
    return f(g(x));
  };
};
```

`f` 和 `g` 都是函数，`x` 是在它们之间通过“管道”传输的值。`g` 先于 `f` 执行，因此数据流是从右到左的，这符合数学上的“结合律”的概念，能为编码带来极大的灵活性（可以任意拆分和组合），而且不用担心执行结果出现意外。比如：

```js
// 结合律（associativity）
var associative = compose(f, compose(g, h)) == compose(compose(f, g), h);
// true
```

函数式编程有个叫“隐式编程”（[Tacit programming][]，见参考）的概念，也叫“point-free 模式”，意思是函数不用指明操作的参数（也叫 points），而是让组合它的函数处理参数。柯里化以及组合协作起来非常有助于实现这种模式。首先，利用柯里化，让每个函数都先接收数据，然后操作数据；接着，通过组合，实现把数据从第一个函数传递到下一个函数那里去。这样，就能做到通过管道把数据在**接受单个参数的函数**间传递。

显然，隐式编程模式隐去了不必要的参数命名，让代码更加简洁和通用。通过这种模式，我们也很容易了解一个函数是否是接受输入返回输出的小函数。比如，replace，split等都是这样的小函数，可以直接组合；map接受两个参数自然不能直接组合，不过可以先让它接受一个函数，转化为一个参数的函数；但是 while 循环是无论如何不能组合的。另外，并非所有的函数式代码都是这种模式的，所以，适当选择，不能使用的时候就用普通函数。

下面，看个例子：

```js
// 非隐式编程，因为提到了数据：word
var snakeCase = function (word) {
  return word.toLowerCase().replace(/\s+/ig, '_');
};

// 隐式编程
var snakeCase = compose(replace(/\s+/ig, '_'), toLowerCase);
```

本来，js的错误定位就不准确，这样的组合给 debug 带来了更多困难。还好，我们可以使用下面这个实用的，但是不纯的 `trace` 函数来追踪代码的执行情况。

```js
var trace = curry(function(tag, x){
  console.log(tag, x);
  return x;
});

var dasherize = compose(join('-'), toLower, split(' '), replace(/\s{2,}/ig, ' '));

dasherize('The world is a vampire');
// TypeError: Cannot read property 'apply' of undefined
```

这里报错了，来 `trace` 下：

```js
var dasherize = compose(join('-'), toLower, trace("after split"), split(' '), replace(/\s{2,}/ig, ' '));
// after split [ 'The', 'world', 'is', 'a', 'vampire' ]
```

啊，`toLower` 的参数是一个数组（记住，上面的代码是从右向左执行的奥），所以需要先用 `map` 调用一下它。

```js
var dasherize = compose(join('-'), map(toLower), split(' '), replace(/\s{2,}/ig, ' '));

dasherize('The world is a vampire');

// 'the-world-is-a-vampire'
```

## 参考

[lodash website]: https://lodash.com/

[mostly-adequate-guide（英文）](https://github.com/DrBoolean/mostly-adequate-guide)

[mostly-adequate-guide（中文）](http://llh911001.gitbooks.io/mostly-adequate-guide-chinese)

[函数式编程初探](http://www.ruanyifeng.com/blog/2012/04/functional_programming.html)

[使用 JavaScript 进行函数式编程](http://www.codeceo.com/article/javascript-functional-programming-1.html)

[结构化编程](https://en.wikipedia.org/wiki/Structured_programming)

[Functional programming](https://en.wikipedia.org/wiki/Functional_programming)

[函数式编程（百度百科）](http://baike.baidu.com/subview/15061/18968664.htm#viewPageContent)

[柯里化（维基百科）](https://zh.wikipedia.org/wiki/柯里化)

[Tacit programming](https://en.wikipedia.org/wiki/Tacit_programming)
