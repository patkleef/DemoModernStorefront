"use strict";

var autoprefixer = require("gulp-autoprefixer");
var browserify = require("browserify");
var babelify = require("babelify");
var browserSync = require("browser-sync");
var buffer = require("vinyl-buffer");
var concat = require("gulp-concat");
var cleanCSS = require("gulp-clean-css");
var del = require("del");
var gulp = require("gulp");
var htmlmin = require("gulp-htmlmin");
var reload = browserSync.reload;
var mergeStream = require("merge-stream");
var sass = require("gulp-sass");
var source = require("vinyl-source-stream");
var sourcemaps = require("gulp-sourcemaps");
var uglify = require("gulp-uglify");
var watch = require("gulp-watch");
var wait = require("gulp-wait");
var rename = require("gulp-rename");
var _if = require("gulp-if");
var ts = require("gulp-typescript");

//To serve files
gulp.task("browserSync", () => {
  browserSync({
    notify: false,
    port: 9000,
    server: "wwwroot/",
    open: false,
    reloadThrottle: 20000,
    https: true
  });

  //Watch for the below file changes and reload browser
  gulp.watch(["wwwroot/**/*.*"]).on("change", reload);
});

gulp.task("copy:html", () => {
  console.log("Coping html files...");

  return gulp
    .src(["app/**/*.html"])
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("wwwroot"));
});

gulp.task("copy:sass", () => {
  console.log("Compiling scss to css files...");

  return gulp
    .src(["app/css/styles.scss"])
    .pipe(
      sass({
        outputStyle: "compressed",
        sourceComments: "map",
        includePaths: ["./app/css"]
      })
    )
    .on("error", function(err) {
      displayError(err);
    })
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(gulp.dest("wwwroot/css"));
});

gulp.task("copy:media", () => {
  return gulp.src(["app/media/**/*.*"]).pipe(gulp.dest("wwwroot/media"));
});

var tsProject = ts.createProject("tsconfig.json");
gulp.task("compile:ts", function() {
  var tsResult = tsProject.src().pipe(tsProject());

  return tsResult.js
    .pipe(sourcemaps.write({ sourceRoot: "/app" }))
    .pipe(gulp.dest("app"));
});

gulp.task("copy:js", function() {
  return gulp
    .src(["app/**/*.js"])
    .pipe(sourcemaps.write({ sourceRoot: "/app" }))
    .pipe(gulp.dest("wwwroot"));
});

gulp.task("jsfiles", ["compile:ts", "copy:js"]);

gulp.task("copy:lib", function() {
  return gulp
    .src([
      "lib/*.*",
      "node_modules/dialog-polyfill/dialog-polyfill.js",
      "node_modules/knockout/build/output/knockout-latest.js",
      "node_modules/knockout-postbox/src/knockout-postbox.js",
      "node_modules/requirejs/require.js",
      "node_modules/requirejs-text/text.js",
      "node_modules/jquery/dist/jquery.js",
      "node_modules/slick-carousel/slick/slick.js",
      "node_modules/google-maps/lib/Google.min.js",
      "node_modules/firebase/firebase.js"
    ])
    .pipe(_if("**/knockout-latest.js", rename({ basename: "knockout" })))
    .pipe(gulp.dest("wwwroot/lib"));
});

gulp.task("copy:others", function() {
  return gulp
    .src(["app/favicon.ico", "app/manifest.json"])
    .pipe(gulp.dest("wwwroot"));
});

gulp.task("copy:data", function() {
  return gulp.src(["data/**.*"]).pipe(gulp.dest("wwwroot/data"));
});

function displayError(err) {
  console.log(err);
}

function createBundler(src) {
  var b = browserify({
    fullPaths: true,
    debug: true
  });

  b.transform("babelify", { presets: ["es2015"] }).add(src);
  return b;
}

var bundlers = {
  "sw.js": createBundler("./app/sw.js")
};

function bundle(bundler, outputPath) {
  var splitPath = outputPath.split("/");
  var outputFile = splitPath[splitPath.length - 1];
  var outputDir = splitPath.slice(0, -1).join("/");

  return bundler
    .bundle()
    .on("error", displayError)
    .pipe(source(outputFile))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("wwwroot/" + outputDir))
    .pipe(reload({ stream: true }));
}

gulp.task("browserify", function() {
  return mergeStream.apply(
    null,
    Object.keys(bundlers).map(function(key) {
      return bundle(bundlers[key], key);
    })
  );
});

gulp.task("clean", done => {
  del(["wwwroot/**/*.*"], done);
});

gulp.task("watch", function() {
  var html = gulp.watch(["app/*.html", "app/**/*.html"], ["copy:html"]);
  var sass = gulp.watch(["app/css/**/*.scss"], ["copy:sass"]);
  var ts = gulp.watch(["app/**/*.ts"], ["jsfiles"]);
  //var js = gulp.watch(["app/**/*.js"], ["copy:js"]);
  var img = gulp.watch(["app/media/*.*"], ["copy:media"]);
  //var browserify = gulp.watch(["app/sw.js"], ["browserify"]);

  var log = function(event) {
    if (event.type === "deleted") {
      runSequence("clean");
      setTimeout(function() {
        runSequence(
          "copy:html",
          "copy:sass",
          "copy:media",
          "copy:lib",
          "copy:others",
          /*"browserify",*/ "watch"
        );
      }, 1000);
    }
    console.log(
      config.notify.update(
        "\n--------- File " +
          event.path +
          " was " +
          event.type +
          " ------------------------\n"
      )
    );
  };

  // On change print file name and event type
  html.once("update", log);
  sass.once("update", log);
  ts.once("update", log);
  //js.once("update", log);
  img.once("update", log);
  /*browserify.once("update", log);*/
});

gulp.task("default", [
  "clean",
  "copy:html",
  "copy:sass",
  "copy:media",
  "compile:ts",
  "copy:js",
  "copy:lib",
  "copy:others",
  "copy:data",
  /*"browserify",*/ "browserSync",
  "watch"
]);
gulp.task("build", [
  "clean",
  "copy:html",
  "copy:sass",
  "copy:media",
  "compile:ts",
  "copy:js",
  "copy:lib",
  "copy:others",
  "copy:data" /*"browserify"*/
]);
