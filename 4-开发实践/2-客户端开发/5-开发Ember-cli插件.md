# 开发Ember-cli插件

## 前言

如果一个所谓的框架，虽然强大，但是会拒很多现有的工具于门外，这样的框架不会被大家广泛接受。Ember.js具备这样的扩展能力，现在官方网站有很多扩展插件（addon）可以直接拿来用。本文参考官方文档，结合`ember-cli-fullPagejs`插件的开发过程，介绍了Ember-cli插件开发的各个细节。

#### 安装

一个插件可以像其他任何npm包一样安装：

`npm install --save-dev <package name>`

安装这个(虚构的)fullPagejs插件包：

`npm install --save-dev ember-cli-fullPagejs`

#### 发现

Ember CLI将检查一个插件的存在，通过检测每个应用的依赖包，搜索这些依赖包的`package.json`文件，看在`keywords`部分是否有`ember-addon`关键字 (如下).

```javascript
  "keywords": [
    "ember-addon"
    ...
  ],
```

#### 场景

Ember CLI插件API，当前支持下面的场景:

* 通过`ember-cli-build.js`操作`EmberApp`（主应用）
* 添加预处理器到默认的注册表
* 提供一个自定义应用程序树与应用程序合并
* 提供定制的专用(服务)中间件
* 添加自定义模板，为主程序生成相关的工程文件

#### 插件命令行选项

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

#### 创建插件

创建一个基本插件:

`ember addon <addon-name>`

运行该命令，就会产生下面这些文件：

```bash
ember addon fullPagejs
version x.y.zz
installing
  create .bowerrc
  create .editorconfig
  create tests/dummy/.jshintrc
  create .travis.yml
  create Brocfile.js
  create README.md

  create tests/dummy/app/app.js
  ... more test files

  create bower.json
  create .gitignore
  create package.json  

  ...
  create vendor/.gitkeep
  create addon/.gitkeep
  create app/.gitkeep
  create index.js

Installing packages for tooling via npm
Installed browser packages via Bower.
```

#### 插件约定

插件基于“约定优于配置”，与 *Ember* 哲学一致。建议你遵循这些约定，让自己更容易、让别人更好地理解你的代码。这同样适用于设计插件模板文件。

#### 插件工程结构

插件工程遵循这些结构约定:

* `app/` - 合并到应用程序的命名空间。
* `addon/` - 插件的命名空间部分。
* `blueprints/` - 包含插件所有模板文件，每一个存放在一个独立的文件夹里。
* `tests/` - 测试文件夹，包括一个"dummy"测试应用和验收测试助手。
* `vendor/` - 第三方专有文件，比如stylesheets, fonts, 外部包等等。
* `ember-cli-build.js` - 编译设置。
* `package.json` - Node.js元数据，依赖库等。
* `index.js` - Node.js入口(遵从npm约定)。

#### Package.json

插件的`package.json`文件，像这样:

```javascript
{
  "name": "ember-cli-fullPagejs", // 插件名称
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
```

让我们添加一些元数据来更好地分类该插件:

```javascript
  "keywords": [
    "ember-addon",
    "fullPagejs",
    "fullpage.js"
  ],
```

#### 插件入口

所谓的插件入口，就是调用插件最先执行的文件，每种编程语言都需要。插件将利用npm约定，并寻找一个 `index.js` 文件作为入口点，除非通过`package.json`文件的`"main"`属性指定另一个入口点。建议使用`index.js`作为插件入口点。

产生的`index.js`文件是一个简单的js对象(POJO) ，可以定制和扩展，像这样：

```javascript
// index.js
module.exports = {
  name: 'ember-cli-full-pagejs',
  included: function(app, parentAddon) {
    var target = (parentAddon || app);
    // 这里你可以修改主应用（app） / 父插件（parentAddon）. 比如, 如果你想包括
    // 一个定制的执行器，你可以把它加到目标注册器，如：
    //     target.registry.add('js', myPreprocessor);
  }
};
```

在构建（build）过程中，included钩子方法会被执行，直接操作主应用程序或者它的父插件，提高插件的处理能力。这个对象扩展了`Addon`类，所以任何存在于`Addon`类的钩子方法都可以被重写。请参考《Ember的几个重要钩子方法简介》

#### 管理插件依赖

安装客户端依赖要通过'Bower'。这里我们安装一个虚构的bower依赖`fullPagejs`:

```
bower install --save-dev fullPagejs
```

添加bower组件到开发依赖

```javascript
// bower.js
{
  "name": "ember-fullPagejs",
  "dependencies": {
    // ...
  },
  "devDependencies": {
    "fullPagejs":  "^1.4.0"
  }
```

#### 组件

为了允许应用程序不用手动导入语句而使用插件组件,把组件放在`app/components`目录下。

```javascript
// app/components/fullPagejs.js

import Ember from 'ember';
import fullPagejs from 'ember-fullPagejs/components/fullPagejs';

export default fullPagejs;
```

代码从插件路径导入组件，再导出。这个设置允许其他代码通过扩展该组件修改它，同时使组件在应用程序命名空间中可用。

插件的实际代码放在`addon/components/fullPagejs.js`

```javascript
import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'button',

  setupfullPagejs: function() {
    // ...
  }.on('didInsertElement'),

  teardownfullPagejs: function() {
    this.get('fullPagejs').destroy();
  }.on('willDestroyElement'),
});
```

#### 蓝图模板
为创建蓝图模板, 添加一个文件 `blueprints/fullPagejs/index.js`. 这遵循的是标准的Ember蓝图模板的命名约定。

确保依赖文件导入到应用程序，使用`included`钩子以正确的顺序导入这些文件。

```javascript
module.exports = {
  name: 'ember-cli-fullPagejs',

  included: function(app) {
    this._super.included(app);

    app.import('bower_components/unbutton/dist/unbutton.js');
    app.import('bower_components/fullPagejs/dist/js/fullPagejs.js');
    app.import('bower_components/fullPagejs/dist/css/fullPagejs.css');
  }
};
```

在这个例子文件里, 使用了`included` 钩子。这个钩子被`EmberApp`构造函数调用，并且让该应用把它作为`app`（与`app`文件夹下的文件一样）调用。
当主应用的`Brocfile.js`被Ember CLI调用去build/serve的时候，插件的`included`函数被调用，通过该应用的`EmberApp`实例（将插件的依赖文件添加到主程序）。

#### 高级定制
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

#### 测试插件
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

#### 验收测试
下面是一个简单的*QUnit*验收测试的例子，放在`tests/unit/components`文件夹之下。

```javascript
// tests/unit/components/button-test.js

import { test, moduleForComponent } from 'ember-qunit';
import startApp from '../../helpers/start-app';
import Ember from 'ember';

var App;

moduleForComponent('fullPagejs', 'fullPagejsComponent', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('is a button tag', function() {
  equal('BUTTON', this.$().prop('tagName'));

  this.subject().teardownfullPagejs();
});

// more tests follow...
```

对于如何运行和设置测试，看 [[Ember CLI Testing]] 部分。

#### 创建蓝图模板
蓝图模板是一些具有可选安装逻辑的模板文件。它用于根据一些参数和选项脚手架(生成)特定应用程序文件。
更多细节请看[[generators-and-blueprints]])。一个插件可以有一个或多个蓝图模板。

给你的插件创建一个*blueprint*:

`ember addon <blueprint-name> --blueprint`

按照惯例，插件的主要蓝图模板应该具有与插件相同的名称:

`ember addon <addon-name> --blueprint`

在我们的例子中:

`ember addon fullPagejs --blueprint`

这将为插件产生一个文件夹 `blueprints/fullPagejs`，在这里你可以定义蓝图模板的逻辑和模板文件。您可以为一个插件定义多个蓝图模板。
最后加载的蓝图模板会覆盖现有(同名)蓝图的模板，该模板可以是来自Ember或其他插件(根据包加载顺序)

#### 蓝图模板约定
蓝图模板应该放在在插件根目录的`blueprints`文件夹下， 就像覆盖工程根目录的蓝图模板一样。如果把它们放在插件的其他目录下，需要通过设置插件的`blueprintsPath`属性告诉ember-cli去哪找到它
(请看下面的 *高级定制* 部分)，如果你熟悉 *Yeoman* (或Rails)的产生器，蓝图模板遵从类似的约定和结构。要想更深入的了解蓝图模板设计，请看 [Ember CLI blueprints](https://github.com/stefanpenner/ember-cli/tree/master/blueprints)。

#### 模板文件结构

```bash
blueprints/
  fullPagejs/
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

`ember g fullPagejs my-button``

由此在你的应用程序中产生一个文件夹`app/components/my-button`。

#### 开发时链接到插件
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

#### 安装和使用插件
为了从您托管的应用中使用插件，从 [npm.org](https://www.npmjs.org/) 安装该插件：

`npm install ember-cli-<your-addon-name-here> --save-dev`.

对于我们的 *fullPagejs* 插件：

`npm install ember-cli-fullPagejs --save-dev`.

运行 *fullPagejs* 蓝图模板：

`ember generate fullPagejs`

#### 更新插件

可以像更新Ember应用一样，通过在工程根目录运行`ember init`命令，更新一个插件。

#### 译注

1. the consuming application：是基于ember-cli等核心API开发的应用，英文通常就是这么称呼，也就是我们口头所说的应用程序，而非插件应用;
2. the hosting application: 托管中的应用，应该是另一种称谓而已，这里应该没有太大区别;
3. blueprint: 这里翻译成 `蓝图模板`，区别于它之下的具体的模板文件，这在rails中，其实就是一个generator

## 参考

https://ember-cli.com/extending/#developing-addons-and-blueprints
