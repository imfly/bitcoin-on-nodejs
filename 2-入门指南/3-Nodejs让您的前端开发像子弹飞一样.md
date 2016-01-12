## 前言

从本文开始，我们正式进入Nodejs的世界。

本文，将指引您搭建Nodejs开发环境，向您介绍Nodejs的安装、使用，帮您快速进入Nodejs的世界。

通过本文，让您彻底转变对前端开发的认知，;您可以学习到，如何将一些公共平台的资源为己所用，比如像巴比特一样即时显示交易市场的交易行情。

本文的实例就是，上文提到的加密货币开发语言统计分析项目(Statistical Analysis of Cryptocurrency Development Languages，简称`Sacdl`)，[点击这里][sacdl]，在线体验。

## 项目需求

`Sacdl`项目需要具备以下几个功能：

* 方便地读取github的Api，实现github搜索功能；
* 对读取的数据集中整理，方便地转化为我们需要的信息；
* 通过柱状图、矩阵图、表格等图表格式，将数据可视化；
* 方便扩展，为以后添加更多图表样式做好准备。

## 技术选型

无处不选择。大方向要选择，具体到每个开发包都要去甄别，安全吗？好用吗？性能高吗？是否有更好的方案？等等。

仅从上述需求来说，一个html文件，再写一个js文件就基本搞定，第三方包都用不着选择，`Nodejs`更是大才小用。

但事实上，很多仅仅是前端的项目，比如：Bootstrap等，都基于`Nodejs`，为什么？答案很简单，它一定提供了诸多方便实用的工具。

比如说：

* 组织方便：js没有模块化组织代码的能力。一个项目，js代码通常会分割在不同的文件中，以往的方式，处理起来非常头疼，现在利用`Nodejs`的模块管理，可以让您彻底解脱；
* 资源广泛：`Nodejs`的出现，让js第三方包像雨后春笋一样遍地开花。需要什么，一条命令，`Nodejs`就帮您办了，这会带来极大便利；
* 全栈处理：开发完，还有很多事情要做，比如：要对前端代码js或css文件进行合并、压缩、混淆，以及项目部署等。体验过ruby on rails一键部署功能的小伙伴，都会印象深刻。`Nodejs`也很容易做到，而且同样自然、流畅。

总之，有了`Nodejs`，我们可以像开发后台程序一样组织前端代码和项目了；有了`Nodejs`，就有了它背后强大的技术社区支持。

## Nodejs简介

有小盆友说，第一次看到`Nodejs`，还以为就是一个js文件呢。呵呵，其实，很多前端的应用，比如大家吵得最欢的`前端开发框架三剑客`，Angular.js， Backone.js, .Ember.js等，其实就是一个js文件。

**那么，`Nodejs`是什么呢？**

官方解释是这样的：

```
Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine. Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient. 
```

翻译如下：

```
Node.js® 是一个搭建在Chrome V8上的JavaScript即时运行平台，采用事件驱动、非阻塞I/O模型，这使它既轻量又高效。
```

用句大白话解释就是，Nodejs是一个可以让您利用JavaScript语言开发应用的平台, 是构建运行在分布式设备上的数据密集型实时程序的完美选择。

请注意哦，这里可没说是`Web应用`，很多人认为Nodejs仅能开发以服务器为中心的web应用，其实不然，PC端、移动端都可以。当然，我们看到的大部分是Web应用，它是php+apache, jsp+tomcat, ruby on rails + Passenger(或thin) + nginx 等传统web开发的绝佳替代品。

如果你还没有直观感受，那么，我告诉你一个信息，`Nodejs`的作者原本是想开发一种取代apache、nginx、tomcat等产品的传统服务器的，结果发展成了今天`Nodejs`的模样，你用`Nodejs`写的每一个应用，即可以认为是一个服务器软件，也可以认为是一个web应用，而且它是如此简单、高效。

**那么，什么是数据密集型、实时应用？**

聊天室、即时通信等都是。当然，所有的交易市场（**比特币**、股票、基金等），电子商务网站的即时交易等也是。甚至物联网，比如电器设备的监控和远程控制。本人刚完成的一个项目，是一家大型连锁超市的电器设备综合监控系统，就是使用Nodejs开发的。

## 开发步骤

运行一个小小的程序体验一下吧，

#### 1.搭建环境

对于初学者，建议先去[Nodejs官方网站][]浏览一遍。这里有币友推荐的一个中文网站，[runoob.com][runoob]，对于英文不太好的用户，有一定帮助。

我个人的开发环境是这样的：

* 操作系统是`Ubuntu`系统：您可以在现有系统上，使用虚拟机软件安装它。
*　IDE工具：`Sublime Text`；

（1）Nodejs的安装

强烈建议参考官网信息（[Nodejs官方网站][]，见参考资料）

我在Ubuntu上通过`nvm`安装管理`Nodejs`，具体方法，这里有一篇详细文档，[快速搭建 Node.js 开发环境以及加速 npm][nodejs install]，请务必阅读一遍。这里摘录其中关键命令（下面的命令都要在Ubuntu的命令行程序下运行）：

**安装`Nvm`**

```
$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.29.0/install.sh | bash
```

**用Nvm安装Nodejs**

```
$ nvm install 5.1.0
$ nvm alias default 5.1.0
```

说明：5.1.0 是Nodejs版本信息，写作本文时，最新稳定版是5.4.0,长期支持版是4.2.4

**安装使用CNpm**

使用淘宝npm镜像，可以提高我们的插件下载数度

<http://npm.taobao.org/>

```
$ npm install -g cnpm --registry=https://registry.npm.taobao.org
```

**参看版本信息**

```
$ nvm -v
$ node -v
$ npm -v
```

我的版本信息如下：

```
nvm 0.29.0
node v5.1.0 
npm v3.3.12
```

#### 2.新建工程

下面我们开始开发

在您电脑上，新建一个文件夹`sacdl-project`，作为工程目录，路径如下：

```
/home/yourname/projects/sacdl-project
```

我们通常会把前端代码放在`public`目录下，然后分别建立`js`,`css`,`images`等目录，最后建立文件`index.html`，`js/app.js`，用于显示页面和写我们的js代码，结构如下：

![project-folder][]

上述结构中，`js/searcher.js`是搜索框处理代码，`js/utils.js`是数据处理代码，`js/bar.js`文件是d3.js的柱状图代码，`js/treemap.js`是树状矩阵图的代码，'js/app.js'用户综合调用，类似于控制器或路由。

前端第三方组件，比如d3.js等都存放在`bower_components`，由`bower`自动生成; 后台第三方模块在`node_modules`，由`npm`自动生成。

#### 3.前端工具

在命令行进入上述目录，安装前端管理工具`bower`

```
cnpm install -g bower # 也可以使用 npm install * 命令，二者一样，只不过cnpm使用淘宝镜像，在中国安装会快些
```

说明：`bower`是一个npm包，是专门用来管理web前端（包含js,css,images,fonts等）依赖包的。我们可以简单类比，bower用于管理前端包，npm管理后台库（包），二者用法十分相似。

通过`bower`，安装`d3.js`

```
bower install d3 
```

说明：`d3.js`是提供了前端显示的柱状图、饼状图等，是数据可视化非常出名的前端开发包。国人的有百度的echarts，也非常丰富，还有一个highcharts，这三者经常被拿来比较。简单的区分，就是，d3.js像开发包，可以任由您编程开发;其他两个更像是模板，拿来就用。

这里，我选择了`d3.js`，纯属我个人喜好，一方面，我个人喜欢完全控制代码;另一方面，在开发[电子书版权保护和交易系统][ebookcoin]，用到了它。

#### 4.前端流程

环境搭建完成，开始写代码了。

按照上面的需求，我们的流程大致是这样的:

![front-data-follow][]

1.接受请求：提供一个输入框，接受用户输入要查询的关键字，当用户提交时，自动转化为github.com的Api请求地址;
2.获得数据：根据上述地址，通过ajax请求数据（这里是d3.js的d3.json()方法），对数据进行处理;
3.展示数据：使用d3.js编写图表样式，将上述数据展示出来。

#### 5.学习Api

第一步非常简单，我们只要提供一个输入框就是了。我们先研究一下github的Api吧

github是用ruby on rails开发的，它的api具有典型的ror的restful风格。下面是，[官方搜索示例][]

请求下面的地址

```
https://api.github.com/search/repositories?q=tetris+language:assembly&sort=stars&order=desc
```

可以得到对应的json格式的数据, 官方是使用的`curl`命令行工具，我们直接使用浏览器即可，有图为证：

![github-search-example][]

这就是我们得到的原始数据结构，大部分情况下，都需要重新整理，不然就不用费劲开发了。这里，我们把它转化为树形矩阵图需要的格式，如下：

```
{
    "name": "languages",
    "children": [{
        "name": "javascript",
        "children": [{
            "name": "imfly/myIDE",
            "watchers_count": 100,
            "forks_count": 50
        }]
    }]
}
```

这里意思是，我们的整个数据根节点就是`languages`（自己建的）, 它以各个语言为子节点;各语言节点，则以他们的版本库为节点，这里存储着我们需要的基本信息。

#### 6.数据整理

我们在`public/js`文件夹下，新建`utils.js`(名字随便起），然后使用文本编辑器打开，我这里使用`Sublime text`.

（1）模块化前端代码

为了实现模块化编程，采取下面的格式组织我们的前端代码（其实，后台也如此，这就是Nodejs的好处之一），

```
var Utils = (function(){
	//局部变量定义
	var a = 0;

	//公共方法
	return {
           settings: function(){},
	   init: function(){},
	   ...
	}

	//私有方法
	function name(){}
}())
```

在引入该文件的html文件里，就可以这样调用

```
Utils.init();
```

而无法这样调用

```
Utils.name();
```

（2）转换数据格式

那么如何将api读取的数据整理成我们想要的格式呢？代码如下：

```
// 一定会有一个地方传入dataset，先别着急
function getTreeData(dataSet) {
	var languages = {};

	//新建根节点
	var result = {
	    "name": "languages",
	    "children": []
	}

	//循环处理子节点
	if (dataSet && dataSet.items) {
	    var items = dataSet.items;

	    //先找出涉及到语言
	    items.forEach(function(item, index) {
		if (typeof languages[item.language] === "undefined") {
		    languages[item.language] = index;
		};
	    })

            //根据语言进行整理
	    for (var language in languages) {
		//原来有些版本库，是没有语言信息。github的语言识别并不是完美的
		if (language === "null") {
		    language = "others";
		};

		//每种语言的子节点
		var root = {
		    "name": language,
		    "children": []
		};

		//从全局数据中再次查找我们的数据
		items.forEach(function(item, index) {
		    var child = {
		        "name": item.full_name,
		        "watchers_count": item.watchers_count,
		        "forks_count": item.forks_count
		    };
	
		    if (item.language === language || (item.language === "null" && language === "others")) {
		        root.children.push(child);
		    };

		})

		result.children.push(root);
	    }
	}

	//返回结果
	return result;
}
```

显然，这是一个私有方法。因为类似这样对数据的整理，每一个图表都要做。我们是把上面的方法作为第一步处理，然后把结果缓存，其他格式的数据都以它为基础获得（公共方法）。请参考源码`js/utils.js`，·[点这里][project-source]。

#### 7.D3.js渲染

数据有了，终于有机会弄成我们想要的样式了。

（1）了解d3.js流程

有人说，对于初学者，d3.js的入门有点困难。如果您尝试了之后，真觉得难，您可以选择echarts，或xcharts（来自于d3.js，下面有链接），方法相同。

d3.js的基本流程是：

* 在html中，提供展示图表的位置，通常是给一个div#divId;
* 定义图表渲染流程，怎么append`svg`元素，怎么填充`text`元素等;
* 请求并填充数据

我们用最简单的例子，演示一下（代码在工程源码的test文件夹下）：

在`test.html`页面添加一个div元素，如下：

```
<div id="testId"></div>
```

新建test.js文件，写下如下代码：

```
//这是要渲染的数据，可以动态获得
var dataset = [1, 2, 3, 4];

//这是渲染的方法，特别是data()方法是填充数据的重要方法
var chart = d3.select('#testId')
        .selectAll('p')
        .data(dataset, function(d) { return d; });

//data（）之后才可以调用的enter()方法，意思是有数据填充的那部分图表元素，通常去增加`append`元素
chart
.enter()
.append('p')
.text(function(d, i) {
    return [d, i];
})

//data（）之后才可以调用的exit()方法，意思是无法获得数据填充的那部分图表元素，通常要删除`remove`
chart.exit().remove();
```

比如上面，我们默认提供了4个数值，第一次渲染正常显示;如果数据换成了[5,6]，再此渲染，enter()方法就是原来渲染[1,2]的元素（现在换成了[5,6]),而[3,4]位置的元素因为没有了数据，自然要删除掉。这样就实现了图表动态转换。

（2）渲染我们数据

d3.js提供了d3.json(),d3.csv()等请求数据的方法，我们上述数据是json格式，自然就用前者了

我们以矩阵图为例，现在index.html加入如下元素

```
<div id="sacdlTreemap"></div>
```

然后，编写`js/treemap.js`代码，用于渲染图表。

最后，在`js/app.js`里，加载数据：

```
----部分代码------
d3.json(url, function(err, data) {
    if (err) {
	...
        alert("加载数据失败，请检查您的网络设置。")
    };

    Utils.getData(data);

    Treemap.show();
 
    ...
});
----部分代码------
```

具体请看源码。

#### 8.部署发布


## 总结


## 参考资源

直接参考的用例

d3.layout.treemap: http://mbostock.github.io/d3/talk/20111018/treemap.html
Grouped horizontal bar chart: http://bl.ocks.org/erikvullings/51cc5332439939f1f292

官方网站

Nodejs官方网站: https://nodejs.org/
Bower官方问站： http://bower.io/
d3.js官方网站: https://d3js.org

值得借鉴的文档

[xcharts一个封装d3.js的图表展示包](http://tenxer.github.io/xcharts/)
[大数据时代的图表可视化利器——highcharts,D3和百度的echarts](http://www.thebigdata.cn/JieJueFangAn/12972.html)
[d3的使用心得和学习资料汇总](http://www.storagelab.org.cn/zhangdi/2014/08/23/d3%E5%8F%AF%E8%A7%86%E5%8C%96%E5%AE%9E%E6%88%9800%EF%BC%9Ad3%E7%9A%84%E4%BD%BF%E7%94%A8%E5%BF%83%E5%BE%97%E5%92%8C%E5%AD%A6%E4%B9%A0%E8%B5%84%E6%96%99%E6%B1%87%E6%80%BB/)

[sacdl]: https://imfly.github.io/sacdl-project
[runoob]: http://www.runoob.com/nodejs/nodejs-tutorial.html
[nodejs install]: https://cnodejs.org/topic/5338c5db7cbade005b023c98
[ebookcoin]: http://8btc.com/forum.php?mod=viewthread&tid=26208&highlight=%B5%E7%D7%D3%CA%E9
[front-data-follow]: ../styles/images/front-data-follow.jpg
[官方搜索示例]: https://developer.github.com/v3/search/
[github-search-example]: ../styles/images/github-search-example.jpg
[project-folder]:
[project-source]: https://github.com/imfly/sacdl-project
