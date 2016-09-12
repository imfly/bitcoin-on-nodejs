# 开发Ember-cli插件

## 前言

如果一个所谓的框架，虽然强大，但是会拒很多现有的工具于门外，这样的框架不会被大家广泛接受。Ember.js具备这样的扩展能力，现在官方网站有很多扩展插件（addon）可以直接拿来用。本文参考官方文档，结合`ember-cli-fullpagejs`插件的开发过程，介绍了Ember-cli插件开发的各个细节。

## 插件简介

https://github.com/imfly/ember-cli-fullpagejs

## 概念解读

（1）约定优于配置(convention over configuration)

我们在《静态网站开发全景扫描》里简单罗列了Ember的几个注意点，特别提到约定优于配置的问题，这是导致很多小伙伴入手困难的根源。有人很奇怪，这是大家纷纷提倡的，本来是好事，怎么就成了问题了呢？是的，如果习惯了（其实就是记牢了）约定，开发难度会大大降低，效率大大提高，因为框架本身已经帮你做好了这一切。相反，记不住那么多约定，或者你根本就不知道其中有这样的约定，就会给你带来很多困扰。这是目前，我们在学习很多所谓的框架知识的时候，应该特别注意的。这类框架，之所以学习成本较高，一方面是因为规则太多，另一方面就是规则与我们固有的习惯冲突太多。

举个简单的例子，我们在使用第三方库的时候，比如下面例子里的“fullPage.js”，通常要使用<script></script>标签来引入，接着按照该库的逻辑去做就是了。但作为一个约束较强的前端框架，类似的工作，你要先考虑一下，是不是有了它自己的规则。事实上，在Ember框架之下，正确的使用方法是先在`index.js`文件里使用`app.import`引入文件，然后使用组件的生命周期（见参考），通过合适的钩子方法来处理，这里是`didInsertElement()`方法。如果仍然延续原来的做法，最好的情况是得不到任何结果，最差的情况是得出奇怪的结果。

这就给我们使用现有的第三方库造成了很大困难，原本大量现成的好工具，使用起来如此蹩脚。很多小伙伴因此，直接放弃了Ember，转投其他约束较少的框架去了。这里，我们不去衡量框架的优劣，还是直接考虑如何解决这点小问题吧。这个小例子可以帮助我们把现有的库直接改造成Ember可用的插件，让其融入Ember体系，降低绑定难度。因为插件开发的过程，与实际的开发有很多相似的地方，只不过多了一些简单的配置过程，所以我们就把具体的开发过程融入这个插件开发里一起介绍了。当然，这样做不足以介绍Ember的方方面面，至少会解决我认为最困扰我们的地方，降低Ember开发难度。

（2）浏览器世界里的组件

Ember的组件（Component）是非常重要的概念，特别是v2.0.0版本之后，全部取代了视图（View），可以理解为Ember的一切都是组件。一切都是组件的概念，大大简化了问题逻辑，也与浏览器保持了最大兼容性，甚至可以兼容未来的浏览器标准。我个人觉得，Ember团队从此终于走出了ruby on rails的桎梏，开始回归理性，真正面向前端了。毕竟把所有功能集中到一个浏览器页面里（单页面应用），还要硬生生的拉上MVC来，着实让开发者纠结不已。

我们可以把浏览器最原始的按钮、链接、下拉框等标签元素，当成Ember最基本的组件来理解。有了Ember，就可以把一篇文章、一个列表、一个图片展示区域处理成一个组件，这样做至少有三个好处：一是，开发符合MVC的要求，可以做到数据与模板分离，就像开发一个独立的页面一样，思路清晰，快速高效；二是，使用上，这个组件本身与浏览器的基础组件没有区别，非常简单直接，可以自由组合嵌套；三是，一次开发，任何地方都可使用，甚至兼容未来的浏览器。

大家看官方文档，还能看到控制器（Controller）和模型（Model）的概念，其实它们是另类的组件而已，可以理解为组件的扩展。如此以来，使用Ember就简化为浏览器组件的开发，而且使用Ember开发的组件功能也更加强大，使用与浏览器普通的组件没有分别，这样无论开发还是使用都极度简化了。如果再把今天的这个例子弄明白，基本上，我们可以把任何重复性的功能都包装成各种组件，然后打包成插件，需要的时候，直接把这些插件安装上，就可以随处可用了，就又达到了一劳永逸的效果。

## 开发过程

现在，我们就来看看 ember-cli-fullpagejs 的完整开发过程吧。

#### 插件基本情况

（1）场景

Ember CLI插件API，当前支持下面的场景:

* 通过`ember-cli-build.js`操作`EmberApp`（主应用）
* 添加预处理器到默认的注册表
* 提供一个自定义应用程序树与应用程序合并
* 提供定制的专用(服务)中间件
* 添加自定义模板，为主程序生成相关的工程文件

（2）安装

一个插件可以像其他任何npm包一样安装：

`npm install --save-dev <package name>`

安装这个fullpagejs插件包：

`npm install --save-dev ember-cli-fullpagejs`

（3）命令行选项

Ember CLI有一个 *addon* 命令，带有下面的选项:

```bash
ember addon <addon-name> <options...>
  Creates a new folder and runs ember init in it.
  --dry-run (Default: false)
  --verbose (Default: false)
  --blueprint (Default: addon)
  --skip-npm (Default: false)
  --skip-bower (Default: false)
  --skip-git (Default: false)
```

注意：一个插件不会在已经存在的应用程序中被创建

（4）创建插件

创建一个基本插件:

`ember addon <addon-name>`

运行该命令，就会产生下面这些文件：

```bash
$ ember addon fullpagejs
version x.y.zz
installing
  create .bowerrc
  create .editorconfig
  create tests/dummy/.jshintrc
  ...
  create index.js

Installing packages for tooling via npm
Installed browser packages via Bower.
```

#### 插件工程结构

通过上述命令，自动生成插件工程目录和相关文件，插件工程遵循这些结构约定:

* `app/` - 合并到应用程序的命名空间(意思是说，在使用该插件的应用程序里，可以直接使用)。
* `addon/` - 插件的命名空间部分。
* `blueprints/` - 包含插件所有蓝图模板文件，每一个存放在一个独立的文件夹里。
* `public/` - 应用程序使用的静态文件，css，images，fonts等，路径前缀 `/your-addon/*`
* `test-support/` - 合并到应用程序的`tests/`
* `tests/` - 测试文件夹，包括一个"dummy"测试应用和验收测试助手。
* `vendor/` - 第三方专有文件，比如stylesheets, fonts, 外部包等等。
* `ember-cli-build.js` - 编译设置。
* `package.json` - Node.js元数据，依赖库等。
* `index.js` - Node.js入口(遵从npm约定)。

（1）Package.json

插件的`package.json`文件，像这样:

```javascript
{
  "name": "ember-cli-fullpagejs", // 插件名称
  "version": "0.0.1", // 插件版本
  "directories": {
    "doc": "doc",
    "test": "test"
  },
  "scripts": {
    "start": "ember server",
    "build": "ember build",
    "test": "ember test"
  },
  "repository": "https://github.com/repo-user/my-addon",
  "engines": {
    "node": ">= 0.10.0"
  },
  "keywords": [
    "ember-addon"
    // 添加更多关键字，便于分类插件
  ],
  "ember-addon": {
    // 插件配置属性
    "configPath": "tests/dummy/config"
  },
  "author": "", // 你的名字
  "license": "MIT", // 协议
  "devDependencies": {
    "body-parser": "^1.2.0",
    ... // 在这里添加专门的依赖库!
  }
}
```

Ember CLI将通过检测每个应用的依赖包的`package.json`文件，看在`keywords`部分是否有`ember-addon`关键字，从而检查一个插件是否存在。我们还可以添加一些额外的元数据来更好地分类该插件:

```javascript
  "keywords": [
    "ember-addon",
    "fullpagejs",
    "fullpage.js"
  ],
```

（2）插件入口

所谓的插件入口，就是调用插件最先执行的文件，每种编程语言都需要。插件将利用npm约定，并寻找一个 `index.js` 文件作为入口点，除非通过`package.json`文件的`"main"`属性指定另一个入口点。建议使用`index.js`作为插件入口点。

产生的`index.js`文件是一个简单的js对象(POJO) ，可以定制和扩展，像这样：

```javascript
// index.js
module.exports = {
  name: 'ember-cli-fullpagejs',
  included: function(app, parentAddon) {
    var target = (parentAddon || app);
    // 这里你可以修改主应用（app） / 父插件（parentAddon）. 比如, 如果你想包括
    // 一个定制的执行器，你可以把它加到目标注册器，如：
    //     target.registry.add('js', myPreprocessor);
  }
};
```

在构建（build）过程中，included钩子方法会被执行，直接操作主应用程序或者它的父插件，提高插件的处理能力。这个对象扩展了`Addon`类，所以任何存在于`Addon`类的钩子方法都可以被重写。请参考《Ember的几个重要钩子方法简介》

#### 插件开发设计

（1）添加插件依赖

这里，我们把要封装的第三方包`fullpagejs`作为插件的依赖包，打包进插件里去。安装客户端依赖要通过'Bower':

```
bower install --save-dev fullpagejs
```

上述命令，自动添加bower组件到开发依赖

```javascript
// bower.js
{
  "name": "ember-cli-fullpagejs",
  "dependencies": {
    ...
    "fullpage.js": "^2.7.8"
  }
}
```

（2）定制组件

为了定制组件，可以使用下面的命令：

```
$ ember generate component full-page
```

组件名称至少有有一个“-”线，这是约定。这个命令会自动生成必要的文件，以及测试文件，只要在里面添加逻辑代码就是了。为了允许应用程序不用手动导入语句而使用插件组件，应该把组件放在应用程序的命名空间之下，即`app/components`目录下。

```javascriptc
// app/components/full-page.js

export { default } from 'ember-cli-fullpagejs/components/full-page';
```

这行代码从插件路径导入组件，再导出到应用程序。实际组件的代码放在`addon/components/full-page.js`里：

```javascript
import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  classNames: ['fullpage-wrapper'],
  options: {
    sectionsColor: ['#4f7f9b', '#4BBFC3', '#1bbc9b', 'whitesmoke'],
    // anchors: ['firstPage', 'secondPage', '3rdPage', '4thpage', 'lastPage'],
    // menu: '#menu',
    scrollingSpeed: 600,
    autoScrolling: false,
    navigation: true,
    navigationPosition: 'right',
    navigationTooltips: ['First page', 'Second page', 'Third', 'Fourth and last page'],
    css3: true
  },

  didRender() {
    Ember.run.scheduleOnce('afterRender', this, function() {
      Ember.$("#fullpage").fullpage(this.options);
    });
  },

  willDestroyElement() {
    Ember.$.fn.fullpage.destroy('all');
  }
});
```

这与直接在应用程序里开发组件是一致的。该组件可以这样使用：

```
{{#full-page}} code {{/full-page}}
```

tagName属性指明，程序渲染之后的标签为`<div></div>`，并添加classNames指定的类名`fullpage-wrapper`。didRender()和willDestroyElement()是两个钩子方法，属于组件生命周期的一部分，前者将在组件静态内容全部渲染之后执行，起到了$(document).ready()方法的作用，所以可以确保Ember.$("#fullpage")元素存在的时候执行；后者，将在元素销毁（通常是页面刷新的时候）的时候执行，因为Ember是一个单页面应用，无论你如何跳转或刷新，全局变量Ember.$始终保持，所以必须手动清理。

这里的问题是，为什么使用didRender()，而不是didInsertElement()钩子方法？你看看官方提供钩子方法文档就知道了，前者在页面初始渲染以及再次渲染（刷新）的时候都可用，而后者仅在初始渲染的时候使用。也就是说，前者可以保证刷新页面，也能保证效果，后者则只能在加载页面时有效果，这也是约定好的。

#### 蓝图模板

为创建蓝图模板, 添加一个文件 `blueprints/ember-cli-fullpagejs/index.js`. 这是标准的Ember蓝图模板的命名约定。

确保依赖文件导入到应用程序，使用`included`钩子以正确的顺序导入这些文件。

```javascript
module.exports = {
  name: 'ember-cli-fullpagejs',

  included: function(app) {
    this._super.included(app);

    app.import('bower_components/unbutton/dist/unbutton.js');
    app.import('bower_components/fullpagejs/dist/js/fullpagejs.js');
    app.import('bower_components/fullpagejs/dist/css/fullpagejs.css');
  }
};
```

在这个例子文件里, 使用了`included` 钩子。这个钩子被`EmberApp`构造函数调用，并且让该应用把它作为`app`（与`app`文件夹下的文件一样）调用。
当主应用的`Brocfile.js`被Ember CLI调用去build/serve的时候，插件的`included`函数被调用，通过该应用的`EmberApp`实例（将插件的依赖文件添加到主程序）。

## 高级定制
一般来说，如果你想超越内置或想要/需要更高级的控制，以下是`index.js`里一些插件对象的可用钩子(键)。所有的钩子都希望把一个函数作为它的值（钩子都应该是函数）。

```javascript
includedCommands: function() {}
blueprintsPath: // return path as String
postBuild:
treeFor:
included:
postprocessTree:
serverMiddleware:
```

一个高级定制的例子可在[这里](https://github.com/poetic/ember-cli-cordova/blob/master/index.js)找到，或者服务器中间件 [这里](https://github.com/rwjblue/ember-cli-inject-live-reload/blob/master/index.js)

## 测试插件
插件工程包含一个`/tests` 文件夹，该文件夹包含运行和设置插件测试的基本文件。`/tests` 文件夹有下面的结构:

- `/dummy`
- `/helpers`
- `/unit`
- `index.html`
- `test_helper.js`

`/dummy` 文件夹包含一个基本的dummy应用，用于测试插件。

`/helpers` 文件夹包含各类*qunit*助手，包括为了保持测试简洁你自己定义的。

`/unit` 文件夹包含你的单元测试，用以测试你的插件用于各种可用场景。这些测试也可以是完整的集成测试,测试被托管在虚拟应用程序中的插件。

`test_helper.js` 是应该在任何测试文件中引用的主要帮助文件，它导入了`resolver`助手，可以在`/helpers`文件夹中找到，用于解析`dummy`中的页面。

`index.html`包含浏览器中加载的测试页面，以显示运行单元测试的结果。

## 验收测试
下面是一个简单的*QUnit*验收测试的例子，放在`tests/unit/components`文件夹之下。

```javascript
// tests/unit/components/button-test.js

import { test, moduleForComponent } from 'ember-qunit';
import startApp from '../../helpers/start-app';
import Ember from 'ember';

var App;

moduleForComponent('fullpagejs', 'fullpagejsComponent', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('is a button tag', function() {
  equal('BUTTON', this.$().prop('tagName'));

  this.subject().teardownfullpagejs();
});

// more tests follow...
```

对于如何运行和设置测试，看 [[Ember CLI Testing]] 部分。

## 创建蓝图模板
蓝图模板是一些具有可选安装逻辑的模板文件。它用于根据一些参数和选项脚手架(生成)特定应用程序文件。
更多细节请看[[generators-and-blueprints]])。一个插件可以有一个或多个蓝图模板。

给你的插件创建一个*blueprint*:

`ember addon <blueprint-name> --blueprint`

按照惯例，插件的主要蓝图模板应该具有与插件相同的名称:

`ember addon <addon-name> --blueprint`

在我们的例子中:

`ember addon fullpagejs --blueprint`

这将为插件产生一个文件夹 `blueprints/fullpagejs`，在这里你可以定义蓝图模板的逻辑和模板文件。您可以为一个插件定义多个蓝图模板。
最后加载的蓝图模板会覆盖现有(同名)蓝图的模板，该模板可以是来自Ember或其他插件(根据包加载顺序)

## 蓝图模板约定
蓝图模板应该放在在插件根目录的`blueprints`文件夹下， 就像覆盖工程根目录的蓝图模板一样。如果把它们放在插件的其他目录下，需要通过设置插件的`blueprintsPath`属性告诉ember-cli去哪找到它
(请看下面的 *高级定制* 部分)，如果你熟悉 *Yeoman* (或Rails)的产生器，蓝图模板遵从类似的约定和结构。要想更深入的了解蓝图模板设计，请看 [Ember CLI blueprints](https://github.com/stefanpenner/ember-cli/tree/master/blueprints)。

## 模板文件结构

```bash
blueprints/
  fullpagejs/
    index.js
    files/
      app/
        components/
          __name__/
  unbutton
    index.js
    files/
      config/
        __name__.js
```

注：这里被命名为`__name__` 的特殊文件或文件夹，将（在运行命令时）在你的应用程序中产生一个文件/文件夹，第一个命令行参数(name)代替`__name__`。

`ember g fullpagejs my-button``

由此在你的应用程序中产生一个文件夹`app/components/my-button`。

## 开发时链接到插件
当你开发和测试的时候，你可以在你的插件工程的根目录运行`npm link`，这样你就可以通过插件名称在本地使用该插件了。

然后，在您计划使用的应用程序工程根目录，运行`npm link <addon-name>`，就会将插件链接到应用程序的`node_modules`文件夹下，这样，插件中的任何改变都会在链接该插件的任何工程中直接发生作用。
请看 [npm-tricks](http://www.devthought.com/2012/02/17/npm-tricks)

#### 发布插件
使用 *npm* 和 *git* 来发布插件，就像一个标准的npm包。

```bash
npm version 0.0.1
git push origin master
git push origin --tags
npm publish
```

更多细节，请看 [npm-version](https://www.npmjs.org/doc/cli/npm-version.html)。

这些命令将被执行：

- tag with the version number
- push the committed addon code to your git repo (origin branch)
- push the new tag to your git repo (origin branch)
- publish addon to the global npm repository.

## 安装和使用插件
为了从您托管的应用中使用插件，从 [npm.org](https://www.npmjs.org/) 安装该插件：

`npm install ember-cli-<your-addon-name-here> --save-dev`.

对于我们的 *fullpagejs* 插件：

`npm install ember-cli-fullpagejs --save-dev`.

运行 *fullpagejs* 蓝图模板：

`ember generate fullpagejs`

#### 更新插件

可以像更新Ember应用一样，通过在工程根目录运行`ember init`命令，更新一个插件。

## 参考

https://ember-cli.com/extending/#developing-addons-and-blueprints
[组件的生命周期](https://guides.emberjs.com/v2.8.0/components/the-component-lifecycle/)
