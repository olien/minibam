////////////////////////////////////////////////////////////////////
//
// VARS
//
var gulp = require('gulp'),
    asciify = require('asciify'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    cssmin = require('gulp-cssnano'),
    prefix = require('gulp-autoprefixer'),
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify'),
    sourcemaps = require('gulp-sourcemaps'),
    clean = require('gulp-clean'),
    colors = require('ansi-colors'),
    browserSync = require('browser-sync'),
    copy = require('cpy');
//
////////////////////////////////////////////////////////////////////
/* -------------------------------------------------------------- */
////////////////////////////////////////////////////////////////////
//
// INIT
//
gulp.task('dev_init', function (cb) {
    asciify('DEVELOPMENT', {
        font: 'big',
        color: 'green'
    }, (err, res) => {
        console.log(res);
        cb();
    });
});

gulp.task('prod_init', function (cb) {
    asciify('PRODUCTIVE', {
        font: 'big',
        color: 'red'
    }, (err, res) => {
        console.log(res);
        cb();
    });
});
//
////////////////////////////////////////////////////////////////////
/* -------------------------------------------------------------- */
////////////////////////////////////////////////////////////////////
//
// ERROR
//
var onError = function (err) {
    notify.onError({
        title: 'Ey',
        message: 'Du hast Mist gebaut!',
        sound: 'Basso',
        icon: 'coffee.jpg'
    })(err);
    console.log("\n\n" + err.name + '\n\n' + err.message);

};
//
////////////////////////////////////////////////////////////////////
/* -------------------------------------------------------------- */
////////////////////////////////////////////////////////////////////
//
//  Copy
//
gulp.task('copy:jquery', (cb) => {
    let src = ['./node_modules/jquery/dist/jquery.min.js'];
    let dest = './theme/public/assets/javascript/';
    copy(src, dest, {}).then((res) => {
        if (res.length > 0) {
            console.log("jquery.min.js wird kopiert");
        }
        cb();
    });
});
//
////////////////////////////////////////////////////////////////////
/* -------------------------------------------------------------- */
////////////////////////////////////////////////////////////////////
//
// SCSS -> CSS
//
var sassOptions = {
    outputStyle: 'expanded'
};
var prefixerOptions = {
    browsers: ['last 3 versions']
};

gulp.task('styles', function () {
    return gulp.src('./theme/private/scss/*.scss')
        .pipe(plumber({errorHandler: onError}))
        .pipe(sass(sassOptions))
        .pipe(prefix(prefixerOptions))
        .pipe(gulp.dest('./theme/public/assets/css/'))
        .pipe(cssmin())
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('./maps', {addComment: false}))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./theme/public/assets/css/'))
});
//
////////////////////////////////////////////////////////////////////
/* -------------------------------------------------------------- */
////////////////////////////////////////////////////////////////////
//
// CLEAN
//
gulp.task('clean', function () {
    return gulp.src('./theme/public/assets/css/styles.css')
        .pipe(clean({force: true}))
        .pipe(clean());
});
//
////////////////////////////////////////////////////////////////////
/* -------------------------------------------------------------- */
////////////////////////////////////////////////////////////////////
//
// WATCH / BROWSERSYNC
//
var browserSyncOptions = {
    watch: true,
    server: './theme/public/',
    directory: false,
    open: true,
    reloadOnRestart: true,
    notify: false,
    reloadDelay: 0
};

gulp.task('watch', function (done) {
    gulp.watch('./theme/private/scss/*.scss', gulp.series('styles'));
    browserSync.init(browserSyncOptions);
    done();
});
//
////////////////////////////////////////////////////////////////////
/* -------------------------------------------------------------- */
////////////////////////////////////////////////////////////////////
//
// TASKS
//
gulp.task('default', gulp.series('dev_init', 'copy:jquery', 'styles', 'watch'));
gulp.task('prod',    gulp.series('prod_init', 'styles', 'clean'));