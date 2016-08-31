/**
 * Created by Z on 2015-11-7.
 */
requirejs.config({//config仅仅是定义依赖关系
    baseUrl: '../js',
    paths: {"underscore":"underscore/underscore","jquery":"jquery/jquery-2.0.2","ztool":"ztool/ztool","qrcode":"qrcode/index","avalon":"avalon/avalon.shim","avalon.store":"avalon/store/avalon.store","avalon.mmRouter":"avalon/mmRouter/mmRouter","jqueryUi":"jquery-ui/jquery-ui-1.11.1.custom/jquery-ui","bootstrap":"bootstrap/bootstrap","bootstrapJq":"bootstrap/jquery.bootstrap.min","js_beautify":"jsbeautify/jsbeautify","webapi":"webapi"},
    shim: {"qrcode":{"exports":"AraleQRCode"},"bootstrap":{"deps":["jquery"]},"js_beautify":{"exports":"js_beautify"}}
});



require(["jquery", "ztool", "avalon", "qrcode","avalon.mmRouter","bootstrap"], function ($, ztool, avalon, qrcode) { //这里才会加载所需的js
        /*chrome-extension
         if(location.hash == "" || location.hash == "/"){
         window.open("chrome-extension://"+location.host+"/index.html#!/ztools");
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
