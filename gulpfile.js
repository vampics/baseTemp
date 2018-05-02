///////////////////////////////////////////////////////
///                  GULPFILE                       ///
///////////////////////////////////////////////////////

///////////////////////////////////////////////////////
///             SET PROJECTS FOLDERS                ///
///////////////////////////////////////////////////////

const jsPath = 'htdocs/js/';
const cssPath = 'htdocs/css/';
const imagePath = 'htdocs/images/';

const staticJsPath    = 'static/js/';
const staticCssPath   = 'static/css/';
const staticHtmlPath  = 'static';
const staticImagePaths = ['static/images','htdocs/images'];

const buildJsPath     = 'src/js/';
const buildCssPath    = 'src/scss/';
const buildHtmlPath   = 'src/html/';


///////////////////////////////////////////////////////
///          INIT GULP, ADD ALL MODULES             ///
///////////////////////////////////////////////////////

const   gulp        = require('gulp'),
        babel       = require('gulp-babel'),
        concat      = require('gulp-concat'),
        uglify      = require('gulp-uglify'),
        sass        = require('gulp-sass'),
        browserSync = require('browser-sync').create(),
        fileinclude = require('gulp-file-include'),
        imagemin    = require('gulp-imagemin'),
        merge       = require('merge-stream'),
        jshint      = require('gulp-jshint'),
        csslint     = require('gulp-csslint'),
	    googleWebFonts = require('gulp-google-webfonts'),
        mmq         = require('gulp-merge-media-queries');


///////////////////////////////////////////////////////
///      CONCAT ALL JS FILES IN BUILD FOLDER        ///
///////////////////////////////////////////////////////

gulp.task('compile-js', () => {
    return gulp.src([
        buildJsPath + 'libarys/**/*.js',
        buildJsPath + '*.js',
        buildJsPath + 'classes/**/*.js',
        buildJsPath + 'modules/**/*.js',
    ])
        .pipe(concat('functions.js'))
        .on('error', onError)
        .pipe(gulp.dest(jsPath))
        .pipe(gulp.dest(staticJsPath));
});

gulp.task('compile-js-es5', () => {
    return gulp.src([
        staticJsPath + 'functions.js'
    ])
        .pipe(babel({ presets: ['env'] }))
        .on('error', onError)
        .pipe(gulp.dest(jsPath))
        .pipe(gulp.dest(staticJsPath));
});

///////////////////////////////////////////////////////
///    EXECUTE SASS TASK, CONCAT ALL SCSS FILES     ///
///////////////////////////////////////////////////////

gulp.task('compile-scss', () => {
    return gulp.src([buildCssPath + 'styles.scss'])
        .pipe(sass())
        .pipe(mmq({log: true}))
        .on('error', onError)
        .pipe(gulp.dest(cssPath))
        .pipe(gulp.dest(staticCssPath))
        .pipe(browserSync.stream());
});

///////////////////////////////////////////////////////
///   DOWNLOAD THE FONT AND SET IT TO ALL FOLDERS   ///
///////////////////////////////////////////////////////

const webFontOptions = {
	fontsDir: '../fonts/'
};

gulp.task('compile-fonts', () => {
	return gulp.src(buildCssPath + 'fonts.list')
		.pipe(googleWebFonts(webFontOptions))
		.pipe(gulp.dest(staticCssPath))
		.pipe(gulp.dest(cssPath));
});

///////////////////////////////////////////////////////
///      CONCAT ALL HTML FILES IN BUILD FOLDER      ///
///////////////////////////////////////////////////////

gulp.task('compile-html', () => {
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

gulp.task('compress-js', () => {
    return gulp.src([
        staticJsPath + '*.js'
    ])
        .pipe(uglify())
        .on('error', onError)
        .pipe(gulp.dest(jsPath));
});

gulp.task('compress-js-libs', () => {
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

gulp.task('compress-css', () => {
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

gulp.task('compress-images', () => {
    let tasts = staticImagePaths.map(function (element) {
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

gulp.task('browser-sync', () => {
    browserSync.init(['*.css', '*.scss'], {
    server: {
        baseDir: "./static"
    }
});
gulp.watch(buildHtmlPath + '**/*.html', ['compile-html']).on('error', onError);
gulp.watch(buildJsPath + '**/*.js', ['compile-js']).on('error', onError);
gulp.watch(buildCssPath + '**/*.scss', ['compile-scss']).on('error', onError);

gulp.watch([staticHtmlPath + "/*.html", staticJsPath + "*.js", staticCssPath + "*.css"]).on('change', browserSync.reload).on('error', onError);
});

///////////////////////////////////////////////////////
///              TESTING FUNCTIONS                  ///
///////////////////////////////////////////////////////

gulp.task('test-js', () => {
    return gulp.src( buildJsPath + '/modules/*.js')
        .pipe(jshint({
            esnext: true
        }))
        .pipe(jshint.reporter('default'));
});

gulp.task('test-css', () => {
    gulp.src( staticCssPath + '*.css')
    .pipe(csslint({
        'order-alphabetical': false,
        'outline-none': false,
        'box-sizing': false,
        'compatible-vendor-prefixes': false,
        'unique-headings': false,
        'box-model': false,
        'adjoining-classes': false,
        'font-sizes': false,
        'zero-units': true,
        'overqualified-elements': false,
        'important': false,
        'floats': false,
        'fallback-colors': false,
        'qualified-headings': false
    }))
    .pipe(csslint.formatter());
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

gulp.task('test-frontend', ['test-js','test-css']);
