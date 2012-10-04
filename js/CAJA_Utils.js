/* CAJA Utils 
	02/20/2012
*/
 
var AJAXLoader="<span class='loader'>   </span>'";

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



