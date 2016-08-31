/*★★★★★gulp使用方法★★★★★
*cmd -> 当前文件路径cd I:\allcode\zjstool
*命令执行 gulp， 不需要参数，会自动调用gulfile.js中的default任务。也可以带参数指定执行哪个任务。
*
 ★绝对路径时，必须在服务器下才能访问，比如pages页面的ztools.js。 相对路径时，应用和文件访问都是可以的。
 *★★★★★★★★★★*/

//导入工具包 require('node_modules里对应模块')
var gulp = require('gulp'), //本地安装gulp所用到的地方
    concat = require('gulp-concat'),//gulp文件合并工具
    replace = require('gulp-replace'),//文本替换工具gulp-replace
    uglify = require("gulp-uglify"); //压缩工具,只能压缩js

//应用相关配置
var myConfig = {
    version:'alpha 1.0',
    author:"Z",

    requirePath:{
        "underscore": 'underscore/underscore',//这里只是定义了path和依赖，没用到的话，require不会去加载这个js
        "jquery": "jquery/jquery-2.0.2"//不能用别的名称，只能用jquery
        //"AraleQRCode":"qrcode/index"//全局，无依赖,必须指定为：AraleQRCode。使用这种方式要在index.js中define为AMD规范
        , "ztool": "ztool/ztool"
        , "qrcode": "qrcode/index"//二维码工具
        , "avalon": "avalon/avalon.shim"
        , "avalon.store": "avalon/store/avalon.store"
        , "avalon.mmRouter":"avalon/mmRouter/mmRouter"
        , "jqueryUi": "jquery-ui/jquery-ui-1.11.1.custom/jquery-ui"//改用bootstrap控件
        , "bootstrap": "bootstrap/bootstrap"//这个js包含了bootstrap所有的jquery插件，不用再另外去引单独功能的js
        , "bootstrapJq":"bootstrap/jquery.bootstrap.min"
        ,"js_beautify":"jsbeautify/jsbeautify"
        , "webapi":"webapi"
    },
    requireShim: {
        "qrcode": {//这个名字提供给require方法的参数
            exports: "AraleQRCode"//这个是index.js中的全局对象，exports之后，require会将其define为AMD规范，然后require中才能引用到这个
        },
        "bootstrap": {
            deps: ['jquery'] //bootstrap没有使用define去定义依赖关系，需要自己增加依赖
        },
        "js_beautify":{
            exports:"js_beautify"
        }
    }
};

function zjsRepNormal(stream){
    return stream.pipe(replace(/__VERSION__/g, myConfig.version))//
        .pipe(replace(/__AUTHOR__/g,myConfig.author))
        .pipe(replace(/__REQUIREPATH__/g,JSON.stringify(myConfig.requirePath)))
        .pipe(replace(/__REQUIRESHIM__/g,JSON.stringify(myConfig.requireShim)))
}
function zjsRepChromeExt(stream){
    return stream.pipe(replace(/\/\*chrome-extension/g,''))
        .pipe(replace(/chrome-extension\*\//g,''))
}

//
gulp.task("srcPublishResourceToTarget",function(cb){
    var stream = gulp.src(['src/**','!src/pages/**','!src/*'])
        .pipe(gulp.dest('target'));
    return stream;
});

gulp.task("srcPublishPagesToTarget",function(cb){
    var stream = gulp.src(['src/pages/**'])
        .pipe(replace(/__VERSION__/g, myConfig.version))//
        .pipe(replace(/__AUTHOR__/g,myConfig.author))
        .pipe(replace(/__REQUIREPATH__/g,JSON.stringify(myConfig.requirePath)))
        .pipe(replace(/__REQUIRESHIM__/g,JSON.stringify(myConfig.requireShim)))
        .pipe(gulp.dest('target/pages'));
    return stream;
});

//发布到chrome-extension用的任务
gulp.task("srcPublishResourceToChromeExt",function(cb){
    var stream = gulp.src(['src/**','!src/pages/**'])
        .pipe(gulp.dest('chromeExtenstion'));//输出目录为根目录，此时会把src下所有文件复制到根目录下
    return stream;
})
gulp.task("srcPublishPagesToChromeExt",function(cb){
    var stream = gulp.src(['src/pages/**'])
        //.pipe(concat('gulpTest.js')) //合并后的文件名称
        //.pipe(uglify()) //压缩js
        .pipe(replace(/__VERSION__/g, myConfig.version))//
        .pipe(replace(/__AUTHOR__/g,myConfig.author))
        .pipe(replace(/__REQUIREPATH__/g,JSON.stringify(myConfig.requirePath)))
        .pipe(replace(/__REQUIRESHIM__/g,JSON.stringify(myConfig.requireShim)))
        .pipe(replace(/\/\*chrome-extension/g,''))
        .pipe(replace(/chrome-extension\*\//g,''))
        .pipe(gulp.dest('chromeExtenstion/pages'));//输出目录为根目录，此时会把src下所有文件复制到根目录下
    return stream;
})
gulp.task("PublishToChromeExt",["srcPublishResourceToChromeExt","srcPublishPagesToChromeExt"]);

//发布到target用的任务
gulp.task("srcPublishResourceToTarget",function(cb){
    var stream = gulp.src(['src/**','!src/pages/**','!src/*'])
        .pipe(gulp.dest('target'));
    return stream;
});
gulp.task("srcPublishPagesToTarget",function(cb){
    var stream = gulp.src(['src/pages/**'])
        .pipe(replace(/__VERSION__/g, myConfig.version))//
        .pipe(replace(/__AUTHOR__/g,myConfig.author))
        .pipe(replace(/__REQUIREPATH__/g,JSON.stringify(myConfig.requirePath)))
        .pipe(replace(/__REQUIRESHIM__/g,JSON.stringify(myConfig.requireShim)))
        .pipe(gulp.dest('target/pages'));
    return stream;
});
gulp.task("PublishToTarget",["srcPublishResourceToTarget","srcPublishPagesToTarget"]);


gulp.task("watch",function(){ //监控变化后才执行发布,watch执行后会进入监控模式，不会像普通任务一样立马就返回结果。
    gulp.watch("src/pages/**",["srcPublishPagesToTarget"]); //☆监控开启后，任务就加载到内存了，如果修改了gulpfile.js文件,要重启监听才能生效。
});
//默认任务
gulp.task('default',['watch']);//Task 'default' is not in your gulpfile 默认任务名称“default”
//gulp.task(name[, deps], fn) 定义任务  name：任务名称 deps：依赖任务名称 fn：回调函数
//gulp.src(globs[, options]) 执行任务处理的文件  globs：处理的文件路径(字符串或者字符串数组)
//gulp.dest(path[, options]) 处理完后文件生成路径