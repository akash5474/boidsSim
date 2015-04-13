var gulp = require('gulp'),
    bg = require('gulp-bg'),
    del = require('del'),
    source = require('vinyl-source-stream'),
    notify = require('gulp-notify'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    babelify = require('babelify');

var paths = {
  DEST: 'dist',
  // DEST_SRC: 'dist/src',
  HTML: 'src/views/index.ejs',
  HTML_DEST: 'dist/views',
  CSS: 'src/public/css/*.css',
  CSS_DEST: 'dist/public/css',
  BUNDLE: 'build.js',
  BUNDLE_DEST: 'dist/public/js',
  JS: 'src/*.js',
  JS_DEST: 'dist',
  ROUTES: ['src/routes/*.js', 'src/routes/**/*.js'],
  ROUTES_DEST: 'dist/routes',
  // APP_WATCH_POINT: './src/public/js/index.jsx',
  APP_WATCH_POINT: './src/public/js/index.js',
  SERVER_ENTRY_POINT: './dist/index.js'
};

gulp.task('clean', function(cb) {
  del([paths.DEST], cb);
});

gulp.task('copy:HTML', function() {
  gulp.src( paths.HTML )
    .pipe( gulp.dest( paths.HTML_DEST ) );

  gulp.src( './package.json' )
    .pipe( gulp.dest( paths.DEST) );
});

gulp.task('copy:CSS', function() {
  gulp.src( paths.CSS )
    .pipe( gulp.dest( paths.CSS_DEST ) );
});

gulp.task('copy:SERVER', function() {
  gulp.src( paths.JS )
    .pipe( gulp.dest( paths.JS_DEST ) );
});

gulp.task('copy:ROUTES', function() {
  gulp.src( paths.ROUTES )
    .pipe( gulp.dest( paths.ROUTES_DEST ) );
});

gulp.task('copy:JS', function() {
  gulp.start(['copy:SERVER', 'copy:ROUTES']);
});

gulp.task('server', bg('node', paths.SERVER_ENTRY_POINT));

gulp.task('watchify', function() {
  gulp.watch(paths.HTML, ['copy:HTML']);
  gulp.watch(paths.CSS, ['copy:CSS']);
  gulp.watch(paths.JS, ['copy:SERVER', 'server']);
  gulp.watch(paths.ROUTES, ['copy:ROUTES', 'server']);

  var watcher = watchify( browserify({
    entries: [paths.APP_WATCH_POINT],
    debug: true,
    cache: {}, packageCache: {}, fullPaths: true
  }))
    .transform(babelify.configure({
      experimental: true
    }));

  function rebundle() {
    return watcher.bundle()
      .on('error', notify.onError())
      .pipe( source( paths.BUNDLE ) )
      .pipe( gulp.dest( paths.BUNDLE_DEST ) )
      .on('end', function() {
        gulp.start(['server']);
      });
  }

  watcher.on('update', rebundle);

  return rebundle();
});

gulp.task('watch', ['clean'], function() {
  gulp.start(['copy:HTML', 'copy:CSS', 'copy:JS', 'watchify']);
});

gulp.task('default', ['watch']);