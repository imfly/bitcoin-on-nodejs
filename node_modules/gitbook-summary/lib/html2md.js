var fs = require('fs');
var path = require('path');
var url = require('url');
var toMarkdown = require('to-markdown');
var request = require('request');
var iconv = require('iconv-lite');
var color = require('bash-color');
var $ = require('cheerio');

var private = {};

// Constructor
function Html2md(options) {
  if (options.file) {
    private.outputFileOptions(options);
    private.convertFromFile(options);
  } else if (options.url) {
    private.outputRemoteOptions(options);
    private.convertFromRemote(options);
  } else {
    console.log(color.red('Sorry, Please provide a file or Url.'));
    return;
  }
}

private = {
  outputFileOptions: function(options) {
    var outputfile = path.parse(options.file);

    options['target'] = path.join(outputfile.dir, outputfile.name + ".md");
  },

  outputRemoteOptions: function(options) {
    var remoteUrl = options.url;

    if (options.target) {
      var outputfile = path.parse(options.target);
      options['targetHtml'] = path.join(outputfile.dir, outputfile.name + ".html");
    } else {
      var outputfileName = url.parse(remoteUrl).pathname.split('/').pop();
      // console.log(outputfileName);
      options['target'] = path.join(outputfileName + ".md");
      options['targetHtml'] = path.join(outputfileName + ".html");
    }
  },

  convertFromFile: function(options) {
    fs.readFile(options.file, 'UTF-8', function(err, html) {
      if (err) {
        throw err;
      }
      private.toMarkdown(options, html);
    });
  },

  convertFromRemote: function(options) {
    var url = options.url,
      target = options.target;
    var html = [],
      size = 0,
      statusCode;

    request
      .get(url)
      .on('error', function(err) {
        console.log(err);
      })
      .on('response', function(response) {
        statusCode = response.statusCode;
        response.on('data', function(data) {
          // compressed data as it is received
          console.log('received ' + data.length + ' bytes of compressed data');
          html.push(data);
          size += data.length;
        });
      })
      .on('end', function() {
        if (statusCode === 200) {
          // console.log('document saved as: http://mikeal.iriscouch.com/testjs/'+ rand);
          console.log(color.green("The html has been received!"));

          var data = Buffer.concat(html, size);
          var str = iconv.decode(data, 'utf8');

          private.toMarkdown(options, str);
        } else {
          console.log('error: ' + statusCode);
        }
      })
      .pipe(fs.createWriteStream(options.targetHtml));
  },

  toMarkdown: function(options, html) {
    console.log(color.green("Converting..."));
    var htmlSelected, md;

    if (options.selector) {
      htmlSelected = $(options.selector, html.toString()).html();
    }else{
      htmlSelected = html;
    }

    try {
      md = toMarkdown(htmlSelected.toString());
      fs.writeFile(options.target, md, function(err) {
        if (err) {
          throw err;
        }
        console.log(color.green('Converted successfully!'));
      });
    } catch (e) {
      console.log(color.red('Sorry, something is wrong!'));
      console.log(color.red('Please, confirm your path or selector is right.'));
    }
  }
};

module.exports = Html2md;
