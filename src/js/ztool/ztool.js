/**
 * Created by Z on 2015-11-9.
 */

(function (window, undefined) {
    var Ztool = {
        /* -------  字符串转换 -----------------------  */
        swcMode: [{mode: "A", alias: ["A"], description: "全部大写"},
            {mode: "a", alias: ["a"], description: "全部小写"},
            {mode: "aBToA_B", alias: ["aBToA_B", "c"], description: "驼峰转大写下划线 aBcD -> A_BC_D"},
            //{mode:"c",description:"#{aBToA_B}的简写"},
            {mode: "A_BToaB", alias: ["A_BToaB", "d"], description: "转驼峰 A_BC_D -> aBcD"},
            //{mode:"d",description:"#{A_BToaB}的简写"},
            {mode: "source", alias: ["source", "s"], description: "使用原值"}//,
            //{mode:"s",description:"#{source}的简写"}
        ],
        swcStr: function (source, mode) {
            switch (mode) {
                case "A":
                    return this.swcA(source);
                case "a":
                    return this.swca(source);
                case "aBToA_B":
                case "c":
                    return this.swcaBToA_B(source);
                case "A_BToaB":
                case "d":
                    return this.swcA_BToaB(source);
                case "source":
                case "s":
                    return source;
                default :
                    return source;
            }
        },
        swcA: function (str) {
            return str.toUpperCase();
        },
        swca: function (str) {
            return str.toLowerCase();
        },
        swcaBToA_B: function (str) {
            var newStr = str;
            newStr = newStr.replace(new RegExp("[A-Z]", "g"), function (m) {
                return "_" + m;
            });
            return newStr.toUpperCase();
        },
        swcA_BToaB: function (str) {
            var newStr = str.toLowerCase();
            newStr = newStr.replace(new RegExp("_[a-zA-Z]", "g"), function (m) {
                return m.replace("_", "").toUpperCase();
            });
            return newStr;
        },
        trim: function (str, charArr) {
            var r = str;
            r = zjt.strtool.ltrim(r, charArr);
            r = zjt.strtool.rtrim(r, charArr);
            return r;
        },
        ltrim: function (str, charArr) {
            if (typeof str != "string" || str.length <= 0) {
                return "";
            }
            if (typeof charArr != "string" || charArr.length <= 0) {
                charArr = ' ';
            }
            var arr = str.split("");
            var i = 0;
            while (i < str.length) {
                if (charArr.indexOf(arr[i]) != -1) {
                    i++;
                } else {
                    break;
                }
            }
            return str.substr(i);//从i之后所有的字符
        },
        rtrim: function (str, charArr) {
            if (typeof str != "string" || str.length <= 0) {
                return "";
            }
            if (typeof charArr != "string" || charArr.length <= 0) {
                charArr = ' ';
            }
            var arr = str.split("");
            var i = str.length - 1;
            while (i >= 0) {
                if (charArr.indexOf(arr[i]) != -1) {
                    i--;
                } else {
                    break;
                }
            }
            return str.substring(0, i + 1);//从0开始到i+1之间的字符
        },
        lpad: function (str, padded_length, pad_string) {
            var i = 0;
            if (typeof str == "string" && typeof padded_length == "number") {
                i = padded_length - str.length;
                if (typeof pad_string != "string" || pad_string.length == 0) {
                    pad_string = " ";
                }
                while (i-- > 0) {
                    str = pad_string + str;
                }
            }
            return str;
        },
        rpad: function (str, padded_length, pad_string) {
            var i = 0;
            if (typeof str == "string" && typeof padded_length == "number") {
                i = padded_length - str.length;
                if (typeof pad_string != "string" || pad_string.length == 0) {
                    pad_string = " ";
                }
                while (i-- > 0) {
                    str += pad_string;
                }
            }
            return str;
        },
        replaceByRule:function (rule,text1,text2){
            var addFirstArr = text1.split("\n");
            var addSecondArr = text2.split("\n");
            var _resultText = "";

            var flag = true;
            var i = 0;
            while (flag) {
                var aN = "",
                    bN = "",
                    rN = "";

                if (i >= addFirstArr.length && i >= addSecondArr.length) {
                    break;
                }
                if (i < addFirstArr.length) {
                    aN = addFirstArr[i];
                }
                if (i < addSecondArr.length) {
                    bN = addSecondArr[i];
                }
                i++;
                if (rule != "") {//替换规则
                    rN = rule.replace(new RegExp("#\{a\}", "g"), aN);
                    rN = rN.replace(new RegExp("#\{as\}", "g"), this.swcStr(aN, "s"));//a大写
                    rN = rN.replace(new RegExp("#\{aA\}", "g"), this.swcStr(aN, "A"));//a大写
                    rN = rN.replace(new RegExp("#\{aa\}", "g"), this.swcStr(aN, "a")); //a小写
                    rN = rN.replace(new RegExp("#\{ac\}", "g"), this.swcStr(aN, "c"));//a反驼峰
                    rN = rN.replace(new RegExp("#\{ad\}", "g"), this.swcStr(aN, "d"));//a驼峰

                    rN = rN.replace(new RegExp("#\{b\}", "g"), bN);
                    rN = rN.replace(new RegExp("#\{bs\}", "g"), this.swcStr(bN, "s"));//a大写
                    rN = rN.replace(new RegExp("#\{bA\}", "g"), this.swcStr(bN, "A"));//a大写
                    rN = rN.replace(new RegExp("#\{ba\}", "g"), this.swcStr(bN, "a")); //a小写
                    rN = rN.replace(new RegExp("#\{bc\}", "g"), this.swcStr(bN, "c"));//a反驼峰
                    rN = rN.replace(new RegExp("#\{bd\}", "g"), this.swcStr(bN, "d"));//a驼峰
                }
                _resultText += rN + "\n";
            }
            return _resultText;
        }
        /* -----字符串转换 END ------------------  */



    };

    if (typeof module === "object" && module && typeof module.exports === "object") {
        module.exports = Ztool;
    }
    else {
        if (typeof define === "function" && define.amd) {
            define(function () {
                return Ztool;//通过require定义模块
            });
        }
    };

    if ( typeof window === "object" && typeof window.document === "object" ) {
        window.Ztool = Ztool; //暴露的全局变量
    }
})(window);

