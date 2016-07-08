# Node.js开发加密货币

**注**: 本书仍在持续更新中，永久`免费`访问地址已经更新为: <http://bitcoin-on-nodejs.ebookchain.org>

如果您喜欢，请`免费`转发给身边的朋友;如果您是开发者，请`免费`为它 [点个赞][] 。虽为举手之劳，也绝非一般人能为！

亿书官网： <http://ebookchain.org>

首发区块链俱乐部： <http://chainclub.org>

## 关于

本书可以作为Node.js开发加密货币的入门书籍，也可以作为亿书（及以Crypti为核心的应用Lisk）的官方开发文档。

本书分享的源码是Ebookcoin（亿书币），是亿书的强大动力。与Lisk一样（成功众筹500多万美元），都是Crypti（已经不再维护）的一个独立分支，类似于以太坊具有侧链功能，可以承载多种去中心化的应用。因此，**无论您是研究Crypti、Lisk，还是Ebookcoin，或者学习Node.js前后端开发技术，本书都值得参考。**

亿书的目标是打造人人可用的去中心化软件，以加密货币为驱动，促进人类知识分享。与其他竞争币不同，我们以提供落地可用的软件为核心，力争成为人类第一个“零门槛”的加密货币产品。更多详情，请看[关于亿书][]

本书写作，也是亿书的最佳实践，从写到发布，简单、快捷。文章暂时在[github][]上免费发布，永久免费访问地址: <http://bitcoin-on-nodejs.ebookchain.org>

## 日志

- [x] 2016-07-08 发布第19篇: 交易 
- [x] 2016-07-02 发布第18篇: 关于时间戳及相关问题（优化补充）
- [x] 2016-06-27 发布第17篇: 签名和多重签名
- [x] 2016-06-23 发布第16篇: 地址
- [x] 2016-06-06 发布第15篇: 共识机制，可编程的利益转移规则
- [x] 2016-05-29 发布第14篇: 利益，魔鬼与天使的共同目标
- [x] 2016-05-23 完成第13篇: 加密货币就是货币
- [x] 2016-04-28 `书链`更名为`亿书`，撰写第13篇
- [x] 2016-04-17 发布第12篇：Ember深“坑”浅出
- [x] 2016-03-26 发布第11篇：一张图学会使用Async组件进行异步流程控制
- [x] 2016-03-17 发布第10篇
- [x] 2016-03-10 发布第9篇
- [x] 完成1-8篇

## 使用

目录由命令行工具 [gitbook-summary][] 自动生成。自由写作、发布，搭建自出版平台的方法，请[点击这里][self-publishing]

简要介绍如下：

(1)克隆源文

```
$ git clone https://github.com/imfly/bitcoin-on-nodejs.git
```

(2)安装gitbook

```
$ npm install -g gitbook-cli
```

(3)安装依赖包

```
cd bitcoin-on-nodejs
npm install
gitbook install
```

(4)写作构建

写作，并开启服务（构建）

```
$ gitbook serve
```

通过`http://localhost:4000`实时浏览

(5)生成目录

只要修改了文章标题和文件夹，就应该重新生成目录文件

```
$ npm run summary
```

(6)一键发布

```
$ npm run deploy
```

以后，只要4-6的过程就是了。

## 反馈

随时告诉我您的阅读体验和问题，也可以直接fork修改，提交PR。

## 协议

原创作品许可 [署名-非商业性使用-禁止演绎 3.0 未本地化版本 (CC BY-NC-ND 3.0)](http://creativecommons.org/licenses/by-nc-nd/3.0/deed.zh)

## 作者

微信：kubying

亿书官方开发交流QQ群：185046161

[github]: https://github.com/imfly/bitcoin-on-nodejs
[巴比特论坛]: http://8btc.com/thread-27448-1-1.html
[gitbook-summary]: https://github.com/imfly/gitbook-summary
[self-publishing]: https://github.com/imfly/how-to-create-self-publishing-platform
[关于亿书]: http://bitcoin-on-nodejs.ebookchain.org/8-附录/2-关于亿书.html
[点个赞]: https://github.com/imfly/bitcoin-on-nodejs
