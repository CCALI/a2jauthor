// JavaScript Document
// 10/25/11 Script handler for Discovery Games and other script support.
// Script variables tracked with vars object
// Support for %% or <> style text macros
// 05/15/2012 
// Dependencies: jqhashtable-2.1.js, jquery.numberformatter-1.2.1.jsmin.js


var CAJAScripter = (function(){

var functions={};
		
function CAJAScripter(){
	trace("hi");
}
 
//addFunctionLow('concat',-1,function(args){return args.join(", ");});


/*
	{	// Date format expected: m/dd/yyyy. 
		ch='';start++;index++;
		while (ch!='#' && ch!=EOL)
			ch=expression.substr(index++,1);
		token=expression.substr(start,index-start-1);		
		//var d=token.split("/");
		//d=Date.UTC(d[2],d[0],d[1])/1000/60/60/24;
		var d=Date.parse(token)/1000/60/60/24;
		//trace(d);
		return {str:d,type:'num'}
	}
*/
 
/*
function addJavascript(jsname,pos) {
var th = document.getElementsByTagName(pos)[0];
var s = document.createElement('script');
s.setAttribute('type','text/javascript');
s.setAttribute('src',jsname);
th.appendChild(s);
} 
*/

var evalHTML_=function(html)
{	// Parse for %% declarations.
	var parts=html.split("%%");
	if (parts.length > 0)
	{
		html="";
		for (var p=0;p<parts.length;p+=2)
		{
			html += parts[p];
			if (p<parts.length-1)
			{
				html += evalBlock(parts[p+1]);
			}
		}
	}
	return html;
} 

return {
	 evalExpression : function (expr)				{return evalExpression_(expr);	}
	,evalHTML : function (html)						{return evalHTML_(html);	}
	,addFunction : function (name,numArgs,fnc)	{addFunctionLow(name,numArgs,fnc);}
	,var2valFunction : function(fnc) 				{var2val=fnc;}
	,setVarFunction : function(fnc) 					{setVar=fnc;}
	}
}

// Local instantiation

function HTMLReplaceMacros(html)
{	// replace macros in lesson's HTML text.
	return CALIScriptEvalHTML(html);
}


script.ep.var2valFunction(function(varName)
{
	var varName_i=varName.toLowerCase();
	if (script.vars[varName_i]==undefined)
		return 0;
	else
		return script.vars[varName_i].val;
});
var tUpdateVar;
script.ep.setVarFunction(function(varName,varVal)
{
	var varName_i=varName.toLowerCase();
	script.vars[varName_i]={name:varName,val:varVal};
	traceScript('<span class="Script Var">'+varName+'</span>='+'<span class="Script Val">'+varVal+'</span>');
	clearTimeout(tUpdateVar);tUpdateVar=setTimeout(updateVarFnc,1000);
});
updateVarFnc=function()
{
	clearTimeout(tUpdateVar);
	var rows="";
	for (var v in script.vars)
		rows+="<tr><td class='Script Var'>"+script.vars[v].name+"</td><td class='Script Val'>"+script.vars[v].val+"</td></tr>";
	$('#ScriptVar>table>tbody').children( 'tr:not(:first)' ).remove();
	$('#ScriptVar>table>tbody tr:last').after(rows);
}

function CALIScriptEvalHTML(html)
{
	html = script.ep.evalHTML(html);
	return html;
}

}

