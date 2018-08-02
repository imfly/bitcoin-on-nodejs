# collapse-whitespace

`collapse-whitespace` is a module for removing unnecessary whitespace from a DOM node.

## Installation

Use [`npm`](https://www.npmjs.org/):

```
$ npm install collapse-whitespace
```

Then, if you’re using [`browserify`](https://github.com/substack/node-browserify) or something similar:

```js
var collapse = require('collapse-whitespace')
```

Otherwise, just include the minified file, `whitespace.min.js`, somewhere on your page, and this module will make itself available as `collapse`:

```html
<script src="./node_modules/collapse-whitespace/whitespace.min.js"></script>
```

## Usage

```js
var collapse = require('collapse-whitespace')
var div = document.createElement('div')

div.innerHTML = '   <p>Foo   bar</p>  <p>Words</p> '
collapse(div)

console.log(div.innerHTML)
// '<p>Foo bar</p><p>Words</p>'
```

For more examples of what `collapse-whitespace` does, check out the [test page](https://github.com/lucthev/collapse-whitespace/blob/master/test.html).

## API

`collapse-whitespace` exposes a single function (called `collapse` if you're including this module via a `script` tag).

### collapse(node [, isBlock])

Removes all extraneous whitespace from the given node. By default, `collapse-whitespace` relies on a theoretical [list][blocks] of block elements to determine which elements are block and which ones are inline. This list may be unsuitable for your needs; the optional parameter `isBlock` can be used to tweak this behaviour. `isBlock` should be a function that accepts a DOM node and returns a Boolean.

Note that `collapse-whitespace` also does not take into account the parent(s) of the given node:

```html
<pre>
  <span class="test">
    Lots of whitespace around this text.
  </span>
</pre>

<script>
  collapse(document.querySelector('.test'))
</script>

<!-- Results in: -->
<pre>
  <span class="test">Lots of whitespace around this text.</span>
</pre>
```

## License

MIT

[regexp]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/RegExp
[blocks]: https://github.com/webmodules/block-elements
