# nodejs Async详解之三：集合操作

Async提供了很多针对集合的函数，可以简化我们对集合进行异步操作时的步骤。如下：

1.  forEach：对集合中每个元素进行异步操作
2.  map：对集合中的每个元素通过异步操作得到另一个值，得到新的集合
3.  filter：对集合中元素使用异步操作进行筛选，得到符合条件的集合
4.  reject：与filter相似，只是判断条件时正好相反，得到剩下的元素的集合
5.  reduce：使用一个初始值同集合中每一个元素进行异步操作，最后得到一个唯一的结果
6.  detect：得到集合中满足条件的第一个数据
7.  sortBy：对集合中的数据进行异步操作，再根据值从小到大排序
8.  some/any：集合中是否有至少一个元素满足条件
9.  every/all：集合中是否每个元素都满足条件
10.  concat：对集合中的元素进行异步操作，将结果集合并成一个数组

下面一一解释：

## 1\. forEach(arr, iterator(item, callback), callback(err))

如果想对同一个集合中的所有元素都执行同一个异步操作，可以利用forEach函数。注意该函数将重点放在“执行过程”上，忽略运行后产生的数据。如果需要结果，可使用map函数。

根据执行的方式不同，forEach提供了三个版本：

1.  集合中所有元素并行执行
2.  一个一个顺序执行
3.  分批执行，同一批内并行，批与批之间按顺序

首先看并行执行的例子，它比较简单，只是打印出传入的元素内容：

> var arr = [{name:'Jack', delay: 200},  
>            {name:'Mike', delay: 100},  
>            {name:'Freewind', delay: 300}];
>
> async.forEach(arr, function(item, callback) {  
>     log(’1.1 enter: ‘ + item.name);  
>     setTimeout(function(){  
>         log(’1.1 handle: ‘ + item.name);  
>         callback();  
>     }, item.delay);  
> }, function(err) {  
>     log(’1.1 err: ‘ + err);  
> });

它将打出如下结果：

> 42.244> 1.1 enter: Jack  
> 42.245> 1.1 enter: Mike  
> 42.245> 1.1 enter: Freewind  
> 42.350> 1.1 handle: Mike  
> 42.445> 1.1 handle: Jack  
> 42.554> 1.1 handle: Freewind  
> 42.554> 1.1 err: undefined

最前面的数据是当前的时间值（秒.毫秒），从中可以看到各异步操作是并行执行的。

如果想同步执行，需要使用forEachSeries函数，它与forEach的用法一模一样，只是执行时是一个一个来的。这里就不给例子了。

当集合中元素很多，既不想一次全部并行操作，又不想一个一个按顺序来，可以使用forEachLimit函数。它可以设定一批处理几个，每一批内并行执行，批与批之间顺序执行。

> async.forEachLimit(arr, 2, function(item, callback) {  
>     log(’1.5 enter: ‘ + item.name);  
>     setTimeout(function(){  
>         log(’1.5 handle: ‘ + item.name);  
>         callback(null, item.name);  
>     }, item.delay);  
> }, function(err) {  
>     log(’1.5 err: ‘ + err);  
> });

打印结果如下：

> 42.247> 1.5 enter: Jack  
> 42.248> 1.5 enter: Mike  
> 42.351> 1.5 handle: Mike  
> 42.352> 1.5 enter: Freewind  
> 42.461> 1.5 handle: Jack  
> 42.664> 1.5 handle: Freewind  
> 42.664> 1.5 err: undefined

可以看到前两个是同时开始的，而第三个是等前两个都完成以后才开始的。

更多详细示例：[https://github.com/freewind/async_demo/blob/master/forEach.js](https://github.com/freewind/async_demo/blob/master/forEach.js)

## 2\. map(arr, iterator(item, callback), callback(err, results))

map的重点是转换，即把集合中的元素通过异步操作转为另一个对象，最后可以得到转换后的对象数组。它也提供了并行与顺序执行两种方式。

这里给一个示例，给集合中的每个元素以异步方式增加!!!：

> var arr = [{name:'Jack', delay:200}, {name:'Mike', delay: 100}, {name:'Freewind', delay:300}, {name:'Test', delay: 50}];
>
> async.map(arr, function(item, callback) {  
>     log(’1.1 enter: ‘ + item.name);  
>     setTimeout(function() {  
>         log(’1.1 handle: ‘ + item.name);  
>         callback(null, item.name+’!!!’);  
>     }, item.delay);  
> }, function(err,results) {  
>     log(’1.1 err: ‘, err);  
>     log(’1.1 results: ‘, results);  
> });

打印结果如下：

> 54.569> 1.1 enter: Jack  
> 54.569> 1.1 enter: Mike  
> 54.569> 1.1 enter: Freewind  
> 54.569> 1.1 enter: Test  
> 54.629> 1.1 handle: Test  
> 54.679> 1.1 handle: Mike  
> 54.789> 1.1 handle: Jack  
> 54.879> 1.1 handle: Freewind  
> 54.879> 1.1 err:  
> 54.879> 1.1 results: [ 'Jack!!!', 'Mike!!!', 'Freewind!!!', 'Test!!!' ]

可以看到，对各元素的操作是并行的，结果会汇总在一起交给最后的回调。

如果想顺序执行，可使用mapSeries，它与map的用法一模一样。

更多详细示例：[https://github.com/freewind/async_demo/blob/master/map.js](https://github.com/freewind/async_demo/blob/master/map.js)

## 3\. filter(arr, iterator(item, callback(test)), callback(results))

使用异步操作对集合中的元素进行筛选。需要注意的是，iterator的callback只有一个参数，只能接收true或false。

对于出错，该函数没有做出任何处理，直接由nodejs抛出。所以需要注意对Error的处理。

提供了并行与顺序执行两种方式。

并行示例，找到所有>=3的元素：

> async.filter([1,2,3,4,5], function(item, callback) {  
>     log(’1.1 enter: ‘ + item);  
>     setTimeout(function() {  
>         log(’1.1 test: ‘ + item);  
>         callback(item>=3);  
>     }, 200);  
> }, function(results) {  
>     log(’1.1 results: ‘, results);  
> });

打印结果如下：

> 16.739> 1.1 enter: 1  
> 16.749> 1.1 enter: 2  
> 16.749> 1.1 enter: 3  
> 16.749> 1.1 enter: 4  
> 16.749> 1.1 enter: 5  
> 16.749> 1.3 enter: 1  
> 16.949> 1.1 test: 1  
> 16.949> 1.1 test: 2  
> 16.949> 1.1 test: 3  
> 16.949> 1.1 test: 4  
> 16.949> 1.1 test: 5  
> 16.949> 1.1 results: [ 3, 4, 5 ]

可见找到了满足条件的所有元素。

如果需要顺序执行，可以使用filterSeries函数，它的用法与filter一样。

更多详细示例：[https://github.com/freewind/async_demo/blob/master/filter_reject.js](https://github.com/freewind/async_demo/blob/master/filter_reject.js)

## 4\. reject(arr, iterator(item, callback(test)), callback(results))

reject与filter相似，只是行为正好相反。当条件为true时，它将丢弃相应的元素。它也提供了并行与顺序执行两种方式。

并行示例，去掉所有>=3的元素：

> async.reject([1,2,3,4,5], function(item, callback) {  
>     log(’1.4 enter: ‘ + item);  
>     setTimeout(function() {  
>         log(’1.4 test: ‘ + item);  
>         callback(item>=3);  
>     }, 200);  
> }, function(results) {  
>     log(’1.4 results: ‘, results);  
> });

打印结果如下：

> 31.359> 1.4 enter: 1  
> 31.359> 1.4 enter: 2  
> 31.359> 1.4 enter: 3  
> 31.359> 1.4 enter: 4  
> 31.359> 1.4 enter: 5  
> 31.559> 1.4 test: 1  
> 31.559> 1.4 test: 2  
> 31.559> 1.4 test: 3  
> 31.559> 1.4 test: 4  
> 31.559> 1.4 test: 5  
> 31.569> 1.4 results: [ 1, 2 ]

如果想顺序执行，可使用rejectSeries，它与reject用法一样。

更多详细示例：[https://github.com/freewind/async_demo/blob/master/filter_reject.js](https://github.com/freewind/async_demo/blob/master/filter_reject.js)

## 5\. reduce(arr, memo, iterator(memo,item,callback), callback(err,result))

Reduce可以让我们给定一个初始值，用它与集合中的每一个元素做运算，最后得到一个值。reduce从左向右来遍历元素，如果想从右向左，可使用reduceRight。

这里给个例子，计算出100与某个集合中所有数之和：

> var arr = [1,3,5];
>
> async.reduce(arr, 100, function(memo, item, callback) {  
>     log(’1.1 enter: ‘ + memo +’, ‘ + item);  
>     setTimeout(function() {  
>         callback(null, memo+item);  
>     }, 100);  
> },function(err, result) {  
>     log(’1.1 err: ‘, err);  
>     log(’1.1 result: ‘, result);  
> });

将打印出结果：

> 28.789> 1.1 enter: 100, 1  
> 28.889> 1.1 enter: 101, 3  
> 28.999> 1.1 enter: 104, 5  
> 29.109> 1.1 err:  
> 29.109> 1.1 result: 109

需要注意的是，async中的reduce，不是并行操作，而是对元素一个个顺序操作，所以当元素比较多时，性能会比较弱。如果想提高性能，可使用async.map函数，先并行得到集合中每个元素被处理之后的值，然后再使用Array.prototype.reduce函数处理，性能会快很多。

对于这个例子：

> async.reduce(arr, 100, function(memo,item,callback) {  
>     log(’1.4 enter: ‘+memo+’,'+item);  
>     t.inc(item, function(err,n) {  
>         log(’1.4 handle: ‘,n);  
>         callback(null, memo+n);  
>     });  
> }, function(err,result) {  
>     log(’1.4 err: ‘, err);  
>     log(’1.4 result: ‘, result);  
> });

它总耗时为0.62秒。如果换成map+array.reduce:

> async.map(arr, function(item, callback) {  
>     log(’1.5 enter: ‘, item);  
>     t.inc(item, function(err,n){  
>         log(’1.5 handle: ‘, n);  
>         callback(null,n);  
>     });   
> },function(err, results) {  
>     log(’1.5 err: ‘, err);  
>     log(’1.5 results: ‘, results);  
>     var sum = results.reduce(function(memo, item) {  
>         return memo + item;  
>     }, 100);  
>     log(’1.5 sum: ‘, sum);  
> });

耗时为0.21秒。

更多详细示例：[https://github.com/freewind/async_demo/blob/master/reduce.js](https://github.com/freewind/async_demo/blob/master/reduce.js)

## 6\. detect(array, iterator(item,callback(test)), callback(result)

用于取得集合中满足条件的第一个元素。它分为并行与顺序执行两种方式，分别对应函数detect和detectSeries。

并行示例，找到一个奇数：

> var arr = [{value:1,delay:500},  
>            {value:2,delay:200},  
>            {value:3,delay:300}];  
> async.detect(arr, function(item,callback){  
>     log(’1.1 enter: ‘, item.value);  
>     setTimeout(function() {
>
>         log(’1.1 handle: ‘, item.value);  
>         callback(n%2===1);  
>     }, item.delay);  
> }, function(result) {  
>     log(’1.1 result: ‘, result);  
> });

结果如下：

> 09.928> 1.1 enter: 1  
> 09.928> 1.1 enter: 2  
> 09.928> 1.1 enter: 3  
> 10.138> 1.1 handle: 2  
> 10.228> 1.1 handle: 3  
> 10.228> 1.1 result: { value: 3, delay: 300 }  
> 10.438> 1.1 handle: 1  
> 10.438> 1.1 handle: 1

可见得到了最先执行完的那个奇数3.

更多详细示例：[https://github.com/freewind/async_demo/blob/master/detect.js](https://github.com/freewind/async_demo/blob/master/detect.js)

## 7\. sortBy(array, iterator(item,callback(err,result)), callback(err,results))

对集合内的元素进行排序，依据每个元素进行某异步操作后产生的值，从小到大排序。

示例：

> var arr = [3,6,1];
>
> async.sortBy(arr, function(item, callback) {  
>     setTimeout(function() {  
>         callback(null,item);  
>     }, 200);  
> }, function(err,results) {  
>     log(’1.1 err: ‘, err);  
>     log(’1.1 results: ‘, results);  
> });

打印结果如下：

> 26.562> 1.1 err: null  
> 26.562> 1.1 results: [ 1, 3, 6 ]

可以看到集合中的数据从小到大排好了序。

更多详细示例：[https://github.com/freewind/async_demo/blob/master/sortBy.js](https://github.com/freewind/async_demo/blob/master/sortBy.js)

## 8\. some/any(arr, iterator(item,callback(test)), callback(result))

当集合中是否有至少一个元素满足条件时，最终callback得到的值为true，否则为false。它有一个别名叫any。

判断集合中是否有元素小于等于3：

> async.some([1,2,3,6], function(item,callback){  
>     log(’1.1 enter: ‘,item);  
>     setTimeout(function(){  
>         log(’1.1 handle: ‘,item);  
>         callback(item<=3);  
>     },100);     
> }, function(result) {  
>     log(’1.1 result: ‘, result);  
> });

打印结果如下：

> 36.165> 1.1 enter: 1  
> 36.165> 1.1 enter: 2  
> 36.165> 1.1 enter: 3  
> 36.165> 1.1 enter: 6  
> 36.275> 1.1 handle: 1  
> 36.275> 1.1 result: true  
> 36.275> 1.1 handle: 2  
> 36.275> 1.1 handle: 3  
> 36.275> 1.1 handle: 6

可见的确得到了结果true。

更多详细示例：[https://github.com/freewind/async_demo/blob/master/some.js](https://github.com/freewind/async_demo/blob/master/some.js)

## 9\. every/all(arr, iterator(item,callback), callback(result))

如果集合里每一个元素都满足条件，则传给最终回调的result为true，否则为false

在下面的示例中，因为集合中每个元素都<=10，所以最终结果为true

> async.every(arr, function(item,callback){  
>     log(’1.1 enter: ‘,item);  
>     setTimeout(function(){  
>         log(’1.1 handle: ‘,item);  
>         callback(item<=10);  
>     },100);     
> }, function(result) {  
>     log(’1.1 result: ‘, result);  
> });

打印如下：

> 32.113> 1.1 enter: 1  
> 32.123> 1.1 enter: 2  
> 32.123> 1.1 enter: 3  
> 32.123> 1.1 enter: 6  
> 32.233> 1.1 handle: 1  
> 32.233> 1.1 handle: 2  
> 32.233> 1.1 handle: 3  
> 32.233> 1.1 handle: 6  
> 32.233> 1.1 result: true

可见最终结果为true

更多详细示例：[https://github.com/freewind/async_demo/blob/master/every.js](https://github.com/freewind/async_demo/blob/master/every.js)

## 10\. concat(arr, iterator(item,callback(err,result)), callback(err,result))

将合并多个异步操作的结果合并为一个数组。

在下面的示例中，将集合中的每一个元素都加倍：

> async.concat(['aa','bb'], function(item,callback) {
>
>     setTimeout(function() {
>
>         callback(null, [item, item]);
>
>     }, 100);
>
> }, function(err, values) {
>
>     log(’1.1 err: ‘, err);
>
>     log(’1.1 values: ‘, values);
>
> });

打印如下：

> 13.539> 1.1 err:
>
> 13.639> 1.1 values: [ 'aa', 'aa', 'bb', 'bb' ]

打印出来的是经过合并后的数组。

更多详细示例：[https://github.com/freewind/async_demo/blob/master/concat.js](https://github.com/freewind/async_demo/blob/master/concat.js)

关于async的api解释到此为止，我将会在以后的项目中使用它。以后使用熟悉之后，再研究一下他的源代码，写一些心得。
