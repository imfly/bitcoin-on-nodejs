进行中...

# DPOS机制的实现

## 前言



## 源码

主要源码地址：

delegates.js https://github.com/Ebookcoin/ebookcoin/blob/master/modules/delegates.js

slots.js: https://github.com/Ebookcoin/ebookcoin/blob/master/helpers/slots.js

accounts.js https://github.com/Ebookcoin/ebookcoin/blob/master/modules/accounts.js

round.js https://github.com/Ebookcoin/ebookcoin/blob/master/modules/round.js

## 需求

[亿书白皮书][] 描述了DPOS（授权股权证明）机制原理，亿书由受托人来创建区块，获得新币（铸币），从而保证整个网络安全运行。想成为受托人，用户

- 需要注册为受托人;
- 注册为受托人的账户可以接受投票;
- 被社区选举，得票数排行前101位;

- 101个区块为一个生成周期，这些块均由101个代表随机生成;
- 每个周期结束，前101名的代表都要重新调整一次，一个完整周期大概需要16分钟。
