# commander介绍

## 前言

从前面的源码中，我们注意到commander、domain和async三个组件（或模块）的应用，对整个app.js程序起到了至关重要的作用。作为技术积累，有必要对他们进行深入探究。这里，就按照我个人的理解，描述一下这三个组件（模块）的使用。

## 题外话

我坚信，搞编程的都是学习高手，智商很高。但不同的人，方法迥异。有的天生聪颖，翻翻源码和文档，就能在日后自由使用。相反，有的就差一些，我个人就算典型的一个，坚信自己愚钝至极。

我经常遇到这样的情况，对于某个组件，这次用了，下次有需要，还要再看文档，特别是在方法的选择上，有时候要反复试验。所以，多年来，我认真总结和改进自己的做法，努力向高手靠拢。

这关系到“知识”的理解和吸收。知识由语言组成，语言由概念和逻辑组成，概念和逻辑涉及到人的记忆能力与分析能力。很多人喜欢逻辑上的思考，而对于概念“视而不见”。生活中，经常见到有人描述事件的时候，用“这个、那个”等代词或形容词代替事件中的人物，应属这种现象。

事实上，概念中含有逻辑，是逻辑的高级浓缩版。概念清晰，逻辑必然是清晰的，相反却未必。因此，学习知识，掌握概念最重要。

比如，什么是模块，什么叫组件？我的理解是，Node.js提供的原生功能模块，叫`模块`（`module`，例如：domain)，而第三方提供的独立功能模块称为`组件`(`component`)，其实他们都叫`中间件`（`middleware`)，本质没什么区别。

但是，在自己的思维逻辑中，这么简单的区分一下，其实表明我们掌握了更多信息，比如在文档、代码质量、可信度等方面，`模块`天生要好于`组件`。知道`domain`是模块，自然会去node.js官网查找最可靠的资料（当然，官方计划废弃`domain`，不提倡再使用了）。

因此，我的做法就是解读概念（官方提供）、提炼概念（官方没有）、解释概念（介绍用法），用自己的理解梳理相关知识。这里的概念不以“全”为目标，以“好记、好用、好区分”为主。

我相信，以后介绍的每个组件或模块，网上都会有很多相关文档。我的做法自然也规避了文字雷同的可能，毕竟人的思维可以相似，但不会相同。

下面，以commander、domain和async在app.js中出现的顺序为准，分别介绍。

## Commander

事实上，在Node.js或ruby等语言环境里，只要在文件头部添加一行所谓的`shebang`(提供一个执行环境)，就可以将代码转为命令行执行。难在命令行选项处理和流程控制，所以才有了这类工具的出现，叫它们`命令行框架`最合适。

类似`Commander`的工具有很多，但多数以规范命令行选项为主，对一些编码细节还要自己实现，比如：何时退出程序(调用`process.exit(1)`)。`Commander`把这一切都简化了，小巧灵活、简单易用，有它足够了。

#### 1.概念定义

简单直接的命令行工具开发组件。

#### 2.概念解释

- 这是一个`组件`，说明是第三方开发的，其实就是开发`Express`的大神`tj`开发的。ruby语言也有一个同名的开发组件，同样是`tj`的杰作，所以，虽为组件，但足够权威，“`您值得拥有`”。
- `命令行工具开发`，`Commander`的英文解释是`命令`，如其名字，这个是用来开发命令行`命令`的。
- `简单直接`，怎么简单？`四个函数`而已。怎么直接？如果您了解“命令行”的话，就能体会深刻，它通常包含命令、选项、帮助和业务逻辑四个部分，该组件分别提供了对应函数。

因此，只要记住该Commander这个名字和这一句话的概念定义，基本上已经掌握了该组件的全部。下面的用法介绍，仅仅是帮助您更好的记忆和使用。

#### 3.用法介绍：

这里，我们也给它概念化，叫“命令行开发三步曲”。具体以 [gitbook-summary][]为例，解释如下：

* 第1步：给工具起名字

这个`名字`，是工具的名字（其实也是`命令`，我叫它主命令），用来区分系统命令，限定`命令`使用的上下文。我通常用工程的名字或操作对象的名字代替，是个名词，比如：`book`。而用`Commander`写的`命令`是个动词（其实是用.command()方法定义的子命令），比如：`generate`，最后的形式如下：

```bash
$ book generate [--options]
```

只所以把起名字单独提出来，主要是在Node.js的世界里，这一步是`固定不变`的，只要记住就是了。方法是，在`package.json`里定义下面的字段：

```
{
  "bin": {
    "book": "./path/to/your-commander.js"
  }
}
```

**注**：`package.json`文件是包配置文件，是全局配置不可逾越之地。很多工具，都是基于它，提供入口程序的。比如：Node.js自己就是请求`main`字段的（没有定义，默认请求index.js文件)，Npm请求`scripts`字段。这里多了一个，Commander请求`bin`字段。

如果，不使用`package.json`，那么定义的就是`node`命令之下的子命令，调用方法是：

```
$ node ./path/to/your-commander.js generate [--options]
```

如果连node都不想输入，那么就要在代码第一行添加`shebang`，即：

```
#!/usr/bin/env node
```

* 第2步：填充四个函数

这一步，用于定义命令、选项、帮助和业务逻辑，完全是`Commander`概念定义的使用。其实，第三方组件，也就是起到这种`微框架`的作用。具体用法，自然最好是看 [官方文档][] 了。这里，需要进一步思考的是，对于这个组件而言，这四个函数，最重要的是什么？

我们想到的通常是`业务逻辑`，不过，请注意，只要是开发，逻辑部分自然只能开发者自己实现，所以，`Commander`仅仅提供了一个接口函数而已。这里的`命令`，仅是一个名称。`帮助`是提示，也仅是简单的文本信息。剩下的各种`选项`，可以规范，也最为关键，才是`Commander`的可爱之处。

（1）**命令**： 使用`command`函数定义（子命令），例如

```
var program = require("commander");

program
    .command("summary <cmd>")
    .alias("sm") //提供一个别名
    .description("generate a `SUMMARY.md` from a folder") //描述，会显示在帮助信息里
...
```

当使用`-h`选项调用命令时，上述命令`summary|sm`会被显示在帮助信息里。这里的`alias`和`description`仅是锦上添花而已。

更复杂的，例如下面[官方的例子][]， .command() 包含了描述信息和 .action(callback) 方法调用，就是说要用子命令各自对应的执行文件，这里就是./pm-install.js，以及 ./pm-search.js 和 ./pm-list.js等。

```
#!/usr/bin/env node

var program = require('..');

program
  .version('0.0.1')
  .command('install [name]', 'install one or more packages')
  .command('search [query]', 'search with optional query')
  .command('list', 'list packages installed')
  .command('publish', 'publish the package')
  .parse(process.argv);
```

**说明**：不使用`command`方法直接定义主命令，个人建议不要这么做。中规中矩地定义每一个子命令（本文统称命令），只要使用`command`方法，不带描述信息，附带`action`方法。如果定义类似git类型的，一连串的命令，一个一个来，显然麻烦，就把描述信息放在`command`里，去掉`action`方法，这时默认请求对应的js文件。

（2）**选项**：使用`option`方法定义，可以理解为`命令行数据结构`。

该函数很简单，可以方便的将文本输入转化为程序需要的数据形式。其功能如下：

* 可以设置任何数量的选项，每一个对应一个`.option`函数调用;
* 可以设置默认值;
* 可以提供文本、数值、数组、集合和范围等约束类型（通过提供处理函数）;
* 可以使用正则表达式;

**说明**：`option`方法，基本使用就用选项名称和描述;复杂一点就要提供处理函数或默认值;再复杂就用`arguments`方法代替`option`方法，使用`可变参数`（带`...`的参数）。

（3）**帮助**： 使用`help`方法输出一切有用的描述信息，这些信息通常在命令和选项的定义中，例如

```
program.help();
```

如果要定制帮助信息，就用：

```
program.on('--help',cb);
```

（4）**逻辑**： 使用`action`方法注册逻辑，将代码转向执行自己的逻辑代码，当然，git类型的多命令也可以不用。例如

```
program.action(function(cmd, options) { //code });
```

* 第3步：开发业务逻辑

撰写`action`可以调用的代码就是了。

#### 4.案例分析：

代码地址：https://github.com/imfly/gitbook-summary 具体内容，请自己看代码吧。

这是一个一键生成文档目录文件的命令行工具，以后可能还会加入简繁转化功能。生成的目录文件，是gitbook生成电子书的必须文件。

我从来不愿意为写作而写作，更不愿意处理任何重复性的工作，因此，隔一段时间，经常积累一堆问题清单和零零散散的文档。这个命令行工具基本上为自己定制。但发现也有很多小盆友在用，看来跟我一样，^_^。

## 总结

这篇仅仅介绍了`commander`组件的相关概念和使用，关于如何安装（简单一条命令）、如何修改权限，都没有细说。这类知识，我坚信网上一搜多的是，自行补充吧。

原本把三个组件（模块）一起整理发布的，发现写到这已经很长了，只好临时改变，单独发布了。

## 链接

**本系列文章即时更新，若要掌握最新内容，请关注下面的链接**

本源文地址： https://github.com/imfly/bitcoin-on-nodejs

电子书阅读： [http://bitcoin-on-nodejs.ebookchain.org](http://bitcoin-on-nodejs.ebookchain.org/4-开发实践/1-commander介绍.html)

电子书下载： [下载页面][] [PDF文件][] [ePub文件][] [Mobi文件][]

## 参考

Node.js 命令行程序开发教程（中文）: http://www.ruanyifeng.com/blog/2015/05/command-line-with-node.html

用npm构建简单命令行（英文）: http://blog.npmjs.org/post/118810260230/building-a-simple-command-line-tool-with-npm

用Node.js开发命令行工具（英文）: http://shapeshed.com/command-line-utilities-with-node.js/


[PDF文件]: https://www.gitbook.com/download/pdf/book/imfly/bitcoin-on-nodejs
[ePub文件]: https://www.gitbook.com/download/epub/book/imfly/bitcoin-on-nodejs
[Mobi文件]: https://www.gitbook.com/download/mobi/book/imfly/bitcoin-on-nodejs
[下载页面]: https://www.gitbook.com/book/imfly/bitcoin-on-nodejs/details

[官方文档]: https://github.com/tj/commander.js
[官方的例子]: https://github.com/tj/commander.js/blob/master/examples/pm
[gitbook-summary]: https://github.com/imfly/gitbook-summary
