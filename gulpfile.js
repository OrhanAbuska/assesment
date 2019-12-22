const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');

// Set the browser that you want to support
const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 45',
    'chrome >= 45',
    'ios >= 10',
    'android >= 4.4',
  ];

// Compile SASS files into CSS files
gulp.task('sass', ()=> {
    return gulp.src('./src/scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./src/css'))
    .pipe(browserSync.stream());
});

// Gulp task to minify CSS files
gulp.task('styles', function () {
    return gulp.src('./src/sass/style.scss')
      // Compile SASS files
      .pipe(sass({
        outputStyle: 'nested',
        precision: 10,
        includePaths: ['.'],
        onError: console.error.bind(console, 'Sass error:')
      }))
      // Auto-prefix css styles for cross browser compatibility
      .pipe(autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
      // Minify the file
      .pipe(csso())
      // Output
      .pipe(gulp.dest('./src/css'))
  });

// Gulp task to minify JavaScript files
gulp.task('scripts', function() {
    return gulp.src('./src/js/**/*.js')
      // Minify the file
      .pipe(uglify())
      // Output
      .pipe(gulp.dest('./src/js'))
  });

// Gulp task to minify HTML files
gulp.task('pages', function() {
    return gulp.src(['./src/**/*.html'])
      .pipe(htmlmin({
        collapseWhitespace: true,
        removeComments: true
      }))
      .pipe(gulp.dest('src'));
  });

// Clean output directory
gulp.task('clean', () => del(['./src']));

// Gulp task to minify all files
gulp.task('default', gulp.series('clean'), function () {
  runSequence(
    'styles',
    'scripts',
    'pages'
  );
});

// create a server and watch files
gulp.task('serve', gulp.series('sass'), () => {
    browserSync.init({
        server: 'src'
    });

    gulp.watch('src/scss/*.scss', ['sass']);
    gulp.watch('src/*.html').on('change', browserSync.reload);
});

gulp.task('default', gulp.series('serve'));