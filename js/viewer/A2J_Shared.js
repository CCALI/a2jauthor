/*
	A2J Author 5 * Justice * justicia * 正义 * công lý * 사법 * правосудие
	All Contents Copyright The Center for Computer-Assisted Legal Instruction

	Shared GUI/IO
	Library of common functions used by author and viewer
	See more functions in A2J_SharedSus.js
	2015 - 05/2014, 12/12/2012
	
	Required by Author and Viewers

*/


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
		width: args.width ?args.width : 350,
		height:args.height?args.height : 240,
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
   if (typeof args.body==='undefined'){	args.body='An error occurred.';}
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
function pathExt(path)
{	// Return extention file type
	var p=path.lastIndexOf('.');
	if (p>=0) {
		return path.substr(p+1);
	}
	else
	{
		return '';
	}
}

function propCount(obj)
{
	var cnt = 0;
	var p;
	for (p in obj){if(1){ cnt++;}}
	return cnt;
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

// http://stackoverflow.com/questions/1219860/javascript-jquery-html-encoding
function htmlEscape(str){
    return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            //.replace(/'/g, '&apos;')//'&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
}

String.prototype.asHTML=function(){
	return htmlEscape(this);
};

String.prototype.stripHTML=function(){
	return $('<div>'+(this)+'</div>').text();
};

String.prototype.ellipsis=function(limit){
	return this.substring(0,limit)+(this.length>limit?"…":"");
};

function prettyXML(xml) {
	var html = htmlEscape(xml);
	html = html.split("&lt;A").join("<BR>&lt;A");
	//trace(html);
	return html;
}


function isBlankOrNull(v)
{	// Return true if v is blank or null.
	return (v===null || typeof v === "undefined" || v === '');
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

function isNumber(n)
{	//http://stackoverflow.com/questions/18082/validate-numbers-in-javascript-isnumeric
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function textToNumber(n)
{	// Convert to number even with commas.
	// If it's text, return 0. 
	if (n==='' || n===null || typeof n === "undefined" || n==="false")
	{
		return 0;
	}
	if (n==="true") {
		return true;
	}
	if (isNumber(n)) {
		return parseFloat(n);
	}
	n=String(n).replace(',','');//English Only
	if (isNumber(n)) {
		return parseFloat(n);
	}
	return 0;
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
function propsJSON(name,o)
{
	return propsJSON_(name,0,o);
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


function cr2P(txt)
{	//
	return txt === "" ?"":"<P>" + txt.split("\n").join("</P><P>")+"</P>";//replace("\n\n","\n")
}
function isValidDate(d)
{	// 06/02/2015 Test if JS date is valid	
	// http://stackoverflow.com/questions/1353684/detecting-an-invalid-date-date-instance-in-javascript
  if ( Object.prototype.toString.call(d) !== "[object Date]" )
    return false;
  return !isNaN(d.getTime());
}
function mdy2jsDate(MDY)
{	//  2014-06-16 Convert a2j m/d/y date to JavaScript date object for use in calculations
	if (makestr(MDY)!=='')
	{
		var parts = MDY.split("/");
		if (parts[0]>100) {
			//  6/2/2015 If first part large, likely y/m/d input instead of m/d/y
			return new Date(parts[0], parts[1]-1,parts[2]);
		}
		else{
			return new Date(parts[2], parts[0]-1,parts[1]);
		}
	}
	else
	{	// return today if we don't recognize it.
		var d=new Date();
		return new Date(d.getFullYear(),d.getMonth(),d.getDate());
	}
}
function ismdy(str)
{	//  Return true if str looks like a date (m/d/y)
	if (typeof str === "string")
	{
		var parts=str.split('/');
		if (parts.length===3) {
			return isNumber(parts[0])  && isNumber(parts[1])  && isNumber(parts[2]) ;
		}
	}
	return false;
}
function today2jsDate()
{
	return mdy2jsDate('');
}
function days2jsDate(numDays)
{	// Return JS Date based on days since 1/1/1970
	var d=new Date();
	//trace('days2jsDate',numDays);
	d.setTime(numDays*1000*60*60*24);
	return d;
}

function jsDate2mdy(d)
{	// 2014-06-16 Convert js date to A2J's M/D/Y format
	//trace('jsDate2mdy',d,(d.getMonth()+1)+'/'+d.getDate()+'/'+d.getFullYear());
	return (d.getMonth()+1)+'/'+d.getDate()+'/'+d.getFullYear();
}
function jsDate2days(d)
{	// Convert JS date into days since 1/1/1970
	//trace('jsDate2days',d);
	return ( d.getTime() /  (1000*60*60*24));
}

function mdyTodmy(MDY)
{	// 7/1/05 convert internal month/day/year format to HotDocs day/month/year format.
	var result='';
	if (makestr(MDY)!=='')
	{
		var parts = MDY.split("/");
		result =parts[1]+"/"+parts[0]+"/"+parts[2];
	}
	return result;
}

function dmyTomdy(DMY)
{	// 12/22/2014 convert HotDocs day/month/year format internal month/day/year format.
	var result='';
	if (makestr(DMY)!=='')
	{
		var parts = DMY.split("/");
		result =parts[1]+"/"+parts[0]+"/"+parts[2];
	}
	return result;
}

function scrollToElt(container,scrollTo)
{	// Scroll container so that element scrollTo is visible.
	// e.g., var container = $('div'), scrollTo = $('#row_8');
	//container.scrollTop(scrollTo.offset().top - container.offset().top + container.scrollTop());
	//trace(scrollTo.offset().top , container.offset().top , container.scrollTop());
	container.animate({
    scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop()
		});
}


function downloadTextFile(fileTextContent, fileName)
{	// 05/08/2014 Download generic text file directly from client to desktop.
	// Create an anchor, set its url to the data, use type application/octet-stream to force download rather than view in browser.
	var a =  window.document.createElement('a');
	a.href = window.URL.createObjectURL(new Blob([fileTextContent], {type: 'application/octet-stream'}));
	a.download = fileName;
	// Append anchor to body.
	document.body.appendChild(a);
	a.click();
	// Remove anchor from body
	document.body.removeChild(a);
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
			cname='valF';//any thing like False, use the False styling
		}
	}
	return "<span class="+cname+">"+htmlEscape(chtml)+"</span>";
}


/** @param {...} var_args */
function trace(var_args)
{	// Send message to brower's console. Mainly for internal developers.
	if (typeof console!=="undefined")
	{
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

function audioPlayerHTML(audiofile)
{	// 2014-06-03 Construct HTML 5 audio HTML. Currently only MP3 supported.
	return '<audio controls><source src="' +fixPath(audiofile) + '" type="audio/mpeg"></audio>';
}


function videoPlayerHTML(videoFile)
{	// 2014-06-03 Construct HTML 5 video HTML. FLV no longer supported.
	// Convert to webm? Mp4 is licensed.
	// For size restrictions, allow youtube embedding?
	videoFile = fixPath(videoFile);
	var ext=pathExt(videoFile);
	//if (ext == 'flv') {
	//	ext='webm';
	//}
	return '<video controls><source src="' + videoFile + '"  type="video/mp4"><source src="' + videoFile + '"  type="video/webm"></video>';
}

/* */

