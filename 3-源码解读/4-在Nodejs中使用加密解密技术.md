# 在Nodejs中使用加密解密技术


## 前言

加密解密技术在加密货币开发中的作用不言而喻。但技术本身并不是什么新鲜事，重要的是如果没有前面的P2P网络，和后面要介绍的区块链，单独的加解密显然没有那么神奇，加密货币也不会成为无需验证、高度可信的强大网络。

但是，提到加解密技术，业界的通则是，使用现成的组件，严格按照文档去做，别自作聪明，这也是使用加密解密技术的最安全方式。这篇就来研究`Ebookcoin`是如何使用加解密技术的。

## 源码

`Ebookcoin`没有提供相关扩展，全部使用Nodejs自己的`crypto`模块进行加密，使用`Ed25519`组件签名认证。本文涉及到的代码：

accounts.js: https://github.com/Ebookcoin/ebookcoin/blob/master/modules/accounts.js

account.js: https://github.com/Ebookcoin/ebookcoin/blob/master/logic/account.js

## 类图

![crypto-class.png][]

## 流程图

![crypto-activity.png][]

## 概念

仅仅介绍涉及到的最少概念（说实话，多了咱也不会，甚至不敢）。

#### (1)私钥和公钥

加密技术涉及的概念晦涩，讲个小故事，就一下清楚了。大学一哥们追女朋友有贼心没贼胆，一直不敢当面说“I love you”，就想了一招，顺手写下"J mpwf zpv"交给了另一位女生，让她帮忙传信。然后，等女朋友好奇打来电话时，他就告诉她依次向前顺延1个字母，组合起来就是他想说的话。

暂且不论成功与否，先看概念：这里的“I love you”就是`明文`，"J mpwf zpv"就是`密文`，向后顺延1个字母是`加密`过程，向前是`解密`过程，而这个规则就是`算法`。这种简单的加解密过程，就叫“对称加密”。缺点很显然，必须得打电话告诉女朋友怎么解密，岂不知隔墙有耳。

当然，更安全的方式是不要打电话也能处理。自然就是这里的私钥和公钥，它们都是长长的字符串值，私钥好比银行卡密码，公钥好比银行卡账户，账户谁都可以知道，但只有掌握私钥密码的人才能操作。不过，私钥和公钥更为贴心与先进，用私钥签名的信息，公钥可以认证确认，相反也可以。这就为网络传输和加密提供了便利。这就是“非对称加密”。

#### (2)加密货币地址

拿加密货币的鼻祖，比特币而言，⼀个⽐特币地址就是一个公钥，在交易中，⽐特币地址通常以收款⽅出现。如果把⽐特币交易⽐作⼀张⽀票，⽐特币地址就是收款⼈，也就是我们要写⼊收款⼈⼀栏的内容。

而私钥就是⼀个随机选出的数字⽽已，在⽐特币交易中，私钥⽤于⽣成⽀付⽐特币所必需的签名以证明资⾦的所有权，即地址中的所有资⾦的控制取决于相应私钥的所有权和控制权。

私钥必须始终保持机密，因为⼀旦被泄露给第三⽅，相当于该私钥保护之下的⽐特币也拱⼿相让了。私钥还必须进⾏备份，以防意外丢失，因为私钥⼀旦丢失就难以复原，其所保护的⽐特币也将永远丢失。

`Ebookcoin`也是如此，只不过更加直接的把生成的公钥地址作为用户的ID，用作网络中的身份证明。更加强调用户应该仔细保存最初设定的长长的密码串，代替单纯的私钥保存，更加灵活。

#### (3)加密过程

Nodejs的`Crypto`模块，提供了一种封装安全凭证的方式，用于HTTPS网络或HTTP连接，也对OpenSSL的Hash，HMAC，加密，解密、签名和验证方法进行了封装。

在币圈里，谈到加密技术时，经常听到Hash算法。很多小盆友时常与数组（array）和散列（hash）等数据格式混淆，以为Hash算法获得的结果都像json格式的键值对似的。

其实，这是语言上的差异，`Hash`还有`n. 混杂，拼凑; vt. 搞糟，把…弄乱`的意思。所以，所谓的hash算法，解释为混杂算法或弄乱算法，更加直观些。

`Ebookcoin`使用的是`sha256`Hash算法（除此之外，还有MD5,sha1,sha512等），这是经过很多人验证的有效安全的算法之一（请看参考）。通过`Crypto`模块，简单加密生成一个哈希值：

```
var hash = crypto.createHash('sha256').update(data).digest()
```

这个语句拆开来看，就是`crypto.createHash('sha256')`先用`sha256`算法创建一个Hash实例;接着使用`.update(data)`接受`明文`data数据，最后调用`.digest()`方法，获得加密字符串，即`密文`。

然后，使用`Ed25519`组件，简单直接地生成对应密钥对：

```
var keypair = ed.MakeKeypair(hash);
```

#### (4)验证过程

加密技术的作用，重在传输和验证。所以，加密货币并不需要研究如何解密原文。而是，如何安全、快捷的验证。`Ebookcoin`使用了`Ed25519`第三方组件。

该组件是一个数字签名算法。签名过程不依赖随机数生成器，没有时间通道攻击的问题，签名和公钥都很小。签名和验证的性能都极高，一个4核2.4GHz 的 Westmere cpu，每秒可以验证 71000 个签名，安全性极高，等价于RSA约3000-bit。一行代码足矣：

```
var res = ed.Verify(hash, signatureBuffer || ' ', publicKeyBuffer || ' ');
```

## 实践

在`Ebookcoin`世界里，`Ebookcoin`把用户设定的密码生成私钥和公钥，再将公钥经过16进制字符串转换产生帐号ID（类似于比特币地址）。付款的时候，只要输入这个帐号ID（或用户别名）就是了。该ID，长度通常是160⽐特（20字节），加上末尾的`L`后缀，也就是21字节长度。

因此，在使用的过程中，会发现，软件（钱包程序）仅仅要求输入密码（通常很长），而不像传统的网站，还要用户名之类的信息。这通常就是加密货币的好处，即保证了安全，也实现了匿名。

`Ebookcoin`要求用户保存好最初设定的长长的明文密码串，它是找回帐号（财富）的真正钥匙。这比直接保管私钥方便得多，当然，风险也会存在，特别是那些喜欢用短密码的人。当然，`Ebookcoin`的做法是，提供了二次签名（类似于支付密码）、多重签名等措施，弥补这些问题。

这里，仅研究一下用户ID的生成，体验上述过程，请看代码：

```
// modules/accounts 628行
shared.generatePublickey = function (req, cb) {
	var body = req.body;
	library.scheme.validate(body, {
		...
		required: ["secret"]
	}, function (err) {
		...
    // 644行
		private.openAccount(body.secret, function (err, account) {
			...
			cb(err, {
				publicKey: publicKey
			});
		});
	});
};

// 447行
private.openAccount = function (secret, cb) {
	var hash = crypto.createHash('sha256').update(secret, 'utf8').digest();
	var keypair = ed.MakeKeypair(hash);

	self.setAccountAndGet({publicKey: keypair.publicKey.toString('hex')}, cb);
};

// 482行
Accounts.prototype.setAccountAndGet = function (data, cb) {
	var address = data.address || null;
	if (address === null) {
		if (data.publicKey) {
      // 486行
			address = self.generateAddressByPublicKey(data.publicKey);
		  ...
		}
	}
	...
  // 494行
	library.logic.account.set(address, data, function (err) {
		...
	});
};

// modules/accounts 455行
Accounts.prototype.generateAddressByPublicKey = function (publicKey) {
	var publicKeyHash = crypto.createHash('sha256').update(publicKey, 'hex').digest();
	var temp = new Buffer(8);
	for (var i = 0; i < 8; i++) {
		temp[i] = publicKeyHash[7 - i];
	}

	var address = bignum.fromBuffer(temp).toString() + 'L';
	if (!address) {
		throw Error("wrong publicKey " + publicKey);
	}
	return address;
};
```

说明：上面628行，是产生公钥的方法，通常需要用户提供一个`secret`。447行，可以看到，将用户密码进行加密处理，然后直接生成了密钥对，接着将公钥继续处理。486行调用了方法`generateAddressByPublicKey`，455行，该方法对公钥再一次加密，然后做16进制处理，得到所要地址。

过程中，对于私钥没有任何处理，直接无视了。这是因为，这里的使用方法`ed25519`，基于某个明文密码的处理结果不是随机的，用户只要保护好自己的明文密码字符串，就可以再次生成对应私钥和公钥。

## 总结

密码学是一门独立的学科，本人纯属外行，只能点到为止。本篇并没有对交易、区块和委托人等的加密验证处理过程进行分析，过程都比较类似，后续阅读时会进一步说明。

其实，加密和验证的过程贯穿于交易的全过程，研究交易才是更好的理解加密和验证机制的方法。因此，请看下一篇：**《Nodejs开发加密货币》之十：签名与交易**

## 链接

**本系列文章即时更新，若要掌握最新内容，请关注下面的链接**

本源文地址： https://github.com/imfly/bitcoin-on-nodejs

电子书阅读： [http://book.btcnodejs.com](http://book.btcnodejs.com/3-源码解读/4-在Nodejs中使用加密解密技术.html)

电子书下载： [下载页面][] [PDF文件][] [ePub文件][] [Mobi文件][]

## 参考

[Ed25519官方网站](http://ed25519.cr.yp.to/)

[现代密码学实践指南(2015年)](http://blog.helong.info/blog/2015/06/05/modern-crypto/)

[密码学一小时必知](http://blog.helong.info/blog/2015/04/12/translate-Everything-you-need-to-know-about-cryptgraphy-in-1-hour/)

[浅谈nodejs中的Crypto模块](https://cnodejs.org/topic/504061d7fef591855112bab5)

[crypto-class.png]: ../styles/images/modules/crypto/class.png
[crypto-activity.png]: ../styles/images/modules/crypto/activity.png

[PDF文件]: https://www.gitbook.com/download/pdf/book/imfly/bitcoin-on-nodejs
[ePub文件]: https://www.gitbook.com/download/epub/book/imfly/bitcoin-on-nodejs
[Mobi文件]: https://www.gitbook.com/download/mobi/book/imfly/bitcoin-on-nodejs
[下载页面]: https://www.gitbook.com/book/imfly/bitcoin-on-nodejs/details
