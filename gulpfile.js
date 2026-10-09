const {series, watch, src, dest, parallel} = require('gulp');
const pump = require('pump');

// gulp plugins and utils
const livereload = require('gulp-livereload');
const postcss = require('gulp-postcss');
const zip = require('gulp-zip');
const uglify = require('gulp-uglify');
const beeper = require('beeper');
const browserify = require('browserify');
const vinylSourceStream = require('vinyl-source-stream');
const vinylBuffer = require('vinyl-buffer');

// postcss plugins
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const easyimport = require('postcss-easy-import');
const tailwind = require('tailwindcss');
const tailwindNesting = require('tailwindcss/nesting');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');

function serve(done) {
  livereload.listen();
  done();
}

const handleError = (done) => {
  return function (err) {
    if (err) {
      beeper();
    }
    return done(err);
  };
};

function css(done) {
  const processors = [
    easyimport,
    tailwindNesting(),
    tailwind('./tailwind.config.js'),
    autoprefixer(),
    cssnano()
  ];

  pump([
    src('assets/css/*.scss', {sourcemaps: true}),
    sass().on('error', sass.logError),
    postcss(processors),
    dest('assets/built/', {sourcemaps: '.'}),
    livereload()
  ], handleError(done));
}

function hbs(done) {
  pump([
    src(['*.hbs', '**/**/*.hbs', '!node_modules/**/*.hbs']),
    livereload()
  ], handleError(done));
  css(done);
}

function sourceRevision() {
  const {execFileSync} = require('node:child_process');
  const {resolveBuildReference} = require('./scripts/analytics-build.cjs');
  const head = execFileSync('git', ['rev-parse', 'HEAD'], {encoding: 'utf8'}).trim();
  const dirty = execFileSync('git', ['status', '--porcelain', '--', '.', ':(exclude)assets/built'], {encoding: 'utf8'}).trim();
  return resolveBuildReference(head, Boolean(dirty), process.env.IGNIS_SOURCE_SHA);
}

function js(done) {
  const fs = require('node:fs');
  const sha = sourceRevision();
  fs.writeFileSync('assets/js/lib/analytics-build.js', `module.exports = ${JSON.stringify(sha)};\n`);

  const browserified = browserify({
    entries: ['./assets/js/main.js'],
    debug: false,
    packageFilter: pkg => {
      // Browserify does not resolve conditional exports; use the SDK's official CommonJS entry.
      if (pkg.name === '@openpanel/web' || pkg.name === '@openpanel/sdk') {
        pkg.main = pkg.exports['.'].require;
      }
      return pkg;
    }
  });

  pump([
    browserified.bundle(),
    vinylSourceStream('source.js'),
    vinylBuffer(),
    sourcemaps.init({ loadMaps: false }),
    uglify(),
    sourcemaps.write('.'),
    dest('assets/built/'),
    livereload()
  ], handleError(done));
}

function zipper(done) {
  if (!sourceRevision()) throw new Error('Commit source changes before release packaging; dirty builds disable analytics');
  const targetDir = 'dist/';
  const themeName = require('./package.json').name;
  const filename = themeName + '.zip';

  pump([
    src([
      '**',
      '!node_modules', '!node_modules/**',
      '!dist', '!dist/**'
    ]),
    zip(filename),
    dest(targetDir)
  ], handleError(done));
}

const cssWatcher = () => watch('assets/css/**', css);
const hbsWatcher = () => watch(['*.hbs', '**/**/*.hbs', '!node_modules/**/*.hbs'], hbs);
const jsWatcher = () => watch('assets/js/*.js', js);

const watcher = parallel(cssWatcher, hbsWatcher, jsWatcher);
const build = series(css, js);
const dev = series(build, serve, watcher);

exports.build = build;
exports.zip = series(build, zipper);
exports.default = dev;
