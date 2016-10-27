# 您必须知道的几个Node.js编码习惯

## 前言

前面的两篇，以`sacdl`工程为例，简单介绍了Node.js的环境搭建和代码组织。这一篇，做个简单的小结，把涉及到的编码习惯用我个人的理解，提示性的说明一下。

编程，其实就是用`特定的语言`讲故事、写规则。`特定`就是习惯，就像中国的方言，掌握了技巧，很快可以交流，剩下的细节慢慢积累就是。

比特币体现了人类去中心化的本质，Node.js也是最能体现人类特质的编程语言之一，比如：一切都是数据流，事事皆回调。下面，让咱们慢慢品鉴一下吧。

## 1、一切都是数据流

#### 概念理解

`Node.js`默认提供了`Stream`模块，即：流，我们在第二篇讲解gulp的时候说起过。作为一个抽象接口，它是Node.js的基础模块，被其他很多模块所使用。

流，最早是linux环境下的概念，与之对应的方法经常是pipe，即：管道（方法）。我个人理解，这种设计非常形象合理。流的概念存在于人类生活的任何场景，数据流，与水流、空气流等具有相同的特性。如：

（1）流，兼具时间和地点两个坐标，时间代表一个过程，地点代表流入、流出（对应发生、结束的编码）位置;

（2）流，是一个时间上的线性过程，而非一个时间点。在时间段内的传输只是部分数据，若要获得完整的数据，就需要花费足够的时间;

（3）流，只能沿着构建在从发生到结束的编码位置的管道传输，在传输的过程中，可以被调整和改变;

再直白一些，流，不可能一下子发生或结束，再快也得有个时间差。就像人类社会，始终以时间为单位，这一刻到下一刻，已经发生变化。而Node.js严格尊重这个现实，无论是远程访问，还是本地请求，每一个data都被分成一段一段数据流（通常是Buffer对象）传输。

因此，Node.js里没有简单拷贝的概念，或者说拷贝其实可以通过流来简单实现。

#### 代码示例

比如：

```
//引用模块
var fs = require('fs');

var rs = fs.createReadStream('test.md');
var chunks = [],
    size = 0;

//接受数据：一段段的接受
rs.on("data", function (chunk){
  chunks.push(chunk);
  size += chunk.length;
});

//拼接数据，并转换为字符串（**注**：如果 test.md 不是 UTF-8 编码格式的，如果直接
//转换为字符串，可能会出现乱码，这时需要使用其他的模块（比如：iconv-lite）来进行转换）
rs.on("end", function() {
  var data = Buffer.concat(chunks, size);
  var str = data.toString("utf8");
  console.log(str);
});
```

其实，在Express的编码中，默认也是在处理buffer数据流，上面的方法照样适用。

#### 思维习惯

记住，在Node.js的世界里，无论是处理文件，还是请求远程资源，处理的就是“数据流”，处理方法都是如此。为了直观，还是用第二篇里那张`管道`图吧：

![pipe][]

**进一步**：因为任何`流`都是时间的函数，为了节省时间、提高效率，最好的方式，当然是`并行`处理。也就是说每一个`流`最好使用一个独立的线程，而不影响其他的。事实上，Node.js就是这么处理的，这就是下面要说的`回调`。看看上面的代码形式，就是典型的`回调`用法。

## 2、事事皆回调

#### 概念理解

中文`回调`这个词，总不能让人一下子就理解得那么透亮。其实，如果按英文`callback`直译最好，`调回`虽然直白，但好理解。

“事事皆回调”，是不是有点绝对？其实不然，它贯穿在人类沟通交往的全过程。大到工程项目，小到求助问路，只要是你必须或需要别人帮你干的事，就得用到`回调`，即：让他人完成并获得明确的回应。让别人为你做某件事，叫事件触发;给一个方法获得该事结束后的结果，就是`回调`。

举个典型的示例：假如你是一位老板，很多事情需要下属去做，然后获得结果。如果下属合格，安排的事情，他（她）会按照要求给你回应，即便没有达到预期的结果，聪明的下属也会及时向你汇报进展。但现实普遍存在的现象是，老板安排的很多事情并不能得到及时回应，这时候你就得亲自过问，要不打电话、要么派秘书或办公室人员去追踪，总之，要有一条`通信线路`让你得到回馈（无论好坏）。

这里，优秀员工主动汇报工作的行为，以及老板打电话或派人的行为，都是`回调`方法。很容易想象，假如没有这些`回调`，我们还能做成什么事，世界会是什么样。一些国字号的企业，为什么效率低下？几个人干着其他公司一个人的活？社会批评说是懒散，是不干活吗？不尽然，其中大部分是不给你`回调`（或者给你不明确的`回调`），让你无从干起。

因此，一个优秀的老板，一定是一个会选人、用人和培养人的人，如果员工只知道埋头干活，不知道及时反馈信息，老板一定会有自己的招式应对;一个优秀的员工，一定是一个让老板节省脑力的人，事前、事中、事后都会适时汇报情况。总之，只要想做事、做成事，一个企业或组织会自觉地对信息`回调`的方法进行优化，降低沟通成本，提高效率。

具体到Node.js的程序，我们形象的比喻一下就是，主线程是老板，子线程（`线程池`）是员工，而`回调`就是它们之间的通信方法。使用`回调`的代码，我们称为`异步`编程。说白了，就是你干自己擅长的、份内的事，其他的都交给别人去做。即：对主线程而言，是`异步`，而从局外人来看，是在`同步`做事情。

**注意**：Node.js是单进程的（而非单线程，官网解释的很清楚），只不过我们写的js代码仅在单（主）线程运行罢了，`回调`都放在事件轮循里处理，而事件轮循等底层代码跑在多线程上（即大家公认的线程池）。这部分讨论，我们会在后续章节，比如加密解密部分，结合如何编写CPU密集型程序去深入讨论。

#### 代码示例

具体形式，在前面的文章中用过多次了，这里再举个例子，类比一下：

（1）在前端开发时，我们用d3.js通过Ajax的方式请求数据的代码，可以简化为：

```
d3.json('/resource.json', function(err, data){
   //code
   console.log("Hello, ", data);
});

console.log("I`m end.");
```

这里，我们请求的`/resource.json`，其实就是远程服务器上的资源`http://localohost:3000/resource.json`，后面紧跟的函数就是`回调`函数，要在资源请求结束之后，才会调用。所以，｀Hello，...`必然要出现在`I'm end.`之后。

(2)在后台开发时，我们也有与之几乎一样的代码：

```
var fs = requrie('fs');
fs.readFoile('/resource.json', function(err, data){
   //code
   console.log("Hello, ", data);
});

console.log("I`m end.");
```

这里，我们请求的`/resource.json`，其实就是本地的资源`resource.json`文件，后面紧跟的函数也是`回调`函数，同样要在资源请求结束之后，才会调用。所以，｀Hello，...`也会出现在`I'm end.`之后。

#### 思维习惯

在Node.js的世界，到处是`回调`（多数使用callback、next、cb等命名回调函数），到处是`异步`，当你不自觉的编写了下面的代码，而反复调试，得不到`data`预期的结果时，要意识到，您已掉进了`异步`的陷阱，忘记了`回调`。

```
var fs = requrie('fs');
var data = fs.readFile('/resource.json'); //异步方法

//code
console.log("Hello, ", data);

console.log("I`m end.");

```

当然，可以这样修改上面的错误代码：

```
var data = fs.readFileSync('/resource.json'); //同步方法
```

在很多其他编程语言里，就是这么用的。这样做的好处，就是直观，便于人类直线思考。坏处就是，数据（流）大时，必然需要长时间执行，直接`阻塞`进程，整个程序只好停下来等着，这就是`I/O阻塞`。

Node.js因为用了`回调`，js代码所在的（主）线程会把一切`回调`扔给后台的线程池去处理，而自己一步到底，所以叫`I/O非阻塞`。

**进一步**：既然“事事皆回调”，那么`回调`里面也可能有`回调`，事实上，这种情况非常多。这也是很多人对Node.js畏惧的原因之一，多年的高手也经常栽在上面，于是大家总结有`回调大坑`的说法，就是回调嵌套太多，流程复杂，难以驾驭。

不过，社区已经提供了很多方案，比如：Async,promise等流程化组件，就能很好的解决这个问题。具体细节，后面在阅读代码时再说。下面说说因为`回调`而更加棘手的问题——程序异常（错误）的处理。

## 3、异常要捕捉

回调太多、异常难捕捉，是Node.js被广为诟病的地方。Node.js是单进程的应用，异常如果未被正确处理，一旦抛出，就会引起整个进程死掉。而异常多发生在回调函数里，回调非常复杂的时候，异常很难定位。所以，很多人说，Node.js很快，但很脆弱。有利就有弊，这就是真实的世界。

与之形成鲜明对比的是，使用ruby on rails的小伙伴一定印象深刻，任何一个`error`发生，RoR抛出的错误信息里，都会明确给出出错的代码位置，而且通常都非常准确。

#### 概念理解

（下面的内容，主要学习引用了这篇文章，[NodeJS 错误处理最佳实践][]，我个人受益匪浅，感谢原作者)

异常，通常分类两种类型，一个是`失败`：正确的程序在运行时因为其他因素导致的失败，如：内存不足、网络不通、远程服务器塔机等，是可以预期的;另一个是`失误`，也就是bug，通常是程序员个人的问题，比如敲错了变量名、方法名，甚至逻辑错误等。

我们这里所讲的`异常`处理，就是第一类`失败`的情况，能够让正确的程序在任何情况下永远不`失败`，那才叫`健壮`。而对于另一种`失误`的处理，也就是Bug，只能要求程序员个人加强修炼，避免一些低级错误;对于一些深层次的逻辑错误，努力提高调试和测试水平，力争找到问题所在;或者发挥社区力量，群策群力。

#### 失败类型

`失败`的原因通常是客观存在的，可以在代码里被有效处理。比如：系统本身（内存不足或者打开文件数过多），系统配置（没有到达远程主机的路由），网络问题（端口挂起），远程服务（500错误，连接失败）。主要场景，如：

* 连接不到服务器
* 无法解析主机名
* 无效的用户输入
* 请求超时
* 服务器返回500
* 套接字被挂起
* 系统内存不足

`失误`的原因多为主观因素，除非修正错误，否则永远无法被有效处理。主要场景，如：

* 读取一个 undefined 属性
* 调用异步函数没有指定回调
* 传递了错误参数：该传对象的时候传了一个字符串，或其他内容等

#### 处理方法

错误处理并不是可以凭空加到一个没有任何错误处理的程序中的。没有办法在一个集中的地方处理所有的异常。需要考虑任何会导致失败的代码（比如打开文件，连接服务器，Fork子进程等）可能产生的结果。包括为什么出错，错误背后的原因。

更具体点说。对于一个给定的错误，可以做这些事情:

**（1）直接处理**。有的时候该做什么很清楚。如果你在尝试打开日志文件的时候得到了一个ENOENT错误，很有可能你是第一次打开这个文件，你要做的就是首先创建它。更有意思的例子是，你维护着到服务器（比如数据库）的持久连接，然后遇到了一个“socket hang-up”的异常。这通常意味着要么远端要么本地的网络失败了。很多时候这种错误是暂时的，所以大部分情况下你得重新连接来解决问题。（这和接下来的重试不大一样，因为在你得到这个错误的时候不一定有操作正在进行）

**（2）报告给客户端**。如果你不知道怎么处理这个异常，最简单的方式就是放弃你正在执行的操作，清理所有开始的，然后把错误传递给客户端。这种方式适合错误短时间内无法解决的情形。比如，用户提交了不正确的JSON，你再解析一次是没什么帮助的。

**（3）重试操作**。对于那些来自网络和远程服务的错误，有的时候重试操作就可以解决问题。比如，远程服务返回了503（服务不可用错误），你可能会在几秒种后重试。如果确定要重试，你应该清晰的用文档记录下将会多次重试，重试多少次直到失败，以及两次重试的间隔。另外，不要每次都假设需要重试。如果在栈中很深的地方（比如，被一个客户端调用，而那个客户端被另外一个由用户操作的客户端控制），这种情形下快速失败让客户端去重试会更好。如果栈中的每一层都觉得需要重试，用户最终会等待更长的时间，因为每一层都没有意识到下层同时也在尝试。

**（4）直接崩溃**。对于那些本不可能发生的错误，或者由程序员失误导致的错误（比如无法连接到同一程序里的本地套接字），可以记录一个错误日志然后直接崩溃。其它的比如内存不足这种错误，是JavaScript这样的脚本语言无法处理的，崩溃是十分合理的。（即便如此，在child_process.exec这样的分离的操作里，得到ENOMEM错误，或者那些你可以合理处理的错误时，你应该考虑这么做）。在你无计可施需要让管理员做修复的时候，你也可以直接崩溃。如果你用光了所有的文件描述符或者没有访问配置文件的权限，这种情况下你什么都做不了，只能等某个用户登录系统把东西修好。

**（5）记录错误**。有的时候你什么都做不了，没有操作可以重试或者放弃，没有任何理由崩溃掉应用程序。举个例子，你用DNS跟踪了一组远程服务，结果有一个DNS失败了。除了记录一条日志并且继续使用剩下的服务以外，你什么都做不了。但是，你至少得记录点什么（凡事都有例外。如果这种情况每秒发生几千次，而你又没法处理，那每次发生都记录可能就不值得了，但是要周期性的记录）。

#### 编码实践

**（1）错误的编码方式**

下面的代码是不能正确处理异常的。如果不明白，请重新温习一下`回调`部分，记住“事事皆回调”。

```
function myApiFunc(callback)
{
	/*
	 * 这种模式并不工作
	 */
	try {
	  doSomeAsynchronousOperation(function (err) { //异步的原因，这里的回调函数被放在另一个线程独立工作，并不在try/catch下工作
	    if (err)
	      throw (err);
	    /* continue as normal */
	  });
	} catch (ex) {
	  callback(ex);
	}
}
```

用惯了其他语言进行同步编程，一开始很容易这么写代码。直观上，上面的代码是想要在出现异步错误的时候调用callback，并把错误作为参数传递。他们错误地认为在自己的回调函数（传递给 doSomeAsynchronousOperation 的函数）里throw一个异常，会被外面的catch代码块捕获。

try/catch和异步函数不是这么工作的。回忆一下，`回调`（异步）函数的意义就在于被调用的时候myApiFunc函数已经执行了（非柱塞），这意味着try代码块已经退出。这个回调函数外面，事实上，并没有try的代码块在作用。如果用这个模式，结果就是抛出异常的时候，程序崩溃了。

**（2）怎么传递错误？**

Node.js提供了3种基本的传递模式，分别是Throw， Callback，以及 EventEmitter：

* throw以同步的方式传递异常--也就是在函数被调用处的相同的上下文。如果调用者（或者调用者的调用者）用了try/catch，则异常可以捕获。如果所有的调用者都没有用，那么程序通常情况下会崩溃（异常也可能会被domains或者进程级的uncaughtException捕捉到，详见下文）。

* Callback是最基础的异步传递事件的一种方式。用户传进来一个函数（callback），之后当某个异步操作完成后调用这个 callback。通常 callback 会以callback(err,result)的形式被调用，这种情况下， err和 result必然有一个是非空的，取决于操作是成功还是失败。

* 更复杂的情形是，函数没有用 Callback 而是返回一个 EventEmitter 对象，调用者需要监听这个对象的 error事件。这种方式在下面两种情况下很有用，

一种是：当在做一个可能会产生多个错误或多个结果的复杂操作的时候。比如，有一个请求一边从数据库取数据一边把数据发送回客户端，而不是等待所有的结果一起到达。在这个例子里，没有用 callback，而是返回了一个 EventEmitter，每个结果会触发一个row 事件，当所有结果发送完毕后会触发end事件，出现错误时会触发一个error事件。

另一种：用在那些具有复杂状态机的对象上，这些对象往往伴随着大量的异步事件。例如，一个套接字是一个 EventEmitter，它可能会触发“connect“，”end“，”timeout“，”drain“，”close“事件。这样，很自然地可以把”error“作为另外一种可以被触发的事件。在这种情况下，清楚知道”error“还有其它事件何时被触发很重要，同时被触发的还有什么事件（例如”close“），触发的顺序，还有套接字是否在结束的时候处于关闭状态。

其实，callback 和 EventEmitter 可以归为一类，不要同时使用。

**（3）怎么使用它们？**

通用的准则是：你即可以同步传递错误（抛出），也可以异步传递错误（通过传给一个回调函数或者触发EventEmitter的 error事件），但是不用同时使用。具体用哪一个取决于异常是怎么传递的，这点得在文档里说明清楚。

**（4）`domain` 和 `process.on('uncaughtException')` 用还是不用？**

客观上，`失败`可以被显示的机制所处理。`Domain` 以及进程级别的`uncaughtException`主要是用来从未料到的程序错误恢复的，这两种方式不鼓励使用。其实，它们通常被用在整个应用级别，作为一种保障机制，而不是在具体编码过程中。

#### 代码示例

下面的函数会异步地连接到一个IPv4地址的TCP端口。

```
/*
* Make a TCP connection to the given IPv4 address.  Arguments:
*
*    ip4addr        a string representing a valid IPv4 address
*
*    tcpPort        a positive integer representing a valid TCP port
*
*    timeout        a positive integer denoting the number of milliseconds
*                   to wait for a response from the remote server before
*                   considering the connection to have failed.
*
*    callback       invoked when the connection succeeds or fails.  Upon
*                   success, callback is invoked as callback(null, socket),
*                   where `socket` is a Node net.Socket object.  Upon failure,
*                   callback is invoked as callback(err) instead.
*
* This function may fail for several reasons:
*
*    SystemError    For "connection refused" and "host unreachable" and other
*                   errors returned by the connect(2) system call.  For these
*                   errors, err.errno will be set to the actual errno symbolic
*                   name.
*
*    TimeoutError   Emitted if "timeout" milliseconds elapse without
*                   successfully completing the connection.
*
* All errors will have the conventional "remoteIp" and "remotePort" properties.
* After any error, any socket that was created will be closed.
*/
function connect(ip4addr, tcpPort, timeout, callback)
{
assert.equal(typeof (ip4addr), 'string',
    "argument 'ip4addr' must be a string");
assert.ok(net.isIPv4(ip4addr),
    "argument 'ip4addr' must be a valid IPv4 address");
assert.equal(typeof (tcpPort), 'number',
    "argument 'tcpPort' must be a number");
assert.ok(!isNaN(tcpPort) && tcpPort > 0 && tcpPort < 65536,
    "argument 'tcpPort' must be a positive integer between 1 and 65535");
assert.equal(typeof (timeout), 'number',
    "argument 'timeout' must be a number");
assert.ok(!isNaN(timeout) && timeout > 0,
    "argument 'timeout' must be a positive integer");
assert.equal(typeof (callback), 'function');

/* do work */
}

```

这个例子很简单，但是展示了上面所谈论的一些建议：

* 参数，类型以及其它一些约束被清晰的文档化。
* 这个函数对于接受的参数是非常严格的，并且会在得到错误参数的时候抛出异常（程序员的失误）。
* 可能出现的`失败`集合被记录了。通过不同的"name"值可以区分不同的异常，而"errno"被用来获得系统错误的详细信息。
* 异常被传递的方式也被记录了（通过失败时调用回调函数）。
* 返回的错误有"remoteIp"和"remotePort"字段，这样用户就可以定义自己的错误了（比如，一个HTTP客户端的端口号是隐含的）。
* 虽然很明显，但是连接失败后的状态也被清晰的记录了：所有被打开的套接字此时已经被关闭。

#### Error 对象属性命名约定

强烈建议在发生错误的时候用这些名字来保持和Node.js核心以及Node.js插件的一致。这些大部分不会和某个给定的异常对应，但是出现疑问的时候，应该包含任何看起来有用的信息，即从编程上，也从自定义的错误消息上。

```
localHostname，localIp，localPort，remoteHostname，remoteIp，remotePort，path，srcpath，vdstpath

hostname，ip，propertyName，propertyValue，syscall，errno
```

## 总结

本文讨论的内容，不仅是初学者经常困惑的地方，很多高手也会不自觉的掉进陷阱。理解了流，有效解决了回调和异常，编写Node.js程序就是一个简单且享受的过程。

本文原本想具体讨论Async、domain等非常具体的解决方案的，不过，限于篇幅和时间，只好暂时放在后面文章里说明。参考里，有几篇较好的文章，有兴趣的，自行翻阅吧。

截至本文，我们用4篇文章，首先考查了币圈Node.js的应用情况，简单介绍了Node.js入门知识，为研究学习Node.js应用奠定了基础。接下来，正式进入`源码解读`阶段，请看下一篇：**亿书，一个面向未来的自出版平台**，简单介绍之后，我们会从整体上分析它的功能模块布局。

## 参考

node.js中流(stream)的理解：http://segmentfault.com/a/1190000000519006

Linux管道PIPE的原理和应用: https://www.hitoy.org/pipe-aplication-in-linux.html

在单线程的情况下，NodeJs是如何分发子任务去执行的？ http://www.zhihu.com/question/24780826

Node is Not Single Threaded： http://rickgaribay.net/archive/2012/01/28/node-is-not-single-threaded.aspx

Node.js 异步异常的处理与domain模块解析: https://cnodejs.org/topic/516b64596d38277306407936


[pipe]: ../styles/images/third/pipe.png
[NodeJS 错误处理最佳实践]: http://segmentfault.com/a/1190000002741935#articleHeader3
