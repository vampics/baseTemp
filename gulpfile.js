///////////////////////////////////////////////////////
///                  GULPFILE                       ///
///                                                 ///
///   for the all active value projects starting    ///
///      08/2015. To Init gulp local tap "npm       ///
///    install" in your console. Last Change of     ///
///                 this File:                      ///
///          03.08.2015 @Tobias Wöstmann            ///
///                                                 ///
///////////////////////////////////////////////////////

///////////////////////////////////////////////////////
///             SET PROJECTS FOLDERS                ///
///////////////////////////////////////////////////////

var projectname = 'basetemp';

var jsPath = 'htdocs/js/';
var cssPath = 'htdocs/css/';
var imagePath = 'htdocs/images/';

var staticJsPath    = 'static/js/';
var staticCssPath   = 'static/css/';
var staticHtmlPath  = 'static';
var staticImagePaths = ['static/images'];

var buildJsPath     = 'build/js/';
var buildCssPath    = 'build/scss/';
var buildHtmlPath   = 'build/html/';


///////////////////////////////////////////////////////
///          INIT GULP, ADD ALL MODULES             ///
///////////////////////////////////////////////////////

var gulp        = require('gulp'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglify'),
    sass        = require('gulp-sass'),
    browserSync = require('browser-sync').create(),
    fileinclude = require('gulp-file-include'),
    imagemin    = require('gulp-imagemin'),
    merge       = require('merge-stream'),
    mmq         = require('gulp-merge-media-queries');


///////////////////////////////////////////////////////
///      CONCAT ALL JS FILES IN BUILD FOLDER        ///
///////////////////////////////////////////////////////

gulp.task('compile-js', function () {
    return gulp.src([
        buildJsPath + 'libs/**/*.js',
        buildJsPath + '*.js',
        buildJsPath + 'modules/**/*.js'
    ])
        .pipe(concat('functions.js'))
        .on('error', onError)
        .pipe(gulp.dest(jsPath))
        .pipe(gulp.dest(staticJsPath));
});

///////////////////////////////////////////////////////
///    EXECUTE SASS TASK, CONCAT ALL SCSS FILES     ///
///////////////////////////////////////////////////////

gulp.task('compile-scss', function () {
    return gulp.src([buildCssPath + 'styles.scss'])
        .pipe(sass())
        .pipe(mmq({log: true}))
        .on('error', onError)
        .pipe(gulp.dest(cssPath))
        .pipe(gulp.dest(staticCssPath))
        .pipe(browserSync.stream());
});

///////////////////////////////////////////////////////
///      CONCAT ALL HTML FILES IN BUILD FOLDER      ///
///////////////////////////////////////////////////////

gulp.task('compile-html', function () {
    gulp.src([buildHtmlPath + '*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .on('error', onError)
        .pipe(gulp.dest('./' + staticHtmlPath));
});

///////////////////////////////////////////////////////
///         COMPRESS JS FILES IN NONSTATIC          ///
///////////////////////////////////////////////////////

gulp.task('compress-js', function () {
    return gulp.src([
        staticJsPath + '*.js'
    ])
        .pipe(uglify())
        .on('error', onError)
        .pipe(gulp.dest(jsPath));
});

gulp.task('compress-js-libs', function () {
    return gulp.src([
        staticJsPath + 'libs/*.js'
    ])
        .pipe(uglify())
        .on('error', onError)
        .pipe(gulp.dest(jsPath + 'libs/'));
});

///////////////////////////////////////////////////////
///         COMPRESS CSS FILES IN NONSTATIC          ///
///////////////////////////////////////////////////////

gulp.task('compress-css', function () {
    return gulp.src([
        buildCssPath + 'styles.scss'
    ])
        .pipe(sass({outputStyle: 'compressed'}))
        .on('error', onError)
        .pipe(gulp.dest(cssPath))
});

///////////////////////////////////////////////////////
///             COMPRESS IMAGES FILES               ///
///////////////////////////////////////////////////////

gulp.task('compress-images', function () {
    var tasts = staticImagePaths.map(function (element) {
        return gulp.src([element + '/**/*'])
            .pipe(imagemin({
                progressive: true,
                interlaced: true,
                multipass: false
            }))
            .on('error', onError)
            .pipe(gulp.dest(imagePath));
    });
    return merge(tasts);
});

///////////////////////////////////////////////////////
///              GULP BROWSER SYNC                  ///
///////////////////////////////////////////////////////

gulp.task('browser-sync', function () {
    browserSync.init(['*.css', '*.scss'], {
        server: {
            baseDir: "./static"
        }
    });
    gulp.watch(buildHtmlPath + '**/*.html', ['compile-html']);
    gulp.watch([staticHtmlPath + "/*.html", staticJsPath + "*.js", staticCssPath + "*.css"]).on('change', browserSync.reload);
});


///////////////////////////////////////////////////////
///             GULP ERROR HANDLING                 ///
///////////////////////////////////////////////////////

function onError(err) {
    console.log(err);
    this.emit('end');
}

///////////////////////////////////////////////////////
///            COMPRESS ALL FILE TASKS              ///
///////////////////////////////////////////////////////

gulp.task('compress', ['compress-js', 'compress-js-libs', 'compress-css', 'compress-images']);
