/*	CALI Author 5 / A2J Author 5 (CAJA)
	All Contents Copyright The Center for Computer-Assisted Legal Instruction

	CAJA Utils 
	Required by Author and Viewers
	02/20/2012
*/

var AJAXLoader="<span class='loader'>&nbsp;</span>'";

function traceTag(cname,chtml){
	if (cname=='val' && chtml === "")
		chtml = "<i>blank</i>";
	return "<span class="+cname+">"+chtml+"</span>";
}
function propCount(obj)
{
	var cnt=0;
	for (var p in obj) cnt++;
	return cnt;
}


function trace( )
{
	var msg="";
	for (var a=0;a<arguments.length;a++)
	{
		var arg = arguments[a];
		if (typeof arg==="object")
			msg += arg;//props(arg);
		else
		if (typeof arg !=="function")
			msg += arg;
		if (typeof console!="undefined") console.log(arg);
	}
}

function cloneObject(obj) {
	var clone = {};
	for(var i in obj) {
		if(typeof(obj[i])=="object")
			 clone[i] = cloneObject(obj[i]);
		else
			 clone[i] = obj[i];
	}
	return clone;
}
$.fn.showit = function(yes) { // show/hide via class rather than .toggle to avoid issues with TR
    return $(this).removeClass('hidden').addClass(yes ? '' : 'hidden');
}
//http://stackoverflow.com/questions/1219860/javascript-jquery-html-encoding
function htmlEscape(str) {
    return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            //.replace(/'/g, '&apos;')//'&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
}
String.prototype.asHTML=function(){
	return htmlEscape(this);
}
String.prototype.asATTR=function(){
	return this.replace(/'/g, "&#39;");
}

function makestr(s)
{	// lazy test to make sure s is a string or blank, not "null" or "undefined"
	if (s===null || typeof s === "undefined" ) return "";
	else return s;
}
function TextToBool(b,defaultb)
{
	if (b===null || typeof b === "undefined" )
		return defaultb;
	else
		return (b==1) || (String(b).toLowerCase()=="true")
}


function aie(obj,attr,val)
{	// set obj's attr to val, only if value exists 
	if (val===null) return; 
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



function pickHilite(html,term)
{	// find term in html text and hilite it
	return html.replace(
		new RegExp(
			"(?![^&;]+;)(?!<[^<>]*)(" +
			$.ui.autocomplete.escapeRegex(term) +
			")(?![^<>]*>)(?![^&;]+;)", "gi"
		), "<span class=hilite>$1</span>");
}



function isNumber(n)
{//http://stackoverflow.com/questions/18082/validate-numbers-in-javascript-isnumeric
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function sortingNaturalCompare(a, b) {//http://my.opera.com/GreyWyvern/blog/show.dml/1671288
  function chunkify(t) {
    var tz = [], x = 0, y = -1, n = 0, i, j;

    while (i = (j = t.charAt(x++)).charCodeAt(0)) {
      var m = (i == 46 || (i >=48 && i <= 57));
      if (m !== n) {
        tz[++y] = "";
        n = m;
      }
      tz[y] += j;
    }
    return tz;
  }

  var aa = chunkify(a);
  var bb = chunkify(b);

  for (x = 0; aa[x] && bb[x]; x++) {
    if (aa[x] !== bb[x]) {
      var c = Number(aa[x]), d = Number(bb[x]);
      if (c == aa[x] && d == bb[x]) {
        return c - d;
      } else return (aa[x] > bb[x]) ? 1 : -1;
    }
  }
  return aa.length - bb.length;
}


//http://stackoverflow.com/questions/5796718/html-entity-decode
var decodeEntities = (function() {
  // this prevents any overhead from creating the object each time
  var element = document.createElement('div');

  function decodeHTMLEntities (str) {
    if(str && typeof str === 'string') {
      // strip script/html tags
      str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
      str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
      element.innerHTML = str;
      str = element.textContent;
      element.textContent = '';
    }

    return str;
  }

  return decodeHTMLEntities;
})();

var JS2XML_SKIP={skip:true};

function js2xml(name,o)
{	// 10/17/2012 Sam's simple JSON to XML. 
	// If object property name starts with '_' it becomes an attribute.
	// If object property name starts with 'XML_' it becomes a node that's NOT encoded (PCDATA like)
	function trim(name,attr,body){
		if (body=='')
			if (attr=='')
				return '';
			else
				return '<'+name.toUpperCase()+attr+'/>';
		else
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
*/		for (var p in o)
		{
			if (parseInt(p)>= 0) // array assumed
				body += js2xml('',o[p]);  //recurse
			else
			if (p.substr(0,1)=='_') // embed as attribute if not blank string
			{
				if (o[p]!=="" && o[p]!=JS2XML_SKIP)
					attr += " " + p.substr(1)+"=\""+clean(o[p])+"\"";
			}
			else
			if (p.substr(0,4)=='XML_') // treat as raw XML
				body += trim(p.substr(4),'',o[p]);
			//else
			//if (typeof o[p]==="string")
			//	body += trim(p,'',o[p]);//o[p];
			else
				body += js2xml(p,o[p]); //recurse
		}
		if (name!='')
			body = trim(name,attr,body); 
	}
	else
		body = trim(name,'',clean(o));
	return body.replace(/&nbsp;/g,'&#160;');
}


function props(o)
{
	var t="", p;
	for (p in o)
		if (typeof o[p]=="object")
			t+=p+"={"+props(o[p])+"}, ";
		else
		if (typeof o[p]=="array")
			t+=p+"=["+props(o[p])+"], ";
		else
		if (typeof o[p] != 'function')
			t+=p+"=" +  o[p] +", ";
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
	body = '<div class="json indent">'//+d+'em">';
	if (typeof o === 'object')
	{
		body += name + ":";
		if (o==null)
			body += "null\n";
		else
		{
			var elts="";
			for (var p in o)
			{
				if (parseInt(p)>= 0) // array assumed
					elts += propsJSON_(p,d+1,o[p]);
				else
					elts += propsJSON_(p,d+1,o[p]); //recurse
			}
			if (elts=="")
				body += "{}\n";
			else
				body += "{\n"+elts+"}\n";
		}
	}
	else
	if (typeof o === 'function')
		body = '';
	else
	if (typeof o === 'string')
	{
		var TRIM = 1024;
		var t=htmlEscape(o );
		if (t.length<TRIM)
			body += name + ':"' + t + '"\n';
		else
			body += name + ':"' + t.substr(0,TRIM) + '"...\n';

	}
	else
		body += name+':'+o+'\n';
	body += "</div>";
	return body;
}

/* */
