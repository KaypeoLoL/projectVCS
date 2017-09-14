// npm
const child = require('child_process');
const browserSync = require('browser-sync').create();

const gulp = require('gulp');
const concat = require('gulp-concat');
const gutil = require('gulp-util');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');

const siteRoot = '_site';
const cssFiles = '_css/**/*.?(s)css';

// kompresija fotografija
gulp.task('compress-images', () => {
  return gulp.src('pre-images/*')
  .pipe(imagemin({
    progressive: true
  }))
  .pipe(gulp.dest('assets/img'));
});

// Spaja svaki SASS i pretvara u jedan css

gulp.task('css', () => {
  gulp.src(cssFiles)
    .pipe(sass())
    .pipe(sourcemaps.init())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(concat('all.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('assets/css'));
});

gulp.task('jekyll', () => {
  const jekyll = child.spawn('jekyll.bat', ['build',
    '--watch',
    '--incremental',
    '--drafts'
  ]);

  const jekyllLogger = (buffer) => {
    buffer.toString()
      .split(/\n/)
      .forEach((message) => gutil.log('Jekyll: ' + message));
  };

  jekyll.stdout.on('data', jekyllLogger);
  jekyll.stderr.on('data', jekyllLogger);
});

gulp.task('serve', () => {
  browserSync.init({
    files: [siteRoot + '/**'],
    port: 4000,
    server: {
      baseDir: siteRoot
    }
  });

  gulp.watch(cssFiles, ['css']);
});

gulp.task('default', ['css', 'jekyll', 'serve']);
