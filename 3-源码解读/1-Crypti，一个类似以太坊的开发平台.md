# Crypti，一个类似以太坊的开发平台

# 不得不说的话

请您牢记：

**投资有风险，入市须谨慎！**

**我们分享的代码，仅仅提供了加密货币的一种技术实现，关注点在技术本身，并不代表该产品一定会成功（取决于很多因素），不能作为您是否投资的依据。**


写下这些文字的时候，Crypti核心团队已经分裂完成，有两名Crypti团队成员独立出来，在原来代码基础上，建立了另一个产品。有点像Bitcoin的Core和Classic。

其实，在决定开启这个专栏的时候，就对Crypti有一种不踏实的预感，原因是当初Crypti仅仅开源了0.3.x版，并且没有测试文件，处于半开源状态。凭多年参与开源项目的经历，一个对开源半推半就的状态绝对是一种错误。所以，才有了前面的一系列入门文章，目的就是在等待和选择。

在大家一再追问的情况下，Crypti最初并没有理会社区的要求，直到核心团队分裂，开源才彻底达成。但，失去了社区信任的产品，它的未来谁又能预料？这或许也是开源产品的风险之一吧。

不过，还好，**有2点幸运**：

* 一是避免了被耻笑的风险。在真正分享之前，它出现了分裂，给了我们警示，如果过程中出现这个问题，有些话没有提前说出来，必定让一些读者怀疑作者的眼光而忽视技术本身的价值，那于您于我都不是好事；
* 二是获得了开源代码。这次分裂，促成代码彻底开源，我们方才有机会学习使用全部代码，这对我们来说，是真正的好事。

那么，为什么一定要分享一个看不到未来的产品？原因有二：一方面，除了Bitcoin（以及fork它的其他竞争币），其他语言开发的加密货币并不是很多，算得上成功的也几乎没有。Nodejs平台上的产品更是如此，分享哪个产品区别不大。另一方面，Crypti的理想目标和已经实现的功能，其实还好，解决问题的思路值得学习，看看下面的分享就会知道。

**我是一个说到就要做到的人。在没有足够动力的情况下，我找不到任何理由把当初计划分享的Crypti，改成另一个名字。相反，于我个人而言，分享一个貌似已经失败的产品，比分享一个貌似可能成功的产品，风险小得多**

**2016.3.3日补充**：目前来看，不是每个人都会看到这里的文字，截止目前，Crypti没有再更新过，失败已成定局。另一个衍生的产品，是否会跑路，是否会成功？无从考量。因此，本人只好正式开启Ebookcoin项目，本项目筹划已久，也算是我2016年第二项心愿单，主导开发一样开源项目。我想，不仅开源代码，还要分享其完整实现，无用大成，也算给社区贡献了一份力量。后续，会公布更多信息，敬请关注。

## 前言

本篇的目的是通过一个产品的发行说明（白皮书），来了解产品最初的设计需求。无论是代码设计，还是源码分析，我们都要循着这些需求去渐次深入到代码内部，这样的思路，会帮助我们更加轻松、快速的掌握代码精髓。

## Crypti，是什么？

官方定义（[白皮书][] v2.1 2015.9.30）

>Crypti is a next generation platform that allows for the development and distribution of                          
>JavaScript based decentralized applications using an easy to use, fully featured ecosystem.                      
>Through Crypti, developers can build, publish, distribute, and monetize their applications within                      
>a custom built cryptocurrency powered system that utilizes custom blockchains, smart contracts,                      
>cloud storage, and computing nodes; all from within one industry solution.

翻译如下：

>Crypti，是下一代平台，允许开发和分发基于javascript的去中心化应用，是一个易于使用、功能齐全的生态系统。
>通过Crypti，开发者能够在一个定制的>加密货币驱动的系统里构建、发布、分发他们的应用，并获利。该系统利用
>定制的区块链、智能合约、云存储，以及计算节点等，提供了一体化的行业解决方案。

Crypti，使用建立在 HTTP 协议之上的点对点网络，基于 DPOS（受托人股权证明机制）共识算法，无需挖矿，大约1亿枚币子。每个块的时间为 10 秒，每个周期的 101 个区块均由 101 个代表随机生成，广播并添加到区块链里，在得到 6-10 个确认后，交易完成，一个完整的 101 个块的周期大概需要 16 分钟。

截一张钱包的图片（感谢巴比特网友`coinportal`的提醒），请看：

![wallet][]

## 核心功能

* 去中心化应用托管
* 去中心化应用存储
* 去中心化运算
* 每个去中心化应用特有的侧链系统
* Crypti 和 Bitcoin 的 API 接口

以及

* 用户名。相当于账户别名，与地址一样，可以接受付款（基于用户名可以实现很多功能）;
* 多重签名钱包。

## 技术架构

Crypti，后端基于 Node.js 开发，前端使用了 HTML5 和 CSS3，数据库使用了 SQLite3.0。任何熟悉 JavaScript 和 Node.js 的开发者都可以立即着手制作去中心化应用（Dapp），部署到Crypti 存储节点，收录到 Crypti 应用商店，且可直接进入 Crypti 运算节点获取执行代码。整个过程都由诚实安全的 Crypti 侧链共识网络提供安全保证。

从代码上看，它使用Express作为开发框架，各功能模块都放在`modules`文件夹里，结构简单清晰。我们看看它的UML图，大概了解一下吧。

（1）整个工程的UML图，如下：

图片太大，请 [点击这里][] 下载后浏览

（2）核心模块的UML图，如下：

![modules][]

## 总结

本篇主要是概览，目的是了解我们要分享的东东是什么。同时也说明，该应用的价值：既可以学习加密货币开发，也可以对侧链的开发有所了解，是目前覆盖区块链技术多个方面的应用之一。

既然使用了Express框架，基于Http协议，下一篇，我们就从Express的入口程序`app.js`入手，学习它的源码。请看下一篇:**《Nodejs开发加密货币》之六： 源码解读（入口程序app.js）**

## 链接

**本系列文章即时更新，若要掌握最新内容，请关注下面的链接**

本源文地址： https://github.com/imfly/bitcoin-on-nodejs

电子书阅读： [http://bitcoin-on-nodejs.ebookchain.org](http://bitcoin-on-nodejs.ebookchain.org/3-源码解读/1-Crypti，一个类似以太坊的开发平台.html)

## 参考

白皮书v2.1 2015.9.30：http://crypti.me/crypti.pdf

官方网站： http://crypti.me

源码地址： https://github.com/imfly/crypti



[白皮书]: http://crypti.me/crypti.pdf
[wallet]: ../styles/images/5/wallet.png
[点击这里]: ../styles/images/5/crypti.png
[modules]: ../styles/images/5/modules.png
