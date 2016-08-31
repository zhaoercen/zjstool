require(["jquery", "ztool", "avalon", "qrcode", "avalon.store", "bootstrap"], function ($, ztool, avalon, qrcode) { //这里才会加载所需的js
        var _vmZ = avalon.define({
            $id: "replaceTool",
            explain: {//说明按钮，已隐藏
                show: false,
                btnText: "说明",
                title: "功能说明",
                contain: "测试popover"
            },
            visibleCol2Val: false,
            visibleCol2: {
                set: function (val) {
                    avalon.store.set("visibleCol2Val", val);
                    this.visibleCol2Val = val;
                },
                get: function () {
                    this.visibleCol2Val = this.visibleCol2 = avalon.store.get("visibleCol2Val") || false;
                    return this.visibleCol2Val;
                }
            },
            showDoubleColText: {
                set: function (val) {
                },
                get: function () {
                    return this.visibleCol2 == true ? "禁用多列输入" : "启用多列输入";
                }
            },
            col1TextVal: "",
            col1Text: {
                set: function (val) {
                    avalon.store.set("col1TextVal", val);
                    this.col1TextVal = val;
                },
                get: function () {
                    this.col1Text = avalon.store.get("col1TextVal") || "";
                    return this.col1TextVal;
                }
            },
            col2TextVal: "",
            col2Text: {
                set: function (val) {
                    avalon.store.set("col2TextVal", val);
                    this.col2TextVal = val;
                },
                get: function () {
                    this.col2Text = avalon.store.get("col2TextVal") || "";
                    return this.col2TextVal;
                }
            },
            ruleTextVal: "",
            ruleText: {
                set: function (val) {
                    avalon.store.set("ruleTextVal", val);
                    this.ruleTextVal = val;
                },
                get: function () {
                    this.ruleText = avalon.store.get("ruleTextVal") || "";
                    return this.ruleTextVal;
                }
            },
            resultText: "",
            saveRuleTitle: "",
            savedRuleArr: [],//[{ruleTitle:"",ruleText:""}]

            /******** 上面是value，下面是function *****************************/
            initControl: function () {
                $('[data-toggle="popover"]').popover();//弹出框需要手工初始化
                $('[data-toggle="tooltip"]').tooltip();

                document.onkeydown = _vmZ.initKeyupEvent;
                _vmZ.initPopoverListener();//保存弹出框中的保存按钮初始化
                _vmZ.$watch("col1Text", _vmZ.textChange);
                _vmZ.$watch("col2Text", _vmZ.textChange);
                _vmZ.$watch("ruleText", _vmZ.textChange);

                this.savedRuleArr = avalon.store.get("savedRuleArrVal") ||[];
                _vmZ.textChange();
            },
            initKeyupEvent: function (event) {//快捷键监控
                var areaType = "";
                if (event.ctrlKey) {
                    areaType = "a";
                } else if (event.altKey) {
                    areaType = "b";
                }
                if (areaType != "") {
                    if (window.event.keyCode == 49) {
                        _vmZ.ruleInsert(areaType + 's');
                    }
                    else if (window.event.keyCode == 50) {
                        _vmZ.ruleInsert(areaType + 'c');
                    }
                    else if (window.event.keyCode == 51) {
                        _vmZ.ruleInsert(areaType + 'd');
                    }
                    else if (window.event.keyCode == 52) {
                        _vmZ.ruleInsert(areaType + 'A');
                    }
                    else if (window.event.keyCode == 53) {
                        _vmZ.ruleInsert(areaType + 'a');
                    } else {
                        return true;//不能阻塞其它快捷键，比如ctr+c,v
                    }
                    return false;
                }
            },
            btnClick: function (p, event) {
                _vmZ.ruleInsert(p);
            },
            ruleInsert: function (rule) {
                var opText = "#{" + rule + "}";
                var selectionStart = $("#txt_rule")[0].selectionStart;//光标起始位置
                var selectionEnd = $("#txt_rule")[0].selectionEnd;//光标结束位置

                //没有选择的时候，在光标位插入。选择的时候，替换掉选择位置的字符
                //这里不需要区分是插入还是替换
                //ruleText.substring(selectionStart,selectionEnd) 所选择的字符串
                //等价于 ruleText.substr(selectionStart,selectionEnd-selectionStart)
                var newRuleText = "";
                newRuleText += _vmZ.ruleText.substring(0, selectionStart);
                newRuleText += opText;
                newRuleText += _vmZ.ruleText.substring(selectionEnd);
                _vmZ.ruleText = newRuleText;
                $("#txt_rule")[0].selectionEnd = $("#txt_rule")[0].selectionStart = selectionStart + opText.length;
            },
            showDoubleCol: function (e) {
                var val = _vmZ.visibleCol2 = !_vmZ.visibleCol2;
                _vmZ.col2Text = "";
            },
            textChange: function () {
                _vmZ.resultText = ztool.replaceByRule(_vmZ.ruleText, _vmZ.col1Text, _vmZ.col2Text);
            },
            //保存常用规则功能
            initPopoverListener:function(){//需要加入监控才能生效，avalon不能绑定带点的事件
                $('#btn_saveRule').on("show.bs.popover",function(e){
                    return _vmZ.onclickSaveRule(e);
                });
            },
            addRule: function (rule) {
                var oldRuleArr = _vmZ.savedRuleArr;
                if (!rule.ruleTitle || !rule.ruleText) {
                    return {result: -1, message: "规则名和规则内容不能为空"};
                }
                if (oldRuleArr && oldRuleArr.length > 0) {
                    for (var i = 0; i < oldRuleArr.length; i++) {
                        if (oldRuleArr[i].ruleTitle == rule.ruleTitle) {
                            return {result: -1, message: "已经存在同名规则：" + rule.ruleTitle};
                        }
                    }
                }
                oldRuleArr.push(rule);
                _vmZ.savedRuleArr = oldRuleArr;
                avalon.store.set("savedRuleArrVal", _vmZ.savedRuleArr);
                return {result: 1, message: "保存新规则成功"};
            },
            removeRule: function (rule) {
                var oldRuleArr = _vmZ.savedRuleArr;
                for (var i = 0; i < oldRuleArr.length; i++) {
                    if (oldRuleArr[i].ruleTitle == rule.ruleTitle) {
                        oldRuleArr.removeAt(i);
                        _vmZ.savedRuleArr = oldRuleArr;
                        avalon.store.set("savedRuleArrVal", _vmZ.savedRuleArr);
                        return {result: 1, message: "已经删除规则" + rule.ruleTitle};
                    }
                }
                return {result: -1, message: "没有找到规则" + rule.ruleTitle};
            },
            onclickSaveAs: function(e){
                _vmZ.saveRuleTitle = "";
            },
            onclickSaveRule: function (e) {
                var reulst = _vmZ.addRule({"ruleTitle": _vmZ.saveRuleTitle, "ruleText": _vmZ.ruleText});
                if (reulst.result == 1) {
                    $('#myModal').modal('toggle');
                    return false;//不弹出错误提示
                }else{
                    $(e.target).attr('data-content',reulst.message);
                    return true;//弹出错误提示
                }
            },
            onclickDelRule:function(ruleTitle){
                var reulst = _vmZ.removeRule({"ruleTitle": ruleTitle});
            },
            onclickDelAllRule: function () {
                _vmZ.savedRuleArr = [];
                avalon.store.set("savedRuleArrVal", _vmZ.savedRuleArr);
            },
            onclickUseRule: function (ruleTitle) {
                for (var i = 0; i < _vmZ.savedRuleArr.size(); i++) {
                    if (_vmZ.savedRuleArr[i].ruleTitle == ruleTitle) {
                        _vmZ.ruleText = _vmZ.savedRuleArr[i].ruleText;
                    }
                }
            }
        });
        avalon.scan();
        _vmZ.initControl();
    }
)


