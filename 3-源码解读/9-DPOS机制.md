进行中...

# DPOS机制的实现

## 前言

地址、签名、交易和区块链，

## 源码

主要源码地址：

delegates.js https://github.com/Ebookcoin/ebookcoin/blob/v0.1.3/modules/delegates.js

round.js https://github.com/Ebookcoin/ebookcoin/blob/v0.1.3/modules/round.js

accounts.js https://github.com/Ebookcoin/ebookcoin/blob/v0.1.3/modules/accounts.js

slots.js: https://github.com/Ebookcoin/ebookcoin/blob/v0.1.3/helpers/slots.js

## 类图

## 流程图

## 解读

[亿书白皮书][] 描述了DPOS（授权股权证明）机制原理，亿书由受托人来创建区块，获得新币（铸币），从而保证整个网络安全运行。想成为受托人，用户

- 需要注册为受托人;
- 注册为受托人的账户可以接受投票;
- 被社区选举，得票数排行前101位;

- 101个区块为一个生成周期，这些块均由101个代表随机生成;
- 每个周期结束，前101名的代表都要重新调整一次，一个完整周期大概需要16分钟。


## 参考

[stackoverflow](http://stackoverflow.com/questions/17502948/nexttick-vs-setimmediate-visual-explanation)
