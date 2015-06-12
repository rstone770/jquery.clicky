var fs = require('fs'),
    gulp = require('gulp'),
    browserify = require('browserify'),
    buffer = require('vinyl-buffer'),
    template = require('gulp-template'),
    rename = require('gulp-rename'),
    source = require('vinyl-source-stream'),
    uglify = require('gulp-uglify'),
    wrap = require('gulp-wrapper');

var pkg = require('../../package'),
    header = fs.readFileSync(__dirname + '/header.tmpl').toString();

gulp.task('build', [
  'cs'
], function () {
  var stream = browserify('./src/jquery.clicky.js')
    .bundle()
    .pipe(source('jquery.clicky.js'))
    .pipe(buffer())
    .pipe(wrap({
      header: header
    }))
    .pipe(template(pkg))
    .pipe(gulp.dest('./bin'))
    .pipe(uglify({
      preserveComments: function (node, comment) {
        return /^\*\!/.test(comment.value);
      }
    }))
    .pipe(rename('jquery.clicky-min.js'))
    .pipe(gulp.dest('./bin'));

  return stream;
});