## 前言

开发一个产品之前，技术选型是很重要的一个步骤。而选型的因素有几个，包括自身所掌握的技术，是否需要与旧项目兼容，项目涉及到的软硬件环境，以及应用场景等。

如果对于一个全新的项目，特别是自己又是一个几乎从零起步的人来说，寻找一种通用的语言平台更为关键，这样做，可以有更多的案例学习，获得更直接的社区支持。

我们目前选择的`Nodejs`就是这样一个平台和技术，我们从各个方面来考察一下，Nodejs是如何被比特币，以及各种竞争币所使用的。

## Nodejs在整个开源社区很流行

在开源社区， [Github][] 大名鼎鼎，我们先看看，在其上托管的项目语言使用情况。有一个需要提醒的问题是，目前`javascript`语言所对应的大部分项目都建立在`Nodejs`平台之上，因此`javascript`语言大致可以代表`Nodejs`。

![Github上Top20项目情况][]

图1: Github上Top20项目情况 

从图1可以看出，在整个开源社区，`javascript`被广泛应用。如果你点开其中的链接，仔细审查发现，他们都建立在Nodejs平台之上，哪怕是纯前端的项目，也因为Nodejs而便于开发与维护。

## Nodejs在币圈也同样非常流行

我们使用[Github自带的搜索工具][], 在搜索框内输入下面的内容：

```
bitcoin stars:>100 forks:>50
```

意思是：查询包含关键字bitcoin，星100以上，Fork50以上的全部项目库

如图：

![github-search-bitcoin][]

结果如下：

![github-search-bitcoin-result][]

也可以使用更加复杂的查询条件，比如：

```
bitcoin OR wallet stars:>100 forks:>50 in:file extension:md
```

意思是：查询在文件扩展名为`.md`的文件中，包含关键字bitcoin或wallet，星100以上，fork50以上的全部项目库

你可以修改限制条件或关键字，多试验几次。

如果仅限于这样的结果，实在不过瘾。为了一劳永逸的获得想要的结果，我专门设计了一个小工具，看看它给我们的效果吧。

上面两个查询的结果如下：

(1)柱状图

查询`bitcoin`关键字，获得如下柱状图

![sacdl-bitcoin-bar][]

查询`wallet`关键字（不一定是加密货币钱包），获得如下柱状图

![sacdl-wallet-bar][]

(2)树形展示

查询`bitcoin`关键字，获得如下树状图

![sacdl-bitcoin-treemap][]

(3)更复杂的查询

请自己去体验吧。

## 前10个应用简介

我们查询

```
bitcoin language:JavaScript 
```

看看前10个应用都是什么。

１. bitpay/bitcore　1656颗星，429个分支

源码网址: https://github.com/bitpay/bitcore

第一位，这是bitpay团队的产品，号称下一代PayPal。这么成功的案例，足见Nodejs开发加密货币的可行性。巴比特有专栏介绍。

２. startup-class/bitstarter-leaderboard 295颗星，386个分支

源码网址：https://github.com/startup-class/bitstarter-leaderboard

第二位，这应该是一个用于基于比特币开发众筹网站的模板程序。巴比特在做众筹，很多人也想进入这个圈子，可以参考学习。

３. bitcoinjs/bitcoinjs-lib 980颗星，305个分支

源码网址：https://github.com/bitcoinjs/bitcoinjs-lib

第三位，这是个比特币web钱包开发包，几乎当前市面上所有的基于网站的钱包都在用，牛吧。

４. askmike/gekko 866颗星，300个分支

源码网址：https://github.com/askmike/gekko

第四位，你也想推出一个像时代、okcoin那样的基于网页的交易市场吗，这个代码不容错过。不过，Gekko提醒您要自担风险。

５. bitpay/insight-ui 354颗星，267个分支

源码网址：https://github.com/bitpay/insight-ui

第五位，这是bitpay放出的一个开发web钱包的UI包（要基于bitcoin-node)，看来当前开发钱包的需求还是比较大的。可以与排行第７位的是bitpay/insight-api配合开发。

６. kyledrake/coinpunk　733颗星，249个分支

第六位，该项目是一个本地化的钱包服务程序，已经停止维护，取而代之的就是第３位的bitcoinjs-lib。

７. bitpay/insight-api（略）

８. cjb/GitTorrent 3065颗星，133个分支

源码网址：https://github.com/cjb/GitTorrent

第八位，不过它的好评3065颗星却是最高的。这是一个去中心化的Github，作者写了[一篇博客][]详细解释了为什么Git也可以去中心化。我本人觉得，这项目确实有意思，也为我们开发去中心化的产品扩展了视野。基于这个项目思路，可以设想很多有价值的应用。

９. bitcoinjs/bitcoinjs-server

源码网址：https://github.com/bitcoinjs/bitcoinjs-server

第九位，已经放弃维护了。

10.　untitled-dice/untitled-dice.github.io　26颗星，114个分支

源码网址：https://github.com/untitled-dice/untitled-dice.github.io
　
第十位，一个基于比特币的赌博网站源码。有意思的是，用户评价26颗星，很低，人们的价值观还是不喜欢赌博的。但是拷贝的分支却很多，对于开发者来说，这也算是比特币的一个落地应用。

其实，还有很多应用，并没有开源，或半开源，并不为人所知。比如：crypti，一个类似于以太坊的应用，就在默默开发中。后面，我们详细介绍它，并对它的源码进行解读。

## 结论

仅就上述数据分析，我们可以得出如下结论:

- 在整个开源社区，`javascript`无疑是使用最广泛的开发语言，`Nodejs`当之无愧是最流行的开发平台；
- 在钱包、交易市场等客户端应用领域，`javascript`也是目前最流行的开发语言；
- 但在开发加密货币核心代码上，最流行的开发语言是`python`，`java`,`c/c++`等紧随其后，而`javascript`较少。

显然，由于`javascript`有着更加众多的用户群，随着加密货币的发展和普及，会有更多的`Nodejs`开发者加入。而现在，“先到先得”，作为第一批实践的用户，必然占据了先机。

选择`Nodejs`，就像最初选择了`bitcoin`(比特币)，我们已经站在时代潮头。

但是，就币圈而言，还有很多没有开源的竞争币或比特币应用，甚至一些半开源（部分代码）的加密货币，被关注的并不是很多（stars少于50,forks更是少得可怜），上述数据显然无法完整呈现币圈的全貌，仅供参考。

## 补充

这就是一篇软文而已，写作不超过小半天时间。真正的工作量在于数据统计分析，而这也因为`Nodejs`,而变的轻松加愉快。

想知道那些数据和图表怎么来吗？请看下一篇：**《Nodejs开发加密货币》之二：Nodejs让前端开发像子弹飞一样**

下一篇的主要目的是介绍`Nodejs`的基本使用，顺带介绍前端开发，题目是噱头（但也是事实）。


[Github]: https://github.com 我个人称之为Github代码托管社区
[Github自带的搜索工具]: https://github.com/search

[Github上Top20项目情况]: ./styles/images/top20-table.jpg
[github-search-bitcoin]: ./styles/images/github-search-bitcoin.jpg
[github-search-bitcoin-result]: ./styles/images/github-search-bitcoin-result.jpg
[sacdl-bitcoin-bar]: ./styles/images/sacdl-bitcoin-bar.jpg
[sacdl-wallet-bar]: ./styles/images/sacdl-wallet-bar.jpg
[sacdl-bitcoin-treemap]: ./styles/images/sacdl-bitcoin-treemap.jpg
[一篇博客]: http://blog.printf.net/articles/2015/05/29/announcing-gittorrent-a-decentralized-github/
