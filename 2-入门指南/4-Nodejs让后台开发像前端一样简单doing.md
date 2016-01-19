# Nodejs让后台开发像前端一样简单


## 题外话

最近一直在关注比特币社区的大事件，Mike hearns说比特币实验失败了，比特币交易价格应声大跌，币圈的朋友该如何站队，比特币的未来会如何，很多人又一次陷入迷茫。

我个人，反而更加坚定了信心。这件事充分说明，一个产品有它的生命周期，有它失败的风险，一项技术却永远前进在路上。无论产品消亡与否（当然，比特币不会那么轻易消亡），都会留下丰厚的技术遗产。

希望我的技术分享，能为这句话做个见证。

## 前言

上一篇文章，简单介绍了Nodejs，搭建了Nodejs开发环境，并轻松完成了前端开发。本文，我们更进一步，看看如何实现更加复杂的业务逻辑，如何构建自己的Api。

问题自然就来了，为什么要用后台？就我们这个统计分析项目(`Sacdl`项目）而言，仅前台几个文件已经足够。但是，多数项目业务更加复杂，没有后台办不成事。

另外，前端处理能力有限，特别是web应用，前端代码越简单越好，对于性能和用户体验都有好处。反观我们的`Sacdl`项目，显然对于数据的整理更适合在后台处理。

再者，大家知道，Bitcoin或其他竞争币的核心，通常会提供Json格式的Api，我们只要在后台对这些Api进行操作，实现自己的业务逻辑，就能很轻松实现区块链浏览器(如：blockchain.info）、钱包、支付等基本应用。因此，直接学习如何处理第三方Api，对于我们快速上手开发加密货币，是有直接帮助的。

## 需求

明确要干什么，很重要。

* 从后台读取github.com的Api;
* 处理读取的数据，并发送给前端;

很明显，我们在重构前端代码。

## 开发

上篇太罗嗦，本文尽量简洁。下文仍以`Sacdl`工程为例。

#### 1.引入Express框架

基于Nodejs的开发框架很多，而Express显示是最基础、最出众的一个，很多其他的框架都是基于它构建的，比如严格学习ruby on rails的sails框架等。

（1）安装Express

```
cnpm install express --save
```

说明：安装 Nodejs 模块时，如果指定了 --save 参数，那么此模块将被添加到 package.json 文件中的 dependencies 依赖列表中。以后，就可以通过 npm install 命令自动安装依赖列表中所列出的所有模块。

（2）创建简单应用

进入工程目录，新建文件 `app.js`，输入如下内容：

```
var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
```

然后，运行下面的命令：

```
$ node app.js
```

最后，用浏览器打开 http://localhost:3000/ ，可以看到 `hello world!`输出。

这就是一个完整web应用，同时包含了前后端。也是一个服务器软件，不过是仅仅是在3000端口，提供了一个简单的web服务。

如果，你对上篇`gulp`的管道概念有了一定认识，你也可以想象成，我们已经搭建了一条从后台到前端的管道。剩下的工作，就是给这条管道添加各种处理装置，让水流（数据流）实现我们的要求。关于流的概念，我们会在下一篇再次总结一下。

（3）使用模板引擎

上面，我们直接将hello world发送给了浏览器，如果是html文件该怎么做呢？Nodejs没有直接渲染模板的功能，需要用到第三方插件，如:jade,ejs,hbs等

这里，咱们用`ejs`，它就像java的jsp，rails的rhtml，直接在html文件里嵌入代码，简单好用。下面，安装它：

```
$ cnpm install ejs --save
```

然后，用`app.set`设置我们的第一个管道过滤器，修改上述代码如下：

```
-------其他-------
app.set('views', './views')
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  res.render('index');
});
-------其他-------
```

我们新建views文件夹（把视图文件暂时放在这里），在views里新建index.ejs，打开它，把`hello imfly!`拷贝过去。

重启服务器（ctrl + C关闭，然后再用node app命令打开），刷新浏览器，看到变化，证明模板启用成功。

（4）使用静态文件服务

我们的前端，只有`public/index.html`文件。现在，将它的代码复制到views/index.ejs文件里，并修改js，css引用。重启，刷新，啊，一堆乱码，按下`F12`，打开浏览器控制台，看到一堆`404错误`，我们的js，css文件都没有成功加载，怎么回事？

到目前为止，我们仅提供了`/`地址下的路由请求，其他任何地址都默认是`404错误`。怎么办？一个个添加吗，显然不是，这类静态文件，express提供了简单的方法：

```
app.use(express.static('./public', {
    maxAge: '0', //no cache
    etag: true
}));

app.get('/', function (req, res) {
...
```

这是咱们使用的第二个管道过滤器，上面的代码意思是，在public下的文件，包括js,css,images，fonts等都当作静态文件处理，根路径是`./public`,请求地址就相对于`/`，比如：./public/js/app.js文件，请求地址就是http://localhost:3000/js/app.js

说明：这里有一个小问题，使用bower安装的前端第三方开发包，都在bower_components文件夹下，需要移到public文件夹里。同时需要添加一个.bowerrc文件，告诉bower组件安装目录改变了，并修改gulpfile.js文件。当然也可以连同bower.json文件都拷贝到public文件夹里。

重启服务，刷新页面，我们看到了久违的页面。

![serve-page][]

（5）后台请求githubApi

在后台请求github也有很多方案，使用Nodejs的request插件，就可以直接在后端请求http地址，相当于直接把前端代码拿到了后台。不过，这里有个更好的方案，github提供了Nodejs使用的开发包，我们可以直接用：

```
cnpm install github --save
```

官方地址：https://github.com/mikedeboer/node-github 
 
为什么会想到这个方案？一方面，你要认真阅读官方文档，浏览他们提供的全部资源;另一方面，要有一种自觉意识，成熟的产品，一般都会提供现成的方案，可以去`https://npmjs.com`上搜搜。

该组件集成了githubApi的几乎全部内容。


[serve-page]: ../assets/images/3/serve-page.jpg
进行中...
