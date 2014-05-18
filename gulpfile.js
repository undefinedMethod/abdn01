// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var connect = require('gulp-connect');
var jshint = require('gulp-jshint');
var stylus = require('gulp-stylus');
var concat = require('gulp-concat');

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

// Get and render all .styl files recursively
gulp.task('php', function() {
    var phpSrc = './src/*.php';
    phpDst = './build';

    phpSrc2 = './src/templates/*.php';
    phpDst2 = './build/templates';

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
        .pipe(stylus())
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

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('js/*.js', ['lint', 'scripts']);
    gulp.watch('./src/*.php', ['php']);
    gulp.watch('./src/templates/*.php', ['php']);
    gulp.watch('./src/stylus/**/*.styl', ['stylus', 'push']);
});

// Default Task
gulp.task('default', ['connect', 'lint', 'php', 'stylus', 'watch', 'assets']);

gulp.task('assets', function() {
    gulp.start('push');
});