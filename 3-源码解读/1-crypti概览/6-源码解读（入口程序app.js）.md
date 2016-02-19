
进行中...

# 源码解读（入口程序app.js）


## 前言

在入门文章部分，我们已经知道，Nodejs的应用最终都可以合并成一个文件，为了开发方便，才将其拆分成多个文件。被拆分的那个文件，自然是我们重点研究的对象，通常这个文件就是App.js或server.js，显然Crypti用的就是app.js，我们称之为入口程序。

这一篇，我们就来阅读一下app.js文件，掌握该应用的整个流程，并对其中的技术重点做些介绍。

## 源码

地址： https://github.com/imfly/crypti/blob/0.5.4-mainnet/app.js

#### 全局配置

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

这样，默认配置appConfig的port值被改变。

这是处理Nodejs应用全局配置的一种常用且简单的方式，值得学习。

下一篇，在技术研究篇，我们再对`commander`组件进行详细介绍，方便快捷的开发一个命令行工具。

#### 全局错误

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

#### 加载模块

这才是真正的重点，不过看过代码，发现一切都那么干净利略，也没有多层`回调`那些`大坑`，原来是用了`async`流程管理组件。

整体使用`async.auto`进行`顺序调用`；在加载`modules`时，又使用`async.parallel`，使其并行运作;当发生错误时，清理工作用到了`async.eachSeries`。

下图是我手工画的，展示了从代码103-438行之间，各模块的加载运行顺序。

![async-for-modules][]

下篇，我们也有必要对`async`组件进行详解梳理。这里，您只要能猜出代码意图，就不用太操心async的用法。下面，读读有关源码：

（1）初始化服务器

我们从`packages.json`里看到使用了`Express`框架。从下面的代码，我们显然看到了与Express相关的熟悉的代码。这几行代码告诉我们，该应用用到

从
```
// 215行
network: ['config', function (cb, scope) {
			var express = require('express');
			var app = express();
			var server = require('http').createServer(app);
			var io = require('socket.io')(server);

			if (scope.config.ssl.enabled) {
...
```


[async-for-modules]: ../../styles/images/5/async-for-modules.jpeg

