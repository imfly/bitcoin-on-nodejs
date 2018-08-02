var fs = require('fs');
var color = require('bash-color');

var dictionary = require('./dictionary');

var private = {};

function Translate(options) {
  console.log(color.green('Convert is starting...'));
  fs.readFile(options.file, function(err, html) {
    if (err) {
      throw err;
    }
    var tr = private.translateText(html.toString(), options.language);
    fs.writeFile(options.target, tr, function(err) {
      if (err) {
        throw err;
      }
      console.log(color.green('Converted successfully!'));
    });
  });
}

// private methods
private = {
  translateString: function(text, table) {
    for (var i = 0; i < table.from.length; ++i)
      text = text.replace(new RegExp(table.from[i], 'g'), table.to[i]);
    for (var i = 0; i < table.froms.length; ++i)
      text = text.replace(new RegExp(table.froms[i], 'g'), table.tos[i]);
    return text;
  },

  translateText: function(text, lang) {
    switch (lang) {
      case 'zh-hant':
        return this.translateString(text, dictionary.Hant);
      case 'zh-hk':
        return this.translateString(this.translateString(text, dictionary.HK), dictionary.Hant);
      case 'zh-tw':
        return this.translateString(this.translateString(text, dictionary.TW), dictionary.Hant);
      case 'zh-sg':
        return this.translateString(this.translateString(text, dictionary.SG), dictionary.Hant);
      default:
        return text;
    }
  }
}

module.exports = Translate;
