/*	CALI Author 5 / A2J Author 5 (CAJA)
	All Contents Copyright The Center for Computer-Assisted Legal Instruction
	
	Advanced editor
	04/09/2012
	04/15/2013


	Experimental code for single document editing of a guide
*/

/*

var useDIV= 0;// 04/09/12 if 0, only P tags. if 1, each page bounded with DIV
var editor;
var selRange = null;
var editdoc=document;
var editwin=window;

$(document).ready(function () { initAdvanced(); });


function setMode(mode)
{
	if (editMode===0){
		editMode=1;
		startCAJA();
		return false;
	}
	textonlyMode=mode;
	setProgress('scanning');
	//$('.CAJAContent P').removeClass('hilite').filter(function(){ return $(this).text().indexOf('Question ')==0;}).addClass('hilite');
	$('.inform').remove();
	$('#advanced > P, #advanced > DIV > P').each(function(){parseP($(this))});
	setProgress('.');
	return false;
}

function initAdvanced()
{
	jQuery(document).bind('paste', handlePaste);
	$('.advanced').bind('mouseup',cajaMouseUp);


//	function getIFrameDocument(aID){  
//	  // if contentDocument exists, W3C compliant (Mozilla)  
//	  if (document.getElementById(aID).contentDocument){  
//		 return document.getElementById(aID).contentDocument;  
//	  } else {  // IE  
//		 return document.frames[aID].document;  
//	  }  
//	}
//	$('#editorWindow').load(function(){
//       editor= $('#editorWindow').contents().find('body') 
//		 editor.text('Greetings there');  
//    });
//	getIFrameDocument("CAJAContent").designMode = "On";
//	//$("#editorWindow").contents().find("#CAJAContent")

	if ($.browser.mozilla) document.execCommand('styleWithCSS',false,null);
}
function handlePaste(e)
{
	return;
	
	//window.setTimeout(function(){
	//	var selRange2, range, html;
	//	trace('pasting!');
	//	selRange2=editwin.getSelection(); 
	//	selRange2=selRange2.getRangeAt(0);
	//	trace(selRange);
	//	trace(selRange2);
	//	range = document.createRange(); 
	//	range.setStart(selRange.startContainer,selRange.startOffset);
	//	range.setEnd(selRange2.endContainer, selRange2.endOffset);
	//	trace(range);
	//	//range=range.getRangeAt(0);
	//	html=new XMLSerializer().serializeToString(range.cloneContents());
	//	trace(html);
	//},1);
	
}

function selToHTML()
{	// convert selection to HTML
	var html="";
//	var editdoc=document;
//	var editwin=window;
	if (document.selection && document.selection.createRange)
	{
		selRange=editdoc.selection.createRange();
		if( selRange.htmlText )
			html=selRange.htmlText;
		else if(selRange.length >= 1) 
			html=selRange.item(0).outerHTML;
		else
			html="";
	}
	else if (window.getSelection)
	{
		selRange=editwin.getSelection(); 
		if (selRange.rangeCount > 0 && window.XMLSerializer)
		{
			selRange=selRange.getRangeAt(0);
			html=new XMLSerializer().serializeToString(selRange.cloneContents());
		}
	}
	//if (0){
	////TEST Determine DIV clicked in by hiliting it
	//var pageP=(useDIV)?$(selRange.startContainer).closest('DIV') : $(selRange.startContainer).closest('P').prevUntil("P.CAJAPage").prev();
	//trace((pageP));
	//pageP.addClass('hilite');
	//} 
	return html;
}






function cajaMouseUp()
{
	var status=''
		,html=selToHTML();
	if (html!='')
		status=html;
	if (status!="") status = 'You selected "'+status+'"'; 
	setProgress(status);
}

function hidem(dohide)
{
	//$('.CAJAContent P,.CAJAContent BLOCKQUOTE,.CAJAContent UL,.CAJAContent OL').toggle(reveal);
	if (dohide){
		$('.advanced > *').hide();
		$('.advanced P.CAJAPage, .advanced P.CAJAPage BR, .advanced DIV').show();// P.CAJAPage
	}
	else
		$('.advanced > *').show();
	return false;
} 


function showPageToEditTextOnly(target)
{	// For single doc, scroll to anchor
	$('#advanced').focus();
	var range, startNode, sel, xy, v;
	// FireFox only!
	range = document.createRange();
	//trace('scrolling to '+target);
	if (useDIV)
		startNode = $("#advanced DIV P.CAJAPage:contains('"+target+"')");//.next(); 
	else
		startNode = $("#advanced P.CAJAPage:contains('"+target+"')");//.next(); 
		//startNode = $("#CAJAContent P.CAJAPage[name='"+pageName+"']");
	if (startNode.length>0)
	{
		//trace(startNode[0]);
//		range.setStart(startNode[0],startOffset);
		range.selectNode(startNode[0]);
		sel=window.getSelection();
		sel.addRange(range);
		xy=startNode.position(); 
		//trace(xy);
		v=$("#advanced").parent().parent().scrollTop();
		$("#advanced").parent().parent().scrollTop(v+ xy.top-150 );
	}
}



function inform(msg){ return '<span class=inform contenteditable=false>'+msg+'</span> '}

function parseP(p)
{	// Add markup to plain text single doc
	var txt=p.text();
	p.removeClass('CAJAPage CAJAAsk CAJATest');

	if (textonlyMode>1)
	{
		if (txt.indexOf('PAGE ')==0){
			p.addClass('CAJAPage');
			p.attr('name',txt.substr(5,999));
		}
		else
		if (txt.indexOf('Section ')==0) p.addClass('CAJASection');
		else
		if (txt.indexOf('STEP ')==0) {
			p.addClass('CAJAStep');
			p.addClass('Step'+parseInt(txt.split("#")[1]));
		}
		else
		if (txt.indexOf("//")==0)  p.addClass('CAJAComment');
		else p.addClass('CAJATest');
	}
	if (textonlyMode==3)
	{
		txtL=txt.toLowerCase();
		if ((args = txt.match(/set\s+(\w+)\s?(=|TO)\s?(.+)/i))!=null) p.append(inform('SET '+args[1]+' TO '+args[3]));
		else
		if ((args = txt.match(/add button\s+(['\w]+)\s?(that goes to)\s?(.+)/i))!=null) p.append(inform('ADD BUTTON '+args[1]+', GOES TO '+args[3]));
		else
		if ((args = txt.match(/add field with label\s+(.+)\s?(using variable)\s?(.+)/i))!=null) p.append(inform('ADD Field label '+args[1]+', for variable '+args[3]));
		else
		if (txtL.indexOf('if ')==0) p.append(inform('IF Statement'));
		else
		if (txtL.indexOf('add ')==0) { //$(this).append(inform('Add something Statement')); 
		}
		else
		if (txtL.indexOf('set ')==0) p.append('<span class=inform contenteditable=false>SET Variable Statement</span> ');
		//if (txt.indexOf('Ask ')==0) $(this).addClass('CAJAAsk');
		//if (txt.indexOf('If ')==0) $(this).addClass('CAJATest');
		//if (/The correct text is|^Model answer is|^If/.test(txt)) $(this).addClass('CAJATest');
	}
}




TGuide.prototype.convertToText=function()
{	// Generate report of CAJA contents in single doc text format
	var t, cnt, vi, v, ci, c, lastStep, pageText, p, page, f, field
		,scriptBefore,scriptAfter,scriptLast
		,b,button
		,d,detail, fb
		,s,script,st,t2;


	t="Converted to text<HR>";
	function text2C(t){
		return "<P>// "+t+"</P>";}
	function text2P(t){
		return "<P>"+t+"</P>";}
	function html2P(t){
		return "<BLOCKQUOTE>"+t+"</BLOCKQUOTE>";}
	function script2P(s){
		return  "<P>"+s.join("</P><P>")+"</P>";}
	function expandPopups(guide,html){ // expand any HREF= POPUP://# with the text
		var args, a, popid;
		if (guide.viewer=="CA") return html;//04/13/2012 resolve CA issue
		if ((args = html.match(/\"POPUP:\/\/(\w+)\"/ig))!=null)
		{
			for (a=0;a<args.length;a++)
			{
				popid=args[a].match(/\"POPUP:\/\/(\w+)\"/i)[1];
				html += "<h1>POPUP: ["+popid+"]</h1>";
				html+=html2P(guide.popups[popid].text);
			}
		}
		return html;
	}
//	txt += row('title','','',this.title)		+row('viewer','','',this.viewer)		+row('description','','',this.description);
	cnt=0;
	
	
	t+=text2C('Meta Information Section');
	t+=text2P('Title of this interview is '+this.title);
	t+=text2P('Description of this interview '+text2P(this.description));
	t+=text2P('Jurisdiction for this interview '+this.jurisdiction);
	
	t+=text2C('Variable Definitions Section');
	for (vi in this.vars)
	{
		v=this.vars[vi];
		t+=text2P("Define variable ["+v.name+"] as "+v.type);
	}
	t+=text2C('Constant Definitions Section');
	for (ci in this.constants)
	{
		c=this.constants[ci]; // STRING or NUMBER
//		if (isNumber(c)) c=
		t+=text2P("Define constant ["+ci+"] = "+c);
	}


	
	lastStep="";
	t+=text2C('Page Section');
	for (p in this.sortedPages)
	{
		pageText="";
		page = this.sortedPages[p];  
		
		if (page.type!="A2J")
			pageText +="Page type/style: "+page.type+"/"+page.style;
			
			
		if (page.notes) pageText += "//"+page.notes;
		pageText += html2P(expandPopups(this,page.text));
		
		if (page.help!="")
		{
			pageText += text2P("ADD learn more button English("+page.learn+")");
			pageText += html2P(expandPopups(this,page.help));
		}
		
		
		
		
		for (f in page.fields)
		{
		//Add field with label 'First Name' using variable 'User Name First' which is text
		//Add field with label Last Name' using variable 'User Name Last' variable			
			field=page.fields[f];
			pageText+=text2P("ADD "+(!field.required?"optional":"")+" "+field.type+" field '"+field.name+"' with label '"+field.label+"'");
			pageText+="<input type=radio>";
			//if (field.type="radio") pageText+="<input type=radio>"+field.label+"</input>";
			
			if (field.invalidPrompt!="") pageText+=text2P('PROMPT if invalid is '+field.invalidPrompt);
		}
		//scriptBefore=[];
		//scriptAfter=[];
		//scriptLast=[];
		for (b in page.buttons)
		{
			button=page.buttons[b];
			//Add button 'Continue' that goes to A2J Name
			pageText+=text2P("ADD button English("+button.label+")"); // that goes to "+this.pageIDtoName(button.next));
			
			//var resptest="IF ResponseNum="+ (parseInt(b)+1);//"IF Button("+(parseInt(b)+1)+")
			//if (button.name) // if button has a variable attached, we assign a value to it
			//	scriptAfter.push(resptest+" THEN SET ["+button.name+"] to "+button.value+"");
			//if (makestr(button.next)!="")// if button has a destination, we'll go there after any AFTER scripts have run.
			//	scriptLast.push(resptest+" THEN GOTO "+this.pageIDtoName(button.next));
			
		}
		

		
		if (page.type == "Book page"){}
		else
		if (page.type=="Multiple Choice" && page.style=="Choose Buttons"){
			for (b in page.buttons){
				pageText+=text2P("Feedback for Button("+(parseInt(b)+1)+")");
				fb=page.feedbacks[fbIndex(b,0)];
				pageText+=html2P(fb.text);
			}
		}
		else if (page.type=="Multiple Choice" && page.style=="Choose List") {
			for (d in page.details){
				detail=page.details[d];
				pageText+=text2P("Choice "+ detail.label ); 
				pageText+=html2P(detail.text);
			}
			for (d in page.details){
				detail=page.details[d]; 
				pageText+=text2P("Feedback for Choice("+detail.label+")");
				fb=page.feedbacks[fbIndex(0,d)];
				pageText+=html2P(fb.text);
			} 
		}
		else if (page.type=="Multiple Choice" && page.style=="Choose MultiButtons"){
			for (d in page.details){
				detail=page.details[d];
				pageText+=text2P("Subquestion "+ (parseInt(d)+1)); 
				pageText+=html2P(detail.text);
			}
			for (d in page.details)
			{
				for (b in page.buttons)
				{	
					button=page.buttons[b];
					fb=page.feedbacks[fbIndex(b,d)];
					pageText+=text2P("Feedback for subquestion " +(parseInt(d,10)+1) + ", Choice("+button.label+")");
					pageText+=html2P(fb.text);
				}
			}
		}
		else if (page.type=="Multiple Choice" && page.style=="Radio Buttons") 		{}
		else if (page.type=="Multiple Choice" && page.style=="Check Boxes")			{}
		else if (page.type=="Multiple Choice" && page.style=="Check Boxes Set")		{}
		else if (page.type=="Text Entry" && page.style=="Text Short Answer")			{}
		else if (page.type=="Text Entry" && page.style=="Text Select")					{}
		else if (page.type=="Text Entry" && page.style=="Text Essay")					{}
		else if (page.type=="Prioritize" && page.style=="PDrag")							{}
		else if (page.type=="Prioritize" && page.style=="PMatch")						{}
		else if (page.type=="Slider")																{}
		else if (page.type=="GAME" && page.style=="FLASHCARD")							{}
		else if (page.type=="GAME" && page.style=="HANGMAN")								{}
		
		
		
		
		//for (s in page.scripts)
		//{
		//	script=page.scripts[s];
		//	st= script.code.split("\n")//.join("<BR>");
		//	if (script.event=="BEFORE")
		//		scriptBefore=scriptBefore.concat(st);
		//	else
		//		scriptAfter=scriptAfter.concat(st);
		//}
		
		
		if (page.step!=lastStep)
		{
			t+=text2P("STEP #"+page.step+": ("+this.steps[page.step].number+")" + this.steps[page.step].text);
			lastStep=page.step;
		}
		
		t2 = text2P("PAGE "+page.name+"") +  pageText + (page.codeBefore)+ (page.codeAfter) + text2P("");
//		t2 = text2P("PAGE "+page.name+"") + script2P(scriptBefore) + pageText + script2P(scriptAfter) + script2P(scriptLast) + text2P("");
		if (useDIV)
			t +='<div class="editq">'+t2+'</div>';
		else
			t += t2;
		//if (cnt++>20){ t+=text2P("There's more");break;}
	}
	return t;
}

*/
