var gulp  = require('gulp')
  , babel = require('gulp-babel');

gulp.task('build', function () {
  return gulp.src('./src/index.js')
    .pipe(babel())
    .pipe(gulp.dest('./bin'));
});

gulp.task('default', function () {
  gulp.watch(['index.js'], ['build']);
});
