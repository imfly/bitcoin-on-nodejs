# Async详解之一：流程控制

为了适应异步编程，减少回调的嵌套，我尝试了很多库。最终觉得还是async最靠谱。

地址：[https://github.com/caolan/async](https://github.com/caolan/async "https://github.com/caolan/async")

Async的内容分为三部分：

1.  流程控制：简化十种常见流程的处理
2.  集合处理：如何使用异步操作处理集合中的数据
3.  工具类：几个常用的工具类

本文介绍其中最简单最常用的流程控制部分。

由于nodejs是异步编程模型，有一些在同步编程中很容易做到的事情，现在却变得很麻烦。Async的流程控制就是为了简化这些操作。

## 1\. series(tasks, [callback]) （多个函数依次执行，之间没有数据交换）

<span style="line-height:22px; font-family:'Hiragino Sans GB W3','Hiragino Sans GB',Arial,Helvetica,simsun,u5b8bu4f53; color:rgb(48,48,48); font-size:15px"></span>

有多个异步函数需要依次调用，一个完成之后才能执行下一个。各函数之间没有数据的交换，仅仅需要保证其执行顺序。这时可使用series。

纯js代码：

> <span style="line-height:23.3333320617676px">step1(function(err, v1) {</span>
>
> <span style="line-height:23.3333320617676px">  step2(function(err, v2) {</span>
>
> <span style="line-height:23.3333320617676px">    step3(function(err, v3) {</span>
>
> <span style="line-height:23.3333320617676px">       // do somethig with the err or values v1/v2/v3</span>
>
> <span style="line-height:23.3333320617676px">    }</span>
>
> <span style="line-height:23.3333320617676px">  }</span>
>
> <span style="line-height:23.3333320617676px">});</span>

从中可以看到这嵌套还是比较多深的，如果再多几步，会更深。在代码中忽略对了每一层err的处理，否则还都等加上 if(err) return callback(err)，那就更麻烦了。

对于这种情况，使用async来处理，就是这样的：

> <span style="line-height:23.3333320617676px">var async = require(‘async’)</span>
>
> <span style="line-height:23.3333320617676px">async.series([</span>
>
> <span style="line-height:23.3333320617676px">   step1, step2, step3</span>
>
> <span style="line-height:23.3333320617676px">], function(err, values) {</span>
>
> <span style="line-height:23.3333320617676px">   // do somethig with the err or values v1/v2/v3</span>
>
> <span style="line-height:23.3333320617676px">});</span>

可以看到代码简洁了很多，而且自动处理每个回调中的错误。当然，这里只给出来最最简单的例子，在实际中，我们常会在每个step中执行一些操作，这时可写成：

> <span style="line-height:23.3333320617676px">var async = require(‘async’)</span>
>
> <span style="line-height:23.3333320617676px">async.series([</span>
>
> <span style="line-height:23.3333320617676px">  function(cb) { step1(function(err,v1) {</span>
>
> <span style="line-height:23.3333320617676px">     // do something with v1</span>
>
> <span style="line-height:23.3333320617676px">     cb(err, v1);</span>
>
> <span style="line-height:23.3333320617676px">  }),</span>
>
> <span style="line-height:23.3333320617676px">  function(cb) { step2(...) },</span>
>
> <span style="line-height:23.3333320617676px">  function(cb) { step3(...) }</span>
>
> <span style="line-height:23.3333320617676px">], function(err, values) {</span>
>
> <span style="line-height:23.3333320617676px">// do somethig with the err or values v1/v2/v3</span>
>
> <span style="line-height:23.3333320617676px">});</span>

该函数的详细解释为：

1.  依次执行一个函数数组中的每个函数，每一个函数执行完成之后才能执行下一个函数。
2.  如果任何一个函数向它的回调函数中传了一个error，则后面的函数都不会被执行，并且将会立刻会将该error以及已经执行了的函数的结果，传给series中最后那个callback。
3.  当所有的函数执行完后（没有出错），则会把每个函数传给其回调函数的结果合并为一个数组，传给series最后的那个callback。
4.  还可以json的形式来提供tasks。每一个属性都会被当作函数来执行，并且结果也会以json形式传给series最后的那个callback。这种方式可读性更高一些。

具体例子可参考：[https://github.com/freewind/async_demo/blob/master/series.js](https://github.com/freewind/async_demo/blob/master/series.js)

其代码中还包含了：

1.  如果中间某个函数出错，series函数如何处理
2.  如果某个函数传给回调的值为undefined, null, {}, []等，series如何处理

另外还需要注意的是：多个series调用之间是不分先后的，因为series本身也是异步调用。

## 2\. parallel(tasks, [callback]) （多个函数并行执行）

<span style="line-height:22px; font-family:'Hiragino Sans GB W3','Hiragino Sans GB',Arial,Helvetica,simsun,u5b8bu4f53; color:rgb(48,48,48); font-size:15px"></span>

并行执行多个函数，每个函数都是立即执行，不需要等待其它函数先执行。传给最终callback的数组中的数据按照tasks中声明的顺序，而不是执行完成的顺序。

如果某个函数出错，则立刻将err和已经执行完的函数的结果值传给parallel最终的callback。其它未执行完的函数的值不会传到最终数据，但要占个位置。

同时支持json形式的tasks，其最终callback的结果也为json形式。

示例代码：

> async.parallel([   
>     function(cb) { t.fire('a400', cb, 400) },   
>     function(cb) { t.fire('a200', cb, 200) },   
>     function(cb) { t.fire('a300', cb, 300) }   
> ], function (err, results) {   
>     log(’1.1 err: ‘, err); // -> undefined   
>     log(’1.1 results: ‘, results); // ->[ 'a400', 'a200', 'a300' ]   
> });

中途出错的示例：

> async.parallel([   
>     function(cb) { log('1.2.1: ', 'start'); t.fire('a400', cb, 400) }, // 该函数的值不会传给最终callback，但要占个位置   
>     function(cb) { log('1.2.2: ', 'start'); t.err('e200', cb, 200) },   
>     function(cb) { log('1.2.3: ', 'start'); t.fire('a100', cb, 100) }   
> ], function(err, results) {   
>     log(’1.2 err: ‘, err); // -> e200   
>     log(’1.2 results: ‘, results); // -> [ , undefined, 'a100' ]   
> });

以json形式传入tasks

> async.parallel({   
>     a: function(cb) { t.fire(‘a400′, cb, 400) },   
>     b: function(cb) { t.fire(‘c300′, cb, 300) }   
> }, function(err, results) {   
>     log(’1.3 err: ‘, err); // -> undefined   
>     log(’1.3 results: ‘, results); // -> { b: ‘c300′, a: ‘a400′ }   
> });

更详细示例参见：[https://github.com/freewind/async_demo/blob/master/parallel.js](https://github.com/freewind/async_demo/blob/master/parallel.js)

## 3\. waterfall(tasks, [callback]) （多个函数依次执行，且前一个的输出为后一个的输入）

<span style="line-height:22px; font-family:'Hiragino Sans GB W3','Hiragino Sans GB',Arial,Helvetica,simsun,u5b8bu4f53; color:rgb(48,48,48); font-size:15px"></span>

与seires相似，按顺序依次执行多个函数。不同之处，每一个函数产生的值，都将传给下一个函数。如果中途出错，后面的函数将不会被执行。错误信息以及之前产生的结果，将传给waterfall最终的callback。

这个函数名为waterfall(瀑布)，可以想像瀑布从上到下，中途冲过一层层突起的石头。注意，该函数不支持json格式的tasks。

> async.waterfall([   
>     function(cb) { log('1.1.1: ', 'start'); cb(null, 3); },   
>     function(n, cb) { log('1.1.2: ',n); t.inc(n, cb); },   
>     function(n, cb) { log('1.1.3: ',n); t.fire(n*n, cb); }   
> ], function (err, result) {   
>     log(’1.1 err: ‘, err); // -> null   
>     log(’1.1 result: ‘, result); // -> 16   
> });

更详细示例参见：[https://github.com/freewind/async_demo/blob/master/waterfall.js](https://github.com/freewind/async_demo/blob/master/waterfall.js)

## 4\. auto(tasks, [callback]) （多个函数有依赖关系，有的并行执行，有的依次执行）

<span style="line-height:22px; font-family:'Hiragino Sans GB W3','Hiragino Sans GB',Arial,Helvetica,simsun,u5b8bu4f53; color:rgb(48,48,48); font-size:15px"></span>

用来处理有依赖关系的多个任务的执行。比如某些任务之间彼此独立，可以并行执行；但某些任务依赖于其它某些任务，只能等那些任务完成后才能执行。

虽然我们可以使用async.parallel和async.series结合起来实现该功能，但如果任务之间关系复杂，则代码会相当复杂，以后如果想添加一个新任务，也会很麻烦。这时使用async.auto，则会事半功倍。

如果有任务中途出错，则会把该错误传给最终callback，所有任务（包括已经执行完的）产生的数据将被忽略。

这里假设我要写一个程序，它要完成以下几件事：

1.  从某处取得数据
2.  在硬盘上建立一个新的目录
3.  将数据写入到目录下某文件
4.  发送邮件，将文件以附件形式发送给其它人。

分析该任务，可以知道1与2可以并行执行，3需要等1和2完成，4要等3完成。

> async.auto({   
>     getData: function (callback) {   
>         setTimeout(function(){   
>             console.log(’1.1: got data’);   
>             callback();   
>         }, 300);   
>     },   
>     makeFolder: function (callback) {   
>         setTimeout(function(){   
>             console.log(’1.1: made folder’);   
>             callback();   
>         }, 200);   
>     },   
>     writeFile: ['getData', 'makeFolder', function(callback) {   
>         setTimeout(function(){   
>             console.log('1.1: wrote file');   
>             callback(null, 'myfile');   
>         }, 300);   
>     }],   
>     emailFiles: ['writeFile', function(callback, results) {   
>         log('1.1: emailed file: ', results.writeFile); // -> myfile   
>         callback(null, results.writeFile);   
>     }]   
> }, function(err, results) {   
>     log(’1.1: err: ‘, err); // -> null   
>     log(’1.1: results: ‘, results); // -> { makeFolder: undefined,   
>                                     //      getData: undefined,   
>                                     //      writeFile: ‘myfile’,   
>                                     //      emailFiles: ‘myfile’ }   
> });

更多详细示例参见：https://github.com/freewind/async_demo/blob/master/auto.js

## 5\. whilst(test, fn, callback)（用可于异步调用的while）

<span style="line-height:22px; font-family:'Hiragino Sans GB W3','Hiragino Sans GB',Arial,Helvetica,simsun,u5b8bu4f53; color:rgb(48,48,48); font-size:15px"></span>

相当于while，但其中的异步调用将在完成后才会进行下一次循环。举例如下：

> var count1 = 0;   
> async.whilst(   
>     function() { return count1 < 3 },   
>     function(cb) {   
>         log(’1.1 count: ‘, count1);   
>         count1++;   
>         setTimeout(cb, 1000);   
>     },   
>     function(err) {   
>         // 3s have passed   
>         log(’1.1 err: ‘, err); // -> undefined   
>     }   
> );

它相当于：

> try {   
>   whilst(test) {   
>     fn();   
>   }   
>   callback();   
> } catch (err) {   
>   callback(err);   
> }

该函数的功能比较简单，条件变量通常定义在外面，可供每个函数访问。在循环中，异步调用时产生的值实际上被丢弃了，因为最后那个callback只能传入错误信息。

另外，第二个函数fn需要能接受一个函数cb，这个cb最终必须被执行，用于表示出错或正常结束。

更详细示例参见：[https://github.com/freewind/async_demo/blob/master/whilst_until.js](https://github.com/freewind/async_demo/blob/master/whilst_until.js)

## 6\. until(test, fn, callback) （与while相似，但判断条件相反）

<span style="line-height:22px; font-family:'Hiragino Sans GB W3','Hiragino Sans GB',Arial,Helvetica,simsun,u5b8bu4f53; color:rgb(48,48,48); font-size:15px"></span>

> var count4 = 0;   
> async.until(   
>     function() { return count4>3 },   
>     function(cb) {   
>         log(’1.4 count: ‘, count4);   
>         count4++;   
>         setTimeout(cb, 200);   
>     },   
>     function(err) {   
>         // 4s have passed   
>         log(’1.4 err: ‘,err); // -> undefined   
>     }   
> );

当第一个函数条件为false时，继续执行第二个函数，否则跳出。

## 7\. queue （可设定worker数量的队列）

<span style="line-height:22px; font-family:'Hiragino Sans GB W3','Hiragino Sans GB',Arial,Helvetica,simsun,u5b8bu4f53; color:rgb(48,48,48); font-size:15px"></span>

queue相当于一个加强版的parallel，主要是限制了worker数量，不再一次性全部执行。当worker数量不够用时，新加入的任务将会排队等候，直到有新的worker可用。

该函数有多个点可供回调，如worker用完时、无等候任务时、全部执行完时等。

定义一个queue，其worker数量为2，并在任务执行时，记录一下日志：

> var q = async.queue(function(task, callback) {   
>     log(‘worker is processing task: ‘, task.name);   
>     task.run(callback);   
> }, 2);

worker数量将用完时，会调用saturated函数：

> q.saturated = function() {   
>     log(‘all workers to be used’);   
> }

当最后一个任务交给worker执行时，会调用empty函数

> q.empty = function() {   
>     log(‘no more tasks wating’);   
> }

当所有任务都执行完时，会调用drain函数

> q.drain = function() {   
>     console.log(‘all tasks have been processed’);   
> }

放入多个任务，可一次放一个，或一次放多个

> q.push({name:’t1′, run: function(cb){   
>     log(‘t1 is running, waiting tasks: ‘, q.length());   
>     t.fire(‘t1′, cb, 400); // 400ms后执行   
> }}, function(err) {   
>     log(‘t1 executed’);   
> });

> q.push([{name:'t3', run: function(cb){   
>     log('t3 is running, waiting tasks: ', q.length());   
>     t.fire('t3', cb, 300); // 300ms后执行   
> }},{name:'t4', run: function(cb){   
>     log('t4 is running, waiting tasks: ', q.length());   
>     t.fire('t4', cb, 500); // 500ms后执行   
> }}], function(err) {   
>     log(‘t3/4 executed’);   
> });

更多详细示例参见：[https://github.com/freewind/async_demo/blob/master/queue.js](https://github.com/freewind/async_demo/blob/master/queue.js)

<span style="line-height:22px; font-family:'Hiragino Sans GB W3','Hiragino Sans GB',Arial,Helvetica,simsun,u5b8bu4f53; color:rgb(48,48,48); font-size:15px"></span>

## 8\. iterator(tasks) （将几个函数包装为iterator）

<span style="line-height:22px; font-family:'Hiragino Sans GB W3','Hiragino Sans GB',Arial,Helvetica,simsun,u5b8bu4f53; color:rgb(48,48,48); font-size:15px"></span>

将一组函数包装成为一个iterator，可通过next()得到以下一个函数为起点的新的iterator。该函数通常由async在内部使用，但如果需要时，也可在我们的代码中使用它。

> var iter = async.iterator([   
> function() { console.log('111') },   
> function() { console.log('222') },   
> function() { console.log('333') }   
> ]);
>
> console.log(iter());
>
> console.log(iter.next());

直接调用()，会执行当前函数，并返回一个由下个函数为起点的新的iterator。调用next()，不会执行当前函数，直接返回由下个函数为起点的新iterator。

对于同一个iterator，多次调用next()，不会影响自己。如果只剩下一个元素，调用next()会返回null。

更详细示例参见：[https://github.com/freewind/async_demo/blob/master/iterator.js](https://github.com/freewind/async_demo/blob/master/iterator.js)

## 9\. apply(function, arguments..) （给函数预绑定参数）

<span style="line-height:22px; font-family:'Hiragino Sans GB W3','Hiragino Sans GB',Arial,Helvetica,simsun,u5b8bu4f53; color:rgb(48,48,48); font-size:15px"></span>

apply是一个非常好用的函数，可以让我们给一个函数预绑定多个参数并生成一个可直接调用的新函数，简化代码。

对于函数：

> function(callback) { t.inc(3, callback); }

可以用apply改写为：

> async.apply(t.inc, 3);

还可以给某些函数预设值，得到一个新函数：

> <span style="line-height:23.3333320617676px">var log = async.apply(console.log, ">");</span>
>
> <span style="line-height:23.3333320617676px">log(‘hello’);</span>
>
> <span style="line-height:23.3333320617676px">// > hello</span>

更详细代码参见：[https://github.com/freewind/async_demo/blob/master/apply.js](https://github.com/freewind/async_demo/blob/master/apply.js)

## 10\. nextTick(callback) （在nodejs与浏览器两边行为一致）

<span style="line-height:22px; font-family:'Hiragino Sans GB W3','Hiragino Sans GB',Arial,Helvetica,simsun,u5b8bu4f53; color:rgb(48,48,48); font-size:15px"></span>

nextTick的作用与nodejs的nextTick一样，都是把某个函数调用放在队列的尾部。但在浏览器端，只能使用setTimeout(callback,0)，但这个方法有时候会让其它高优先级的任务插到前面去。

所以提供了这个nextTick，让同样的代码在服务器端和浏览器端表现一致。

> var calls = [];
>
> async.nextTick(function() {
>
>     calls.push(‘two’);
>
> });
>
> calls.push(‘one’);
>
> async.nextTick(function() {
>
>     console.log(calls); // -> [ 'one', 'two' ]
>
> });

更详细代码参见：[https://github.com/freewind/async_demo/blob/master/nextTick.js](https://github.com/freewind/async_demo/blob/master/nextTick.js)

下一篇将放松一下，讲解一下async提供的一些工具类，最后才是对集合的并行处理。
