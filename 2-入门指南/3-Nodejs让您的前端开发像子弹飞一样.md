## 前言

从本文开始，我们正式进入Nodejs的世界。

这篇文章，将指引您搭建Nodejs开发环境，向您介绍Nodejs的安装、使用、常用资源，帮您快速进入Nodejs的世界。

当然，是以介绍上文的加密货币开发语言统计分析项目(Statistical Analysis of Cryptocurrency Development Languages，简称`Sacdl`)为主线。

## 项目需求

`Sacdl`项目需要具备以下几个功能：

* 方便地读取github的Api，实现github搜索的全部功能；
* 整理读取的数据，方便地转化我们需要的字段信息；
* 集成展示数据的图表开发包，编写需要的图表；
* 方便扩展，为以后添加更多Api和图表样式预留接口。

## 技术选型

仅从上述需求来说，一个html文件，外加D3.js（或highcharts，echarts等）第三方包即可，根本不需要`Nodejs`。但事实上，很多仅仅是前端的项目，比如：Bootstrap等项目，都基于`Nodejs`，为什么？

答案很简单，它一定提供了诸多方便实用的工具。比如说，

* 一个项目js代码通常会分割在不同的文件中，以往的方式，处理起来非常头疼，现在`Nodejs`的模块管理，可以让您彻底解脱；
* 第三方包ds.js的使用，您不用手动下载了，一条命令，`Nodejs`就帮您办了。特别是对于多个版本共存的情况，这会带来极大便利；
* 您写的前端代码js或css文件，需要合并、压缩、混淆吗？`Nodejs`提供了grunt，gulp等自动化任务管理工具，您可以拿来就用；

总之，有了`Nodejs`，我们可以像开发后台程序一样组织代码和项目了；有了`Nodejs`，就有了`Nodejs`背后强大的技术社区支持。

## 开发步骤

#### 搭建环境

对于初学者，建议先去Nodejs官方网站浏览一遍。这里有币友推荐的一个中文网站，[runoob.com](http://www.runoob.com/nodejs/nodejs-tutorial.html)，对于英文不太好的用户，有一定帮助。

我个人的开发环境是这样的：

* 操作系统是`Ubuntu`系统：具体这样，在ｗindowsXp或windows7之下，通过虚拟机软件`Vmware`安装的`Ubuntu`操作系统。之前，一直彻底删除win系统，直接使用Ubuntu，但是最新版Ubuntu网卡驱动等兼容性能不太好，只能退而求其次。但用过一段时间，发现这种方式很方便。
*　IDE工具：使用`Sublime Text`；
*　`Nodejs`通过`nvm`安装管理，具体方法，这里有一篇文档很详细，请看参考资料，`快速搭建 Node.js 开发环境以及加速 npm`。我使用的版本信息如下：

```
nvm 0.29.0
node v5.1.0 
npm v3.3.12
```

#### 新建工程

安装前端管理工具

```
npm install -g bower
```

通过`bower`，安装`d3.js`

```
bower install d3 
```

#### 读取Api

#### D3.js展示

## 总结


## 链接

Github开源项目统计分析工具: <https://github.com/imfly/sacdl-project> 试用地址：<https://imfly.github.io//sacdl-project>

## 参考资源

直接参考的用例：

[d3.layout.treemap](http://mbostock.github.io/d3/talk/20111018/treemap.html)
[Grouped horizontal bar chart](http://bl.ocks.org/erikvullings/51cc5332439939f1f292)

官方网站

[Nodejs官方网站]()
[d3.js官方网站](https://d3js.org)　

值得借鉴的文档

[快速搭建 Node.js 开发环境以及加速 npm](https://cnodejs.org/topic/5338c5db7cbade005b023c98)
[xcharts一个封装d3.js的图表展示包](http://tenxer.github.io/xcharts/)
[大数据时代的图表可视化利器——highcharts,D3和百度的echarts](http://www.thebigdata.cn/JieJueFangAn/12972.html)
[d3的使用心得和学习资料汇总](http://www.storagelab.org.cn/zhangdi/2014/08/23/d3%E5%8F%AF%E8%A7%86%E5%8C%96%E5%AE%9E%E6%88%9800%EF%BC%9Ad3%E7%9A%84%E4%BD%BF%E7%94%A8%E5%BF%83%E5%BE%97%E5%92%8C%E5%AD%A6%E4%B9%A0%E8%B5%84%E6%96%99%E6%B1%87%E6%80%BB/)

