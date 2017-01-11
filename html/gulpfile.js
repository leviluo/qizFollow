
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

// gulp.task("webpack", function(callback) {
//     // run webpack
//     webpack({
//         //插件项
//     plugins: [commonsPlugin],
//     //页面入口文件配置
//     entry: {
//         index : './js/page/index.js'
//     },
//     //入口文件输出配置
//     output: {
//         path: 'dist/js/page',
//         filename: '[name].js'
//     },
//     module: {
//     //加载器配置
//         loaders: [
//             { test: /\.css$/, loader: 'style-loader!css-loader' },
//             { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader?presets[]=es2015&presets[]=react' },
//             // { test: /\.scss$/, loader: 'style!css!sass?sourceMap'},
//             { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'}
//         ]
//     },
//     //其它解决方案配置
//     resolve: {
//         root: 'E:/github/flux-example/src', //绝对路径
//         extensions: ['', '.js', '.json', '.scss'],
//         alias: {
//             AppStore : 'js/stores/AppStores.js',
//             ActionType : 'js/actions/ActionType.js',
//             AppAction : 'js/actions/AppAction.js'
//         }
//     }

//     }, function(err, stats) {
//         if(err) throw new gutil.PluginError("webpack", err);
//         gutil.log("[webpack]", stats.toString({
//             // output options
//         }));
//         callback();
//     });
// });

var jsFiles = [
    "static/index.js"
];
// 在这两个 `min` 任务之外，还有两个不带 `min` 的任务，区别在于不对文件压缩
gulp.task('scripts_min', function() {
    return gulp.src(jsFiles)
        .pipe(concat('main.js')) // 合并 JavaScript ，并设置合并后的文件名
        .pipe(uglify()) // 执行 JavaScript 压缩
        .pipe(gulp.dest('static'));
});

gulp.task('default', ['scripts_min']);
