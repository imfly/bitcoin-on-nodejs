进行中...


# Ember的所有钩子方法汇总

## `contentFor`钩子方法

范围：这是一个插件的钩子方法。

用途：该方法可以在构建时被调用，直接在`content-for`标签的地方插入需要的内容。如果不是开发插件的话，就直接忽略他们就行了

描述：在默认生成的`app/index.html`里，有几处用到`content-for`标签，类似于`{{content-for 'head'}}`、`{{content-for 'body'}}`，它们需要等待某个插件的`contentFor`钩子方法注入内容。如：

```
// index.js
module.exports = {
  name: 'ember-cli-display-environment',

  contentFor: function(type, config) {
    if (type === 'environment') {
      return '<h1>' + config.environment + '</h1>';
    }
  }
};
```

不管`{{content-for 'environment'}}`在什么地方，这段代码将插入程序正在运行的当前环境。`contentFor`钩子方法会为每一个`index.html`下的`content-for`标签调用一次。

文档：

http://ember-cli.com/extending/#content

http://ember-cli.com/api/classes/Addon.html#method_contentFor

## 写入命令行

范围：插件方法。

用途：代替`console.log`，向命令行输出信息。

描述：每个插件都被发送给父应用的命令行输出流的实例，因此在插件的`index.js`里，输出信息到命令行，需要用到`this.ui.writeLine`，而不是`console.log`。例如：

```
// index.js
module.exports = {
  name: 'ember-cli-command-line-output',
  
  included: function(app) {
    this.ui.writeLine('Including external files!');
  }
}
```

## 其他钩子方法

```
includedCommands: function() {},
blueprintsPath: // return path as String
preBuild:
postBuild:
treeFor:
contentFor:
included:
postprocessTree:
serverMiddleware:
lintTree:
```

范围：插件，而且是在插件的`index.js`文件里。它的两个高级定制实例。