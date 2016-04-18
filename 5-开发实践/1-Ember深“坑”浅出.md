# Ember.js 深“坑”浅出

## 前言

Ember给开发带来一种飞一般的感觉，如果问前端框架哪家强，我会毫不犹豫的说`Ember`。

之前接触过ember，那应该是1.0版本以前的事情，说起来也得有2年多了。当初ruby on rails火热，出来的discourse论坛就是以RoR为后台，用Ember开发的前端，很酷，真有点`ambitions`的感觉（Ember的宣传口号）。

不过，试用了一下，用后台的思路去开发前端应用，有点撕裂，很多东西不对路。生搬硬套后端的MVC模式，除了使开发更复杂，感觉没有太大的突破。另外，Ember是封装最为严格的前端框架，市面上大量现成的第三方开发包不能直接简单的引入使用，也成为其被受诟病的地方。

这次，为了开发`书链`的官方网站，也为了给日后客户端的开发选择一个技术方案，重新看了看Ember。不看不知道，一看，我了个去，简直就是按照自己当年的想法在改进，试用了一下，岂止一个爽字了得。真心感谢，这些踏踏实实做事的团队，他们真的非常`ambitions`。

这里分享的是书链官方网站的开发体会，仅仅一个星期的体验，并不能理解它的精髓，如果让你看完感觉不是那么回事，一定不是Ember的问题，而是作者我的能力所限。对美丽的东西，我们得学着欣赏。

## 书链官网介绍

#### 1.资源信息

书链官网： http://ebookchain.org  源码： https://github.com/Ebookchain/ebookchain.org

截图如下：

![ebookchain-official-site][]

这是一个简单的静态网站，如果不考虑扩展性，单纯使用html + div + javascript的形式，对于美工较好的前端来说，就是半天的时间。

当然，对于我这样，习惯了后台开发产品的人，实际花费的时间也不多。从建立工程到部署，7天时间，每天两个多小时集中投入，其中大部分都花在研究和学习上了。从安装使用，搭建工程，到插件开发，引入第三方库，都统统了解了一下，所以才有了很爽快的感觉。

#### 2.功能特点

一个静态网站还要什么特殊功能吗？好看，能传达产品信息，不就行了吗？不过，既然是研究，就得多少弄点特色出来。书链，主要实现了以下几个功能（**这些功能，很多网站都有，我把它集中到一起，因此，书链官网可以作为一个init工程来用**）：

* **导航动画**：当滚动页面的时候，网站的header会动态调整。这个我已经抽出来，做成了Ember的插件，源码地址：https://github.com/imfly/ember-cli-animated-header

* **滚动事件**：Ember没有对`Scroll`事件的处理。这里为Ember提供了响应`Scroll`事件的能力，抽出的插件在这里： https://github.com/imfly/ember-cli-scroller

* **SVG动画**: 当打开网站的时候，会看到第一页`ebookchain`的动画效果;

* **全页展示**: 滚动页面，页面会按照屏幕，逐个显示出来，自动适配屏幕大小。封装的插件在这里： https://github.com/imfly/ember-cli-fullPagejs

* **多语言支持**: 提供了英文和中文两种语言，默认是英文，咱也走国际范;
* **模块布局**: 产品特征、合作伙伴部分（甚至footer部分）直接用的json数据，完全按照mvc模式进行分离，添加、修改、删除、扩展都很方便，无需动刀页面;
* **自动构建**: 一键导出静态页面，合并压缩js,css等文件;
* **一键部署**

多语言支持和扩展性，显然要比纯粹的静态页面好处多多。细心的小伙伴，一定会发现，类似的主页非常多，有的基本上完全一样。事实上，很多是直接拷贝他人的静态页面，有了书链官网代码，建立类似的主页，扩展和修改就会简单很多。

#### 3.技术选型

开发静态网站，可用的方案有很多，我尝试了下面三种：

（1）自己开发设计

为了延续前面的工作，最初在《Nodejs开发加密货币》 入门部门提供的实例程序基础上构建了一个应用，用来输出静态页面。写到最后，发现在走ember-cli等现有产品的老路，果断放弃。代码在这里（已经废弃）https://github.com/Ebookchain/ebookchain.com

（2）使用第三方产品

这类产品，有人叫做静态站点生成器，最早流行的是WordPress。不过，基于Nodejs并在github上被广泛关注的，有Wintersimith，Assemble，Metalsmith，Hexo，DocPad等等。这类产品多是面向技术人员，要具备学习掌握基本安装和使用的能力。

这类产品的特点，就是帮你解决了主题、转化和部署等工作，把内容创作给你留下，极大的简化静态页面的生成过程。其原理，与我现在使用[`gitbook-summary`][]撰写电子书一样。试用了其中两款，没有简单到哪去，因此，也不是俺的菜。

（3）借助开发框架

个性化的产品，当然还得自己开发设计，只不过代码的结构和后期的处理，可以交由现成的框架产品。这样，即保证了开发设计的工作效率，也可获得更大的代码处理自由度。缺点可能是，技术门槛会高一些。

书链选择使用Ember作为前端开发框架，涉及的产品包括：官方网站、各平台的客户端。把可以共享的部分，全部抽取出来，独立为基本的组件，方便各产品共享使用，会大大提高产品线的开发进度。试用了一下Ember，感觉很爽，不再它顾。

## 理解Ember几个让人迷乱的深“坑”

对某些小伙伴来说，ember的学习曲线还是陡了些。前面罗嗦的都是Ember的好，或许会让你毫不犹豫的用它。这里把拉几个Ember的“不良”习惯，不至于一试用就被泼了冷水。入门文章，网上有很多，就不重复了。这里提示性的，把我理解的、需要提醒小伙伴们注意的地方，简单说说。

#### 1.什么是前端框架？

貌似高深的东西，其实也不过是一个js文件而已。因此，您完全可以像用其他js文件一样，在自己的页面里引入和使用。既然它叫框架，显然是提供了`特定的规则`，所以学习它的重点，就是要掌握这些规则。掌握不好，自然就会掉进“坑”里。

为什么要这么说，是因为Ember官方文档实在不是个好东西，它没有一个整体的概念，有时候让人无从知晓“为什么会如此”。即便是对细节的介绍，也不是那么细，有时候需要结合源码去理解。再者，版本、Api变化太快。这些在两年前，已经被人提出来，现在仍然没有太大改进。可见团队是多么“坚持”的一帮哥们。

#### 2.一定要使用它的命令行工具Ember-cli

这个就别犹豫了，虽然可以直接使用js文件，但是没有Ember-cli这样强有力的命令行工具，使用Ember的难度会陡增。这个工具，让开发Ember应用，如开发后台程序，特别是用惯了ruby on rails的朋友，会非常亲切。从建立工程、产生各类逻辑代码，到测试、部署，等等，该工具（或通过插件）包揽了一切。

不习惯命令行开发？当我没说。

#### 3.在浏览器上安装使用ember-inspector插件

这个必须有。在ruby on rails里，产生的路由等信息，可以在命令行里查看。但是，针对前端应用，只能在前端查看。通过该工具，可以掌握生成的路由、控制器、视图组件等各类对象信息，以及它们之间的对应关系，还能点击对应对象，查看对应方法和加载的数据。更主要的是，Ember默认生成的路由和视图等也被罗列了出来，如indexRoute，如图：

![ember-inspector][]

#### 4.Ember提倡的MVC模型里没有了VC

在Ember的MVC模型里，之前的版本，`M`：代表model，`V`: view（外加helper,component)，`C`：controller，路由route单独存在。2.0版本以后，这个模式改变了，VC部分逐步剔除，取而代之的是router + model + component的形式。

或者说，V的内容变成了component，C的内容放在了router里。个人看来，这应该是理性回归，因为之前的版本里，controller能做的事情，router也照样能做，留着controller只能是一个概念的实现，本质上没什么用处。

当然，目前的版本还保留着控制器和视图（可以通过插件来用），但是能不用就别用了。

#### 5.有了组件，自然就没了全局模板layout和局部模板partial的存在了

理解这个很重要。一方面，Ember号称面向未来，今天开发的UI组件component，在以后也能被使用。以后的版本里，组件的地位更加重要。所以，以前可能对文章列表，比如：post-item的处理，就是写一个局部模板partial来实现重用，今天用component就好了。partial不再被支持。

另一方面，application.hbs本身就相当于一个layout.hbs文件，作为单页面应用，自然就没有所谓layout的存在，这与后台使用handlebar.js有区别。它的渲染层次如下：

![views-render][]

这张图，权且简单的描述一下Ember的视图渲染过程，动态图像才会更直观。事实上，它还可以更复杂一些，把一些钩子方法也放进去，这样对于Ember的数据传递、视图渲染等过程就会更加直观。

#### 6.掌握路由、模型、UI组件等各部分的钩子方法，是玩转Ember的必经之路

设计独立静止的页面，肯定没有什么难度，所以简单的hello world程序看不出什么来。现实是，多个模型的关联操作，路由状态的转移变更，UI组件的交互嵌套，插件与主程序的良好扩展，才是开发中的常态，处理它们简单了，才真叫简单。

这部分，有必要单独总结一下，有机会再说，^_^。

#### 7.本地插件开发，最容易忽视的小动作

这个不是ember的问题，但是ember的插件也是npm包，自然npm的问题也是它的问题。我们本地开发调试npm包（或ember-cli插件），通常使用`npm link`和`npm link npm-name`两个命令，将开发的npm包引入工程。最容易忽略的就是，运行完命令后，还应在工程的`package.json`里，添加对该包的依赖`ember-cli-pluginName: '*'`。

事实上，也有不需要设置的。不过这么做，是最稳妥的方法。建议把这一个小步骤作为一个固定`约束`，会节省很多时间（俺这次被坑了大半天）。

## 总结

Ember是个值得掌握的产品，这篇算做引子，接下来两篇，图解它的渲染过程和钩子方法，介绍它的插件开发，慢慢补全客户端开发部分的内容。

写本文时，涉及到的源码还在整理中，文档和测试没有添加，功能还不健全，如果喜欢Ember，欢迎参与或star。

## 链接

**本系列文章即时更新，若要掌握最新内容，请关注下面的链接**

本源文地址： https://github.com/imfly/bitcoin-on-nodejs

电子书阅读： [http://bitcoin-on-nodejs.ebookchain.org](http://bitcoin-on-nodejs.ebookchain.org/5-开发实践/1-Ember深“坑”浅出.html)

电子书下载： [下载页面][] [PDF文件][] [ePub文件][] [Mobi文件][]

[PDF文件]: https://www.gitbook.com/download/pdf/book/imfly/bitcoin-on-nodejs
[ePub文件]: https://www.gitbook.com/download/epub/book/imfly/bitcoin-on-nodejs
[Mobi文件]: https://www.gitbook.com/download/mobi/book/imfly/bitcoin-on-nodejs
[下载页面]: https://www.gitbook.com/book/imfly/bitcoin-on-nodejs/details

**涉及到的源码，如果觉得有用，欢迎通过`star`收藏**

书链官网源码： https://github.com/Ebookchain/ebookchain.org

全屏页面插件： https://github.com/imfly/ember-cli-fullPagejs

动画效果导航：https://github.com/imfly/ember-cli-animated-header

Ember滚动事件：https://github.com/imfly/ember-cli-scroller

## 参考

Ember官网： https://emberjs.com

Ember-cli官网： http://ember-cli.com

书链官网： http://ebookchain.org  

[ebookchain-official-site]: ../styles/images/5-1/ebookchain.gif
[ember-inspector]: ../styles/images/5-1/ember-inspector.jpg
[views-render]: ../styles/images/5-1/ember-multi-render.jpg
[`gitbook-summary`]: https://github.com/imfly/gitbook-summary
