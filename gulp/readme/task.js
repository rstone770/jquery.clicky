var gulp = require('gulp'),
    template = require('gulp-template'),
    rename = require('gulp-rename');

var pkg = require('../../package');

gulp.task('readme', function () {
  var stream = gulp.src(__dirname + '/README.md.tmpl')
    .pipe(template(pkg))
    .pipe(rename('README.md'))
    .pipe(gulp.dest('./'));

  return stream;
});