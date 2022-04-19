/* jshint strict: false */
/* globals require, console */
var gulp = require('gulp');
var exit = require('gulp-exit');

var browserify = require('browserify');
var watchify = require('watchify');

var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

const browserify_opts = {
  extensions: [ '.jsx' ],
  debug: true,
  cache: {},
  packageCache: {},
  entries: [ './src/js/index.js' ],
  paths: [ './src/js' ]
}


function compile (watch) {
  var bundler = browserify(browserify_opts).transform("babelify", {
    presets: [
      '@babel/preset-env',
      '@babel/preset-react'
    ],
    sourceMaps: true
  });

  if (watch) {
    bundler = watchify(bundler)
  }

  function rebundle() {
    return bundler
      .bundle()
      .on('error', function (err) {
          console.error(err);
          this.emit('end');
      })
      .pipe(source('./src/js/index.js'))
      .pipe(buffer())
      .pipe(rename('keymap_maker.min.js'))
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(uglify())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./dist'));
  }

  if (watch) {
    bundler.on('update', function () {
      console.log('-> bundling...');
      rebundle();
    });

    bundler.on('time', t => {
      console.log(`Rebuilt in ${t} ms`);
    });
    
    rebundle();
  } else {
    return rebundle()
  }
}


gulp.task('watch', function () {
  return compile(true);
});


gulp.task('build', function () {
  return compile();
});

gulp.task('default', gulp.series(['watch']));
