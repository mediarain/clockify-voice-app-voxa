'use strict';

const del = require('del');
const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const ts = require('gulp-typescript');
const zip = require('gulp-zip');
const merge = require('merge-stream');
const install = require('gulp-install');
const runSequence = require('run-sequence');
const awsLambda = require('node-aws-lambda');

const awsConfig = require('./aws-config'); // eslint-disable-line import/no-unresolved

gulp.task('watch', () =>
  nodemon({
    script: 'server.js',
    watch: ['src/*'],
    ext: 'json js',
    ignore: ['node_modules/**/*'],
  }));

gulp.task('clean', () => del(['dist/']));

gulp.task('bundle', () =>
  gulp
    .src('./package.json')
    .pipe(gulp.dest('./dist'))
    .pipe(install({ production: true })));

gulp.task('compile', () => {
  const tasks = ['src'].map(directory => gulp
    .src(`${directory}/**/*`)
    .pipe(gulp.dest(`./dist/${directory}`)));
  return merge(tasks);
});

gulp.task('typescript', function () {
  const tsProject = ts.createProject('tsconfig.json', {
    rootDir: './',
  });
  const result = tsProject.src().pipe(tsProject());

  return result.js.pipe(gulp.dest('dist'));
});

gulp.task('zip', () =>
  gulp
    .src('./dist/**/*', { nodir: true })
    .pipe(zip('dist/dist.zip'))
    .pipe(gulp.dest('./')));

gulp.task('upload', (callback) => {
  awsLambda.deploy('./dist/dist.zip', awsConfig, callback);
});

gulp.task('deploy', callback => runSequence(['clean'], ['bundle'], ['compile'], ['typescript'], ['zip'], callback));
