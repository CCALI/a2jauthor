/* CAJA Utils 
	02/20/2012
*/
 
var AJAXLoader="<span class='loader'>&nbsp;</span>'";


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

function makestr(s)
{	// lazy test to make sure s is a string or blank, not "null" or "undefined"
	if (s===null || typeof s === "undefined" ) return "";
	else return s;
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



function isNumber(n)
{//http://stackoverflow.com/questions/18082/validate-numbers-in-javascript-isnumeric
  return !isNaN(parseFloat(n)) && isFinite(n);
}
function sortingNatural(str)
{	// 12/11/07 Return natural sorting order
	// e.g., Q20 and Q100 produce  Q00020 and Q00100 which sort correctly 
	var newStr=""
	,  i
	, lastWasDigit=false
	, numStr=""
	, ch;
	
	str = "#"+str+"#";//hack to force name ending in digits to parse correctly.
	for (i=0;i<str.length;i++)
	{
		ch=str.charAt(i);
		if  ((ch>='0' && ch<='9'))
		{
			if (lastWasDigit)
				numStr += ch;
			else
			{
				numStr = ch;
				lastWasDigit=true;
			}
		}
		else
		{
			if (lastWasDigit)
			{
				if (numStr.length<6)
					newStr += '000000'.substr(numStr.length)+numStr;
				lastWasDigit=false;
			}
			newStr += ch;
		}
	}

	return newStr.toUpperCase();
}
function trace(msg)
{
	if (typeof msg=="object") msg=props(msg);
	if (typeof console!="undefined") console.log(msg);
	$('#tracer').prepend('<li>'+msg+"</li>");
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
	body = '<div style="margin-left:1em">'//+d+'em">';
	if (typeof o === 'object')
	{
		body +=name+':{\n';
		for (var p in o)
		{
			if (parseInt(p)>= 0) // array assumed
				body += propsJSON_(p,d+1,o[p]);
			else
				body += propsJSON_(p,d+1,o[p]); //recurse
		}
		body += "\n}\n";
	}
	else
	if (typeof o === 'function')
		body = '';
	else
	if (typeof o === 'string')
		body += name + ':"' + htmlEscape(o.substr(0,100) )+ '"\n';
	else
		body += name+':'+o+'\n';
	body += "</div>";
	return body;
}

//http://stackoverflow.com/questions/1219860/javascript-jquery-html-encoding
function htmlEscape(str) {
    return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
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
	if (typeof o === 'object')
	{
		var attr="";
		var body="";
		for (var p in o)
		{
			if (parseInt(p)>= 0) // array assumed
				body += js2xml('',o[p]);  //recurse
			else
			if (p.substr(0,1)=='_') // embed as attribute
				attr += " " + p.substr(1)+"=\""+htmlEscape(o[p])+"\"";
			else
			if (p.substr(0,4)=='XML_') // treat as raw XML
				body += trim(p.substr(4),'',o[p]);//o[p];
			else
				body += js2xml(p,o[p]); //recurse
		}
		if (name=='')
			return body;
		else
			return trim(name,attr,body); 
	}
	else
		return trim(name,'',htmlEscape(o));
}
