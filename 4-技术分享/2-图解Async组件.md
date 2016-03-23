进行中...

# 图解Async组件

## 前言

前面说过，在Nodejs的世界里“事事皆回调”，学习使用Nodejs，最不可能回避的就是“回调”（用“调回”更直观些）。无法回避，自然要积极面对，因此开源社区出现了很多代码流程控制的解决方案。比如：bluebird，q，以及这里要图解的async。

这种基础性的技术，社区的文档极其丰富，但是我们为什么还要介绍？个人觉得，原因很简单，它真的很有必要，在只需要顺序编码的世界里，没有所谓的流程或promise/a+规范（服务器帮助实现了），基本用不着。但是在Nodejs的世界里，学习掌握一种方案，会显著提升编码能力。

为什么要介绍async，不是说BB性能更好吗？原因更简单：（1）Ebookcoin大量使用了aysnc，几乎是用到了极致，掌握它，对于理解和编码，事倍功半;（2）社区认可度高、使用简单、对代码没污染。

![most-depended-upon-packages.jpg][]

这是async在`https://npmjs.org`上的依赖排名，除了lodash，就是它了。而且，bluebird和q也都在前10，也基本说明，使用流程控制组件是Nodejs处理回调的标配。

## 解析

在开始之前，有必要对编码中的流程，做一下简单的预期展望，带着目的去研究。简单汇总一下，应该是下面三种情况：

#### 1.执行流程

主要是从事件（函数）执行顺序的角度考量，包括顺序执行、并行执行、混合执行，以及循环执行等5种基本流程。进一步细化，顺序执行当中，还有一种后面的执行严格依赖于前面执行的结果的情况，这是纯粹的流程，共计4种。

#### 2.处理集合



## 流程图

没有使用任何流程控制组件的代码：

> step1(function(err, v1) {
>
>   step2(function(err, v2) {
>
>     step3(function(err, v3) {
>
>        // do somethig with the err or values v1/v2/v3
>
>     }
>
>   }
>
> });


## 源码实践

## 总结

其实，加密和验证的过程贯穿于交易的全过程，研究交易才是更好的理解加密和验证机制的方法。因此，请看下一篇：**《Nodejs开发加密货币》之十：签名与交易**

## 链接

**本系列文章即时更新，若要掌握最新内容，请关注下面的链接**

本源文地址： https://github.com/imfly/bitcoin-on-nodejs

电子书阅读： [http://book.btcnodejs.com](http://book.btcnodejs.com/3-源码解读/4-在Nodejs中使用加密解密技术.html)

电子书下载： [下载页面][] [PDF文件][] [ePub文件][] [Mobi文件][]

[PDF文件]: https://www.gitbook.com/download/pdf/book/imfly/bitcoin-on-nodejs
[ePub文件]: https://www.gitbook.com/download/epub/book/imfly/bitcoin-on-nodejs
[Mobi文件]: https://www.gitbook.com/download/mobi/book/imfly/bitcoin-on-nodejs
[下载页面]: https://www.gitbook.com/book/imfly/bitcoin-on-nodejs/details

## 参考

[https://github.com/caolan/async](https://github.com/caolan/async "https://github.com/caolan/async")

[most-depended-upon-packages.jpg]: ../styles/images/11/most-depended-upon-packages.jpg
[《Async详解之一：流程控制》]: ../6-转载文章/1-Async详解之一：流程控制.html
