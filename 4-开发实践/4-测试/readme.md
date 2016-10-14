# 测试

## 前言
测试与开发相辅相成，一个完整的项目离不开测试，测试保证了系统的正确运行，这篇文章主要介绍nodejs下常用的测试框架mocha、should和一些基本的测试方法。

## 1.概念解释

#### 单元测试：
在计算机编程中，单元测试（又称为模块测试, Unit Testing）是针对程序模块（软件设计的最小单位）来进行正确性检验的测试工作。程序单元是应用的最小可测试部件。在过程化编程中，一个单元就是单个程序、函数、过程等；对于面向对象编程，最小单元就是方法，包括基类（超类）、抽象类、或者派生类（子类）中的方法。

#### 集成测试：
整合测试又称组装测试，即对程序模块采用一次性或增殖方式组装起来，对系统的接口进行正确性检验的测试工作。整合测试一般在单元测试之后、系统测试之前进行。实践表明，有时模块虽然可以单独工作，但是并不能保证组装起来也可以同时工作。

#### 系统测试:
系统测试是将需测试的软件，作为整个基于计算机系统的一个元素，与计算机硬件、外设、某些支持软件、数据和人员等其他系统元素及环境结合在一起测试。在实际运行(使用)环境下，对计算机系统进行一系列的组装测试和确认测试。系统测试的目的在于通过与系统的需求定义作比较，发现软件与系统定义不符合或与之矛盾的地方。

#### 性能测试：
性能测试是对软件性能的评价。简单的说，软件性能衡量的是软件具有的响应及时度能力。因此，性能测试是采用测试手段对软件的响应及时性进行评价的一种方式。根据软件的不同类型，性能测试的侧重点也不同。

#### benchmarking：  
基准测试是一种测量和评估软件性能指标的方法，具体做法是：在系统上运行一系列测试程序并把性能计数器的结果保存起来。这些结构称为“性能指标”。性能指标通常都保存或归档，并在系统环境的描述中进行注解。这可以让他们对系统过去和现在的性能表现进行对照比较，确认系统或环境的所有变化。

#### BDD：
BDD的英文全称是Behavior-Driven Development，即行为驱动开发。 它通过用自然语言书写非程序员可读的测试用例扩展了测试驱动开发方法。行为驱动开发人员使用混合了领域中统一的语言的母语语言来描述他们的代码的目的。这让开发者得以把精力集中在代码应该怎么写，而不是技术细节上，而且也最大程度的减少了将代码编写者的技术语言与商业客户、用户、利益相关者、项目管理者等的领域语言之间来回翻译的代价。

## 2.知识点介绍

#### 测试框架Mocha：
mocha 是一个简单、灵活有趣的 JavaScript 测试框架，用于 Node.js 和浏览器上的 JavaScript 应用测试，大多数node开发者在使用，所以还是很可靠的。

#### 断言库should.js：
should.js也是支持浏览器和nodejs环境，它的特色就是书写起来更像人类语言，错误提示也是表达期望-应该是什么样的（正如它的名字）。

#### web测试库supertest：
基于Super-agent的http接口测试库，提供了更高抽象的方法，使得测试http服务更加顺滑，也支持调用superagent的接口方法。

#### 基准库benchmark:  
也是一个可以用于 Node.js 和浏览器上的 JavaScript的基准测试库。

## 3.框架流程  

我们按照测试的顺序，画出一个流程图，在不同的阶段对应了不同的测试方法。 如图：

![test-overview.png][]

## 4.实践

#### 安装使用
```
$ npm install mocha -g
$ npm install should --save-dev
$ npm install supertest --save-dev
$ npm install benchmark --save-dev
$ mkdir test
$ atom test/test.js
```
##### 编码
(1)简单例子

我们使用官方提供的例子，验证数组的indexOf方法越界后是否返回-1，这个例子使用了node自带的assert。
```
var assert = require('assert');
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
});
```
- describe():传进去的字符串用来描述你要测的主体是什么，可以嵌套，这里我们要测试的主体就是Array，indexOf方法是其中的一个子描述。
- it():描述具体的 case 内容，里面包含了断言的使用。

执行后输出如下：
```
$ mocha test.js

  Array
    #indexOf()
      ✓ should return -1 when the value is not present


  1 passing (18ms)

```
上面的是passing的结果，现在我们看看failing的情况，把断言中的-1改为0，执行后可以看到：
```
$ mocha test.js

 Array
   #indexOf()
     1) should return 0 when the value is not present


 0 passing (18ms)
 1 failing

 1) Array #indexOf() should return 0 when the value is not present:

     AssertionError: 0 == -1
     + expected - actual

     -0
     +-1

     at Context.<anonymous> (test.js:5:14)
```
定位错误的信息都打印出来了，通过这个简单的例子，我们知道怎样用descride和it来描述测试用例了，接下来我们还要做一些常见的测试类型。

(2)异步回调测试  
回调是js里最基础的函数调用方式，写异步测试案例我们只需要在it()添加一个回调函数(通常是done)，这个回调函数接受一个error做参数，如果传参数error就是失败，那么我们将修改刚才的代码如下，加入了延时执行：
```
var assert = require('assert');
var async = function (callback) {
  setTimeout(function () {
    callback(assert.equal(-1, [1,2,3].indexOf(4)));
  }, 10);
};
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function (done) {
    async(function (result) {
      done(result);
    });
  });
  });
});
```
这个例子输出的结果，我就不贴图了，你们可以自行试验(assert失败会返回AssertionError)。

(3)Promise测试  
Promise是目前ES6规范里比较流行的异步方式了，对Promise的测试支持也变得很重要，mocha支持直接返回Promise，执行resolve是测试成功，执行reject是测试失败。
```
var assert = require('assert');
var promise = new Promise(function(resolve, reject){
  const result = [1,2,3].indexOf(4)
  if (result == 0) {
    resolve(true)
  }
  else{
    reject(false)
  }
})
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function () {
      return promise
  });
  });
});
```
(4)should.js使用  
上面的例子是一些基本的判断，如果你要判断更复杂的情况，需要自己写很多代码，那么should就让这些变得简单实用，使用should库可以给对象加上更多方法，不用自己来实现判断true和false了。比如可以判断一个对象是否这个属性，判断类型是否是字符串、数组，还有很多的用法，可以去官网文档里查看http://shouldjs.github.io/#should 。
```
var assert = require('assert');
var should = require('should');

describe('Should', function() {
    it('should have property a ', function () {
      ({ a: 10 }).should.have.ownProperty('a');
  });
});

```
比较好的地方还在与should支持Promise，可以判断Promise的结果。
```
var should = require('should');

describe('Should', function() {
  it('should return 10 ', function () {
    return new Promise((resolve, reject) => resolve(10)).should.be.finally.equal(10);
  });
});
```
(5)web接口测试  
此例子参照亿书的test/lib/accounts.js的代码，supertest可以直接调用superagent的接口，除此之外新增了expect接口，可以验证status、header和body，以及在end函数里直接处理返回的数据。具体接口说明可以直接查看官方文档，文章末尾会有链接。
```
var request = require('supertest');
var should = require('should');

describe('Account', function() {
    it('Opening account with password: password. Expecting success',function(done){
        request('http://127.0.0.1:7000').post('/accounts/open')
            .set('Accept', 'application/json')
            .send({
                secret: 'password'
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res){
                if (err) done(err);
                res.body.should.have.property('success',true);
                res.body.should.have.property('account').which.is.Object();
                res.body.account.address.should.equal('12099044743111170367C');
                res.body.account.publicKey.should.equal('fbd20d4975e53916488791477dd38274c1b4ec23ad322a65adb171ec2ab6a0dc');
                done();
            });
    });
})
```
我们通过supertest设置请求路径和参数，对返回的response的status进行了判断，并且直接通过end函数处理返回的内容，通过刚才的should库对body的属性进行了检验，最后调用了done结束。这个过程就是在亿书中最常用的接口测试，更多例子可以去看亿书测试源码。  

(6)性能测试  
在上面的例子中，我们可以使用node自带的consloe.time输出耗费时间，但是如果有比较性的测试，比如需要知道哪个方案运行快，就需要benchmark库了，照着官方文档的例子，讲解一下。
```
var suite = new Benchmark.Suite;

// add tests
suite.add('RegExp#test', function() {
  /o/.test('Hello World!');
})
.add('String#indexOf', function() {
  'Hello World!'.indexOf('o') > -1;
})
// add listeners
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
})
// run async
.run({ 'async': true });
```
执行的结果：
```
RegExp#test x 5,658,069 ops/sec ±1.61% (78 runs sampled)
String#indexOf x 10,170,498 ops/sec ±1.40% (78 runs sampled)
Fastest is String#indexOf
```
这个例子使用了两种方法（正则和查找索引）来判断一个字符串是否含有'o'，其中，Ops/sec测试结果以每秒钟执行测试代码的次数（Ops/sec）显示，这个数值越大越好。除了这个结果外，同时会显示测试过程中的统计误差。

## 小结

这篇主要讲述了一些简单的用法和示例，测试是一门很重要的学问，测试的理论和实践有很多人做过总结，作者水平有限，难以完全论述清楚，这里只是一个简单的入门操作，让开发人员了解下nodejs的常用测试方法，如果您是专业的测试人员，或者您还需要更深入的了解，可以去看一些关于质量控制的专业书籍。

## 链接

**本系列文章即时更新，欢迎关注，^-^**

本源文地址： https://github.com/imfly/bitcoin-on-nodejs

电子书阅读： http://bitcoin-on-nodejs.ebookchain.org


## 参考

[软件测试](https://zh.wikipedia.org/wiki/软件测试)

[Mocha](https://github.com/mochajs/mocha)

[Should](https://github.com/shouldjs/should.js)

[supertest](https://github.com/visionmedia/supertest)

[superagent](https://github.com/visionmedia/superagent)

[BDD](https://zh.wikipedia.org/wiki/行为驱动开发)


[test-overview.png]: ../../styles/images/third/test-overview.png
