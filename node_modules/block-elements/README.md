# block-elements

### Array of "block level elements" defined by the HTML specification

Exports an Array of "block level element" node names as defined by the HTML spec.

The list is programatically generated from [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Block-level_elements).

## Usage

As an Array:

```
var blocks = require('block-elements')
blocks.indexOf('div') > -1 // true
```

As an Object:

```
var hash = require('block-elements/hash')
hash['div'] && hash['DIV'] // true
```

As a Set:

```
var set = require('block-elements/set')
set.has('div') && set.has('DIV') // true
```
