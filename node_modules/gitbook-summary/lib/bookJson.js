var fs = require('fs-extra');
var path = require('path');

function BookConfig(root) {

    var bookJson = path.resolve(root, 'book.json');
    var book = config = {};

    if (fs.existsSync(bookJson)) {
        config = require(bookJson);
    }

    var outputName = config.outputfile || 'SUMMARY.md';

    // default options
    book.outputfile = path.join(root, outputName);
    book.catalog = config.catalog || 'all';
    book.ignores = config.ignores || [];
    book.unchanged = config.unchanged || [];
    book.bookname = config.bookname || 'Your Book Name';
    book.sortedBy = config.sortedBy || '';
    
    return book;
}

module.exports = BookConfig;
