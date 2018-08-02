#! /usr/bin/env node

var _ = require("lodash");
var program = require("commander");
var color = require('bash-color');

var pkg = require("../package.json");
var summary = require("../lib/summary");
var convert = require("../lib/convert");
var html2md = require("../lib/html2md");

function list(val) {
  return val.split(',');
}

program
  .version(pkg.version)

program
  .command("summary")
  .alias("sm")
  .description("Generate a `SUMMARY.md` from a folder")
  .option("-r, --root [string]", "root folder, default is `.`")
  .option("-n, --bookname [string]", "book name, default is `Your Book Name`.")
  .option("-c, --catalog [list]", "catalog folders included book files, default is `all`.")
  .option("-i, --ignores [list]", "ignore folders that be excluded, default is `[]`.", list)
  .option("-u, --unchanged [list]", "unchanged catalog like `request.js`, default is `[]`.")
  .option("-o, --outputfile [string]", "output file, defaut is `./SUMMARY.md`")
  .option("-s, --sortedBy [string]", "sorted by sortedBy, for example: `num-`, defaut is sorted by characters")
  .action(function(options) {
    // generate `SUMMARY.md`
    // Fixme 
    // if (options.length >= 1) {
    //   console.log(color.red('\nError! The sub commands "%s" has been deprecated, please read the follow messages:'), cmd);
    //   program.help();
    // } else {
      summary(options);
    // }
  });

program
  .command("html2md")
  .alias("md")
  .description("Get markdown from a remote url or a local html.")
  .option("-f, --file [file]", "path to file")
  .option("-l, --url [url]", "artical`s url")
  .option("-t, --target [target]", "target to be saved")
  .option("-s, --selector [selector]", "DOM element selector")
  .action(function(options) {
    html2md(options);
  });

// todo
program
  .command("convert")
  .alias("cv")
  .description("Todo: Convert articals between Simplified and Traditional Chinese.")
  .option("-f, --file [file]", "path to file")
  .option("-l, --language [language]", "artical`s language")
  .option("-t, --target [target]", "target to be saved")
  .action(function(options) {
    convert(options);
  });

// Parse and fallback to help if no args
if (_.isEmpty(program.parse(process.argv).args) && process.argv.length === 2) {
  program.help();
}
