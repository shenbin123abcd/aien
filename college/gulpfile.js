'use strict';
var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins = gulpLoadPlugins();
var rubySass = require('gulp-ruby-sass');
var sourcemaps = require('gulp-sourcemaps');
var fs = require('fs');

gulp.task('generateDistVersion', function () {
    fs.writeFileSync('app/Public/College/js/config.dist.js',''+
        '(function(){' +
        '"use strict";' +
        'window.appConfig={};' +
        'window.appConfig.debug=false;' +
        'window.appConfig.version="' +(new Date().getTime())+'";'+
        'if(window.appConfig.debug){' +
        '    window.appConfig.bust="?v="+(new Date().getTime());' +
        '}else{' +
        '    window.appConfig.bust="?v="+window.appConfig.version;' +
        '}' +
        '}());' +
        '' +
        '');
});

gulp.task('clearDistVersion',['build'], function () {
    fs.writeFileSync('app/Public/College/js/config.dist.js','');
});

gulp.task('sass', function () {
    return gulp.src(['app/Public/College/css/main.scss'])
        .pipe(sourcemaps.init())
        .pipe(plugins.sass())
        .pipe(sourcemaps.write('../maps/sass'))
        .pipe(gulp.dest('app/Public/College/css/'));
});

gulp.task('less', function () {
    return gulp.src('app/Public/College/css/second.less')
        .pipe(sourcemaps.init())
        .pipe(plugins.less())
        .pipe(sourcemaps.write('../maps/less'))
        .pipe(gulp.dest('app/Public/College/css/'));
});

//gulp.task('rubySass', function () {
//    return rubySass('app/vendor/bootstrap-sass-3.3.5/assets/stylesheets/bootstrap.scss',{ sourcemap: true })
//        .pipe(sourcemaps.write('./'))
//        .pipe(gulp.dest('app/vendor/bootstrap-sass-3.3.5/assets/stylesheets/'));
//});



gulp.task('styles',['sass','less'], function () {

});

//gulp.task('coffee', function () {
//    return gulp.src('app/**/*.coffee')
//        .pipe(plugins.coffee())
//        .pipe(gulp.dest('app/'));
//});
//gulp.task('transJson', function () {
//    return gulp.src('app/i18n/*.json')
//        .pipe(gulp.dest('dist/i18n'))
//
//});

gulp.task('html', function () {
    return gulp.src('app/Public/College/views/**/*.html')
        .pipe(plugins.minifyHtml({
            empty: true,
            spare: true,
            quotes: true,
            conditionals: true
        }))
        .pipe(gulp.dest('dist/Public/College/views/'))
});

//gulp.task('fonts', function () {
//    return gulp.src(require('main-bower-files')({
//            filter: '**/*.{eot,svg,ttf,woff,woff2}'
//        }).concat('app/fonts/**/*'))
//        .pipe(gulp.dest('.tmp/fonts'))
//        .pipe(gulp.dest('dist/fonts'));
//});

//gulp.task('fonts', function () {
//    return gulp.src('**/*.{eot,svg,ttf,woff,woff2}')
//        .pipe(plugins.flatten())
//        .pipe(gulp.dest('dist/fonts'));
//});


//gulp.task('favicon', function () {
//    return gulp.src('app/favicon.ico')
//        .pipe(gulp.dest('dist/'))
//});

//gulp.task('docIcons', function () {
//    return gulp.src('app/images/docIcons/*.{png,gif,jpg}')
//        .pipe(gulp.dest('dist/images/docIcons'))
//
//});

gulp.task('haloIcon', function () {
    return gulp.src('app/Public/College/css/haloIcon/**/*iconfont.*')
        .pipe(gulp.dest('dist/Public/College/css/haloIcon/'))
});

gulp.task('videojs', function () {
    var jsFilter = plugins.filter('**/*.js',{restore: true});
    var cssFilter = plugins.filter('**/*.css',{restore: true});
    return gulp.src(['app/Public/College/js/lib/video.js/5.5.3/dist/video-js.css', 'app/Public/College/js/lib/video.js/5.5.3/dist/video.js'])
        .pipe(jsFilter)
        .pipe(plugins.uglify())
        .pipe(jsFilter.restore)
        .pipe(cssFilter)
        .pipe(plugins.autoprefixer({
            browsers:  ['> 0%'],
            cascade: false
        }))
        .pipe(plugins.csso())
        .pipe(cssFilter.restore)
        .pipe(gulp.dest('dist/Public/College/js/lib/video.js/5.5.3/dist/'))
});
gulp.task('swiper', function () {
    var jsFilter = plugins.filter('**/*.js',{restore: true});
    var cssFilter = plugins.filter('**/*.css',{restore: true});
    return gulp.src(['app/Public/College/js/lib/Swiper/3.3.0/dist/css/swiper.css', 'app/Public/College/js/lib/Swiper/3.3.0/dist/js/swiper.jquery.js'])
        .pipe(jsFilter)
        .pipe(plugins.uglify())
        .pipe(gulp.dest('dist/Public/College/js/lib/Swiper/3.3.0/dist/js/'))
        .pipe(jsFilter.restore)
        .pipe(cssFilter)
        .pipe(plugins.autoprefixer({
            browsers:  ['> 0%'],
            cascade: false
        }))
        .pipe(plugins.csso())
        .pipe(gulp.dest('dist/Public/College/js/lib/Swiper/3.3.0/dist/css/'))
        .pipe(cssFilter.restore)

});



gulp.task('images', function () {
    return gulp.src(['app/Public/College/images/*.{png,gif,jpg}'])
        .pipe(plugins.flatten())
        .pipe(gulp.dest('dist/Public/College/images'))
});


gulp.task('build', ['generateDistVersion','html','haloIcon','images','videojs','swiper'], function () {
    var htmlFilter = plugins.filter('*.html',{restore: true});
    var jsFilter = plugins.filter('**/*.js',{restore: true});
    var cssFilter = plugins.filter('**/*.css',{restore: true});
    //var assets;
    return gulp.src('app/index.html')
        //.pipe(assets = plugins.useref.assets())
        .pipe(plugins.useref())
        .pipe(jsFilter)
        .pipe(plugins.babel({
            presets: ['es2015']
        }))
        .pipe(plugins.uglify())
        .pipe(plugins.rev())
        .pipe(jsFilter.restore)
        .pipe(cssFilter)
        .pipe(plugins.autoprefixer({
            browsers:  ['> 0%'],
            cascade: false
        }))
        .pipe(plugins.csso())
        .pipe(plugins.rev())
        .pipe(cssFilter.restore)
        .pipe(plugins.useref())
        //.pipe(assets.restore())
        .pipe(plugins.revReplace())
        .pipe(htmlFilter)
        .pipe(plugins.minifyHtml({
            empty: true,
            spare: true,
            quotes: true,
            conditionals: true
        }))
        .pipe(htmlFilter.restore)
        .pipe(gulp.dest('dist'))
});

gulp.task('clean', require('del').bind(null, [ 'dist']));


gulp.task('default', ['clean'], function () {
    gulp.start('clearDistVersion');
});



