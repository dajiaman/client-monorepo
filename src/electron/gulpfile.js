var gulp = require("gulp");
const path = require("path");
var ts = require("gulp-typescript");

gulp.task("copy-files", function () {
  return gulp
    .src(["src/**/*.js"])
    .pipe(gulp.dest(path.join(__dirname, "../../dist/")));
});

gulp.task("watch-files", function () {
  gulp.watch(
    ["src/**/*.js"],
    {
      ignoreInitial: false,
    },
    gulp.series("copy-files")
  );
});

var tsProject = ts.createProject("tsconfig.json", {
  noImplicitAny: false,
  noEmitOnError: true,
  skipLibCheck: true,
  strict: false,
  sourceMap: true,
  noImplicitReturns: false,
  module: "amd",
});

gulp.task("default", function () {
  return gulp
    .src(["src/**/*.ts", "!src/preload.js", "!src/**/main.js"])
    .pipe(tsProject())
    .pipe(gulp.dest(path.join(__dirname, "../../dist")));
});

gulp.task("watch-client", function () {
  gulp.watch(
    ["src/**/*.ts"],
    {
      ignoreInitial: false,
    },
    gulp.series("default", "watch-files")
  );
});
