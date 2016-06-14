var gulp = require('gulp');
var del = require('del');
var ghPages = require('gulp-gh-pages');
var summary = require('gitbook-summary/lib/summary').summary;

gulp.task('summary', function() {
    // If you have no book.json, please add other options.
    var options = {
        root: "."
    };

    return summary(options);
});

gulp.task('clean', function() {
    // You can use multiple globbing patterns as you would with `gulp.src`
    return del([settings.destFolder + '']);
});

//Deploy
gulp.task('deploy', function() {
    return gulp.src('./_book/**/*')
        .pipe(ghPages());
});