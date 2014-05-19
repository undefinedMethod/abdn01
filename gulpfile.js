// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var gutil = require('gulp-util');
connect = require('gulp-connect');
jshint = require('gulp-jshint');
stripDebug = require('gulp-strip-debug');
concat = require('gulp-concat');
autoprefix = require('gulp-autoprefixer');
clean = require('gulp-clean');
stylus = require('gulp-stylus');
concat = require('gulp-concat');
uglify = require('gulp-uglify');
svgSprites = require('gulp-svg-sprites');
svg2png = require('gulp-svg2png');

gulp.task('connect', function() {
    connect.server({
        root: ['build'],
        port: 8080,
        livereload: true
    })
});

// Lint Task
gulp.task('lint', function() {
    return gulp.src('js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// JS concat, strip debugging and minify
gulp.task('js', function() {
    var jsHeadSrc = './src/js/header/*.js';
    jsSrc = ['./src/js/vendor/*.js', './src/js/plugins/*.js', './src/js/modules/*.js'];
    jsDst = './build/js/';

    gulp.src([jsHeadSrc])
        .pipe(concat('header.js'))
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(gulp.dest(jsDst))
        .pipe(connect.reload());
    gulp.src(jsSrc)
        .pipe(concat('site.js'))
        .pipe(gulp.dest(jsDst))
        .pipe(connect.reload());
});

// Get and render all .styl files recursively
gulp.task('php', function() {
    var phpSrc = './src/*.php';
    phpDst = './build';

    phpSrc2 = './src/templates/*.php';
    phpDst2 = './build/templates/';

    gulp.src(phpSrc)
        .pipe(gulp.dest(phpDst))
        .pipe(connect.reload());

    gulp.src(phpSrc2)
        .pipe(gulp.dest(phpDst2))
        .pipe(connect.reload());
});

// Get and render all .styl files recursively
gulp.task('stylus', function() {
    var stylSrc = './src/stylus/screen.styl';
    stylDst = './build/css';

    gulp.src(stylSrc)
        .pipe(stylus({
// use: ['nib']
}))
        .pipe(concat('screen.css'))
        .pipe(gulp.dest(stylDst))
        .pipe(connect.reload());
});

// Get files and distribute
gulp.task('push', function() {
    var pushStylSrc = './build/css/*.css';
    pushStylDst = './css';

    gulp.src([pushStylSrc])
        .pipe(gulp.dest(pushStylDst))
        .pipe(connect.reload());
});

// .svg sprite functions
gulp.task('sprites', function() {
    var svgSrc = './src/assets/svg/*.svg';
    svgDst = './build/assets';
    svg = svgSprites.svg;
    png = svgSprites.png;

    gulp.src(svgSrc)
        .pipe(svg())
        .pipe(gulp.dest(svgDst))
        .pipe(png())
        .pipe(connect.reload());
});

gulp.task('png', function() {
    var pngSrc = './src/assets/svg/*.svg';
    pngDst = './build/images';

    gulp.src(pngSrc)
        .pipe(svg2png())
        .pipe(gulp.dest(pngDst));
});

// Clean
gulp.task('clean', function() {
    return gulp.src(['build/*.php', 'build/css/*.css', 'build/js/*.js', 'build/images/', 'build/templates/*php'], {
        read: false
    })
        .pipe(clean());
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('js/*.js', ['lint', 'js']);
    gulp.watch(['./src/js/vendor/*.js', './src/js/plugins/*.js', './src/js/modules/*.js'], ['js']);
    gulp.watch('./src/*.php', ['php']);
    gulp.watch('./src/templates/*.php', ['php']);
    gulp.watch('./src/stylus/**/*.styl', ['stylus', 'push']);
    gulp.watch('./src/assets/svg/*.svg', ['sprites']);
});

// Default Task
gulp.task('default', ['connect', 'lint', 'js', 'php', 'stylus', 'watch', 'assets', 'sprites', 'png']);

gulp.task('assets', function() {
    gulp.start('push');
});