var gulp = require('gulp'),
    jscs = require('gulp-jscs'),
    lint = require('gulp-jshint');

var lintConfig = require('./jshint'),
    jscsConfig = require('./jscs');

var source = [
  './src/**/*.js',
  './gulp/**/*.js',
  './tests/**/*.js',
  './gulpfile.js'
];

gulp.task('cs', function () {
  var stream = gulp.src(source)
    .pipe(lint(lintConfig))
    .pipe(lint.reporter('default'))
    .pipe(lint.reporter('fail'))
    .pipe(jscs(jscsConfig));

  return stream;
});