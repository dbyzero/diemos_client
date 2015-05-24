var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concatCss = require('gulp-concat-css');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var watchify = require('watchify');

gulp.task('build:css', function() {
    return gulp.src('css/**/*.css')
        .pipe(concatCss("deimos.css").on('error',errorHandler))
        .pipe(gulp.dest('dist/'))
        .pipe(gulp.dest('test/'));
});
 
gulp.task('build:js', function() {
    return gulp
        .src([
            "src/external_libs/md5.js",
            "src/org/dbyzero/tools/Inherit.js",
            "src/org/dbyzero/tools/Loop.js",
            "src/org/dbyzero/tools/Log.js",
            "src/org/dbyzero/tools/Vector.js",
            "src/org/dbyzero/tools/EventManager.js",
            "src/org/dbyzero/tools/KeyboardController.js",
            "src/org/dbyzero/deimos/Config.js",
            "src/org/dbyzero/deimos/Engine.js",
            "src/org/dbyzero/deimos/render/Animation.js",
            "src/org/dbyzero/deimos/render/UI.js",
            "src/org/dbyzero/deimos/render/Scene.js",
            "src/org/dbyzero/deimos/element/Element.js",
            "src/org/dbyzero/deimos/element/Speaker.js",
            "src/org/dbyzero/deimos/element/Avatar.js",
            "src/org/dbyzero/deimos/element/ServerAvatar.js",
            "src/org/dbyzero/deimos/element/Block.js",
            "src/org/dbyzero/deimos/element/Zone.js",
            "src/org/dbyzero/deimos/element/Projectile.js",
            "src/org/dbyzero/deimos/element/Monster.js",
            "src/org/dbyzero/deimos/element/Item.js",
            "src/org/dbyzero/deimos/element/AttackZone.js",
            "src/org/dbyzero/deimos/network/WebsocketClient.js",
            "src/org/dbyzero/deimos/network/Manager.js",
            "src/org/dbyzero/deimos/network/Message.js",
            "src/org/dbyzero/tools/Physics.js",
            "src/org/dbyzero/deimos/physic/UserMovement.js",
            "src/org/dbyzero/deimos/physic/Gravity.js",
            "src/org/dbyzero/deimos/analyser/Manual.js",
            "src/app.js"
        ])
        .pipe(sourcemaps.init())
        .pipe(concat('deimos.js'))
        // .pipe(uglify({
        //     compress:true,
        //     mangle:true,
        //     preserveComments:false
        // }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/'))
        .pipe(gulp.dest('test/'))
        .pipe(gulp.dest('/home/half/repository/puck/client/libs/'));
});

gulp.task('default', ['build:css','build:js']);

// Handle the error
function errorHandler (error) {
    console.log(error.toString());
    this.emit('end');
}
