const { src, dest, series } = require('gulp');
const del = require('del');

function clean() {
  return del(['dist']);
}

function copy() {
  return src('public/**/*').pipe(dest('dist'));
}

exports.default = series(clean, copy);
