const gulp = require('gulp');
const { series, parallel } = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();
const del = require('del');


const html = () => {
    return gulp.src('src/pug/*.pug')
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest('build'))
}

const styles = () => {
    return gulp.src('src/styles/*.scss')
        .pipe(sass().on('err', sass.logError))
        .pipe(autoprefixer())
        .pipe(cssnano())
        .pipe(rename( { suffix: '.min' } ))
        .pipe(gulp.dest('build/css'))
}


const images = () => {
    return gulp.src('src/images/*.*')
        .pipe(imagemin())
        .pipe(gulp.dest('build/images'))
}

const fonts = () => {
    gulp.src('src/styles/fonts/*.*')
        .pipe(gulp.dest('build/fonts/'))
    return gulp.src('src/styles/fonts/*.*')
        .pipe(gulp.dest('build/fonts/'))
}


const server = () => {
    browserSync.init({
        server: {
            baseDir: './build'
        },
        notyfy: false
    });
    browserSync.watch('build', browserSync.reload)
}

const deleteBuild = (cb) => {
    return del('build/**/*.*').then(() => { cb() })
}

const watch = () => {
    gulp.watch('srs/pug/**/*.pug', html);
    gulp.watch('srs/styles/**/*.scss', styles);
    gulp.watch('srs/images/**/*.*', images);
    gulp.watch('srs/styles/fonts/**.ttf', fonts);
}

exports.default = series(
    deleteBuild,
    parallel(html,fonts,styles,images),
    parallel(watch, server)
)



