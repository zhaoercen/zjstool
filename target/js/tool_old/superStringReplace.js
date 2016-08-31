//UUID
var uuidObj = {
	uuidUpper : "N",
	uuidSplit : "Y",
	setDiv : function(divId) {
		zjt.logtool.setDiv(divId);
	},
	getUUID : function(obj) {
		debugger;
		if (obj == $("#getUUID")[0]) {
			var uuid = zjt.util.getUUID();//默认是小写带分割线
			if (this.uuidUpper == "Y") {
				uuid = uuid.toUpperCase();
			}
			if (this.uuidSplit == "N") {
				uuid = uuid.replace(new RegExp("-","g"),"");
			}
			zjt.logtool.log(uuid + "<br/>");
		}
	},
	clearUUIDLog : function(obj) {
		if (obj == $("#clearUUIDLog")[0]) {
			zjt.logtool.clear();
		}
	}
};


