/*******************************************************************************
	A2J_Shared.js
	CALI Author 5 / A2J Author 5 (CAJA) công lý
	All Contents Copyright The Center for Computer-Assisted Legal Instruction
	
	Shared GUI/IO
	12/12/2012
	02/20/2012
	04/15/2013
	Required by Author and Viewers
******************************************************************************/


var html={
	version:'1'
	,row:function(cols){ return "<tr valign=top><td>"+cols.join("</td><td>")+"</td></tr>";}
	,rowheading:function(cols){ return "<thead><tr valign=top><th>"+cols.join("</th><th>")+"</th></tr></thead>";}
};


function dialogConfirmYesNo(args)
{
	var $d=$( "#dialog-confirm" );
	$d.html('<p><span class="ui-icon ui-icon-alert" style="float: left; margin: 0 7px 20px 0;"></span>'+args.message+'</p>');
	
	$d.dialog({
		title: args.title,
		resizable: false,
		width: 350,
		height:args.height!==null?args.height : 240,
		modal: true,
		buttons: {
			 Yes: function() {
				  $( this ).dialog( "close" );
				  args.Yes(args);
			 },
			 No: function() {
				  $( this ).dialog( "close" );
			 }
		}
	});
}

function dialogAlert(args)
/** @param {Object} args */
{  // Usage:
	//	args.title = dialog title,
	//	args.body = message body
	
   if (typeof args === "string"){args={body:args};	}
   if (typeof args.title==='undefined'){	args.title="Alert";}
   if (typeof args.width==='undefined'){	args.width=350;}
   if (typeof args.height==='undefined'){	args.height=250;}
   var $d=$( "#dialog-confirm" );
   $d.html('<p><span class="ui-icon ui-icon-alert" style="float: left; margin: 0 7px 20px 0;"></span>'+args.body+'</p>');
   $d.dialog({
      title: args.title,
      resizable: true,
      width: args.width,
      height:args.height,
      modal: true,
      buttons: {
          OK: function() {
              $( this ).dialog( "close" );
          }
      }
   });
}

function urlSplit(url)
{	// given a url like http://www.cali.org/intro/view.php?a=1#start,
	// return path object with {path:"http://www.cali.org/intro/", file:"view.php", params:"a=1", hash:"start" 
	var parts={path:"",file:"",params:"",hash:""};
	var p;
	url=url.replace("\\","/","gi");
	p=url.lastIndexOf('#');
	if (p>=0)
	{
		parts.hash =  url.substr(p+1);
		url=url.substr(0,p);
	}
	p=url.lastIndexOf('?');
	if (p>=0)
	{
		parts.params =  url.substr(p+1);
		url=url.substr(0,p);
	}
	p=url.lastIndexOf('/');
	if (p>=0)
	{
		parts.file =  url.substr(p+1);
		parts.path=url.substr(0,p+1);
	}
	else
	{
		parts.file=url;
	}
	return parts;
}


function propCount(obj)
{
	var cnt = 0;
	var p;
	for (p in obj){if(1){ cnt++;}}
	return cnt;
}

function traceTag(cname,chtml)
{	// cname is tag name, chtml is htmlized value
	if (cname==='val')
	{
		if (chtml === "" || chtml===null )
		{
			chtml = "blank";
			cname = 'valBlank';
		}
		else
		if (chtml == true || chtml=='true') {
			cname='valT';//any thing like True, use the True styling
		}
		else
		if (chtml == false || chtml=='false') {
			cname='valF';;//any thing like False, use the False styling
		}
	}
	return "<span class="+cname+">"+htmlEscape(chtml)+"</span>";
}

/** @param {...} var_args */
function trace(var_args)
{
	if (typeof console!=="undefined"){
		var msg="";
		var a;
		for (a=0;a<arguments.length;a++)
		{
			var arg = arguments[a];
			if (typeof arg==="object"){
				msg += arg;//props(arg);
			}
			else
			if (typeof arg !=="function"){
				msg += arg;
			}
			if (msg!=="") {
				msg += ", ";
			}
		}
		console.log(msg);
	}
}
function prettyXML(xml) {
	var html = htmlEscape(xml);
	html = html.split("&lt;A").join("<BR>&lt;A");
	//trace(html);
	return html;
}

function cloneObject(obj) {
	var clone = {};
	var i;
	for(i in obj) {
		if(typeof(obj[i])==="object"){
			 clone[i] = cloneObject(obj[i]);
		}
		else{
			 clone[i] = obj[i];
		}
	}
	return clone;
}
$.fn.showit = function(yes) { // show/hide via class rather than .toggle to avoid issues with TR
    return $(this).removeClass('hidden').addClass(yes ? '' : 'hidden');
};

String.prototype.asHTML=function(){
	return htmlEscape(this);
};
/*
String.prototype.asATTR=function(){
	return this.replace(/'/g, "&#39;");
}
*/

// http://stackoverflow.com/questions/1219860/javascript-jquery-html-encoding
function htmlEscape(str){
    return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            //.replace(/'/g, '&apos;')//'&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
}
function makestr(s)
{	// lazy test to make sure s is a string or blank, not "null" or "undefined"
	return (s===null || typeof s === "undefined" ) ? '' : s;
}
function textToBool(b, defaultb)
{
	if (b===null || typeof b === "undefined" )
	{
		return defaultb;
	}
	return (b===1) || (b==='1') || (String(b).toLowerCase()==="true");
}
function aie(obj,attr,val)
{	// set obj's attr to val, only if value exists 
	if (val===null){
		return; 
	}
	obj[attr]=val;
}

String.prototype.printf = function() {
    var formatted = this, i, regexp;
    for (i = 0; i < arguments.length; i++) {
        regexp = new RegExp('\\{'+(i+1)+'\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

function strcmp(a,b)//Number
{	// Utility function to compare two strings REGARDLESS OF CASE.
	// Return 0 if a and b are equal regardless of case.
	// Return -1 if a is less than b.
	// Return +1 if a is greater than b.
	// quick check for equality before we do uppercase function
	if (a===b){ return 0;}
	if (a===null || typeof a==='undefined') {a="";}
	if (b===null || typeof b==='undefined') {b="";}
	a=a.toUpperCase();
	b=b.toUpperCase();
	if (a<b)	{return -1;}
	if (a>b)	{return 1;}
	return 0;
}

function isNumber(n)
{//http://stackoverflow.com/questions/18082/validate-numbers-in-javascript-isnumeric
  return !isNaN(parseFloat(n)) && isFinite(n);
}


function jquote(str)
{
	return "\""+str.replace( /"/gi,"\\\"")+"\"";
}


function pickHilite(html,term)
{	// find term in html text and hilite it
	return html.replace(
		new RegExp(
			"(?![^&;]+;)(?!<[^<>]*)(" +
			$.ui.autocomplete.escapeRegex(term) +
			")(?![^<>]*>)(?![^&;]+;)", "gi"
		), "<span class=hilite>$1</span>");
}



var gJS2XML_SKIP={skip:true};

function js2xml(name,o)
{	// 10/17/2012 Simple JSON to XML. 
	// If object property name starts with '_' it becomes an attribute.
	// If object property name starts with 'XML_' it becomes a node that's NOT encoded (PCDATA like)
	function trim(name,attr,body){
		if (body===''){
			if (attr===''){
				return '';
			}
			return '<'+name.toUpperCase()+attr+'/>';
		}
		return '<'+name.toUpperCase()+attr+'>'+body+'</'+name.toUpperCase()+'>';
	}
	function clean(body)
	{
		return htmlEscape(body);
	}
	if (typeof o === 'object')
	{
		var attr="";
		var body="";
		
/*		var sorted=[];
		for (var p in o) sorted.push(p);
		sorted.sort();	
		for (var pi in sorted)
		{
			p=sorted[pi];
*/
		var p;
		for (p in o)
		{
			if (parseInt(p,10)>=0)
			{	// array assumed
				body += js2xml('',o[p]);  //recurse
			}
			else
			if (p.substr(0,1)==='_')
			{	// embed as attribute if not blank string
				if (o[p]!=="" && o[p]!==gJS2XML_SKIP)//TODO 
				{
					attr += " " + p.substr(1)+"=\""+clean(o[p])+"\"";
				}
			}
			else
			if (p.substr(0,4)==='XML_')
			{	// treat as raw XML
				body += trim(p.substr(4),'',o[p]);
			}
			//else
			//if (typeof o[p]==="string")
			//	body += trim(p,'',o[p]);//o[p];
			else{
				body += js2xml(p,o[p]); //recurse
			}
		}
		if (name!==''){
			body = trim(name,attr,body); 
		}
	}
	else{
		body = trim(name,'',clean(o));
	}
	return body.replace(/&nbsp;/g,'&#160;');
}


function props(o)
{
	var t="", p;
	for (p in o)
	{
		if (typeof o[p]==="object")
		{
			t+=p+"={"+props(o[p])+"}, ";
		}
		else
		if (typeof o[p] !== 'function'){
			t+=p+"=" +  o[p] +", ";
		}
	}
	return t;
}


function propsJSON(name,o)
{
	return propsJSON_(name,0,o);
}
function propsJSON_(name,d,o)
{	// 10/17/2012 Sam's simple JSON to XML. 
	var body = "";
	//for (var t=0;t<d;t++) body += " ";
	body = '<div class="json indent">'; //+d+'em">';
	if (typeof o === 'object')
	{
		body += name + ":";
		if (o===null)
		{
			body += "null\n";
		}
		else
		{
			var elts="";
			var p;
			for (p in o)
			{
				if (parseInt(p,10)>= 0)
				{	// array assumed
					elts += propsJSON_(p,d+1,o[p]);
				}
				else{
					elts += propsJSON_(p,d+1,o[p]); //recurse
				}
			}
			if (elts===""){
				body += "{}\n";
			}
			else{
				body += "{\n"+elts+"}\n";
			}
		}
	}
	else
	if (typeof o === 'function'){
		body = '';
	}
	else
	if (typeof o === 'string')
	{
		var TRIM = 1024;
		var t=htmlEscape(o );
		if (t.length<TRIM){
			body += name + ':"' + t + '"\n';
		}
		else{
			body += name + ':"' + t.substr(0,TRIM) + '"...\n';
		}
	}
	else{
		body += name+':'+o+'\n';
	}
	body += "</div>";
	return body;
}
/*
//http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values
var urlParams;
(window.onpopstate = function () {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
       urlParams[decode(match[1])] = decode(match[2]);
})();
*/


function cr2P(txt){
	return txt === "" ?"":"<P>" + txt.split("\n").join("</P><P>")+"</P>";//replace("\n\n","\n")
}


function mdyTodmy(DMY)
{	// 7/1/05 convert internal month/day/year format to HotDocs day/month/year format.
	var result='';
	if (makestr(DMY)!=='')
	{
		var parts = DMY.split("/");
		result =parts[1]+"/"+parts[0]+"/"+parts[2];
	}
	return result;
}


/* */
