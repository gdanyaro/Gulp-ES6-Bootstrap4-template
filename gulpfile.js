const gulp = require('gulp');
const babel = require('gulp-babel');    
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const concat = require('gulp-concat');
const uglify = require('gulp-uglifyjs');
const cssnano = require('gulp-cssnano');
const del = require('del');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const cache = require('gulp-cache');
const autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', () => {
    return gulp.src('app/sass/**/*.sass')
    .pipe(sass())
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7']))
    .pipe(cssnano())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('jslibs', () => {
    return gulp.src([
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/bootstrap/dist/js/bootstrap.min.js'        
    ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'))
});

gulp.task('es6', () => {
    return gulp.src('app/js/es6/**/*.js')
    .pipe(babel({
        presets: ['env']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('browser-sync', () => {
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false
    })
});

gulp.task('clean', () => {
    return del.sync('build');
});

gulp.task('clearCache', () => {
    return cache.clearAll();
});

gulp.task('img', () => {
    return gulp.src('app/img/**/*')
    .pipe(cache(imagemin({
        interlaced: true,
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
    })))
    .pipe(gulp.dest('build/img'))
})

gulp.task('watch', ['browser-sync', 'img', 'sass', 'jslibs', 'es6'], () => {
    gulp.watch('app/sass/**/*.sass', ['sass']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/es6/*.js', ['es6']);
});

gulp.task('build', ['clean', 'sass', 'jslibs', 'es6'], () => {
    let buildCss = gulp.src('app/css/**/*.css')
    .pipe(gulp.dest('build/css'))

    let buildJs = gulp.src('app/js/*.js')
    .pipe(gulp.dest('build/js'))

    let buildFonts = gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('build/fonts'))

    let buildHtml = gulp.src('app/*.html')
    .pipe(gulp.dest('build'))
})