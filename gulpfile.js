////////////////////////////////////////////////////////////////////
//
// VARS
//
var gulp        = require('gulp'),
    asciify     = require('asciify'),
    browserSync = require('browser-sync'),
    clean       = require('gulp-clean'),
    colors      = require('ansi-colors'),
    concat      = require('gulp-concat'),
    copy        = require('cpy'),
    cssmin      = require('gulp-cssnano'),
    sass        = require('gulp-sass'),
    notify      = require('gulp-notify'),
    plumber     = require('gulp-plumber'),
    prefix      = require('gulp-autoprefixer'),
    rename      = require('gulp-rename'),
    uglify      = require('gulp-uglify');

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
//  COPY
//
gulp.task('copy:jquery', function () {
    return gulp
        .src('./node_modules/jquery/dist/jquery.min.js')
       .pipe(gulp.dest('./theme/public/assets/js/'));
});
gulp.task('copy:elementqueries', function () {
    return gulp
        .src(['./node_modules/css-element-queries/src/ResizeSensor.js','./node_modules/css-element-queries/src/ElementQueries.js'])
        .pipe(gulp.dest('./theme/public/assets/js/'));
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
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./theme/public/assets/css/'))
});
////////////////////////////////////////////////////////////////////
/* -------------------------------------------------------------- */
////////////////////////////////////////////////////////////////////
//
// JAVASCRIPT
//
gulp.task('javascript', function() {
    return gulp.src('./theme/private/js/*.js')
        .pipe(plumber({errorHandler: onError}))
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./theme/public/assets/js/'));
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
    gulp.watch('./theme/private/js/*.js', gulp.series('javascript'));
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
gulp.task('default', gulp.series('dev_init', 'copy:jquery', 'copy:elementqueries' , 'javascript', 'styles', 'watch'));
gulp.task('prod',    gulp.series('prod_init', 'styles', 'clean'));