/*	CALI Author 5 / A2J Author 5 (CAJA)
	All Contents Copyright The Center for Computer-Assisted Legal Instruction

	Logic
	Convert CAJA script into JavaScript
	Required by Author and Viewers
	06/15/2012  10/25/11  
	Phase 1: Compile the CAJA script to spot syntax errors or undefined functions or variables.
	Phase 2: If compile ie successful, execute the JS version.

	Dependencies: jqhashtable-2.1.js, jquery.numberformatter-1.2.1.jsmin.js
*/

CONST.ScriptLineBreak='<BR/>';
// Classes
function jquote(str)
{
	return "\""+str.replace( /"/gi,"\\\"")+"\"";
}

/** 
 * @constructor
 * @struct
 * @this {ParseError}
 */
function ParseError(lineNum,errType,errText)
{
	this.line = lineNum;
	this.type = errType;//missing page, unknown line, unknown function
	this.text = errText;
	return this;
}


/** 
 * @constructor
 * @struct
 * @this {TLogic}
 */
function TLogic()
{
	this.showCAJAScript =
		0 // none
		//+1 // end of js line
		//+2// before js
		//+3//tracer
		;
	this.tracerID="#tracer";
	this.userFunctions =  [];
	this.indent=0;
	this.GOTOPAGE=null;
	return this;
}


TLogic.prototype.pageExists = function(pageName)
{	// return true if page name exists (Case-sensitive check)
	return gGuide.pages[pageName]!==null;
};


TLogic.prototype.pageFindReferences = function(CAJAScript,findName,newName)
{	// Find/replace all GOTO findName with newName or just return if found.
	var result={};
	result.add=false;
	var csLines = CAJAScript.split( CONST.ScriptLineBreak );
	var l;
	for (l=0;l<csLines.length;l++)
	{
		var line=jQuery.trim(csLines[l]).split("//")[0];
		// TODO : handle Replacement of a page name inside GOTO.
		var args;
		if ((args = line.match(/^goto\s+\"(.+)\"/i))!==null)
		{	// Goto named page (not an expression). We 'return' to avoid further processing which is A2J's designed behavior.
			var pageName=args[1];
			if (pageName===findName)
			{
				result.add=true;
			}
		}
	}
	return result;
};

TLogic.prototype.evalLogicHTML = function(html)
{	// Parse for %% declarations.
	var parts=html.split("%%");
	if (parts.length > 0)
	{
		html="";
		var p;
		for (p=0;p<parts.length;p+=2)
		{
			html += parts[p];
			if (p<parts.length-1)
			{
				html += this.evalBlock(parts[p+1]);
			}
		}
	}
	return html;
};

TLogic.prototype.evalBlock = function(expressionInText)
{
	var txt = "";
	var errors=[];
	var js=this.translateCAJAtoJSExpression(expressionInText, 1, errors);
	if (errors.length === 0 )
	{
		js = "with (gLogic) { return ("+ js +")}";
		try {
			var f=(new Function( js ));
			var result = f(); // Execute the javascript code. 
			txt = result;
		}
		catch (e) {
			// Trace runtime errors
			txt='<span class="code">'+expressionInText+'</span><span class="err">' + e.message + '</span>';
		}
	}
	else
	{	// Compile time error
		txt='<span class="code">'+expressionInText+'</span><span class="err">' +'syntax error' + '</span>';
	}
	return txt;
};


TLogic.prototype.translateCAJAtoJS = function(CAJAScriptHTML)
{	// Translate CAJA script statements of multiple lines with conditionals into JS script but do NOT evaluate.
	// Returns JavaScript source code lines in .js and errors in .errors which caller may evaluate
	// TODO: needs a regex guru to optimize
/*
	_VG(x) = get value of variable x
	_VG(x,n) = get nth element of array variable x
	_VS(x,y,z) = set value of variable x#y to z
	_ED(d) = parse an mm/dd/yyyy string to date
	_CF(f,a) = call function f with argument a	

	CAJA supported syntax
	SET v TO e or SET v = e becomes SV(v,e)
	GOTO v becomes GOTO(v)
	IF exp
	END IF
*/
	var errors=[];
	var jsLines=[];
	//var csLines=CAJAScriptHTML.split(CONST.ScriptLineBreak);//CAJAScriptLines;//CAJAScript.split("\n");
	//var csLines= decodeEntities(CAJAScriptHTML.replace(CONST.ScriptLineBreak,"\n",'gi')).split("\n");
	
	var csLines= CAJAScriptHTML.split(CONST.ScriptLineBreak);
	
	var ifd=0;//if depth syntax checker
	var l;
	for (l=0;l<csLines.length;l++)
	{
		var line=jQuery.trim( decodeEntities(csLines[l])).split("//")[0];
		var args;
		var js;
		if (line!=="")
		{
			//if ((args = line.match(/set\s+([\w#]+|\[[\w|#|\s]+\])\s*?(=|TO)\s?(.+)/i))!=null)
			if ((args = line.match(/set\s+([\w#]+|\[.+\])\s*?(=|TO)\s?(.+)/i))!==null)
			{	// SET variable name TO expression
				var jj = args[1];
				jj = jj.replace(/\[|\]/gi,"");// strip variable name brackets if present
				jj = jj.split("#");// extract array index
				if (jj.length===1){
					// Set named variable to evaluated expression
					js=('_VS(' + jquote(line)+',"'+jj[0]+'",0,'+this.translateCAJAtoJSExpression(args[3], l, errors)+");");
				}
				else{
					// Set named variable array element to evaluated expression
					js=('_VS(' + jquote(line)+',"'+jj[0]+'",'+ this.translateCAJAtoJSExpression(jj[1], l, errors)+","+this.translateCAJAtoJSExpression(args[3], l, errors)+");");
				}
			}
			else
			if ((args = line.match(/^goto\s+(.+)/i))!==null)
			{	// Goto named page (not an expression). We 'return' to avoid further processing which is A2J's designed behavior.
				var pageNameExp=args[1];
				if (pageNameExp.substr(0,1)==='"' && pageNameExp.substr(-1,1)==='"')
				{	// We can statically check of a quoted page name.
					var pageName=pageNameExp.substr(1,pageNameExp.length-2);
					if (!this.pageExists(pageName))
					{
						errors.push(new ParseError(l,"",lang.scriptErrorMissingPage.printf(pageName)));
					}
				}
				js=("_GO("+jquote(line)+","+pageNameExp+");return;");
			}
			else
			if ((args = line.match(/print\s+(.+)/i))!==null)
			{
				js="";
				//script.trace("PRINT "+args[1]);
				//script.trace("RESULT "+script.evalHTML(args[1]));
			}
			else
			if ((args = line.match(/^if\s+(.+)/i))!==null)
			{	// "if expressions" becomes "if (expressions) {"
				ifd++;
				if (this.showCAJAScript===3)
				{
					line="";//don't print elese?
				}
				js=("if (_IF("+ifd+","+jquote(args[1])+","+this.translateCAJAtoJSExpression(args[1], l, errors)+")){");
				//				js=("if ("+this.translateCAJAtoJSExpression(args[1], l, errors)+"){");
			}
			else
			if ((args = line.match(/^else if\s+(.+)/i))!==null)
			{	// "else if expression" becomes "}else if (expression){"
				//does NOT affect depth. ifd++;
				if (this.showCAJAScript===3)
				{
					line="";//don't print else?
				}
				js=("} else if (_IF("+ifd+","+jquote(args[1])+","+this.translateCAJAtoJSExpression(args[1], l, errors)+")){");
			}
			else
			if ((args = line.match(/^end if/i))!==null)
			{	// "END IF" becomes "}"
				if (this.showCAJAScript===3){
					line="";//don't print elee?
				}
				ifd--;
				js=("};_ENDIF("+ifd+");");
			}
			else
			if ((args = line.match(/^else/i))!==null)
			{	// "else" becomes "}else{" 
				if (this.showCAJAScript===3){
					line="";//don't print else?
				}
				js=("}else{");
			}
			else
			if (line.match(/deltavars/i)!==null)
			{	// debugging aid
				js=("_deltaVars("+jquote(line)+");");
			}
			else
			{	// Unknown statement
				//js=("// Unhandled: "  + line);
				js="_CAJA("+ jquote(line)+ ");";
				errors.push(new ParseError(l,"",lang.scriptErrorUnhandled.printf(line)));
			}
			
			switch (this.showCAJAScript)
			{
				case 0:
					jsLines.push(js);//standard
					break;
				case 1:
					jsLines.push(js + " //CAJA: "+line); //include original source appended
					break;
				case 2:
					jsLines.push("","//CAJA: "+line,js);// include original source prepended
					break;
				default:
					jsLines.push("","",js); // line.replace( /"/x/gi,"!") +
			}
		}
	}
	if (ifd>0){
		errors.push(new ParseError(l,"",lang.scriptErrorEndMissing.printf()));
	}
	return {js : jsLines,  errors: errors};
};


TLogic.prototype.translateCAJAtoJSExpression = function(CAJAExpression, lineNum, errors)
{	// Parse a CAJA expression into a JS expression, NOT EVALUATED.
	// Compiled into JS function to check for errors.
	var js = (" " + CAJAExpression +" ");
	// Handle items not in quotes
	js = js.split('"');
	var j;
	for (j=0;j<js.length;j+=2)
	{
		var jj=js[j];
		//	A2J variables support spaces and other symbols using [] notation
		// Variable formats:
		//		Variable name with possible spaces
		//			[child name] converts to GetVar("child name")
		jj = jj.replace(/\[([\w|\s|-]+)\]/gi,"$$1(\"$1\")"); 
		
		//		Variable name with possible spaces#number (array)
		//			[child name#2] converts to GetVar("child name",2)
		jj = jj.replace(/\[([\w|\s|-]+)#([\d]+)\]/gi,"$$1(\"$1\",$2)");
		
		// Variable name with possible spaces#other variable name that evaluates to a number (array)
		//			[child name#child counter] converts to GetVar("child name",GetVar("child counter"))
		jj = jj.replace(/\[([\w|\s|-]+)#([\w|\s|-]+)\]/gi,"$$1(\"$1\",$$1(\"$2\"))");

		//	A2J dates bracketed with # like VB
		//		#12/25/2012# converts to convertDate("12/25/2012")
		var date = /#([\d|\/]+)#/gi;
		jj = jj.replace(date,"$$2(\"$1\")");
		
		js[j]=jj;
	}
	js = js.join('"').split('"');
	for (j=0;j<js.length;j+=2)
	{	// handle standalone symbols not in quotes
		jj=js[j];
		
		// A2J allows commas in numbers for clarity
		//		25,000.25 converts to 25000.25
		var vn = /(\d[\d|\,]+)/gi;
		jj = jj.replace(vn,function(s){return s.replace(",","");});
		
		//	A2J uses AND, OR and NOT while JS uses &&, || and !
		jj = jj.replace(/\band\b/gi,"&&");
		jj = jj.replace(/\bor\b/gi,"||");
		jj = jj.replace(/\bnot\b/gi,"!");
		
		//	A2J uses = and <> for comparison while JS uses == and !=
		jj = jj.replace(/\=/gi,"==");
		jj = jj.replace(/\>\=\=/gi,">=");
		jj = jj.replace(/\<\=\=/gi,"<=");
		jj = jj.replace(/\<\>/gi,"!=");
		
		// Constants 
		jj = jj.replace(/\btrue\b/gi,"1");
		jj = jj.replace(/\bfalse\b/gi,"0");
		
		// Function calls
		//		age([child birthdate]) converts to CallFunction("age",GetVar("child birthdate"))
		jj = jj.replace(/([A-Za-z_][\w]*)(\s*)(\()/gi,'$$3("$1",');

		js[j]=jj;
	}
	js = js.join('"').split('"');
	for (j=0;j<js.length;j+=2)
	{	// handle standalone variables that aren't functions
		var jj=js[j];
		// Unbracketed variables get final VV treatment
		//		first_name converts to VV("first_name")
		jj = jj.replace(/([A-Za-z_][\w]*)/gi,'$$1("$1")');

		js[j]=jj;
	}
	js = js.join('"').split('"');
	for (j=0;j<js.length;j+=2)
	{	// restore js functions
		var jj=js[j];
		jj = jj.replace(/\$1/,"_VG").replace(/\$2/,"_ED").replace(/\$3/,"_CF");
		js[j]=jj;
	}
	js = js.join('"');

	// Build function to find syntax errors
	try {
		var f=(new Function( js ));
		f=null;
	}
	catch (e) { 
		if (e.message==="missing ; before statement"){ e.message="syntax error";}
		errors.push(new ParseError(lineNum,"",e.message));
	}
	return js;
};



TLogic.prototype.addUserFunction = function(funcName,numArgs,func)
{	// add a user defined function
	this.userFunctions.push({name:funcName,numArgs:numArgs,func:func});
};


TLogic.prototype.trace = function(html)
{
	$(this.tracerID).append('<li style="text-indent:'+(this.indent)+'em">'+html+"</li>");
	//if (typeof console!=='undefined') console.log(html);
};

// Functions called by JS translation of CAJA code. 
TLogic.prototype._CAJA = function(c)
{
	this.trace( traceTag('code',c));
};
TLogic.prototype._IF = function(d,c,e)
{
	this.trace( "IF "+traceTag('val',c)+' = '+ traceTag('val',( (e) === true)) );
	this.indent=d;
	return (e===true);
};
TLogic.prototype._ENDIF = function(d)
{
	this.indent=d;
	this.trace( "ENDIF");
};
TLogic.prototype._VS = function(c,varname,varidx,val)
{
	this.trace(c);
	return gGuide.varSet(varname,varidx,val);
};
TLogic.prototype._VG=function( varname,varidx)
{
	return gGuide.varGet(varname,varidx);
};
TLogic.prototype._CF=function(f)
{ 
	//this.indent++;
	this.trace("Call function "+f); 
	//this.indent--;
	return 0;
};
TLogic.prototype._ED=function(dstr)
{
	// Date format expected: m/dd/yyyy. 
	// Converted to unix seconds
	return Date.parse(dstr);
};
TLogic.prototype._GO = function(c,pageName)
{
	this.GOTOPAGE=pageName;
	this.trace(c);
	//this.trace("Going to page "+traceTag('page',this.GOTOPAGE));
};
TLogic.prototype._deltaVars = function()
{
};


TLogic.prototype.executeScript = function(CAJAScriptHTML)
{
	// Execute lines of CAJA script. Syntax/runtime errors go into logic tracer, error causes all logic to cease.
	// GOTO's cause immediate break out of script and the caller is responsible for changing page.
	// Script statement lines separated <BR/> tags.
	this.indent=0;
	var script = this.translateCAJAtoJS(CAJAScriptHTML);
	if (script.errors.length === 0)
	{
		var js = "with (gLogic) {"+ script.js.join("\n") +"}";
		try {
			var f=(new Function( js ));
			var result = f(); // Execute the javascript code.
			result = null;
		}
		catch (e) {
			// Trace runtime errors
			this.trace("ERROR: " +e.message +" " + e.lineNumber);
			return false;
		}
	}
	else
	{
		this.trace("ERROR: "+"syntax error in logic");
		return false;
	}
	this.indent=0;
	return true;
};

var gLogic = new TLogic();
// Default user defined functions used by A2J
gLogic.addUserFunction('Number',1,function(val){return parseFloat(val);});
gLogic.addUserFunction('String',1,function(val){return String(val);});
gLogic.addUserFunction('HisHer',1,function(gender){return (gender==='male') ? 'his' : 'her';});
gLogic.addUserFunction('HimHer',1,function(gender){return (gender==='male') ? 'him' : 'her';});
gLogic.addUserFunction('HeShe',1,function(gender){ return (gender==='male') ? 'he' : 'she';});
if ($.formatNumber){
	gLogic.addUserFunction('Dollar',1,function(val){		return $.formatNumber(val,{format:"#,###.00", locale:"us"});});
	gLogic.addUserFunction('DollarRound',1,function(val){	return $.formatNumber(Math.round(val),{format:"#,##0", locale:"us"});});
}
gLogic.addUserFunction('dateMDY',1,function(val){ var d=new Date(); d.setTime(val*1000*60*60*24);return (d.getMonth()+1)+'/'+d.getDate()+'/'+d.getFullYear();});


function traceLogic(html)
{
	gLogic.trace(html);
}

/* */
