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

[亿书白皮书][] 描述了DPOS（授权股权证明）机制原理，亿书由受托人来创建区块，获得新币（铸币），从而保证整个网络安全运行。整个机制需要完成如下过程：

（1）用户成为受托人，并接受投票

- 注册为受托人;
- 接受投票（得票数排行前101位）;

（2）维持循环周期，调整受托人

- 每个块需要10秒，为一个时段（Slot）；每101个区块为一个循环周期（Round）。这些块均由101个代表随机生成，每个代表生成1个块。一个完整循环周期大概需要1010秒(101x10)，约16分钟;
- 每个周期结束，前101名的代表都要重新调整一次；
- 根据区块链高度，设置里程碑时间，调整区块奖励；

（3）循环产生新区块，处理分叉

上一章《区块链》已经讲过，这里不再赘述。

## 参考

[stackoverflow](http://stackoverflow.com/questions/17502948/nexttick-vs-setimmediate-visual-explanation).

[dpos-class.png]: ../styles/images/modules/dpos/dpos-class.png
[dpos-activity.png]: ../styles/images/modules/dpos/dpos-activity.png
[dpos-database.png]: ../styles/images/modules/dpos/dpos-database.png
