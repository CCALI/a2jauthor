/* 
	A2J Author 5 * Justice * 正义 * công lý * правосудие
	All Contents Copyright The Center for Computer-Assisted Legal Instruction
*/


var testunit=gLogic;

function loadTestUnit(nth)
{ 

	testunit.trace("<h1>Defining variables</h1>");
	testunit.varsOld={}; 
	$('table.testVariables tr').each(function(i){
		if (i==0) return;
		var varName =jQuery.trim( $('td:first',this).text());
		testunit.trace(varName);
	});


	// Load a test unit file. Create fake pages from @Page and @Var lines
	testunit.trace("<h1>Defining pages/scripts</h1>");
	
	var pfirst="";
	var plast="";
	var curpage=null;
	$('table.testPages tr').each(function(i)
	{
		if (i==0) return;
		var pageName =jQuery.trim( $('td:first',this).text());
		testunit.trace(pageName);
		gGuide.pages[pageName.toLowerCase()] = { row:this, name:pageName, lines:[]};
		var pageLogic =jQuery.trim( $('td:nth(1)',this).text());
		
		var lines=pageLogic.split("\n");			
		for (var l=0;l<lines.length;l++)
		{	// Extract variables and page names and attach scripts to pages
			var line=jQuery.trim(lines[l]).split("//")[0];
			if (pfirst=="") pfirst=pageName;
			plast=pageName;
			if (curpage != null) curpage.next=pageName;
			curpage= gGuide.pages[pageName.toLowerCase()];
			if (curpage!=null){
				curpage.lines.push(lines[l]);
			}
		}
	});
	

	
	//testunit.trace("<h1>Variables</h1>");
	//testunit.deltaVars();
	
	gLogic.showCAJAScript= 0 ;
	
	testunit.trace("<h1>Syntax check</h1>");
	// Parse the syntax of each page's scripts
	for (var p in gGuide.pages)
	{
		var page=gGuide.pages[ p ];
		var lines = page.lines;
		var script = page.script  = gLogic.translateCAJAtoJS(lines.join(CONST.ScriptLineBreak));
		//alert(lines.join("\n"));
		//testunit.trace( 'Page ' + traceTag('page',page.name)); 
		//testunit.indent++;
		
		
		//if ( script.errors.length > 0 )
		{
			var t=[];
			for (l=0;l<lines.length;l++)
			{
				var err=null;
				for (var e in script.errors)
					if (script.errors[e].line == l)
						err=script.errors[e];
				if (err == null)
					t.push(lines[l]);
				else
				{
					t.push('<span class="err">'+lines[l]+"</span>");
				}
			}
			// Parsed script
			$('td:nth(1)',page.row).html('<BLOCKQUOTE class="Script">'+t.join("<BR/>")+"</BLOCKQUOTE>");
			
			// Javascripted version
			if ( 1 ) {
				var t=[];
				for (l=0;l<script.js.length;l++)
				{
					t.push(script.js[l]);
				}
				$('td:nth(3)',page.row).html("<BLOCKQUOTE class=Script>"+t.join("<hr>")+"</BLOCKQUOTE>");
			}
			
			// Syntax errors
			for (var e in script.errors)
			{
				err=script.errors[e];
				$('td:nth(2)',page.row).append("<li><b>"+err.line+":"+err.text+"</b>");
			}
		} 
		
		if(1){
			testunit.target =  $('td:nth(2)',page.row);
			execute (script);
		}
		
		//testunit.indent--; 
	}

	testunit.target = $('.ScriptTrace');
	testunit.trace("<h1>Script execution</h1>");
	
	
	if (0) {
		// start on first page and execute, following GOTO and falling through to next page. terminate after 20 loops or fall off last page.
		testunit.nextpage=pfirst;
		trace(testunit.nextpage);
		var loop=0;
		while (loop++<25 && (typeof testunit.nextpage!=="undefined"))
		{
			var page=gGuide.pages[ testunit.nextpage.toLowerCase() ];
			testunit.trace( '<hr>page '+traceTag('page',page.name)+'<span>'); 
			testunit.nextpage = page.next; //default next goto page
			if (page==null)
			{
				testunit.trace("Page doesn't exist");
				break;
			}
			testunit.target =  $('td:nth(2)',page.row);
			execute (page.script);
		}
	}
	
	
}

function execute(script)
{ 
	//var script = gLogic.translateCAJAtoJS(lines.join("\n")); 

	if (script.errors.length == 0)
	{
		if (0){
			testunit.trace("CAJAScript Evaluate");
			testunit.indent++;
			var t=[];
			for (l=0;l<lines.length;l++)
			{
				t.push(lines[l]);
			}
			testunit.trace("<BLOCKQUOTE class=Script>"+t.join("<BR/>")+"</BLOCKQUOTE>");
			testunit.indent--;
		}
		
		if (0) {
			testunit.trace("Javascript (with CAJA Script commented)");
			testunit.indent++;
			var t=[];
			for (l=0;l<script.js.length;l++)
			{
				t.push(script.js[l]);
			}
			testunit.trace("<BLOCKQUOTE class=Script>"+t.join("<BR/>")+"</BLOCKQUOTE>");
			testunit.indent--;
		}
		
		testunit._CAJA=function(c){
			testunit.trace( traceTag('code',c));
		}
		/*
		testunit._ED=gLogic._ED;
		testunit._CF=gLogic._CF;
		testunit._VS=gLogic._VS;
		testunit._VG=gLogic._VG;
		testunit._IF=gLogic._IF;
		testunit._ENDIF=gLogic._ENDIF;
		testunit._IF=function(d,c,e){
			testunit.trace( traceTag('code',c)+' = '+(e==true));return (e==true);
		}
		testunit._VS=function(c,v,i,val){
			testunit.trace( traceTag('code',c));
			return gGuide.varSet(v,val,i);
		}
		testunit._VG=function( v,i){
			return gGuide.varGet(v,i);
		}		 
		testunit._CF=function(f){ 
			this.indent++;
			this.trace("Call function "+f); 
			this.indent--;
			return 0;
		}
		testunit._ED=function(dstr){
			// Date format expected: m/dd/yyyy. 
			// Converted to unix seconds
			return Date.parse(dstr);
		}
		*/
		testunit.pageExists = function(pageName)
		{	// return true if page name exists
			return true;
		}
		testunit._GO=function(c,pageName)
		{
			testunit.nextpage=pageName;
			testunit.trace("Going to page "+testunit.nextpage);
		}
		testunit._deltaVars=testunit.deltaVars;
		var js = "with (testunit) {"+ script.js.join("\n") +"}";
		try {
			var f=(new Function( js ));
			var result = f();//execute the javascript code.
		}
		catch (e) { 
			testunit.trace("ERROR: " +e.message +" " + e.lineNumber);
		}
	}
}
function traceTag(cname,chtml){
	if (cname=='val' && chtml == "")
		chtml = "<i>blank</i>";
	return "<span class="+cname+">"+chtml+"</span>";
}


/*
testunit.setVar=function(varName,varIndex,varVal)
{
	if (varIndex==null || varIndex=='') varIndex=0;
	
	this.indent++;
	this.trace( traceTag('var',varName)+ (varIndex>0 ? traceTag('varidx',varIndex) :'') + ' = '+ traceTag('val',varVal) );
	this.indent--;
	
	var varName_i=varName.toLowerCase();
	var v=testunit.vars[varName_i];
	if (typeof v == 'undefined')
	{
		v={name:varName,values:[]};
		testunit.vars[varName_i]=v;
	}
	if (typeof testunit.varsOld[varName_i+"."+varIndex]=='undefined')
		testunit.varsOld[varName_i+"."+varIndex]=[v.values[varIndex]];
//	testunit.varsOld[varName_i+"."+varIndex].push(v.values[varIndex]);
	v.values[varIndex]=varVal; 
}
testunit.getVar=function(varName,varIndex)
{
	//this.trace('Get '+traceTag('var',varName));
	var varName_i=varName.toLowerCase();
	var v=testunit.vars[varName_i];
	if (typeof v == 'undefined')
	{
		testunit.indent++;
		testunit.trace('Undefined variable: '+traceTag('var',varName)+ ((varIndex==null || varIndex=='')?'':traceTag('varidx',varIndex) ));
		testunit.indent--;
		return 'undefined';
	}
	else
	{
		if (varIndex==null || varIndex=='') varIndex=0;
		return v.values[varIndex]; 
	}
}
*/

testunit.deltaVars=function()
{	// Display variables indicating changed/new.
	return;

	var html='<table   border="2"  cellpadding="1" cellspacing="0"><tr><th nowrap="nowrap" class="colVar">Variable</th><th nowrap="nowrap" class="colIndex">Index</th><th nowrap="nowrap" class="colValue">Value</th><th  class="colValue">Old Value</th></tr>';

	//console.log(testunit.vars);
	for (var varName_i in testunit.vars)
	{
		var v = testunit.vars[varName_i]
		var varName=v.name;
		for (var vi=0;vi<v.values.length;vi++)
		{
			var stat=""; 
			var varVal=v.values[vi];
			var vOld=testunit.varsOld[varName_i+"."+vi];
			if (1 || typeof vOld!="undefined")
			{
				html += '<TR rel="'+varName_i+'">'
					//+'<td class="colVar">'+varName+'</td><td class="colIndex">'+vi+'</td><td class="colValue '+''+'">'+varVal+'</td><td class="colValue">'+vOld.join(" , ")+'</td>'
					+'</TR>';
			}
		}
	}
	html += '</table><br/>';
	testunit.trace(html);
	
	testunit.varsOld={}; 
}

testunit.evalExpression = function(expr)
{
/*
	*/
}
testunit.evalBlock=function(block)
{
	return this.evalExpression(block);
}
testunit.evalHTML=function(html)
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
				html += this.evalBlock(parts[p+1]);
			}
		}
	}
	return html;
}


traceScript=trace=function(msg)
{
	//console.log(msg);
	testunit.target.append('<li>'+  Array.prototype.slice.call(arguments).join(", "));
	//$('.ScriptTrace').append('<li>'+  Array.prototype.slice.call(arguments).join(", "));
}
$(document).ready(function()
{
	testunit.target = $('.ScriptTrace');
	trace("Ready");
	Languages.set(Languages.defaultLanguage);
	
	testunit.trace=trace;
	gLogic.traceLogic=trace; 
	/*
	function(msg){
		//var nbsp="";for (var i=0;i<3*this.indent;i++){nbsp+="&nbsp;";}
		//$('.ScriptTrace').append( nbsp + Array.prototype.slice.call(arguments).join(", ")+"<br>");
		$('.ScriptTrace').append( '<li style="margin-left:'+(this.indent*50)+'px">'+ Array.prototype.slice.call(arguments).join(", "));
		};
		*/
//	testunit.traceIndent=function(delta){ this.traceDepth+=delta;}
	testunit.indent=0;
	testunit.pageName="";
	testunit.vars={}
	testunit.varsOld={};
	gGuide=new TGuide();
	gGuide.pages={};
	
	
	loadTestUnit(1);
});

