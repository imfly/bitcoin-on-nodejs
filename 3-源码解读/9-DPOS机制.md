进行中...

# DPOS机制的实现

## 前言

共识机制，这可是我一直神往的部分。我在第一个部分，专门拿出一篇文章介绍了它的原理、作用和种类，这一篇我们就来通过代码具体学习和研究它的具体实现。

## 源码

主要源码地址：

delegates.js https://github.com/Ebookcoin/ebookcoin/blob/v0.1.3/modules/delegates.js

round.js https://github.com/Ebookcoin/ebookcoin/blob/v0.1.3/modules/round.js

accounts.js https://github.com/Ebookcoin/ebookcoin/blob/v0.1.3/modules/accounts.js

slots.js: https://github.com/Ebookcoin/ebookcoin/blob/v0.1.3/helpers/slots.js

## 类图

![dpos-class.png][]

## 流程图

![dpos-activity.png][]

## 解读

我们在第一部分《共识机制，看编程的“利益”转移规则》里，已经详细解释了共识机制的相关概念，也对比了当前加密货币领域常用的三种共识算法原理和优越点，阅读本篇内容前，可以先去浏览温习一下。本篇把重点放在代码实现上，通过程序语言来强化亿书共识机制的实现方法。

[亿书白皮书][] 描述了DPOS（授权股权证明）机制基本原理和改进方法，这里不再重复。亿书由受托人来创建区块，并定量增加新币（铸币奖励，第一年每个块奖励5个亿书币），从而保证整个网络安全运行。整个机制需要完成如下过程：

（1）注册受托人，并接受投票

- 用户注册为受托人;
- 接受投票（得票数排行前101位）;

（2）维持循环，调整受托人

- 时段周期（Slot）：也称为块周期，每个块需要10秒，为一个时段（Slot）；
- 循环周期（Round）：或叫受托人周期，每101个区块为一个循环周期（Round）。这些块均由101个代表随机生成，每个代表生成1个块。一个完整循环周期大概需要1010秒(101x10)，约16分钟；每个周期结束，前101名的代表都要重新调整一次；
- 奖励周期（Milestone）：根据区块链高度，设置里程碑时间，在某个时间点调整区块奖励。大致是这样的，第一年奖励5亿书币/块，4年之后降为1亿书币/块，以后永远保持1亿书币/块，所以总量是在少量增发的；

（3）循环产生新区块，处理分叉

上一章《区块链》已经讲过，不再赘述。

下面，我们通过源码逐个查看其实现方法。

#### 1.注册受托人

注册受托人必须使用客户端软件（币圈俗称钱包），因此这项功能需要与节点进行交互，也就是说客户端要调用Api。与受托人管理的模块是 modules/delegates.js ，根据前面篇章的经验，我们很容易找到该模块提供的Api：

```
"put /": "addDelegate"
```

最终的Api信息如下：

```
put /api/delegates
```

对应的方法是，modules/delegates.js模块的`addDelegate()`方法。该方法与注册用户别名地址等功能性交易没有区别，注册受托人也是一种交易，类型为“DELEGATE”（受托人），详细过程请自行查看modules/delegates.js文件1017行的源码。

#### 2.投票



#### 3.时段周期

#### 4.循环周期（Round）

#### 5.奖励周期（Milestone）


## 链接

**本系列文章即时更新，若要掌握最新内容，请关注下面的链接**

本源文地址： https://github.com/imfly/bitcoin-on-nodejs

亿书白皮书： http://ebookchain.org/ebookchain.pdf

亿书官网： http://ebookchain.org

亿书官方QQ群：185046161（亿书完全开源开放，欢迎各界小伙伴参与）

## 参考

[stackoverflow](http://stackoverflow.com/questions/17502948/nexttick-vs-setimmediate-visual-explanation).

[dpos-class.png]: ../styles/images/modules/dpos/dpos-class.png
[dpos-activity.png]: ../styles/images/modules/dpos/dpos-activity.png
[dpos-database.png]: ../styles/images/modules/dpos/dpos-database.png
