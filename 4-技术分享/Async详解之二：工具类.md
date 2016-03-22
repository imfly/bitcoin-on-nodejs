# Async详解之二：工具类

[摘要：转载：http://freewind.me/blog/20120517/931.html 比拟“之一”，那一篇要简略良多，算是中场苏息，为下半场的“调集处置惩罚”做预备。 Async中供应了几个对象类，给我们供应一些小方便： memoi]  

转载：http://freewind.me/blog/20120517/931.html

相比“之一”，这一篇要简单很多，算是中场休息，为下半场的“集合处理”做准备。

Async中提供了几个工具类，给我们提供一些小便利：

1.  memoize
2.  unmemoize
3.  log
4.  dir
5.  noConflict

1\. memoize(fn, [hasher])

有一些方法比较耗时，且对于相同的输入总是有相同的输出。这时可以使用memoize给它加个缓存，对于相同的参数只计算一次，以后就直接从缓存中取结果用了。

比如这里有一个很慢的函数：

> var slow_fn = function(x, y, callback) {   
>     console.log(‘start working for: ‘ + x+’,'+y);   
>     t.wait(100);   
>     console.log(‘finished: ‘ + x+’,'+y);   
>     callback(null, ‘im slow for: ‘+x+’,'+y);   
> };

可以用memoize生成一个新的带缓存的函数：

> var fn = async.memoize(slow_fn);

试试同样参数调用两次：

> fn(‘a’,'b’, function(err, result) {   
>     console.log(result);   
> });
>
> // 直接得到之前计算好的值   
> fn(‘a’,'b’, function(err, result) {   
>     console.log(result);   
> });

注意memoize的参数中还有一个hasher，它是做什么用的呢？它可以让我们自定义如果根据参数来判断是否从缓存中取。默认情况下，两次调用，只有参数完全一样的时候才会从缓存中取。这里我们使用hasher来改变规则。

> var fn_hasher = async.memoize(slow_fn, function(x,y) {   
>     return x+y;   
> });

新定义的这个，将根据两个参数的和来判断。

> fn_hasher(‘cd’,'e’, function(err, result) {   
>     console.log(result);   
> });
>
> fn_hasher(‘c’,'de’, function(err, result) {   
>     console.log(result); // 可以取得前面(‘cd’,'e’)的计算结果   
>                          // im show for: cd,e   
> });

第二次的调用，虽然参数跟第一次不一样，但是其和却一样，所以直接从缓存中拿到前次运行结果。

2\. unmemoize(fn)

unmemoize的作用正好跟memoize相反，它可以把一个带缓存的函数再变回原样：

> var fn2 = async.unmemoize(fn);   
> console.log(‘unmemoized’);
>
> fn2(‘a’,'b’, function(err,result) {   
>     console.log(result);   
> });

经过unmemoize后，再运行该函数就得重新运算了。

3\. log(function, arguments)

log用于快速执行某异步函数，并记录它的返回值。试验函数时很方便，不用写那些固定模式的代码。

> var x = function() {   
>     this.name = ‘Freewind’;   
> }   
> var hello = function(name, callback) {   
>     setTimeout(function() {   
>         callback(null, ‘hello ‘ + name, ‘nice to see you ‘ + name, x, {a:’123′});   
>     }, 200);   
> };
>
> async.log(hello, ‘world’);

打印结果如下：

> hello world   
> nice to see you world   
> [Function]   
> { a: ’123′ }

可以看到，它直接运行了该函数，并以每行一个参数的形式打印出了结果。

4\. dir(function, arguments)

该函数与log非常像，不同之处在于，它最终调用了console.dir，而log最终调用了console.log。

看看使用dir打印的效果如何：

> async.dir(hello, ‘world’);

结果：

> ‘hello world’   
> ‘nice to see you world’   
> [Function]   
> { a: ’123′ }

仅仅是多了几个单引号。为了弄清楚dir存在的意义（什么情况下应该使用dir而不是log），我提了一个问题，参看：http://stackoverflow.com/questions/10636866/whats-the-difference-between-async-log-and-async-dir

5\. noConflict

最后是这个noConflict，它仅仅用于浏览器端，在nodejs中没用，这里无法演示。

它的作用是：如果之前已经在全局域中定义了async变量，当导入本async.js时，会先把之前的async变量保存起来，然后覆盖它。用完之后，调用noConflict()方法，就会归还该值。同时返回async本身供换名使用。

这里可以看一下它的实现代码：

> // global on the server, window in the browser   
> var root = this,   
>     previous_async = root.async;
>
> if (typeof module !== ‘undefined’ && module.exports) {   
>     module.exports = async;   
> }   
> else {   
>     root.async = async;   
> }
>
> async.noConflict = function () {   
>     root.async = previous_async;   
>     return async;   
> };

可以看到，当处于nodejs或者commonjs环境中，它会执行module.exports=async，在其它情况下（通常为浏览器端）才会root.async=async，将async赋值给root。

在浏览器中的用法如下：

> <script type="text/javascript" src="other_lib.js"></script>   
> <script type="text/javascript" src="async.js"></script>   
> <script type="text/javascript">
>
>   // code using async   
>   async.noConflict();   
>   // Code that uses other library’s ‘async’ can follow here.   
> </script>

感谢关注 Ithao123精品文库频道，ithao123.cn是专门为互联网人打造的学习交流平台，全面满足互联网人工作与学习需求，更多互联网资讯尽在 IThao123!
