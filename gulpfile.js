// Examples for installing required plugins:
// npm install gulp-ruby-sass gulp-autoprefixer gulp-minify-css gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-livereload gulp-cache del --save-dev
// sudo npm install gulp-livereload --save-dev
// npm i -D gulp-connect  is same as   npm install --save-dev gulp-connect

// require gulp.js
var gulp = require('gulp');

// require plugins
var changed = require('gulp-changed'),
    jshint = require ('gulp-jshint'),
    concat = require ('gulp-concat'),
    uglify = require ('gulp-uglify'),
    rename = require('gulp-rename'),
    imagemin = require ('gulp-imagemin'),
    clean = require('gulp-clean'),
    minifyhtml = require ('gulp-minify-html'),
    autoprefixer = require ('gulp-autoprefixer'),
    minifyCSS = require ('gulp-minify-css'),
    sass = require('gulp-sass'),
    less = require('gulp-less'),
    ts = require('gulp-typescript'),
    plumber = require('gulp-plumber'),
    livereload = require('gulp-livereload'),
    connect = require('gulp-connect'),
    notify  = require('gulp-notify');

// set directory paths
// not yet properly corresponding with the js paths...
var tsPath = './src/ts/*.ts',
    compilePath = './src/js/compiled',
    dist = 'js/dist';

// Use plumber for error output to console:
var onError = function(err) {
    console.log(err);
};

// Compress TypeScript scripts
gulp.task('compressScripts', function() {
    gulp.src([
        compilePath + '/typescript/*.js'
        ])
    .pipe(plumber())
    .pipe(concat('scripts.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(dist));
});

// Compile TypeScript
gulp.task('typescript', function() {
    var tsResult = gulp.src(tsPath)
    .pipe(ts({
        target: 'ES5',
        declarationFiles: false,
        noExternalResolve: true
    }));
    // .pipe(notify({ message: 'TypeScript compiled to JavaScript.' }));
    tsResult.dts.pipe(gulp.dest(compilePath + '/tsdefinitions'));
    return tsResult.js.pipe(gulp.dest(compilePath + '/typescript'));
});

// Compress images
gulp.task('images', function() {
  var imgSrc = './src/images/**/*',
      imgDst = './build/images';

  gulp.src(imgSrc)
    .pipe(plumber({
        errorHandler: onError
    }))
    .pipe(changed(imgDst))
    .pipe(imagemin())
    .pipe(gulp.dest(imgDst));
});

// Lint Task
gulp.task('lint', function() {
    return gulp.src('./src/js/*.js')
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compile Sass
// Usually Less OR Sass would be used.
gulp.task('sass', function() {
  var sassSrc = 'src/scss/*.scss',
      sassDst = 'src/css/';
    return gulp.src(sassSrc)
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(sass())
        .pipe(gulp.dest(sassDst));
});

// Compile Less
// Usually Less OR Sass would be used.
gulp.task('less', function() {
  gulp.src('./src/less/main.less')
    .pipe(less())
    .pipe(gulp.dest('./build/css'))
    .pipe(connect.reload());
});

// Minify CSS
gulp.task('style', function() {
    return gulp.src('src/css/**/*.css')
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(minifyCSS())
        .pipe(gulp.dest('./build/css'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('./src/js/*.js')
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

// Node Web Server for proper Live Reload capability
// This web server mounts the file structure of the folder, where the gulpfile.js lives in,
// to the root of localhost:8080.
// The server will run until you stop the task by pressing Ctrl + c on your keyboard.
// http://localhost:8080/build/
gulp.task('webserver', function() {
    connect.server({
        livereload: true
    });
});

// Watch Files For Changes
gulp.task('watch', function() {

    gulp.watch('./src/js/*.js', ['lint', 'scripts']);
    // Just for the exercise I use both Less and Sass.
    gulp.watch('./src/scss/*.scss', ['sass']);
    gulp.watch('./src/less/*.less', ['less']);

    gulp.watch('./src/css/*.css', ['style']),
    gulp.watch([tsPath], ['typescript']);

    // Create LiveReload listener
    livereload.listen();
    // Watch any files in build/, reload on change
    // Notice: You need the LiveReload browser extension running and
    // you have to call the HTML file inside the watched directory through
    // a local server, i.e.
    // cd build/ && python -m SimpleHTTPServer
    // open http://localhost:8000/index.html
    gulp.watch(['build/**']).on('change', livereload.changed);

});

// Default Task
gulp.task('default', ['typescript', 'lint', 'less', 'sass', 'scripts', 'watch']);
// Live Reload task: gulp lr
gulp.task('lr', ['webserver', 'typescript', 'lint', 'less', 'sass', 'scripts', 'watch']);