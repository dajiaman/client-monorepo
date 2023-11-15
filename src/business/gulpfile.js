var gulp = require("gulp");
var ts = require("gulp-typescript");
const path = require("path");

var tsProject = ts.createProject("tsconfig.json", {
  noImplicitAny: false,
  noEmitOnError: true,
  skipLibCheck: true,
  strict: false,
  sourceMap: true,
});

gulp.task("default", function () {
  return gulp
    .src(["src/**/*.ts"])
    .pipe(tsProject())
    .pipe(gulp.dest(path.join(__dirname, "../../dist/business/preloads/")));
});

gulp.task("watch", function () {
  gulp.watch(
    ["src/**/*.ts"],
    {
      ignoreInitial: false,
    },
    gulp.series("default")
  );
});
