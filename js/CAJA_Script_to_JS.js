// JavaScript Document
// 06/15/2012 Convert CAJA script into JavaScript  10/25/11  
// Phase 1: Compile the CAJA script to spot syntax errors or undefined functions or variables.
// Phase 2: If compile ie successful, execute the JS version.
//
// Dependencies: jqhashtable-2.1.js, jquery.numberformatter-1.2.1.jsmin.js


// Classes
function jquote(str)
{
	return "\""+str.replace( /"/gi,"\\\"")+"\"";
}
function ParseError(lineNum,errType,errText)
{
	this.line = lineNum
	this.type = errType;//missing page, unknown line, unknown function
	this.text = errText;
	return this;
}

var _GCS = {  //global CAJA script
// Note:  Not re-entrant.



showCAJAScript : 
	//0 // none
	//+1 // end of js line
	//2// before js
	3//tracer
,
/*
_IF : function(caja,expr)
{
	
	return expr;
},
_VS : function(varname,arrayindex,value)
{
	// returns nothing
},

_VG : function(varname,arrayindex)
{
	return 0;
},

_ED : function(datestr) // expand a date
{
	
	return 0;
},

_CF : function(fncName)
{
	fncName=fncName.toLowerCase(); 
},

_GO : function(pagename)
{
	//returns nothing
},


_deltaVars : function(pagename)
{
	//returns nothing
},
*/


pageExists : function(pageName)
{	// return true if page name exists
	return true;
},
translateCAJAtoJS : function(CAJAScript)
{	// Translate CAJA script statements of multiple lines with conditionals into JS script but do NOT evaluate
	// Returns JavaScript source code lines in .js and errors in .errors which caller may evaluate
/*
	_GetVar(x) = get value of variable x
	_GetVar(x,n) = get nth element of array variable x
	_VS(x,y,z) = set value of variable x#y to z
	ED(d) = parse an mm/dd/yyyy string to date
	CF(f,a) = call function f with argument a	
	
	Needs a bit of tightening on the regex

	CAJA supported syntax
	SET v TO e or SET v = e becomes SV(v,e)
	GOTO v becomes GOTO(v)
	IF exp
	END IF
*/
	var errors=[];
	var jsLines=[];
	var csLines=CAJAScript.split("\n");
	var ifd=0;//if depth syntax checker
	for (var l=0;l<csLines.length;l++)
	{
		var line=jQuery.trim(csLines[l]).split("//")[0];
		var args;
		var js;
		if (line!="")
		{
			if ((args = line.match(/set\s+([\w#]+|\[[\w|#|\s]+\])\s*?(=|TO)\s?(.+)/i))!=null)
			{	// SET variable name TO expression
				var jj = args[1];
				jj = jj.replace(/\[|\]/gi,"");// strip variable name brackets if present
				jj = jj.split("#");// extract array index
				if (jj.length==1)
					// Set named variable to evaluated expression
					js=('_VS(' + jquote(line)+',"'+jj[0]+'",0,'+this.translateCAJAtoJSExpression(args[3], l, errors)+");");
				else
					// Set named variable array element to evaluated expression
					js=('_VS(' + jquote(line)+',"'+jj[0]+'",'+ this.translateCAJAtoJSExpression(jj[1], l, errors)+","+this.translateCAJAtoJSExpression(args[3], l, errors)+");");
			}
			else
			if ((args = line.match(/^goto\s+(.+)/i))!=null)
			{	// Goto named page (not an expression). We 'return' to avoid further processing which is A2J's designed behavior.
				var pageName=args[1];
				if (!this.pageExists(pageName)) errors.push(new ParseError(l,"",lang.scriptErrorMissingPage.printf(pageName)));
				js=("_GO("+jquote(line)+","+pageName+");return;");
				
				//alert(js+"\n"+line+"\n"+CAJAScript);
			}
			else
			if ((args = line.match(/print\s+(.+)/i))!=null)
			{
				js="";
				//script.trace("PRINT "+args[1]);
				//script.trace("RESULT "+script.evalHTML(args[1]));
			}
			else
			if ((args = line.match(/^if\s+(.+)/i))!=null)
			{	// "if expressions" becomes "if (expressions) {"
				ifd++;
				if (this.showCAJAScript==3) line="";//don't print elese?
				js=("if (_IF("+ifd+","+jquote(args[1])+","+this.translateCAJAtoJSExpression(args[1], l, errors)+")){");
				//				js=("if ("+this.translateCAJAtoJSExpression(args[1], l, errors)+"){");
			}
			else
			if ((args = line.match(/^else if\s+(.+)/i))!=null)
			{	// "else if expression" becomes "}else if (expression){"
				//does NOT affect depth. ifd++;
				if (this.showCAJAScript==3) line="";//don't print elese?
				js=("} else if (_IF("+ifd+","+jquote(args[1])+","+this.translateCAJAtoJSExpression(args[1], l, errors)+")){");
				//js=("} else if ("+this.translateCAJAtoJSExpression(args[1], l, errors)+"){");
			}
			else
			if ((args = line.match(/^end if/i))!=null)
			{	// "END IF" becomes "}"
				if (this.showCAJAScript==3) line="";//don't print elese?
				js=("}");
				ifd--;
			}
			else
			if ((args = line.match(/^else/i))!=null)
			{	// "else" becomes "}else{" 
				if (this.showCAJAScript==3) line="";//don't print elese?
				js=("}else{");
			}
			else
			if (line.match(/deltavars/i)!=null)
			{	// debugging aid
				js=("_deltaVars("+jquote(line)+");");//.traceVars();
			}
			else
			{	// Unknown statement
				//js=("// Unhandled: "  + line);
				js="_CAJA("+ jquote(line)+ ");";
				errors.push(new ParseError(l,"",lang.scriptErrorUnhandled.printf(line)));
			}
			

			if (this.showCAJAScript==0)jsLines.push(js);//standard
			else
			if (this.showCAJAScript==1) jsLines.push(js + " //CAJA: "+line); //include original source appended
			else
			if (this.showCAJAScript==2) jsLines.push("","//CAJA: "+line,js);// include original source prepended
			else
				jsLines.push("","",js); // line.replace( /"/x/gi,"!") +
//				jsLines.push("",line==""?"":"_CAJA("+ jquote(line)+ ");",js); // line.replace( /"/x/gi,"!") +
		}
	}
	if (ifd>0)errors.push(new ParseError(l,"",lang.scriptErrorEndMissing.printf()));
	return {js : jsLines,  errors: errors};
},

translateCAJAtoJSExpression : function(CAJAExpression, lineNum, errors)
{	// Parse a CAJA expression into a JS expression, NOT EVALUATED.
	// Compiled into JS function to check for errors.
	var js = (" " + CAJAExpression +" ");
	// Handle items not in quotes
	js = js.split('"');
	for (var j=0;j<js.length;j+=2)
	{
		var jj=js[j];
		//	A2J variables support spaces and other symbols using [] notation
		// Variable formats:
		//		Variable name with possible spaces
		//			[child name] converts to GetVar("child name")
		jj = jj.replace(/\[([\w|\s]+)\]/gi,"$$1(\"$1\")"); 
		
		//		Variable name with possible spaces#number (array)
		//			[child name#2] converts to GetVar("child name",2)
		jj = jj.replace(/\[([\w|\s]+)#([\d]+)\]/gi,"$$1(\"$1\",$2)");
		
		// 	Variable name with possible spaces#other variable name that evaluates to a number (array)
		//			[child name#child counter] converts to GetVar("child name",GetVar("child counter"))
		jj = jj.replace(/\[([\w|\s]+)#([\w|\s]+)\]/gi,"$$1(\"$1\",$$1(\"$2\"))");

		//	A2J dates bracketed with # like VB
		//		#12/25/2012# converts to convertDate("12/25/2012")
		var date = /#([\d|\/]+)#/gi;
		jj = jj.replace(date,"$$2(\"$1\")");
		
		js[j]=jj;
	}
	js = js.join('"').split('"');
	for (var j=0;j<js.length;j+=2)
	{	// handle standalone symbols not in quotes
		var jj=js[j];
		
		// A2J allows commas in numbers for clarity
		//		25,000.25 converts to 25000.25
		var vn = /(\d[\d|\,]+)/gi;
		jj = jj.replace(vn,function(s){return s.replace(",","")});
		
		//	A2J uses AND, OR and NOT while JS uses &&, || and !
		jj = jj.replace(/\band\b/gi,"&&");
		jj = jj.replace(/\bor\b/gi,"||");
		jj = jj.replace(/\bnot\b/gi,"!");
		
		//	A2J uses = and <> for comparison while JS uses == and !=
		jj = jj.replace(/\=/gi,"==");
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
	for (var j=0;j<js.length;j+=2)
	{	// handle standalone variables that aren't functions
		var jj=js[j];
		// Unbracketed variables get final VV treatment
		//		first_name converts to VV("first_name")
		jj = jj.replace(/([A-Za-z_][\w]*)/gi,'$$1("$1")');

		js[j]=jj;
	}
	js = js.join('"').split('"');
	for (var j=0;j<js.length;j+=2)
	{	// restore js functions
		var jj=js[j];
		jj = jj.replace(/\$1/,"_VG").replace(/\$2/,"_ED").replace(/\$3/,"_CF");
		js[j]=jj;
	}
	js = js.join('"');
//	trace("CAJA: "+CAJA + " JS: " + js);

	// Build function to find syntax errors
	try {
		var f=(new Function( js ));
	}
	catch (e) { 
		//alert("ERROR: " +e.message +" " + e.lineNumber +"\n"+js );
		errors.push(new ParseError(lineNum,"",e.message));
	}

	return js;
},

userFunctions: [],

addUserFunction : function(funcName,numArgs,func)
{	// add a user defined function
	this.userFunctions.push({name:funcName,numArgs:numArgs,func:func});
}

}//end of GSC declaration

// Default user defined functions used by A2J
_GCS.addUserFunction('Number',1,function(val){return parseFloat(val);});
_GCS.addUserFunction('String',1,function(val){return String(val);});
_GCS.addUserFunction('HisHer',1,function(gender){if (gender=='male') return 'his'; else return 'her';});
_GCS.addUserFunction('HimHer',1,function(gender){if (gender=='male') return 'him'; else return 'her';});
_GCS.addUserFunction('HeShe',1,function(gender){if (gender=='male') return 'he'; else return 'she';});
if ($.formatNumber){
_GCS.addUserFunction('Dollar',1,function(val){  		return $.formatNumber(val,{format:"#,###.00", locale:"us"});});
_GCS.addUserFunction('DollarRound',1,function(val){	return $.formatNumber(Math.round(val),{format:"#,##0", locale:"us"});});
}
_GCS.addUserFunction('dateMDY',1,function(val){ var d=new Date(); d.setTime(val*1000*60*60*24);return (d.getMonth()+1)+'/'+d.getDate()+'/'+d.getFullYear();});




