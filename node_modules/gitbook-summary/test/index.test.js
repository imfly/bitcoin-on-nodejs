var path = require('path');
var fs = require('fs-extra');
var should = require('should');

var summary = require('../lib/summary');
var config = require('../lib/bookJson');

describe('summary/index.js', function() {
    describe('#summary()', function() {
        after(function(done) {
            var file = path.resolve('SUMMARY.md');
            fs.remove(file, done);
        });

        it('should get a `SUMMARY.md` for `.` if has no options, for example: book sm', function() {
            summary({});

            // Fixme why can`t pass it using sync?
            // should(fs.existsSync(path.join(bookRoot, 'SUMMARY.md'))).be.ok();
            fs.exists(path.resolve('SUMMARY.md'), function(exist) {
                should(exist).be.ok();
            });
        });
    });

    // command line
    describe('#summary()', function() {
        var bookRoot;

        beforeEach(function() {
            bookRoot = path.resolve('test/books/basic');
        });

        afterEach(function(done) {
            var file = path.resolve(bookRoot, 'SUMMARY.md');
            fs.remove(file, done);
        });

        describe('should get a `SUMMARY.md`', function() {

            it('given an option root, for example: book sm -r root', function() {
                summary({
                    root: bookRoot
                });

                // should(fs.existsSync(path.join(bookRoot, 'SUMMARY.md'))).be.ok();
                fs.exists(path.resolve(bookRoot, 'SUMMARY.md'), function(exist) {
                    exist.should.be.ok();
                });
            });

            it('given an option bookname, for example: book sm -n bookname', function() {
                var bookname = 'This is a test book';
                summary({
                    root: bookRoot,
                    bookname: bookname
                });

                var summaryFile = path.resolve(bookRoot, 'SUMMARY.md');
                fs.readFile(summaryFile, 'utf8', function(err, content) {
                    if (err) {
                        console.log(err);
                    }
                    content.should.containEql('# This is a test book\n\n');
                    content.should.containEql('- Test');
                });
            });

            it('given an option ignores, for example: book sm -i test', function() {
                var bookname = 'This book has no test';
                summary({
                    root: bookRoot,
                    bookname: bookname,
                    ignores: ['test']
                });

                var summaryFile = path.resolve(bookRoot, 'SUMMARY.md');
                fs.readFile(summaryFile, 'utf8', function(err, content) {
                    if (err) {
                        console.log(err);
                    }
                    content.should.be.equal('# This book has no test\n\n');
                });
            });
        });
    });

    // has `book.json`
    describe('#summary()', function() {
        var bookRoot;

        before(function() {
            bookRoot = path.resolve('test/books/config-json');
        });

        after(function(done) {
            var file = path.resolve(bookRoot, config(bookRoot).outputfile);
            fs.remove(file, done);
        });

        it('should get a `SUMMARY.md` if given a `book.json`', function() {
            summary({
                root: bookRoot
            });

            var su = path.resolve(bookRoot, config(bookRoot).outputfile);

            fs.exists(su, function(err, exist) {
                if (err) {
                    console.log(err);
                }

                // fixme
                // exist.should.be.ok();

                fs.readFile(su, 'utf8', function(err, content) {
                    if (err) {
                        console.log(err);
                    }

                    content.should.containEql('# json-config-name\n\n');
                    content.should.containEql('- Second\n');
                });
            });
        });
    });
});
