/* jshint strict: false */
/* globals require, console */
var path = require('path');
var { src, dest, task, series, parallel, watch } = require('gulp');
var exit = require('gulp-exit');

var browserify = require('browserify');
var watchify = require('watchify');

var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

var less = require('gulp-less');

const browserify_opts = {
  extensions: [ '.jsx' ],
  debug: true,
  cache: {},
  packageCache: {},
  entries: [ './src/js/index.js' ],
  paths: [ './src/js' ]
}


function compile (watch) {
  var bundler = browserify(browserify_opts)
    .transform('babelify', {
    presets: [
      '@babel/preset-env',
      '@babel/preset-react'
    ],
    sourceMaps: true
  });

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
    // .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(dest('./dist'));
}

function styles () {
  return src('./src/css/main.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'css', 'includes') ]
    }))
    .pipe(buffer())
    .pipe(rename('main.css'))
    .pipe(dest('./dist'));
}

function watchStyles () {
  return watch(['./src/css/**/*.less'], styles);
}

function watchJS () {
  return watch(['./src/js/**/*.js', './src/js/**/*.jsx'], compile)
}

exports.compile = compile;
exports.styles = styles;
exports.watch = parallel(watchJS, watchStyles);
exports.build = parallel(compile, styles);
exports.default = series(exports.build, exports.watch);
