
var cheerio = require('cheerio');
var superagent = require('superagent');

superagent
  .get('https://developer.mozilla.org/en-US/docs/Web/HTML/Block-level_elements')
  .end(function (err, res) {
    var $ = cheerio.load(res.text);
    var codes = $('#wikiArticle .threecolumns dt a code');
    var names = [].slice.call(codes).map(function (code) {
      var s = $(code).text();
      return s.substring(1, s.length - 1);
    });

    console.log('/**');
    console.log(' * This file automatically generated from `build.js`.');
    console.log(' * Do not manually edit.');
    console.log(' */');
    console.log();
    console.log('module.exports = %s;', JSON.stringify(names, null, 2));
  });
