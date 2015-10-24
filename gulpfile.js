var gulp  = require('gulp')
  , babel = require('gulp-babel');

gulp.task('build', function () {
  return gulp.src('./src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('./bin'));
});

gulp.task('build-test', function () {
  return gulp.src('./test/src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('./test/bin'));
});

gulp.task('default', function () {
  gulp.watch(['index.js'], ['build']);
});
