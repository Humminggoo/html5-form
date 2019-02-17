const gulp = require("gulp"),
  autoprefixer = require("gulp-autoprefixer"),
  browserSync = require("browser-sync").create(),
  sass = require("gulp-sass"),
  minCSS = require("gulp-clean-css"),
  concat = require("gulp-concat"),
  imagemin = require("gulp-imagemin"),
  changed = require("gulp-changed");

function css() {
  return gulp
    .src("src/sass/*.scss")
    .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
    .pipe(autoprefixer("last 2 versions"))
    .pipe(concat("style.min.css"))
    .pipe(
      minCSS({ debug: true }, details => {
        console.log(`${details.name}: ${details.stats.originalSize}`);
        console.log(`${details.name}: ${details.stats.minifiedSize}`);
      })
    )
    .pipe(gulp.dest("dist/css/"));
}
function image() {
  return gulp
    .src("src/img/*.svg")
    .pipe(changed("src/img/"))
    .pipe(
      imagemin([
        imagemin.svgo({
          plugins: [{ removeViewBox: true }]
        })
      ])
    )
    .pipe(gulp.dest("dist/img/"));
}
function watch() {
  browserSync.init({
    open: "external",
    host: "http://localhost:8080",
    port: 8080
  });
  gulp.watch("src/sass/*.scss", css);
  gulp.watch("src/img/*", image);
  gulp
    .watch(["dist/css/style.min.css", "./index.html"])
    .on("change", browserSync.reload);
}
const build = gulp.parallel(watch);
gulp.task("default", build);
