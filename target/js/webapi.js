/**
 * Created by Z on 2016-3-18.
 */
requirejs.config({//config仅仅是定义依赖关系
    baseUrl: '../js', //绝对路径： /应用名称/。。。   相对路径：xx/
    paths: {
        "jquery": "jquery/jquery-2.0.2"//不能用别的名称，只能用jquery
    }
});

define(["jquery"], function ($) { //这里才会加载所需的js
    var webapi = {
        //*** 百度api ****************
        apikey:"cc8fafb725219ebf8685db1bee47d925",//百度apikey，用于百度api服务

        //*** 百度api-end ****************
        /*
         *
         * =================分割线====================
         *
         **/
        //*** 聚合数据api ****************
        openId:" JHee1a399b3b57986febff398f4348287e",//聚合数据api
        getCurrencies:function(key,successF){
            var _url = "http://op.juhe.cn/onebox/exchange/query";
            _url += "key="+ this.openId;
            $.ajax(
                {
                    type : "get",
                    url : _url,
                    dataType : "jsonp",
                    jsonp: 'jsoncallback',
                   // contentType: "application/json; charset=utf-8",
                    success : function (data){
                        debugger;
                        successF&&successF(data);
                        console.info(data);
                    }
                }
            );
        }
        //*** 聚合数据api-end ****************
    }//webapi

    return webapi;
})
