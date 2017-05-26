const gulp = require('gulp')
const fs = require('fs')
const path = require('path')
const sourcemaps = require('gulp-sourcemaps')

// postcss
const autoprefixer = require('autoprefixer')
const extend = require('postcss-extend')
const concatCss = require('gulp-concat-css')
const mixins = require('postcss-mixins')
const modules = require('postcss-modules')
const nested = require('postcss-nested')
const postcss = require('gulp-postcss')
const postcss_import = require('postcss-easy-import')
const cssvariables = require('postcss-css-variables')

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
  return gulp.src([
    './src/css/modules/*.css',
    './src/css/layouts/*.css'
  ])
  .pipe(postcss([
    postcss_import,
    cssvariables,
    mixins,
    nested,
    extend,
    autoprefixer,
    modules({
      getJSON: getJSONFromCssModules,
      generateScopedName: '[name]-[local]__[hash:base64:5]'
    }),
  ]))
  .pipe(concatCss('app.css'))
  .pipe(gulp.dest('./css'))
  .pipe(sync.stream({match: '**/*.css'}))
})

gulp.task('layouts', gulp.series('css', () => {
  return gulp.src('./src/layouts/**.ejs')
    .pipe(ejs({ className: getClass }, {}, { ext: '.html' }))
    .pipe(gulp.dest('./_layouts'))
    .pipe(sync.stream())
}))

gulp.task('includes', gulp.series('css', () => {
  return gulp.src('./src/includes/**.ejs')
    .pipe(ejs({ className: getClass }, {}, { ext: '.html' }))
    .pipe(gulp.dest('./_includes'))
    .pipe(sync.stream())
}))

gulp.task('cards', gulp.series('css', () => {
  return gulp.src('./src/cards/**.ejs')
    .pipe(ejs({ className: getClass }, {}, { ext: '.html' }))
    .pipe(gulp.dest('./_includes/cards'))
    .pipe(sync.stream())
}))

gulp.task('browserify', gulp.series(() => {
  const bundler = watchify(browserify('./src/js/app.js', {debug: true}))
    .transform(babelify)

  return bundler.bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./_includes'))
    .pipe(sync.stream({match: '**/*.js'}))

}))

function watch() {
  sync.init({
    server: {
      baseDir: './_site'
    },
    open: false,
    browser: 'default',
    reloadOnRestart: true,
    notify: false
  })

  gulp.watch(['./*.markdown', './_posts/**/*.markdown'],
    gulp.series('jekyll', done => {
      sync.reload()
      done()
    }))

  gulp.watch(['./src/css/**/*.css'],
    gulp.series('css', 'jekyll', done => {
      sync.reload()
      done()
    }))

  gulp.watch(['./src/includes/**/*.ejs', './src/layouts/**/*.ejs', './src/cards/**/*.ejs'],
    gulp.series('layouts', 'includes', 'cards', 'jekyll', done => {
      sync.reload()
      done()
    }))

  gulp.watch(['./src/js/**/*.js'],
    gulp.series('browserify', 'jekyll', done => {
      sync.reload()
      done()
    }))
}

gulp.task(watch)

gulp.task('default', gulp.series('includes', 'layouts', 'browserify', 'jekyll', 'watch'))
