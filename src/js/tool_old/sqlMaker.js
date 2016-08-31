$(function() {
	initKnockoutModel();//knockout绑定要放前面，不然可能会导致初始化select的值无效
	initJQueryUI();//JQueryUI控件初始化
	
});

function initJQueryUI() {
	initTooltip();
	return;//试试不用jquery的控件
	$("#varFormat").selectmenu();
	$("#sqlType").selectmenu();//使用JqueryUI的select的话，不能使用knockout绑定。JqueryUI会将select变成几个Span来显示
	$("#varType").selectmenu();
	$("button").button();
}
function initTooltip(){
	$(document).tooltip();
	$("#txt_colName").attr('title','');//要使用下面的tooltip必须有title属性！
	$("#txt_colName").tooltip({
		content: "支持用换行或空格或英文逗号隔开列名!",
		position: {my:"left+15 center",at:"right center",collision: "flipfit"}
	});
}


function initKnockoutModel(){
	ko.applyBindings(new ViewModel());//knockoutJs绑定
}	
function ViewModel(){
	this.sqlTypes = ko.observableArray(dictSqlType);//初始化select的值
	
	this.tableName = ko.observable("TABLE_T");
	this.tabAlias = ko.observable("t");
	this.columns = ko.observable("A_COL,T_ID,T_CODE");
	this.sqlType = ko.observable("update");	//insert/update/select/delete
	this.varFormat = ko.observable("hump");//hump/upper/lower
	this.varType = ko.observable("mybatis");//mybatis/nowhere
	
	this.sqlResult = ko.computed(function(){return sqlObj.getSQL(this);},this);//sqlObj.getSQL
} 

	

var sqlObj = {
	//一级入口 vm->viewModel
	getSQL:function(vm){
		var sqlResult = "";
		if(vm.sqlType() == "insert"){
			sqlResult = this.getSqlInsert(vm);
		}else if(vm.sqlType() == "update"){
			sqlResult = this.getSqlUpdate(vm);
		}else if(vm.sqlType() == "select"){
			sqlResult = this.getSqlSelect(vm);
		}else if(vm.sqlType() == "delete"){
			sqlResult = this.getSqlDelete(vm);
		}
		return sqlResult;
	},
	
	//二级服务
	getSqlInsert:function(vm){
		var valueParam = {
			columns:vm.columns(),//列名
			varType:vm.varType(),//mybatis/nowhere
			varFormat:vm.varFormat()
		};
		
		var result = "";
		result += "INSERT INTO ";
		result += vm.tableName()+" "; 
		result += "(" + sqlObj.getColumns(vm.columns()) + ")";
		//对应的VALUES
		result += sqlObj.getInsertValues(valueParam);
		
		return result;
	},
	getSqlDelete:function(vm){
		var tabAlias = zjt.strtool.trim(vm.tabAlias()) + " ";
		tabAlias = tabAlias.length>1?tabAlias:"";
		
		var deleteParam = {
			columns:vm.columns(),//列名
			varType:vm.varType(),//mybatis/nowhere
			varFormat:vm.varFormat(),
			tabAlias:tabAlias
		};
		
		var result = "";
		result += "DELETE ";
		result += vm.tableName()+" " + tabAlias; 
		result += sqlObj.getWhere(deleteParam); 
		return result;
	},
	getSqlUpdate:function(vm){
		var updateParam = {
			columns:vm.columns(),//列名
			varType:vm.varType(),//mybatis/nowhere
			varFormat:vm.varFormat(),
			tabAlias:vm.tabAlias()
		};
		var tabAlias = zjt.strtool.trim(vm.tabAlias()) + " ";
		tabAlias = tabAlias.length>1?tabAlias:"";
		
		var result = "";
		result += "UPDATE ";
		result += vm.tableName()+" " + tabAlias; 
		result += sqlObj.getUpdateSet(updateParam);
		result += sqlObj.getWhere(updateParam); 
		return result;
	},
	getSqlSelect:function(vm){
		var tabAlias = zjt.strtool.trim(vm.tabAlias()) + " ";
		tabAlias = tabAlias.length>1?tabAlias:"";
		
		var whereParam = {
			columns:vm.columns(),//列名
			varType:vm.varType(),//mybatis/nowhere
			varFormat:vm.varFormat(),
			tabAlias:tabAlias
		};
		
		var result = "";
		result += "SELECT ";
		result += sqlObj.getColumns(vm.columns(),tabAlias);
		result += " FROM ";
		result += vm.tableName()+" " + tabAlias; 
		result += sqlObj.getWhere(whereParam); 
		
		return result;
	},
	
	//三级组件
	getColumns:function(sourceColumns,tabAlias){
		var newColumns = "";
		var columnArr = new Array();
		if(sourceColumns){
			columnArr = sourceColumns.split(/\s+|\n+|,+/);
		}
		newColumns = columnArr.join();//默认用“英文,”隔开的
		newColumns = zjt.strtool.rtrim(newColumns,',');
		if(tabAlias&&tabAlias.length>0&&newColumns.length>0){
			tabAlias = zjt.strtool.trim(tabAlias);
			tabAlias = zjt.strtool.trim(tabAlias,".")+".";
			newColumns = tabAlias+newColumns;
			newColumns = newColumns.replace(/,/g,","+tabAlias);
		}
		return newColumns;
	},
	//获取insert后面的values
	getInsertValues:function(valueParam){
		var newValues = "";
		var columnArr = new Array();
		if(valueParam.columns){
			columnArr = valueParam.columns.split(/\s+|\n+|,+/);
		}
		if(columnArr.length>0){
			newValues += " VALUES (";
			for(var i=0; i<columnArr.length; i++){
				var col_i = columnArr[i];
				newValues += sqlObj.getValue(col_i, valueParam.varFormat, valueParam.varType);
				newValues += ",";
			}
			newValues = zjt.strtool.trim(newValues,',');
			newValues += ")";
		}
		return newValues;
	},
	getUpdateSet:function(updateParam){
		var newSqlSet = "SET ";
		
		var tabAlias = zjt.strtool.trim(updateParam.tabAlias)+".";//别名去掉二端空格后，加个点 t -> t.
		tabAlias = zjt.strtool.ltrim(tabAlias,".");//如果没有别名，加的点会被从左边去掉
		
		var columnArr = new Array();
		if(updateParam.columns){
			columnArr = updateParam.columns.split(/\s+|\n+|,+/);
		}
		for(var i=0; i<columnArr.length; i++){
			var col_i = columnArr[i];
			newSqlSet += tabAlias + col_i;
			newSqlSet += " = ";
			newSqlSet += sqlObj.getValue(col_i, updateParam.varFormat, updateParam.varType);
			newSqlSet += ",";
		}
		newSqlSet = zjt.strtool.trim(newSqlSet,',')+" ";
		return newSqlSet;
	},
	getWhere:function(whereParam){
		if(whereParam&&whereParam.varType=="nowhere"){return ""};
		
		var tabAlias = zjt.strtool.trim(whereParam.tabAlias)+".";//别名去掉二端空格后，加个点 t -> t.
		tabAlias = zjt.strtool.ltrim(tabAlias,".");//如果没有别名，加的点会被从左边去掉
		
		var newWhere = "WHERE 1=1";
		
		var columnArr = new Array();
		if(whereParam.columns){
			columnArr = whereParam.columns.split(/\s+|\n+|,+/);
		}
		for(var i=0; i<columnArr.length; i++){
			var col_i = columnArr[i];
			newWhere += " AND " + tabAlias + col_i;
			newWhere += " = ";
			newWhere += sqlObj.getValue(col_i, whereParam.varFormat,whereParam.varType);
		}
		return newWhere;
	},
	getValue:function(str,varFormat,varType){
		var newValue = "";
		if(varFormat == "hump"){
			newValue = zjt.strtool.swcStr(str, "A_BToaB");
		}else if(varFormat == "upper"){
			newValue = zjt.strtool.swcStr(str, "A");
		}else if(varFormat == "lower"){
			newValue = zjt.strtool.swcStr(str, "a");
		}else{
			newValue = zjt.strtool.swcStr(str, "source");
		}
		
		if(varType&&varType=="mybatis"){
			newValue = "#{"+ newValue +"}";
		}
		return newValue;
	}
};

//数据字典，这样就不用再html上写初始化的值了
var dictSqlType = [
	{dictId:'select',dictName:'SELECT语句'},
	{dictId:'insert',dictName:'INSERT语句'},
	{dictId:'update',dictName:'UPDATE语句'},
	{dictId:'delete',dictName:'DELETE语句'}
];


  
