const gulp = require('gulp')
const fs = require('fs')
const path = require('path')
const sourcemaps = require('gulp-sourcemaps')

// postcss
const autoprefixer = require('autoprefixer')
const extend = require('postcss-extend')
const mixins = require('postcss-mixins')
const modules = require('postcss-modules')
const nesting = require('postcss-nesting')
const postcss = require('gulp-postcss')
const postcss_import = require('postcss-easy-import')

// ejs
const ejs = require('gulp-ejs')

// jekyll
const shell = require('gulp-shell')

//testing server
const rewrite = require('connect-modrewrite')
const sync = require('browser-sync').create()

// Babel and Browserify
const browserify = require('browserify')
const babelify = require('babelify')
const watchify = require('watchify')
const buffer = require('vinyl-buffer')
const source = require('vinyl-source-stream')
const uglify = require('gulp-uglify')


function getJSONFromCssModules(cssFileName, json) {
  const cssName = path.basename(cssFileName, '.css')
  const jsonFileName = path.resolve('./css', `${ cssName }.json`)
  fs.writeFileSync(jsonFileName, JSON.stringify(json))
}

function getClass(module, className) {
  const moduleFileName = path.resolve('./css', `${ module }.json`)
  const classNames = fs.readFileSync(moduleFileName).toString()
  return JSON.parse(classNames)[className]
}

gulp.task('jekyll', shell.task(['bundle exec jekyll build']))

gulp.task('css', () => {
  return gulp.src('./src/css/app.css')
  .pipe(sourcemaps.init({ loadMaps: true }))
  .pipe(postcss([
    postcss_import,
    nesting,
    mixins,
    extend,
    autoprefixer,
    modules({
      getJSON: getJSONFromCssModules,
      generateScopedName: '[name]-[local]__[hash:base64:5]'
    }),
  ]))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('./css'))
  .pipe(sync.stream({match: '**/*.css'}))
})

gulp.task('layouts', ['css'], () => {
  return gulp.src('./src/layouts/**.ejs')
    .pipe(ejs({ className: getClass }, {}, { ext: '.html' }))
    .pipe(gulp.dest('./_layouts'))
    .pipe(sync.stream())
})

gulp.task('includes', ['css'], () => {
  return gulp.src('./src/includes/**.ejs')
    .pipe(ejs({ className: getClass }, {}, { ext: '.html' }))
    .pipe(gulp.dest('./_includes'))
    .pipe(sync.stream())
})

gulp.task('browserify', () => {
  const bundler = watchify(browserify('./src/js/app.js', {debug: true}))
    .transform(babelify)

  bundler.bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./_includes'))
    .pipe(sync.stream({match: '**/*.js'}))
})

gulp.task('watch', () => {
  sync.init({
    server: {
      baseDir: './_site',
      middleware: [
        rewrite([
          '^.([^\\.]+)$ /$1.html [L]'
        ])
      ]
    },
    open: false,
    browser: 'default',
    reloadOnRestart: true,
    notify: false
  })

  gulp.watch('./*.html', ['jekyll'])
  gulp.watch('./*.markdown', ['jekyll'])
  gulp.watch('./posts/**/*.markdown', ['jekyll'])
  gulp.watch('./src/css/**.css', ['css'])
  gulp.watch('./src/layouts/**.ejs', ['layouts'])
  gulp.watch('./src/includes/**.ejs', ['includes'])
  gulp.watch('./src/js/**.js', ['browserify'])
})

gulp.task('default', ['jekyll', 'includes', 'layouts', 'browserify', 'watch'])
