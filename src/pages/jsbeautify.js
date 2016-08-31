/**
 * Created by Z on 2016-4-10.
 */
require(["jquery", "avalon","js_beautify",  "avalon.store","bootstrap"], function ($, avalon,js_beautify){
    var _vmjsbeautify = avalon.define({
        $id: "jsbeautifytool",
        jsunbeautifytextVal:"",
        jsunbeautifytext:{
            set:function(val){
                avalon.store.set("jsunbeautifytextVal",val);
                this.jsunbeautifytextVal = val;
            },
            get:function(){
                this.jsunbeautifytextVal = avalon.store.get("jsunbeautifytextVal")||"";
                return this.jsunbeautifytextVal;
            }
        },
        jsbeautifytext:"",
        //-------------------------------------------
        initControl:function(){
            _vmjsbeautify.$watch("jsunbeautifytext", _vmjsbeautify.textChange);
            _vmjsbeautify.textChange();//第一次加载需要手工执行
        },
        textChange:function(){
            _vmjsbeautify.jsbeautifytext = js_beautify(_vmjsbeautify.jsunbeautifytext);
        }
    });

    avalon.scan();
    _vmjsbeautify.initControl();
})