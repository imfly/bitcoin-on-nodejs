# 源码解读（入口程序app.js）

## 前言

代码： 

## 源码


#### 全局配置

（1）全局默认配置

使用了文件 `./config.json` 来保存全局配置，如：

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
var program = require('commander');

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
if (program.port) {
	appConfig.port = program.port; // app.js 40行
}
```

这样，默认配置appConfig的port值被改变。

这是处理Nodejs应用全局配置的一种常用且简单的方式，值得牢记。

下一篇，在技术分享中，我们再对`commander`组件进行详细介绍，方便快捷的开发一个命令行工具。

#### 全局错误

我们在第一部分总结时，特意提到`异常要捕捉`，这里我们很轻松就可以看出来，代码对全局异常处理的方式。

（1）使用`uncaughtException`捕捉进程异常

```
process.on('uncaughtException', function (err) {
	// handle the error safely
	logger.fatal('System error', { message: err.message, stack: err.stack });
	process.emit('cleanup');
});
```

（2）使用`domain`模块捕获全局异常

```
var d = require('domain').create();
d.on('error', function (err) {
	logger.fatal('Domain master', { message: err.message, stack: err.stack });
	process.exit(0);
});
d.run(function () {
...
```

对于`domain`模块的用法，我们在下一篇，技术分析中详述。

#### 加载模块

这才是真正的重点，不过一切都那么干净利略，也没有发现多层`回调`那些`大坑`，原来是用了`async`流程管理组件。

整体使用`async.auto`进行`顺序调用`；在加载`modules`时，又使用`async.parallel`，使其并行运作;当发生错误时，清理工作用到了`async.eachSeries`。

下面的Uml图是我手工画，展示了从代码103-438行之间，各模块的加载运行顺序。

![async-for-modules][]

这张图，将是后续各篇源码分析文章的地图索引，会经常引用这张图。下篇，我们也有必要对`async`组件进行详解梳理。这里，先读读有关源码：

（1）

```

```

进行中...


