# 将库转化为Ember CLI插件

Ember.js的规则非常严格，使用它最大的难度就是如何把很多现有的强大的js工具包轻松的用在项目里。在本向导里，我们主要转化2种类型的库:

- Ember特定库
- Vendor库（第三方）

### Ember库

Ember库假定Ember已经加载（加载顺序更高），因此假定它可以调用Ember API。

我们假定，有一个库，可以创建一个新的Ember命名空间，叫`Ember.Validators`,并且整个库可以被分发到`dist/ember-validators.js`中【意译】。

```javascript
// dist/ember-validators.js
Ember.Validators = Ember.Namespace.create({
  // ...
});

Ember.Validators.presence = function (args) {
  // ...
}
```

然后，我们应该经由[bower](http://bower.io/docs/creating-packages/) 通过设置`bower.json`文件来暴露该库。我们应该使用`"main"`属性来指定该分发库中的主要文件，使用`"ignore"`来指定哪些文件夹或文件在安装时不被加入包里。

```javascript
//bower.json
{
  "name": "my-project",
  "version": "1.0.0",
  "main": [
    "dist/es6/ember-validator.js",
    "dist/ember-validator.js",
    ],
  "ignore": [
    ".jshintrc",
    "lib"
    // ...
  ],
  "dependencies": {
    // ...
  },
  "devDependencies": {
    // ...
  }
}
```


在一个“标准的”Ember应用中，你就可以使用下面类似的脚本简单地引用该库：

```html
<script src="bower_components/ember/dist/stable/ember.js"/>
<script src="bower_components/ember-validations/dist/ember-validators.js"/>
````

对于一个Ember CLI应用，我们应该经由*Broccoli*使用`app.import`表达式导入这些文件：

```javascript
// Broccoli.js
app.import(app.bowerDirectory + '/ember-validations/ember-validators.js')
```

作为一个Ember CLI插件，我们能够避免，全部使用这些导入表达式，以致*污染*我们主要的`Brocfile`文件，而是让插件通过`"included"`钩子方法，把它们导入到应用中去。


```javascript
// index.js (of the addon)
module.exports = {
  name: 'ember-cli-validators',

  included: function(app) {
    this._super.included(app);

    app.import(app.bowerDirectory + '/ember-validatiors/ember-validators.js');
  }
}
````

在一个托管的应用中，我们必须首先把它作为一个`bower`组件经由`bower install`安装，然后，作为一个ember-cli插件（npm包）经由`npm install`安装。

这就与上面简单的`<script src="">`例子，具有切实相同的效果，而且它就会增加Ember命名空间【译注：and it should add Ember namespace 这句不用说吧】。

就像我们看到的，这并不是真正最优的，因为这会导致重复，比如：该包将被2个不同的包管理者安装2次。相反，建议，首先把该库作为标准的bower包打包该库，接着创建一个新的`ember-cli-*`包，该包是一个瘦身的"bower包装器"，它假定上述bower包已经安装。然后，该插件就会简单地引用bower组件，安装该应用树和blueprints模板到插件。【译注：这里的app tree是addon的，还是app的？个人觉得是addon的，因为后面是安装到addon】

这是ember-cli插件与ember-cli一起打包的最常用的方式，（请参考 在bower——components文件夹里的*ember-qunit*，以及node_modules文件夹下的*ember-cli-qunit*）

这里是一个这样的例子：

```javascript
app.import('bower_components/ember-cli-shims/test-shims.js', {
  type: 'test',
  exports: {
    'qunit': ['default']
  }
});
```

作为我们的例子，应该有类似这样的内容：

```javascript
this.app.import(
  app.bowerDirectory + '/ember-easyform-cli/distributions/es6/ember-easyform-cli.js',
    {exports: {'ember-easyform': 'default'}}
);
```

或者，更简单的：

```javascript
  this.app.import(
    app.bowerDirectory + '/ember-easyform-cli/distributions/ember-easyform-cli.js'
  );
  // lets see that we got it!
  console.log('app, app.legacyFilesToAppend);
```

然后，在我们的应用中导入它，像这样：

```bash
$ ember serve
version: 0.0.46
loaded ember-easyform-cli
including ember-easyform-cli into app
app [ 'bower_components/loader/loader.js',
  'bower_components/jquery/dist/jquery.js',
  'bower_components/handlebars/handlebars.js',
  'bower_components/ember/ember.js',
  'bower_components/ember-cli-shims/app-shims.js',
  'bower_components/ember-resolver/dist/modules/ember-resolver.js',
  'bower_components/ember-load-initializers/ember-load-initializers.js',
  'vendor/ember-data/ember-data.js',
  'vendor/ic-ajax/dist/named-amd/main.js',
  'bower_components/ember-easyform-cli/distributions/ember-easyform-cli.js' ]
```

所以我们可以看到，在这个应用中，它就可以作为一个遗留文件使用【译注：什么是legacy文件？】。

### Ember对象

如果我们的插件(addon)并没有增加到命名空间，相反，暴露一个或多个Ember对象被包含到应用中的一些部分，我们就需要不同的策略。

让我们假设我们有一个库，该库定义了几个全局变量，像这个（确切地说不推荐）：

```javascript
// dist/my-ember-mixins.js
var AuthorizerMixin = Ember.Mixin.create({
  // ...
});

var TimerMixin = Ember.Mixin.create({
  // ...
});
```

我们能供使用像`Ember.Namespace`例子同样的方法，但是，我们仍然会污染应用的全局命名空间，我们怎样利用更加细粒度的控制来包装这个？

我们可以创建另一个文件，该文件像下面这样包装它，使用ES6模块。我们将把这个ES6包装器，放进`dist/es6/my-ember-mixins.js`。

```javascript
// dist/es6/my-ember-mixins.js

require('../my-ember-mixins.js');

export var Authorizer = AuthorizerMixin;
export var TimerMixin = TimerMixin;
```

如果我们仅仅想（或需要）暴露一个简单变量，我们可以使用`export default`

```
var mixins = {
  authorizer: AuthorizerMixin,
  timer: TimerMixin
}

export default mixins;
```

然后，我们就能够导入这个包装器文件，而不是把它作为一个Ember CLI应用的插件导入各类应用【译注：有点绕】

```javascript
module.exports = {
  name: 'ember-cli-validators',

  included: function(app) {
    this._super.included(app);

    app.import('dist/es6/ember-validators.js')  
  }
}
````

这会让我们在想要的地方仅仅导入想要的变量。这里，我们展示通过使用`as`的(可选的）alias功能的使用：

```javascript
// app/mixins/authorization.js

import {Authorizer as authorize} from "ember-cli-validators";

console.log('Authorizer', authorize);
```


### Vendor库

对于一个Vendor(第三方）库，你可以使用Ember对象所描述的那样同样的方法
