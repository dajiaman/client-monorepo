var gulp = require("gulp");
const path = require("path");

gulp.task("copy-preload", function () {
  return gulp
    .src(["src/preload.js"])
    .pipe(gulp.dest(path.join(__dirname, "../../dist/")));
});

gulp.task("watch-preload", function () {
  gulp.watch(
    ["src/preload.js"],
    {
      ignoreInitial: false,
    },
    gulp.series("copy-preload")
  );
});
