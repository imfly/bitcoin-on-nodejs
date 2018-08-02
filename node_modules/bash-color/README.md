bash-color
============

A node.js module for wrapping strings in color codes for pretty printing in bash. Usage is very simple. Install via NPM:

```bash
$ npm install bash-color
```

Then import it into your project:

```js
var color = require('bash-color');
console.log('Guess which word is ' + color.red('red') + ' when this is run?');
```

The 8 standard colors are explicitly supported as method names, and each takes a second argument which is a boolean (defaults to false) toggling hi-intensity.

```js
color.black('this text is black');
color.red('this text is high-intensity red', true);
color.green('this text is green');
color.yellow('this text is high-intensity yellow', true);
color.blue('this text is blue');
color.purple('this text is purple');
color.cyan('this text is cyan');
color.white('this text is white');
```

Additionally, the wrap() method allows you to pass in three arguments: your string, the color you want to use and a style value. Colors are enumerated as `color.colors`. Styles are enumerated as `color.styles`, and include bold, underline, background, high intensity text, high intensity bold text and high intensity background.

```js
color.wrap('this string will have a high-intensity blue background.', color.colors.BLUE, color.styles.hi_background);
color.wrap('this string will be red and underlined.', color.colors.RED, color.styles.underline);
```

Nesting things does NOT work. Bash codes can't nest this way - each color overwrites the previous, so you can't do one color over another. So this will fail:

```js
color.wrap(color.wrap("You might expect this text to be green on a high-intensity yellow background, but you'd be wrong.", color.colors.GREEN), color.colors.YELLOW, color.styles.hi_background);
```

Finally, all codes are exposed using the color.bash_codes property so if you wanted to wrap your own strings you could. For instance, this will work:
```js
var string = color.bash_codes.GREEN.text + "This text is green." + color.REMOVE_COLOR;
```
Just pay attention to that `color.REMOVE_COLOR` append - if you don't add that you may accidentally have all the rest of your console output colored until you do. The convenience methods all append that for you.

When to use bash-color and when not to use bash-color
===
Please understand the way bash color codes work: these methods actually prepend and append characters to your strings. These characters are only meaningful in a bash environment - they tell bash how to color the following text. If you try to add this stuff to strings that will be later rendered in an HTML page then you're going to see some weird characters show up - don't do that. 

The whole point of this is that you can quickly and easily wrap pieces of text just before logging them to the console. This is useful in things like logging tools (`console.log(color.red('[error]') + ' - ' + err)`), or if you're building some sort of CLI interface and expect the user to interact directly with various color-coded pieces of text in the console.