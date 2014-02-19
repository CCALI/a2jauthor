/*******************************************************************************
	A2J Author 5 * Justice * 正义 * công lý * правосудие
	All Contents Copyright The Center for Computer-Assisted Legal Instruction
	
	10/2013
	JavaScript functions with JSLint complaints.
	Companion to A2J_Shared.js.
******************************************************************************/


var REG={
	LOGIC_SET: /set\s+(.+)/i
	,LOGIC_SETTO: /set\s+([\w#]+|\[.+\])\s*?(=|TO)\s?(.+)/i
	,LOGIC_GOTO: /^goto\s+\"(.+)\"/i
	,LOGIC_GOTO2: /^goto\s+(.+)/i
	,LOGIC_PRINT: /print\s+(.+)/i
	,LOGIC_ELSEIF:  /^else if\s+(.+)/i
	,LOGIC_IF: /^if\s+(.+)/i
	,LOGIC_LE: /\<\=\=/gi
	,LOGIC_NE: /\<\>/gi
	,LINK_POP:  /\"POPUP:\/\/(([^\"])+)\"/ig
	,LINK_POP2: /\"POPUP:\/\/(([^\"])+)\"/i
};

String.prototype.simpleHash=function()
{	// Return a simple hash of string. MD5 or other preferred but will do in a pinch.
	// 
	var str=String(this);
	//http://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery
	return str.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a;},0);
}

/*jslint eqeq: false  */
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
  var x;
  for (x = 0; aa[x] && bb[x]; x++) {
    if (aa[x] !== bb[x]) {
      var c = Number(aa[x]), d = Number(bb[x]);
      if (c == aa[x] && d == bb[x]) {
         return c - d;
		} else{
			return (aa[x] > bb[x]) ? 1 : -1;
		}
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
/* */
