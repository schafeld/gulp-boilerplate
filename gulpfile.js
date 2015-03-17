// Basiert auf: http://mo.phlow.de/gulp/
// Bilder optimieren:
// gulp images


// gulp.js einbauen
var gulp = require('gulp');

// Plugins einbauen
var changed = require('gulp-changed'),
    jshint = require ('gulp-jshint'),
    concat = require ('gulp-concat'),
    uglify = require ('gulp-uglify'),
    rename = require('gulp-rename'),
    imagemin = require ('gulp-imagemin'),
    clean = require('gulp-clean'),
    minifyhtml = require ('gulp-minify-html'),
    autoprefixer = require ('gulp-autoprefixer'),
    minifyCSS = require ('gulp-minify-css');


// Komprimiere Bilder
gulp.task('images', function() {
  var imgSrc = './src/images/**/*',
      imgDst = './build/images';

  gulp.src(imgSrc)
    .pipe(changed(imgDst))
    .pipe(imagemin())
    .pipe(gulp.dest(imgDst));
});