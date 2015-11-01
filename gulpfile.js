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
var imagePaths = ['htdocs/images', 'htdocs/files', 'htdocs/icons'];

var staticJsPath    = 'static/js/';
var staticCssPath   = 'static/css/';
var staticHtmlPath  = 'static';

var buildJsPath     = 'static/build/js/';
var buildCssPath    = 'static/build/scss/';
var buildHtmlPath   = 'static/build/html/';

var rexDeveloper    = 'htdocs/redaxo/include/data/addons/developer/';


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
    svgSprite   = require('gulp-svg-sprite');


///////////////////////////////////////////////////////
///      CONCAT ALL JS FILES IN BUILD FOLDER        ///
///////////////////////////////////////////////////////

gulp.task('scripts', function () {
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

gulp.task('sass', function () {
    return gulp.src([buildCssPath + 'styles.scss'])
        .pipe(sass())
        .on('error', onError)
        .pipe(gulp.dest(cssPath))
        .pipe(gulp.dest(staticCssPath))
        .pipe(browserSync.stream());
});

///////////////////////////////////////////////////////
///      CONCAT ALL HTML FILES IN BUILD FOLDER      ///
///////////////////////////////////////////////////////

gulp.task('fileinclude', function () {
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
            jsPath + 'functions.js'
    ])
        .pipe(uglify())
        .on('error', onError)
        .pipe(gulp.dest(jsPath));
});

///////////////////////////////////////////////////////
///         COMPRESS CSS FILES IN NONSTATIC          ///
///////////////////////////////////////////////////////

gulp.task('compress-css', function () {
    return gulp.src([buildCssPath + 'styles.scss'])
        .pipe(sass({outputStyle: 'compressed'}))
        .on('error', onError)
        .pipe(gulp.dest(cssPath))
});

///////////////////////////////////////////////////////
///             COMPRESS IMAGES FILES               ///
///////////////////////////////////////////////////////

gulp.task('compress-images', function () {
    var tasts = imagePaths.map(function (element) {
        return gulp.src([element + '/**/*'])
            .pipe(imagemin({
                progressive: true,
                interlaced: true,
                multipass: false
            }))
            .on('error', onError)
            .pipe(gulp.dest(element + '/'));
    });
    return merge(tasts);
});

///////////////////////////////////////////////////////
///                ADD SVG SPRITE                   ///
///////////////////////////////////////////////////////

gulp.task('svg-sprite', function () {

    gulp.src('path/to/assets/*.svg')
        .pipe(svgSprite( /* ... Insert your configuration here ... */ ))
        .pipe(gulp.dest('out'));


});

///////////////////////////////////////////////////////
///              GULP BROWSER SYNC                  ///
///////////////////////////////////////////////////////

///////////////////////////////////////////////////////
///    FOR REDAXO BROWSER SYNC WITH LOCAL SERVER    ///
///////////////////////////////////////////////////////

gulp.task('browser-sync-server', function () {
    browserSync.init(['*.css', '*.scss'], {
        proxy: projectname + '.dev'
    });
    gulp.watch(cssPath + '*.scss', ['sass']);
    gulp.watch([rexDeveloper + "**/*.php", "src/*.php"]).on('change', browserSync.reload);
});

///////////////////////////////////////////////////////
///           FOR FRONTEND BROWSER SYNC             ///
///////////////////////////////////////////////////////

gulp.task('browser-sync-static', function () {
    browserSync.init(['*.css', '*.scss'], {
        server: {
            baseDir: "./static"
        }
    });
    gulp.watch(cssPath + '*.scss', ['sass']);
    gulp.watch(buildHtmlPath + '**/*.html', ['fileinclude']);
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
///                                                 ///
///                   GULP TASKS                    ///
///                                                 ///
///////////////////////////////////////////////////////

///////////////////////////////////////////////////////
///            COMPRESS ALL FILE TASKS              ///
///////////////////////////////////////////////////////

gulp.task('compress', ['compress-js', 'compress-css', 'compress-images']);

///////////////////////////////////////////////////////
///         EXECUTE SASS & CONCAT JS FILES          ///
///////////////////////////////////////////////////////

gulp.task('local', ['scripts', 'sass']);

///////////////////////////////////////////////////////
///      CONCAT JS FILES & COMPRESS ALL FILES       ///
///////////////////////////////////////////////////////

gulp.task('default', ['scripts', 'compress']);