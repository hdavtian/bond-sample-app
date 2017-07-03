/*
 *
 * @desc Gulp script
 * @author Harma Davtian
 *
 * */

// Alphabetized list of variables

var babel = require('gulp-babel'),
    bower = require('gulp-bower'),
    browserSync = require('browser-sync'),
    cleanCSS = require('gulp-clean-css'),
    concat = require('gulp-concat'),
    folders = require('gulp-folders'),
    gulp = require('gulp'),
    gulpFilter = require('gulp-filter'),
    imagemin = require('gulp-imagemin'),
    jpegoptim = require('imagemin-jpegoptim'),
    mainBowerFiles = require('gulp-main-bower-files'),
    merge = require('merge-stream'),
    order = require('gulp-order'),
    path = require('path'),
    pngquant = require('imagemin-pngquant'),
    reload = browserSync.reload,
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify');

// custom config objects

var config = {
    bowerDir: './bower_components',

    src: {
        root: './src',
        js: './src/js',
        scss: './src/scss',
        vendorJs: './src/js/vendor',
        angularApps: './src/js/angular-apps',
        images: './src/images'
    },

    dest: {
        root: './build',
        js: './build/js',
        scss: './build/css',
        vendorJs: './build/js/vendor',
        angularApps: './build/js/angular-apps',
        images: './build/images'
    }
};

// *******************************************************************************************
// Tasks
// *******************************************************************************************

// ===========================================================================================
// Task Name: scripts-site
// Description: concatenate js files in js/site, uglify and copy to build folder.
//   If order of inclusion is necessary then use the order() plugin
// ===========================================================================================

gulp.task('scripts-site', function () {
    gulp.src([ path.join(config.src.js, '**/*.js') , '!./src/js/vendor/**/*', '!./src/js/{vendor,angular-apps}/**/*'])
        .pipe(sourcemaps.init())
        .pipe(babel())
        .on('error', console.error.bind(console))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.dest.js))
        .pipe(reload({ stream: true }));
});

// ===========================================================================================
// Task Name: scripts-vendor
// Description: concatenate src/js/vendor js files to one file, uglify and copy to build folder
// ===========================================================================================

gulp.task('scripts-vendor', function () {
    gulp.src(path.join(config.src.vendorJs, '**/*.js'))
        .pipe(sourcemaps.init())
        .pipe(order([
            'jquery*'
        ]))
        .pipe(uglify())
        .pipe(concat('vendor.js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.dest.vendorJs))
        .pipe(reload({ stream: true }));

});

// ===========================================================================================
// Task Name: angular-apps-js
// Description: This task copies, concatenates and minifies js files to appropriate folders
// JS order is given to whateverApp.js and whateverAppConfig.js
// this helped: https://www.npmjs.com/package/gulp-folders
// ===========================================================================================

gulp.task('angular-apps-js', folders(config.src.angularApps, function(folder){

    // take js files, concat, minify and put in build directory with same name as source
    // Here's the concatenation order @todo: rearchitect this to use AMD or requirejs
    //      app.js
    //      config.js
    //      /directives/*.js
    //      ctrl.js

    var app = gulp.src(path.join(config.src.angularApps, folder, 'app.js'));
    var appConfig = gulp.src(path.join(config.src.angularApps, folder, 'config.js'));
    var appDirectives = gulp.src(path.join(config.src.angularApps, folder, 'directives/**/*.js'));
    var appCtrl = gulp.src(path.join(config.src.angularApps, folder, 'ctrl.js'));

    var stream = merge(app, appConfig, appDirectives, appCtrl);
    return stream
        .pipe(uglify())
        .pipe(concat(folder + '.js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(path.join(config.dest.angularApps, folder)))
        .pipe(reload({ stream: true }));

    // replace old here

}));

// ===========================================================================================
// Task Name: angular-apps-js-vendor
// Description: copy js files within the 'vendor' subdirectory for access in destination folder
// ===========================================================================================

gulp.task('angular-apps-js-vendor', folders(config.src.angularApps, function(folder){

    // copy all .html files to appropriate app folder
    return gulp.src(config.src.angularApps + '/' + folder + '/vendors/**/*')
        .pipe(gulp.dest(config.dest.angularApps + '/' + folder + '/vendors'))
        .pipe(reload({ stream: true }));

}));

// ===========================================================================================
// Task Name: angular-apps-partials
// Description: copy html files within each ngApp partials to destination
// ===========================================================================================

gulp.task('angular-apps-partials', folders(config.src.angularApps, function(folder){

    // copy all .html files to appropriate app folder
    return gulp.src(path.join(config.src.angularApps, folder, 'partials/**/*.html'))
        .pipe(gulp.dest(path.join(config.dest.angularApps, folder, 'partials')))
        .pipe(reload({ stream: true }));

}));

// ===========================================================================================
// Task Name: angular-apps-json
// Description: copy .json files within each ngapp to destination
// HD note: will have to turn this off once getting data from api
// ===========================================================================================

gulp.task('angular-apps-json', folders(config.src.angularApps, function(folder){

    // copy all .json files to appropriate app folder
    return gulp.src(path.join(config.src.angularApps, folder, 'data/**/*.json'))
        .pipe(gulp.dest(path.join(config.dest.angularApps, folder, 'data')))
        .pipe(reload({ stream: true }));

}));

// ===========================================================================================
// Task Name: sass
// Description: compiles sass, writes to src dir and triggers browser sync
// ===========================================================================================

gulp.task('sass', function () {
    return gulp.src(path.join(config.src.scss, '**/*.scss'))
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'compressed' })).on('error', sass.logError)
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.dest.scss))
        .pipe(reload({ stream: true }));
});

// ===========================================================================================
// Task Name: html
// Description: Triggers browser sync on changes to .html files and copies html files to build folder
// ===========================================================================================

gulp.task('html', function () {
    gulp.src(path.join(config.src.root, '**/*.html'))
        .pipe(gulp.dest(config.dest.root))
        .pipe(reload({ stream: true }));
});

// ===========================================================================================
// Task Name: images
// Description: Triggers browser sync on changes to image files
// ===========================================================================================

gulp.task('images', function () {
    gulp.src(path.join(config.src.images, '**/*'))
        .pipe(gulp.dest(config.dest.images));
});

// ===========================================================================================
// Task Name: images-compress
// Description: Copies images from src to build and compresses them
// ===========================================================================================

gulp.task('images-compress', function () {
    return gulp.src(path.join(config.src.images, '**/*'))
        .pipe(imagemin({
            svgoPlugins: [
                { removeViewBox: false },
                { cleanupIDs: false }
            ],
            use: [pngquant(), jpegoptim({ progressive: true })]
        }))
        .pipe(gulp.dest(config.dest.images));
});

// ===========================================================================================
// Task Name: browser-sync
// Description: Initializes browserSync gulp plugin
// ===========================================================================================

gulp.task('browser-sync', function () {
    browserSync.init({
        //proxying and serving from an existing server
        //proxy: 'localhost:82', //our PHP server
        //port: 3334, // our new port
        //open: true,
        //watchTask: true

        // basic setup
        server: {
            baseDir: 'build'
        }
    });
});

// ----------
// bower
// ----------

gulp.task('bower', function () {
    return bower()
        .pipe(gulp.dest(config.bowerDir));
});

gulp.task('main-bower-files', function () {

    var filterJS = gulpFilter('**/*.js', { restore: true });
    gulp.src('./bower.json')
        .pipe(mainBowerFiles({ includeDev: true }))
        .pipe(filterJS)
        .pipe(sourcemaps.init())
        .pipe(concat('vendor-bower.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.dest.vendorJs));


    // We're using bower to include bootstrap-sass in the project
    // The bootstrap-sass does not have an entry point for the SASS compilation. The bower.json file points to
    //  assets/stylesheets/_bootstrap.scss, but that won't compile since it starts with an underscore.
    // A lot of people seem to just include _boostrap.scss in their main.scss files, but we're trying to create a vendor.css
    // So at gulp runtime, let's create an entry point, bootstrap.css, that just has this one line:
    //  @include "_bootstrap";
    // Then, in the main bower.json, we'll override the default settings with:
    //      "overrides": {
    //          "bootstrap-sass": {
    //              "main": [
    //                  "assets/stylesheets/custom-bootstrap.scss",
    //                  "assets/javascripts/bootstrap.js"
    //              ]
    //          }
    //      }
    require('fs').writeFileSync(config.bowerDir + '/bootstrap-sass/assets/stylesheets/custom-bootstrap.scss', '@import "_bootstrap";');



    var filterCSS = gulpFilter(['**/*.css', '**/*.scss'], { restore: true });
    return gulp.src('./bower.json')
        .pipe(mainBowerFiles({ includeDev: true }))
        .pipe(filterCSS)
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(concat('vendor.css'))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./build/css/vendor'));

});

// ===========================================================================================
// Task Name: bower-install-plugins
// ===========================================================================================
gulp.task('bower-install-plugins', ['bower']);

// ===========================================================================================
// Task Name: watch
// Description:
// ===========================================================================================

gulp.task('watch', ['browser-sync'], function () {
    gulp.watch('src/js/**/*.js', ['scripts-site', 'scripts-vendor']);
    gulp.watch('src/scss/**/*.scss', ['sass']);
    gulp.watch('src/**/*.html', ['html']);
    gulp.watch('src/images/**/*.*', ['images']);
    gulp.watch('src/js/angular-apps/**/*.js', ['angular-apps-js']);
    gulp.watch('src/js/angular-apps/**/*.html', ['angular-apps-partials']);
    gulp.watch('src/js/angular-apps/**/*.json', ['angular-apps-json']);
});

// ===========================================================================================
// Task Name: default
// ===========================================================================================

gulp.task('default', [
    'html',
    'images',
    'scripts-site',
    'scripts-vendor',
    'sass',
    'main-bower-files',
    'browser-sync',
    'angular-apps-js',
    'angular-apps-js-vendor',
    'angular-apps-partials',
    'angular-apps-json',
    'watch'
]);

// ===========================================================================================
// Task Name: build
// ===========================================================================================

gulp.task('build', [
    'html',
    'images-compress',
    'scripts-site',
    'scripts-vendor',
    'sass',
    'main-bower-files',
    'angular-apps-js',
    'angular-apps-js-vendor',
    'angular-apps-partials',
    'angular-apps-json'
]);

/*
 - First run: npm install
 - Second run: bower install
 - then run: gulp
 */