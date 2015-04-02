// Basiert auf: http://mo.phlow.de/gulp/
// Bilder optimieren:
// gulp images


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
    ts = require('gulp-typescript'),
    plumber = require('gulp-plumber');

// set directory paths
// not yet properly corresponding with the js paths...
var tsPath = './src/ts/*.ts',
    compilePath = './src/js/compiled',
    dist = 'js/dist';

// Compress TypeScript scripts
gulp.task('compressScripts', function() {
    gulp.src([
        compilePath + '/typescript/*.js'
        ])
    .pipe(plumber())
    .pipe(concat('scripts.min.js'))
    .pipe(uglify())
    pipe(gulp.dest(dist));
});

// Compile TypeScript
gulp.task('typescript', function() {
    var tsResult = gulp.src(tsPath)
    .pipe(ts({
        target: 'ES5',
        declarationFiles: false,
        noExternalResolve: true
    }));
    tsResult.dts.pipe(gulp.dest(compilePath + '/tsdefinitions'));
    return tsResult.js.pipe(gulp.dest(compilePath + '/typescript'));
});

// Compress images
gulp.task('images', function() {
  var imgSrc = './src/images/**/*',
      imgDst = './build/images';

  gulp.src(imgSrc)
    .pipe(changed(imgDst))
    .pipe(imagemin())
    .pipe(gulp.dest(imgDst));
});

// Lint Task
gulp.task('lint', function() {
    return gulp.src('./src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src('scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('css'));
});

// Minify CSS
gulp.task('style', function() {
    return gulp.src('src/css/**/*.css')
        .pipe(minifyCSS())
        .pipe(gulp.dest('./build/css'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('./src/js/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('./src/js/*.js', ['lint', 'scripts']);
    gulp.watch('scss/*.scss', ['sass']);
    gulp.watch('./src/css/*.css', ['style']),
    gulp.watch([tsPath], ['typescript']);
});

// Default Task
gulp.task('default', ['typescript', 'lint', 'sass', 'scripts', 'watch']);