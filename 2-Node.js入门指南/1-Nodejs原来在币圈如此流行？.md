Node.js原来在币圈如此流行？
-------------------------


## 前言

本文主要讲解技术选型，币圈开源项目使用的开发语言现状，以及被程序员广泛参与的前10个有关比特币的开源项目。

开发一个产品之前，我们总会纠结要选择使用什么样的技术。考虑的因素有几个，其中包括自身所掌握的技能，项目兼容性，软硬件环境，以及应用场景等。

不管怎样，寻找一种通用的语言平台往往是相对合适的。这样做，可以有更多的案例学习，获得更多的社区支持，大大降低技术风险。

开发加密货币，我们计划使用`Node.js`，是否可行？需要尽可能的，从各个方面考察一下。

## Node.js在开源社区很流行

在开源社区， [Github][] 大名鼎鼎，我们先看看，在其上托管的项目语言使用情况。

Github上Top20项目情况（这是早期的旧数据）

![Github上Top20项目情况][]

从图中可以看出，在整个开源社区，`javascript`被广泛应用。如果你点开其中的链接，仔细审查，会发现他们都建立在Node.js平台之上，哪怕是纯前端的项目。

这也提醒我们，目前`javascript`语言所对应的大部分项目都基于`Node.js`平台，也就是说，对于成熟的项目，`javascript`语言大致可以代表`Node.js`。

## Node.js在币圈也同样流行

#### Github自带搜索

我们使用[Github自带的搜索工具][], 在搜索框内输入下面的内容：

```
bitcoin stars:>100 forks:>50
```

结果如下：

![github-search-bitcoin-result][]

使用更加复杂的查询条件，比如：

```
bitcoin OR wallet stars:>100 forks:>50 in:file extension:md
```

意思是：查询在文件扩展名为`.md`的文件中，包含关键字bitcoin或wallet，星100以上，fork50以上的全部项目库

其他情况，请自己试验。

#### 自制查询工具

程序员天生就是懒人，为了一劳永逸的获得想要的结果，我专为本文配套设计了一个小工具，看看它给我们的效果吧。

上面两个查询的对应结果如下：

(1)柱状图

查询`bitcoin`关键字，获得如下柱状图

![sacdl-bitcoin-bar][]

查询`wallet`关键字（不一定是加密货币钱包），获得如下柱状图

![sacdl-wallet-bar][]

(2)树形矩阵

查询`bitcoin`关键字，获得如下矩阵图

![sacdl-bitcoin-treemap][]

(3)更复杂的查询

请自己去体验吧，地址：<https://imfly.github.io/sacdl-project>。

## 前10个应用简介

我们使用github的搜索功能，并选择forks数量倒序排列，查询：

```
bitcoin language:JavaScript
```

**注意**：每一个fork背后可能就是一个全新的产品，forks代表了程序被二次开发的情况，个人觉得对于技术选型相对更有说服力。

前10个应用如下：

１. bitpay/bitcore　1656颗星，429个分支

源码网址: https://github.com/bitpay/bitcore

第一位，这是bitpay团队的产品，号称下一代PayPal。这算是一个成功案例，足见Node.js开发加密货币的可行性。巴比特有专栏介绍。

２. startup-class/bitstarter-leaderboard 295颗星，386个分支

源码网址：https://github.com/startup-class/bitstarter-leaderboard

第二位，这是一个基于比特币开发众筹网站的模板程序。巴比特在做众筹，很多人也想进入这个领域，可以参考学习。

３. bitcoinjs/bitcoinjs-lib 980颗星，305个分支

源码网址：https://github.com/bitcoinjs/bitcoinjs-lib

第三位，这是个比特币web钱包开发包，几乎当前市面上所有的基于网站的钱包都在用，牛x吧。

４. askmike/gekko 866颗星，300个分支

源码网址：https://github.com/askmike/gekko

第四位，你也想推出一个像时代、okcoin那样的基于网页的交易市场吗，这个代码不容错过。不过，我个人觉得交易市场不仅仅是技术问题，Gekko也提醒您要自担风险。

５. bitpay/insight-ui 354颗星，267个分支

源码网址：https://github.com/bitpay/insight-ui

第五位，这是bitpay放出的一个开发web钱包的UI包（要基于bitcoin-node)，看来当前开发钱包的需求还是比较大的。可以与排行第７位的bitpay/insight-api配合开发。

６. kyledrake/coinpunk　733颗星，249个分支

第六位，该项目是一个本地化的钱包服务程序，已经停止维护，取而代之的就是第３位的bitcoinjs-lib。

７. bitpay/insight-api（略）

８. cjb/GitTorrent 3065颗星，133个分支

源码网址：https://github.com/cjb/GitTorrent

第八位，不过它的好评3065颗星却是最高的。这是一个去中心化的Github，作者写了[一篇博客][]详细解释了为什么Git也要去中心化。我本人觉得，这项目确实有意思，为我们开发去中心化的产品扩展了视野。基于这个项目思路，可以设想很多有价值的应用。

９. bitcoinjs/bitcoinjs-server

源码网址：https://github.com/bitcoinjs/bitcoinjs-server

第九位，已经放弃维护了。

10.　untitled-dice/untitled-dice.github.io　26颗星，114个分支

源码网址：https://github.com/untitled-dice/untitled-dice.github.io
　
第十位，一个基于比特币的赌博网站源码。有意思的是，用户评价26颗星，很低，说明人们的价值观还是不喜欢赌博的。但是拷贝的分支却很多，对于开发者来说，这也算是比特币的一个落地应用。

其实，还有很多应用，没有开源，或半开源，被关注的不多，鲜为人知。

## 结论

仅就上述数据分析，我们可以得出如下结论:

- 在整个开源社区，`Node.js`当之无愧是最流行的开发平台之一；
- 在钱包、交易市场等客户端应用领域，`Node.js`的应用较为广泛；
- 在加密货币核心代码开发上，`Node.js`的应用较少，远不如`python`，`java`,`c/c++`等开发语言的使用。

不过，由于`javascript`有着众多的用户群，随着加密货币的发展和普及，会有更多的`Node.js`开发者加入。选择`Node.js`，就像最初选择了`bitcoin`，作为第一批实践的用户，我们已经站在时代潮头。

## 说明

本文数据收集面仍然狭窄，无法完整呈现币圈全貌，仅供参考。后续，如果发现更多更好的应用，我会持续更新，您可以关注本文的电子书形式进行跟踪。

这是一篇软文，写作不难，真正的工作量在于数据统计分析，而这也因为`Node.js`变的轻松加愉快。

想知道上述数据和图表怎么来吗？请看下一篇：**《Node.js开发加密货币》之二：Node.js让前端开发像子弹飞一样**，将简单介绍`Node.js`的基本使用，教您一个数据挖掘、统计分析的小技巧，并尝试去理解那些交易市场、在线钱包等实时应用的开发过程。

## 链接

项目源码: <https://github.com/imfly/sacdl-project>

试用地址：<https://imfly.github.io/sacdl-project>

本文源地址： https://github.com/imfly/bitcoin-on-nodejs

电子书阅读： http://bitcoin-on-nodejs.ebookchain.org/


[Github]: https://github.com
[Github自带的搜索工具]: https://github.com/search

[Github上Top20项目情况]: ../styles/images/1/top20-table.jpg
[github-search-bitcoin]: ../styles/images/1/github-search-bitcoin.jpg
[github-search-bitcoin-result]: ../styles/images/1/github-search-bitcoin-result.jpg
[sacdl-bitcoin-bar]: ../styles/images/1/sacdl-bitcoin-bar.jpg
[sacdl-wallet-bar]: ../styles/images/1/sacdl-wallet-bar.jpg
[sacdl-bitcoin-treemap]: ../styles/images/1/sacdl-bitcoin-treemap.jpg
[一篇博客]: http://blog.printf.net/articles/2015/05/29/announcing-gittorrent-a-decentralized-github/
