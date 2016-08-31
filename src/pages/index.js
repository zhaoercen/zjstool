/**
 * Created by Z on 2015-11-7.
 */
requirejs.config({//config仅仅是定义依赖关系
    baseUrl: '../js',//这其实是一个单页面应用，子页面里面的路径其实基于本页面
    paths: __REQUIREPATH__,
    shim: __REQUIRESHIM__
});

require(["jquery", "ztool", "avalon", "qrcode","avalon.mmRouter","bootstrap"], function ($, ztool, avalon, qrcode) { //这里才会加载所需的js
        /*chrome-extension
         if(location.hash == "" || location.hash == "/"){
         window.open("chrome-extension://"+location.host+"/pages/index.html#!/ztools");
         }
         chrome-extension*/


        var pageUrl={
            replaceToolUrl:"ztools.html"
        };
        _vmIndex = avalon.define({
            $id:"indexBodyC",
            iframeUrl:"ztools.html",
        });

        function callback(){
            if(this.path==="/" || this.path==="/index"){
                _vmIndex.iframeUrl="ztools.html";
            }else {
                var path_tail = this.path.replace(/\//, "");
                _vmIndex.iframeUrl = "" + path_tail + ".html";  //动态修改iframeUrl属性值
            }
        }

        avalon.router.get("/*path", callback); //劫持url hash并触发回调
        avalon.history.start(); //历史记录堆栈管理
        avalon.scan();

        $('ul.nav > li').click(function (e) {//监控导航页点击事件，修改active
            e.preventDefault();
            $('ul.nav > li').removeClass('active');
            $(this).addClass('active');
            location.href = $("a",e.currentTarget)[0].href;//跳转页面
        });
    }
)
