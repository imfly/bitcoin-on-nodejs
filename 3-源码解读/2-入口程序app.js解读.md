# 入口程序app.js解读


## 前言

在入门文章部分，我们已经知道，Nodejs的应用最终都可以合并成一个文件，为了开发方便，才将其拆分成多个文件。

被拆分的那个文件，自然是我们重点研究的对象，通常这个文件就是App.js或server.js，我把它称之为`入口程序`。

显然Ebookcoin用的就是app.js。这一篇，我们就来阅读一下该文件，学习研究它的整体架构流程。

## 源码

地址： https://github.com/Ebookcoin/ebookcoin/blob/master/app.js

## 类图

js原本无类，因此它的类图并不好处理，仅能大致给出它与其他模块的关联关系。

![appjs-uml][]

## 解读

直接读代码看看。

#### 1.配置处理

任何一个应用，都会提供一些参数。对这些参数的处理，有很多种方案。但总的来说，通常需要提供一种理想环境，即默认配置，同时给你一种方法自行修改。

（1）全局默认配置

通常默认参数较少时，可以硬编码到代码里。但更灵活的方式，就是使用单独文件。这里就使用了文件 `./config.json` 来保存全局配置，如：

```
{
    "port": 7000,
    "address": "0.0.0.0",
    "serveHttpAPI": true,
    "serveHttpWallet": true,
    "version": "0.1.1",
    "fileLogLevel": "info",
    "consoleLogLevel": "log",
    "sharePort": true,
    ...
```

使用时，只需要`require`就可以了。源码：

```
var appConfig = require("./config.json"); // app.js 4行
```

不过，为了灵活性，默认值通常允许用户修改。

（2）使用`commander`组件，引入命令行选项

`commander`是Nodejs第三方组件（使用npm安装），常被用来开发命令行工具，用法极为简单。源码：

```
// 1行
var program = require('commander');

// 19行
program
	.version(packageJson.version)
	.option('-c, --config <path>', 'Config file path')
	.option('-p, --port <port>', 'Listening port number')
	.option('-a, --address <ip>', 'Listening host name or ip')
	.option('-b, --blockchain <path>', 'Blockchain db path')
	.option('-x, --peers [peers...]', 'Peers list')
	.option('-l, --log <level>', 'Log level')
	.parse(process.argv);
```

这样，就可以在命令行执行命令时，加带`-c`,`-p`等选项，例如：

```
node app.js -p 8888
```

这时，该选项就以`program.port`的形式被保存，于是手动修改一下：

```
// 39行
if (program.port) {
	appConfig.port = program.port;
}
```

这是处理Nodejs应用全局配置的一种常用且简单的方式，值得学习。

更多内容，我们在下一篇对`commander`组件进行详细介绍。

#### 2.异常捕捉

我们在第一部分总结时，特意提到`异常要捕捉`，这里我们很轻松就可以看出来，代码对全局异常处理的方式。

（1）使用`uncaughtException`捕捉进程异常

```
// 65行
process.on('uncaughtException', function (err) {
	// handle the error safely
	logger.fatal('System error', { message: err.message, stack: err.stack });
	process.emit('cleanup');
});
```

（2）使用`domain`模块捕获全局异常

```
// 96行
var d = require('domain').create();
d.on('error', function (err) {
	logger.fatal('Domain master', { message: err.message, stack: err.stack });
	process.exit(0);
});
d.run(function () {
...
```

另外，对各个模块，也使用了`domain`

```
// 415行
var d = require('domain').create();

d.on('error', function (err) {
scope.logger.fatal('domain ' + name, {message: err.message, stack: err.stack});
});
...
```

对于`domain`模块的用法，我们在下一篇，技术分析中详述。

#### 3.模块加载

这才是真正的重点，不过看过代码，发现一切都那么干净利略，也没有多层`回调`那些`大坑`，原来是用了`async`流程管理组件。

整体使用`async.auto`进行`顺序调用`；在加载`modules`时，又使用`async.parallel`，使其并行运作;当发生错误时，清理工作用到了`async.eachSeries`。

下图是我手工简单画的，说明了从代码103-438行之间，各模块的加载运行顺序。（**说明**：既然是加载顺序，或许使用UML的`时序图`更专业一些，不过专业的东西也有专业的门槛，不一定有我这种土办法、大白话更有实效）

![async-for-modules][]

下篇，我们也有必要对`async`组件进行详解梳理。这里，您只要能猜出代码意图，就不用太操心async的用法。下面，读读有关源码：

（1）初始网络

我们从`packages.json`里看到使用了`Express`框架。通过前面部分的介绍，知道必须在入口程序里，初始化才对。具体如何调用的？下面的代码，显然十分熟悉。

我们知道，Express是Nodejs重要的web开发框架，这里的网络`network`本质上就是以Express为基础的web应用，自然`白皮书`才会宣扬`基于Http协议`。

```
// 215行
network: ['config', function (cb, scope) {
	var express = require('express');
	var app = express();
	var server = require('http').createServer(app);
	var io = require('socket.io')(server);

	if (scope.config.ssl.enabled) {
		var privateKey = fs.readFileSync(scope.config.ssl.options.key);
		var certificate = fs.readFileSync(scope.config.ssl.options.cert);

		var https = require('https').createServer({
	...
```

**说明**：这是`async.auto`常用的方法，`network`用到的任何需要回调的方法（这里是`config`），都放在这个数组里，最后的回调函数(`function (cb, scope) {//code}`)，可以巧妙的调用，如： `scope.config`。

这里的代码，仅仅初始化服务，没有做太多实质的事情，真正的动作在下面。

（2）构建链接

从下面的代码开始，我们才能看到这个应用的本质。270行代码用到了`network`等，如下：

```
// 270行
connect: ['config', 'public', 'genesisblock', 'logger', 'build', 'network', function (cb, scope) {
```

接着，下面的代码，加载了几个中间件，告诉我们，该应用接受`ejs`模板驱动的html文件，视图文件和图片、样式等静态文件都在`public`文件夹等，这些信息绝对比官方文档还有用。

```
// 277行
scope.network.app.engine('html', require('ejs').renderFile);
scope.network.app.use(require('express-domain-middleware'));
scope.network.app.set('view engine', 'ejs');
scope.network.app.set('views', path.join(__dirname, 'public'));
scope.network.app.use(scope.network.express.static(path.join(__dirname, 'public')));
...
```

再下来，就是对请求参数和响应数据的处理，包括对节点`peers`中黑名单、白名单的过滤等，最后启动服务操作：

```
// 336行
scope.network.server.listen(scope.config.port, scope.config.address, function (err) {
```

（3）加载逻辑

看代码知道，其核心逻辑功能应该是：账户管理、交易和区块链。这些模块，有其执行顺序，我们需要在后面的篇章中，分别单独介绍。

```
// 379行
logic: ['dbLite', 'bus', 'scheme', 'genesisblock', function (cb, scope) {

	// 嵌套了async.auto
	async.auto({
		...
		account: ["dbLite", "bus", "scheme", 'genesisblock', function (cb, scope) {
			new Account(scope, cb);
		}],
		transaction: ["dbLite", "bus", "scheme", 'genesisblock', "account", function (cb, scope) {
			new Transaction(scope, cb);
		}],
		block: ["dbLite", "bus", "scheme", 'genesisblock', "account", "transaction", function (cb, scope) {
			new Block(scope, cb);
		}]
	}, cb);
	...
```

（4）加载模块

上面所有代码的执行结果，都要被这里的各模块共享。下面的代码说明，各个模块都采用一致（不一定一样）的参数和处理方法，这样处理起来简单方便：

```
// 411行
modules: ['network', 'connect', 'config', 'logger', 'bus', 'sequence', 'dbSequence', 'balancesSequence', 'dbLite', 'logic', function (cb, scope) {

	// 对每个模块都使用`domain`监控其错误
	Object.keys(config.modules).forEach(function (name) {
		tasks[name] = function (cb) {
			var d = require('domain').create();

			d.on('error', function (err) {
				...
			});

			d.run(function () {
				...
			});
		}
	});

	// 让各个模块并行运行
	async.parallel(tasks, function (err, results) {
		cb(err, results);
	});

```

这里的模块既然都是并行处理，研究它们就不需要分先后了。

## 总结

这篇文章总算深入代码了，但是仍然较为粗略。不过，对整个应用的基本架构已经了然。继续深入研究，方向路线也已然清晰。

代码中还有很多细节，我们并没有逐行介绍。个人认为，读代码就像看文章，先要概览，逐步深入，不一定一开始就逐字逐句去读，那样效率低、效果差。

对于这个app.js文件，成手读它可能就是分分钟的事情，而写出来却要罗嗦这么多。如果，你并没有觉得很轻松，甚至理解很困难，那么可能缺少对`commander`、`domain`和`async`等组件或模块的了解，请看下一篇：**《Nodejs开发加密货币》之七： 技术研究——commander、domain和async介绍**

## 链接

**本系列文章即时更新，若要掌握最新内容，请关注下面的链接**

本源文地址： https://github.com/imfly/bitcoin-on-nodejs

电子书阅读： [http://bitcoin-on-nodejs.ebookchain.org](http://bitcoin-on-nodejs.ebookchain.org/3-源码解读/2-入口程序app.js解读.html)

电子书下载： [下载页面][] [PDF文件][] [ePub文件][] [Mobi文件][]



[appjs-uml]: ../styles/images/5/appjs-uml.png
[async-for-modules]: ../styles/images/5/async-for-modules.jpeg
[PDF文件]: https://www.gitbook.com/download/pdf/book/imfly/bitcoin-on-nodejs
[ePub文件]: https://www.gitbook.com/download/epub/book/imfly/bitcoin-on-nodejs
[Mobi文件]: https://www.gitbook.com/download/mobi/book/imfly/bitcoin-on-nodejs
[下载页面]: https://www.gitbook.com/book/imfly/bitcoin-on-nodejs/details
