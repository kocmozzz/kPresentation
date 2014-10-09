var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    less = require('gulp-less'),
    sourcemaps = require('gulp-sourcemaps'),
    notify = require('gulp-notify'),
    path = require('path');

gulp.task('css', function() {
    return gulp.src(['less/style.less'])
        .pipe(sourcemaps.init())
        .pipe(less({
            compress: true
        }))
        .on('error', notify.onError({
            title: 'Fail'
        }))
        .pipe(autoprefixer("last 2 version", "ie 8", "ie 9"))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('css'));
});

gulp.task('js', function() {
    return gulp.src(['js/polyfills.js', 'js/helpers.js', 'js/kpresentation.js', 'js/kshow.js'])
        .pipe(sourcemaps.init())
        .pipe(concat('kpresentations.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('js/build'));
});

gulp.task('watch', function() {
    gulp.watch('less/*', ['css']);
    gulp.watch('js/*', ['js']);
});

gulp.task('default', ['css', 'js', 'watch']);