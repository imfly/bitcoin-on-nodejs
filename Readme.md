# Nodejs开发加密货币

版本： 0.3.4
时间： 2016-03-10

## 关于

这是我2016年必须完成的一项任务，积累知识，娱乐自己，方便他人。[2016年心愿单][]

## 说明

文章在[github][]上免费发布，永久免费访问地址: <http://book.btcnodejs.com>

## 使用

目录由命令行工具 [gitbook-summary][] 自动生成。自由写作、发布，搭建自出版平台的方法，请[点击这里][self-publishing]

简要介绍如下：

(1)安装gitbook

```
$ npm install -g gitbook-cli
```

(2)克隆源文

```
$ git clone https://github.com/imfly/bitcoin-on-nodejs.git
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

我们始终关注C/C++、Nodejs等编程语言，在`区块链、电子商务、即时通信、电子书、自媒体、物联网`等领域的创新应用，已经汇聚了大批在该领域的`开发、设计、运营和管理`人才，如果您也有志于此，请[跟我联系][]

微信：kubying

Ebookcoin官方开发交流QQ群：185046161

[github]: https://github.com/imfly/bitcoin-on-nodejs
[巴比特论坛]: http://8btc.com/thread-27448-1-1.html
[gitbook-summary]: https://github.com/imfly/gitbook-summary
[self-publishing]: https://github.com/imfly/how-to-create-self-publishing-platform
[跟我联系]: /7-附录/4-关于作者.md
[2016年心愿单]: 7-附录/3-2016年心愿单.html
