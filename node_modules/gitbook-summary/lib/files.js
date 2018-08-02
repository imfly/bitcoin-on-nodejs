var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var async = require('async');
var color = require('bash-color');

// Use a loop to read all files
function ReadFile(filePath, filesJson, sortedBy) {
  var files;

  try {
    // Synchronous readdir
    files = fs.readdirSync(filePath)
      // sort the files: directories first, afterwards files
      .map(function(v) {
        var stat = fs.statSync(path.resolve(filePath, v));
        return {
          name: v,
          isDirectory: stat.isDirectory()
        };
      })
      .sort(function(a, b) {
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        // Sorted if given a sorted hyphen, for example: `-` or `_`
        if (sortedBy) {
            var pattern = "(^[\\da-zA-Z]*)" + sortedBy;
            var reg = RegExp(pattern);
            if(a.name.match(reg) && b.name.match(reg)){
              var aNum = a.name.match(reg)[1];
              var bNum = b.name.match(reg)[1];
              return aNum - bNum;
            }
        }
        return a.name.localeCompare(b.name);
      })
      .map(function(v) {
        return v.name;
      });

    files.forEach(walk);
  } catch (error) {
    filesJson = null; //fixme
    console.log(color.red(error.message));
  }

  function walk(file) {
    var newpath = path.posix.join(filePath, file);
    var state = fs.statSync(newpath);

    if (state.isDirectory()) {
      filesJson[file] = {};
      ReadFile(newpath, filesJson[file], sortedBy);
      // filter empty directories
      if (Object.keys(filesJson[file]).length < 1) {
        delete filesJson[file];
      }
    } else {
      // Parse the file.
      var obj = path.parse(newpath);

      if (obj.ext === '.md') {
        filesJson[obj.name] = newpath + ")\n";
      }
    }
  }
}

module.exports = ReadFile;
