var color = require('bash-color');
var fs = require('fs');

var spawn = require('child_process').spawn;

var translate = require('./translate');

// Todo: Add more configures like `s2t.json`, and so on.
 function Convert(options) {
    // console.log(process.argv[1], process.argv[2], process.argv[3]);
    var bookRoot = options.bookroot || '.';
    translate(options);
    // convert.handleFile(bookRoot, 'zht2zhs.ini');
    // console.log(color.green('Finished.'));
    // if (process.argv[3] === "t2s") {
    // convert.handleFile(process.argv[2], 'zhs2zht.ini');
    // }
};

// Asynchronous process to handle files
function handleFile(rootPath, configure) {
    try {
        fs.readdir(rootPath, function(err, files) {
            if (err) {
                console.log('read dir error');
            } else {
                files.forEach(function(item) {
                    var tmpPath = rootPath + '/' + item;
                    fs.stat(tmpPath, function(err1, state) {
                        if (err1) {
                            console.log('stat error');
                        } else {
                            if (state.isDirectory()) {
                                handleFile(tmpPath, configure);
                            } else {
                                // http://nodejs.cn/api/child_process.html#child_process_child_process_execfile_file_args_options_callback
                                spawn('opencc', ['-i', tmpPath, '-o', tmpPath, '-c', configure], {
                                        // detached: true,
                                        stdio: ['ignore', console.log('Converted successfully.'), console.log('Sorry, some errors happened!')]
                                    })
                                    .unref();
                            }
                        }
                    });
                });
            }
        });
    } catch (err) {
        console.log(err);
    }
};

module.exports = Convert;
