/*
 	CALI Author 5 / A2J Author 5 (CAJA) 正义 * công lý * правосудие
	All Contents Copyright The Center for Computer-Assisted Legal Instruction
	
	Pieces of obsolete code that might prove useful later.
*/

<script src="CAJA_Utils.js" type="text/javascript"></script>
<script src="CAJA_Types.js" type="text/javascript"></script>
<script src="CAJA_Languages.js" type="text/javascript"></script>
<script src="CAJA_IO.js" type="text/javascript"></script>
<script src="CAJA_Parser.js" type="text/javascript"></script>
<script src="CAJA_Logic.js" type="text/javascript"></script>
<script src="CAJA_Parser_A2J.js" type="text/javascript"></script>
<script src="CAJA_Shared.js" type="text/javascript"></script>
<script src="A2J_Viewer.js" type="text/javascript"></script>
<script src="A2J_ViewerApp.js" type="text/javascript"></script>

<script src="CAJA_Types.js?jsver=5.0.1.2" type="text/javascript"></script>
<script src="CAJA_Utils.js?jsver=5.0.1.2" type="text/javascript"></script>
<script src="CAJA_Languages.js?jsver=5.0.1.2" type="text/javascript"></script>
<script src="CAJA_Parser.js?jsver=5.0.1.2" type="text/javascript"></script>
<script src="CAJA_Parser_A2J.js?jsver=5.0.1.2" type="text/javascript"></script>
<script src="CAJA_Logic.js?jsver=5.0.1.2" type="text/javascript"></script>
<script src="CAJA_Shared.js?jsver=5.0.1.2" type="text/javascript"></script>
<script src="CAJA_IO.js?jsver=5.0.1.2" type="text/javascript"></script>
<script src="A2J_Mapper.js?jsver=5.0.1.2" type="text/javascript"></script>
<script src="A2J_Viewer.js?jsver=5.0.1.2" type="text/javascript"></script>
<script src="A2J_AuthorApp.js?jsver=5.0.1.2" type="text/javascript"></script>
<script src="CAJA_Dev.js?jsver=5.0.1.2" type="text/javascript"></script>




/*
	CALI Author 5 / A2J Author 5 (CAJA) 正义 * công lý * правосудие
	All Contents Copyright The Center for Computer-Assisted Legal Instruction

	Full HTML Editor
	03/30/2012
	04/15/2013
	
*/
/*
$(document).ready(function () {
   // Everything loaded, execute.
   Languages.set(Languages.defaultLanguage);


   // Declare TinyMCE Editor options
   // Notice: The simple theme does not use all options some of them are limited to the advanced theme
   tinyMCE.init({
      theme: "advanced",
      //theme_advanced_toolbar_location : "top",
      //theme_toolbar_location : "top",
      theme_advanced_toolbar_location: "external",
      theme_advanced_layout_manager: 'SimpleLayout',
      //mode : "none",

      //	plugins: "autoresize",//8/3/12 SJG hid the progress spinner - too distracting

      theme_advanced_buttons1: "cut,copy,paste,undo,redo,separator,bold,italic,underline,separator,sub,sup,separator,justifyleft,justifycenter,separator,bullist,numlist,blockquote,separator,outdent,separator,indent,separator,link,image,charmap,spellchecker,separator",
      theme_advanced_buttons2: "",
      theme_advanced_buttons3: "",
      //theme_advanced_buttons1 : "separator,insertdate,inserttime,preview,zoom,separator,forecolor,backcolor",
      //theme_advanced_buttons2 : "bullist,numlist,separator,outdent,indent,separator,undo,redo,separator",
      //theme_advanced_buttons3 : "hr,removeformat,visualaid,separator,sub,sup,separator,charmap"

      // 8/2/12 SJG Keep underline as U rather than text-decoration
      inline_styles: false,
      formats: {
         underline: { inline: 'u', exact: true }
      },
      //http://www.tinymce.com/wiki.php/Configuration:valid_elements
      valid_elements: "@[id|class|style|title|dir<ltr?rtl|lang|xml::lang|onclick|ondblclick|"
	+ "onmousedown|onmouseup|onmouseover|onmousemove|onmouseout|onkeypress|"
	+ "onkeydown|onkeyup],a[rel|rev|charset|hreflang|tabindex|accesskey|type|"

      // 8/2/12 SJG CSS simple: U is underline, B is bold, i it italics, not emphasis.
	+ "name|href|target|title|class|onfocus|onblur],b/strong,i/em,strike,u,"
      //	+ "name|href|target|title|class|onfocus|onblur],strong/b,em/i,strike,u,"
	+ "#p,-ol[type|compact],-ul[type|compact],-li,br,img[longdesc|usemap|"
	+ "src|border|alt=|title|hspace|vspace|width|height|align],-sub,-sup,"
	+ "-blockquote,-table[border=0|cellspacing|cellpadding|width|frame|rules|"
	+ "height|align|summary|bgcolor|background|bordercolor],-tr[rowspan|width|"
	+ "height|align|valign|bgcolor|background|bordercolor],tbody,thead,tfoot,"
	+ "#td[colspan|rowspan|width|height|align|valign|bgcolor|background|bordercolor"
	+ "|scope],#th[colspan|rowspan|width|height|align|valign|scope],caption,-div,"
	+ "-span,-code,-pre,address,-h1,-h2,-h3,-h4,-h5,-h6,hr[size|noshade],-font[face"
	+ "|size|color],dd,dl,dt,cite,abbr,acronym,del[datetime|cite],ins[datetime|cite],"
	+ "object[classid|width|height|codebase|*],param[name|value|_value],embed[type|width"
	+ "|height|src|*],script[src|type],map[name],area[shape|coords|href|alt|target],bdo,"
	+ "button,col[align|char|charoff|span|valign|width],colgroup[align|char|charoff|span|"
	+ "valign|width],dfn,fieldset,form[action|accept|accept-charset|enctype|method],"
	+ "input[accept|alt|checked|disabled|maxlength|name|readonly|size|src|type|value],"
	+ "kbd,label[for],legend,noscript,optgroup[label|disabled],option[disabled|label|selected|value],"
	+ "q[cite],samp,select[disabled|multiple|name|size],small,"
	+ "textarea[cols|rows|disabled|name|readonly],tt,var,big"

   });
});

*/

/* */

/*
	CALI Author 5 / A2J Author 5 (CAJA) 正义 * công lý * правосудие
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
		else if (page.type=="Multiple Choice" && page.style=="Radio Buttons")		{}
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

.map {
	xbackground-color:#f00;
	xwidth: auto;
	xwidth: 1500px;
	xheight: 1500px;
	xoverflow: hidden;
	border: 2px thick #0f0;
	position: relative;
}

.dialog_window_minimized {
   float: left;
   padding: 5px 10px;
   font-size: 12px;
   cursor: pointer;
   margin-right: 2px;
   xdisplay: none;
}
.dialog_window_minimized .ui-icon {
   display: inline-block !important;
   position: relative;
   top: 3px;
   cursor: pointer;
}
.ui-dialog .ui-dialog-titlebar-minimize {
   height: 18px;
   width: 19px;
   padding: 1px;
   position: absolute;
   right: 23px;
   top: 9px;
}
.ui-dialog .ui-dialog-titlebar-minimize .ui-icon {
   display: block;
   margin: 1px;
}
.ui-dialog .ui-dialog-titlebar-minimize:hover, .ui-dialog .ui-dialog-titlebar-minimize:focus {
   padding: 0;
}


		<!--<button id="guideNew" />-->
		<!--<button id="guideOpen" />-->
		<!--<button id="guideSave" />-->
		<!--<button id="guideSaveAs" />-->
		<!--<button id="guideClose" />-->
	/*
	$('#guideClose').hover(function() {
		$(this).addClass('ui-state-hover');
	}, function() {
		$(this).removeClass('ui-state-hover');
	}).click(function() {
		guideClose();
	});
	*/
	
function guideClose()
{
	if ((gGuide!==null) && (gGuideID!==0))
	{
		guideSave();
	}	
	//$('#welcome').dialog('open');
	signin();
	//$('#authortool').hide();
}

	var avatarVarName="User Avatar";
	var av=this.varGet(avatarVarName); // Client's gender (blank means only show guide)
	if (typeof cg=='undefined') this.varSet(genderVarName,
		//code
	}
	setVariableLoop(CVariable.genderVarName,"");
	setVariableLoop(CVariable.avatarVarName,CTemplate.defaultAvatar);
	getVariable(CVariable.avatarVarName).type=CVariable.vtText;



/** @const */ var x=1;
/** @param {TPage} page The page to parse */



	<div id="login-form" title="Access To Justice 5 Authoring System Sign in">
		<form>
			<fieldset>
			<label for="username">Name</label>
			<input type="text" name="username" id="username" class="text ui-widget-content ui-corner-all"  />
			<label for="password">Password</label>
			<input type="password" name="password" id="password" class="text ui-widget-content ui-corner-all"   />
			</fieldset>
		</form>
	</div>


/*
function checkLength( o, n, min, max ) {
	if ( o.val().length > max || o.val().length < min ) {
		 o.addClass( "ui-state-error" );
		 updateTips( "Length of " + n + " must be between " + min + " and " + max + "." );
		 return false;
	} else {
		 return true;
	}
}
function signinask()
{
	$( "#login-form" ).dialog({
		autoOpen: false,
		height: 300,
		width: 350,
		modal: true,
		buttons: {
			"Sign in": signin,
			 Cancel: function() {
				  $( this ).dialog( "close" );
			 }
		},
		close: function() {
			 //allFields.val( "" ).removeClass( "ui-state-error" );
		}
	});
	$( "#login-form" ).dialog( "open" );
	
	//if (typeof autouser !== "undefined"){
		signin();
	//}
}
*/
	//var bValid = true;
	// allFields.removeClass( "ui-state-error" );
	//bValid = bValid && checkLength( name, "username", 3, 16 );
	//bValid = bValid && checkLength( password, "password", 4, 16 ); 
function browseXML(field)
{
	browseServer(field,'Lists');
}
function browseImage(field)
{
	browseServer(field,'Images');
}
function browseServer(field,kind)
{
	 // You can use the "CKFinder" class to render CKFinder in a page:
	 //var finder = new CKFinder( );
	 //finder.basePath = '../';	// The path for the installation of CKFinder (default = "/ckfinder/").
	 finder.selectActionFunction = SetFileField;
	 //CKFinder.config.startupPath ="Guides:/A2J_MobileOnline/";// "Images:/Images/";
	 CKFinder.config.startupPath =kind+":/A2J_MobileOnline/";
	// var api = finder.popup();
	// api.openFolder('Guides','/A2J_MobileOnline/')
	 //api.data={field:field,kind:kind};
	 
	 // It can also be done in a single line, calling the "static"
	 // popup( basePath, width, height, selectFunction ) function:
	 // CKFinder.popup( '../', null, null, SetFileField ) ;
	 //
	 // The "popup" function can also accept an object as the only argument.
	 // CKFinder.popup( { basePath : '../', selectActionFunction : SetFileField } ) ;
}



// This is a sample function which is called when a file is selected in CKFinder.
function SetFileField( fileUrl )
{

	$('#filePath1').val(fileUrl);
}


	//$('#filePath2').parent().find('img').attr('src','http://localhost/js/editors/ckfinder/core/connector/php/connector.php?command=Thumbnail&type=Guides&currentFolder=/A2J_MobileOnline/&langCode=en&FileName=smallestate_screenshot.jpg&')





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







// JavaScript Document
// 10/25/11 Script handler for Discovery Games and other script support.
// Script variables tracked with vars object
// Support for %% or <> style text macros
// 05/15/2012 
// Dependencies: jqhashtable-2.1.js, jquery.numberformatter-1.2.1.jsmin.js

/*
var CAJAScripter = (function(){

var functions={};
		
function CAJAScripter(){
	trace("hi");
}
 
//addFunctionLow('concat',-1,function(args){return args.join(", ");});
*/

/*
{	// Date format expected: m/dd/yyyy. 
		ch='';start++;index++;
		while (ch!='#' && ch!=EOL)
			ch=expression.substr(index++,1);
		token=expression.substr(start,index-start-1);		
		//var d=token.split("/");
		//d=Date.UTC(d[2],d[0],d[1])/1000/60/60/24;
		var d=Date.parse(token)/1000/60/60/24;
		//trace(d);
		return {str:d,type:'num'}
	}
*/ 
/*
function addJavascript(jsname,pos) {
var th = document.getElementsByTagName(pos)[0];
var s = document.createElement('script');
s.setAttribute('type','text/javascript');
s.setAttribute('src',jsname);
th.appendChild(s);
} 
*/
/*
var evalHTML_=function(html)
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
				html += evalBlock(parts[p+1]);
			}
		}
	}
	return html;
} 

return {
	 evalExpression : function (expr)				{return evalExpression_(expr);	}
	,evalHTML : function (html)						{return evalHTML_(html);	}
	,addFunction : function (name,numArgs,fnc)	{addFunctionLow(name,numArgs,fnc);}
	,var2valFunction : function(fnc) 				{var2val=fnc;}
	,setVarFunction : function(fnc) 					{setVar=fnc;}
	}
}

// Local instantiation

function HTMLReplaceMacros(html)
{	// replace macros in lesson's HTML text.
	return CALIScriptEvalHTML(html);
}


script.ep.var2valFunction(function(varName)
{
	var varName_i=varName.toLowerCase();
	if (script.vars[varName_i]==undefined)
		return 0;
	else
		return script.vars[varName_i].val;
});
var tUpdateVar;
script.ep.setVarFunction(function(varName,varVal)
{
	var varName_i=varName.toLowerCase();
	script.vars[varName_i]={name:varName,val:varVal};
	traceScript('<span class="Script Var">'+varName+'</span>='+'<span class="Script Val">'+varVal+'</span>');
	clearTimeout(tUpdateVar);tUpdateVar=setTimeout(updateVarFnc,1000);
});
updateVarFnc=function()
{
	clearTimeout(tUpdateVar);
	var rows="";
	for (var v in script.vars)
		rows+="<tr><td class='Script Var'>"+script.vars[v].name+"</td><td class='Script Val'>"+script.vars[v].val+"</td></tr>";
	$('#ScriptVar>table>tbody').children( 'tr:not(:first)' ).remove();
	$('#ScriptVar>table>tbody tr:last').after(rows);
}

function CALIScriptEvalHTML(html)
{
	html = script.ep.evalHTML(html);
	return html;
}

}

*/





   /*
   //8/3/2012 http://stackoverflow.com/questions/1176245/how-do-you-set-the-jquery-tabs-to-form-a-100-height
   function resizeUi() {
		 
   var h = $(window).height()-60;
   var w = $(window).width();
   $("#tabs").css('height', h-95 );
   $(".ui-tabs-panel").css('height', h-140 );
   };
   var resizeTimer = null;
   $(window).bind('resize', function() {
   if (resizeTimer) clearTimeout(resizeTimer);
   resizeTimer = setTimeout(resizeUi, 100);
   });
   resizeUi();
   */
   // Click on section header to expand/collapse.
   if (0) $(".header").click(function () {
      $(this).next().toggle();
      //$(this).toggleClass('.sectionheader .collapsable');
   });

	
	
	
	
	
	
//header:'<div class="A2JViewer" title="A2J Viewer"><ul class="NavBar"> <li><a href="#">Back</a></li> <li><a href="#">Next</a></li> <li>Progress: <select id="history"><option>Question 1</option><option>Question 2</option></select></li> <li class="right size3"><a href="#">A</a></li> <li class="right size2"><a href="#">A</a></li> <li class="right size1"><a href="#">A</a></li> <li class="right"><a href="#">Exit</a></li> <li class="right"><a href="#">Save</a></li> </ul> <div class="interact">This is some content </div> </div>',
	

/*

//http://net.tutsplus.com/tutorials/javascript-ajax/creating-a-windows-like-interface-with-jquery-ui/
var _init = $.ui.dialog.prototype._init;
$.ui.dialog.prototype._init = function() {
   //Run the original initialization code
   _init.apply(this, arguments);
   //set some variables for use later
   var dialog_element = this;
   var dialog_id = this.uiDialogTitlebar.next().attr('id');
   //append our minimize icon
   this.uiDialogTitlebar.append('<a href="#" id="' + dialog_id +
   '-minbutton" class="ui-dialog-titlebar-minimize ui-corner-all">'+
   '<span class="ui-icon ui-icon-minusthick"></span></a>');
//this.uiDialogTitlebar.append($("<button class='options'>Options</button>").button());
   //append our minimized state
   $('#dialog_window_minimized_container').append(
      '<div class="dialog_window_minimized ui-widget ui-state-default ui-corner-all" id="' +
      dialog_id + '_minimized">' + this.uiDialogTitlebar.find('.ui-dialog-title').text() +
      '<span class="ui-icon ui-icon-newwin"></div>');
   //create a hover event for the minimize button so that it looks good
   $('#' + dialog_id + '-minbutton').hover(function() {
      $(this).addClass('ui-state-hover');
   }, function() {
      $(this).removeClass('ui-state-hover');
   }).click(function() {
      //add a click event as well to do our "minimalization" of the window
      dialog_element.close();
      $('#' + dialog_id + '_minimized').show();
   });
   //create another click event that maximizes our minimized window
   $('#' + dialog_id + '_minimized').click(function() {
      $(this).hide();
      dialog_element.open();
   });
};
*/





	
	/*
	$('#tabviews').bind('tabsselect', function(event, ui) {
		switch (ui.panel.id){
			case 'tabsAbout':
			case 'tabsVariables':
			case 'tabsSteps':
			case 'tabsLogic':
			case 'tabsText':
			case 'tabsConstants':
				gGuide.noviceTab(ui.panel.id);
				break;
	
			default:
		}
		}); 
*/



/*#guidepanel {
	position:fixed;
	top: 0px;
	left:0px;
	right:0px;
	bottom: 0px;
}
#guidepanel.ui-tabs > .ui-tabs-nav{
	margin-left: 40px;
}
#tabnav {
	xposition:fixed;
	position:absolute;
	top: 32px;
	left: 0;
	right: 66%;
	bottom: 20px;
}
#tabviews {
	xposition:fixed;
	position:absolute;
	top: 32px;
	left: 33%;
	right: 0;
	bottom: 20px;
}*/


function selectTab(target)
{
	$('#CAJAOutline li, #CAJAIndex li').each(function(){$(this).removeClass('ui-state-active')});
	$('li').filter(function(){ return target == $(this).attr('target')}).each(function(){$(this).addClass('ui-state-active')});
}

	if (target.indexOf("STEP ")==0)
	{
		$('#tabviews').tabs('select','#tabsSteps');
	}

<div id="xguidepanel" class="tabset">
		<ul>
			<li><a href="#CAJAGuide">Guide</a></li>
		</ul>
		<div id="CAJAGuide">
			<div id="tabnav" class="ui-layout-west tabset" >
				<ul>
					<li><a href="#CAJAOutline">Outline</a></li>
					<li><a href="#CAJAIndex">Index</a></li>
					<!--<li><a href="#tabsfind">Search</a></li>-->
				</ul>
				<div class="ui-layout-content">
					<div id="CAJAOutline" class="pagelist tabContentFrame">
						<ul>
						</ul>
					</div>
					<div id="CAJAIndex" class="pagelist tabContentFrame">
						<ul>
						</ul>
					</div>
					<!--			<div id="tabsfind"> Find? </div>-->
				</div>
			</div>
			<div id="tabviews" class="ui-layout-center tabset">
				<ul>
					<li><a href="#tabsGuide">Authoring</a></li>
					<li><a href="#tabsAbout">About</a></li>
					<!--<li><a href="#tabsMapper">Map</a></li>-->
					<li><a href="#tabsVariables">Variables</a></li>
					<!--<li><a href="#tabsConstants">Constants</a></li>-->
					<li><a href="#tabsSteps">Steps</a></li>
					<li><a href="#tabsLogic">All Logic</a></li>
					<li><a href="#tabsText">All Text</a></li>
				</ul>
				<div class="ui-layout-content">
					<!--<div id="tabsMapper">
					<div class="tabHeader">
						<button zoom="fit"></button>
						<button zoom="1.2"></button>
						<button zoom="0.8"></button>
						<button ></button>
						<button ></button>
					</div>
					<div id="MapperPanel">
						<div class="map"></div>
					</div>
				</div>-->
					<div id="tabsGuide">
						<div class="tabHeader"></div>
						<div class="tabContentFrame">
							<div class="tabContent editq">Welcome to A2J Author 5.
								<p>Not sure where to start? Try some of these authoring resources:
								<ul>
									<li>Best Practices</li>
									<li>Authoring system</li>
								</ul>
								</p>
							</div>
						</div>
					</div>
					<div id="tabsAbout">
						<div class="tabHeader">About this guide</div>
						<div class="tabContentFrame">
							<div class="tabContent editq"></div>
						</div>
					</div>
					<div id="tabsVariables">
						<div class="tabHeader">Variables used in this guide</div>
						<div class="tabContentFrame">
							<div class="tabContent editq"></div>
						</div>
						<div class="tabFooter">
							<button id="var-add">Add Variable</button>
						</div>
					</div>
					<!--<div id="tabsConstants">
					<div class="tabHeader"></div>
					<div class="tabContentFrame">
						<div class="tabContent editq"></div>
					</div>
				</div>
				-->
					<div id="tabsSteps">
						<div class="tabHeader"></div>
						<div class="tabContentFrame">
							<div class="tabContent editq"></div>
						</div>
					</div>
					<div id="tabsLogic">
						<div class="tabHeader">
							<form>
								<div id="showlogic">
									<input checked="checked" type="radio" id="showlogic1" name="showlogic" />
									<label for="showlogic1">Active code fields</label>
									<input type="radio" id="showlogic2" name="showlogic" />
									<label for="showlogic2">All code fields</label>
								</div>
							</form>
						</div>
						<div class="tabContentFrame">
							<div class="tabContent editq"></div>
						</div>
					</div>
					<div id="tabsText">
						<div class="tabHeader">
							<form>
								<div id="showtext">
									<input checked="checked" type="radio" id="showtext1" name="showtext" />
									<label for="showtext1">Show only filled text</label>
									<input type="radio" id="showtext2" name="showtext" />
									<label for="showtext2">Show all text blocks</label>
								</div>
							</form>
						</div>
						<div class="tabContentFrame">
							<div class="tabContent editq"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

x#cajasettings  {
	top:0;
	right:0;
	position: fixed;
}
x#cajasettings li {
	width: 150px;
}

   if (typeof tinyMCE === "undefined") tinyMCE = {};



 /*********** TinyMCE ***************/
.mceExternalToolbar {
	xposition: fixed !important;
	top: 60px !important;
	text-align: center;

	position: absolute !important;
	xtop: -20px !important;
	left: 0px;

	z-index: 12;
}


function gotoTabOrPage(target)
{
	selectTab(target);
	
	// Remove existing editors 
	//for (var edId in tinyMCE.editors)
	// tinyMCE.editors[edId].remove();
	if (target.indexOf("PAGE ")==0)
	{
		gotoPageEdit(target.substr(5));
	}
	else
	if (target.indexOf("STEP ")==0)
	{
		$('#tabviews').tabs('select','#tabsSteps');
	}
	else{
		$('#tabviews').tabs('select',target);
	}	
	// Attach editors
	//attach all immediate $('.tinyMCEtext').each(function(){tinyMCE.execCommand("mceAddControl", false, $(this).attr('id'));	});
/*	$('.tinyMCEtext').click(function(){
		var id=$(this).attr('id');
		tinyMCE.execCommand("mceAddControl", false, id);
		tinyMCE.execCommand('mceFocus',true,id);
		
		});
*/
}



//var _GCS = {  //global CAJA script// Note:  Not re-entrant.

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



function loadGuideFile2(guideFile,startTabOrPage)
{
   var cajaDataXML;
   $.ajax({
      url: guideFile,
      dataType: ($.browser.msie) ? "text" : "xml", // IE will only load XML file from local disk as text, not xml.
      timeout: 45000,
      error: function(data,textStatus,thrownError){
        DialogAlert('Error occurred loading the XML from '+this.url+"\n"+textStatus);
       },
      success: function(data){
         //var cajaDataXML;
         if ($.browser.msie)
         {  // convert text to XML. 
            cajaDataXML = new ActiveXObject('Microsoft.XMLDOM');
            cajaDataXML.async = false;
            data=data.replace('<!DOCTYPE Access2Justice_1>','');//02/27/12 hack bug error
            cajaDataXML.loadXML(data);
         }
         else
         {
            cajaDataXML = data;
         }
         cajaDataXML=$(cajaDataXML); 
         // global variable guide
         gGuide =  parseXML_Auto_to_CAJA(cajaDataXML);
         gGuide.filename=guideFile;
         guideStart(startTabOrPage);         
      }
   });
}



			case 'tabsPageView':
				//a2jviewer.layoutpage(ui.panel,gGuide,gGuide.steps,gPage); 
				break;





	$('#cajasettings a').click(function(){
			var attr = $(this).attr('href'); 
			switch (attr) {
				case '#save':
							guideSave();
					break;
				case '#close':
					guideClose();
					break;
				case '#sample': 
					loadGuideFile($(this).text(), "");
					break;
				case '#mode1': setMode(1); break;
				case '#mode2': setMode(2); break;
				case '#mode3': setMode(3); break;
				case '#bold': document.execCommand('bold', false, null); break;
				case '#italic': document.execCommand('italic', false, null); break;
				case '#indent': document.execCommand('indent', false, null); break;
				case '#outdent': document.execCommand('outdent', false, null); break;
				case '#text2xml': toxml(); break;
				case '#collapse': hidem(1); break;
				case '#reveal': hidem(0); break;
				case '#theme':
					styleSheetSwitch($(this).text());
					break;
				default:
					//console.log('Unhandled ' + attr);
			}
			return false;
		});
function showPageToEdit()
{	// Clicked on index, scroll to the right place in the document.
	var target=$(this).attr('target')
	gotoTabOrPage(target);
}

					<li> <a href="#" id="memenu">Me</a>
							<ul>
								<li><a href="#signout">Sign out</a></li>
							</ul>
					</li>
<li><a href="#save"><span class="ui-icon ui-icon-disk"></span>Save</a></li>
					<li><a href="#close"><span class="ui-icon ui-icon-disk"></span>Close</a></li>
					<li  > <a href="#">Text</a>
							<ul>
								<li> <a href="#bold">Bold</a> </li>
								<li> <a href="#italic">Italic</a> </li>
								<li> <a href="#indent">Indent</a> </li>
								<li> <a href="#outdent">Outdent</a> </li>
							</ul>
					</li>
					
					
					
					
					
					var textonlyMode=0; // textonlyMode for single document editing
var editMode= 0 ; // editMode=0 if separate pages, =1 for single document

	//if(editMode==1)
	//	$('#advanced').html(gGuide.convertToText());
	//else
	
		//if (editMode==0) startTabOrPage = "PAGE " + startTabOrPage;


function showPageToEdit()
{	// Clicked on index, scroll to the right place in the document.
	var target=$(this).attr('target')
//	if (editMode==1)
//		showPageToEditTextOnly(target)
//	else
		gotoTabOrPage(target);
}



			/*
			fs.append(form.tableManager({name:'Authors',picker:'',min:1,max:12,list:guide.authors,blank:blankAuthor
				,columns: ['Name','Title','Organization','EMail']
				,save:function(newlist){
					guide.authors=newlist; }
				,create:function(author){
					var cols=[
						form.text({  placeholder:'author name',value:author.name,
							change:function(val,author){author.name=val}})
						,form.text({  placeholder:'job title',value:author.title,
							change:function(val,author){author.title=val}})
						,form.text({  placeholder:'organization',value:author.organization,
							change:function(val,author){author.organization=val}})
						,form.text({  placeholder:'email',value:author.email,
							change:function(val,author){author.email=val}})
					];
					return cols;
				}}));*/

			
			/*
			fs.append(form.tableRowCounter('Steps','Number of steps',2, CONST.MAXSTEPS,guide.steps.length)); 
			var steps=[];
			for (var s in guide.steps)
			{
				var step=guide.steps[s];
				steps.push({ row: [form.text({value:step.number,class:'narrow'}),form.text({value:step.text})]});
			}
			fs.append(form.tableRows('Steps',['Step','Sign'],steps).addClass(''));
			t.append(fs);
			*/
/*
			$row.hover(
				function(){ // start hovering
					$('.editicons').remove();
					$(this).append('<span class="editicons"><a href="#" class="ui-icon ui-icon-circle-plus"></a><a href="#" class="ui-icon ui-icon-circle-minus"></a></span>');
					$('.editicons .ui-icon-circle-plus').click(function(){
						// Insert blank statement above
						var line = $(this).closest('li');
						var cmd = $(this).closest('li').find('.adv.res').html();
					});
					$('.editicons .ui-icon-circle-minus').click(function(){
						// Delete statement line
						var line = $(this).closest('li');
						//line.remove();
					});
				},
				function(){ // stop hovering
					$('.editicons').remove();}
			);
			*/
x.header {
	border-bottom : 2px solid #cccccc;
	padding-top: 4px;
	padding-bottom: 0px;
	background-image: url(img/CAJA_Icon_48.png);
	background-repeat: no-repeat;
	padding-left: 50px;
}
function layoutPanes()
{
   // Splitter layout
	/*
   var outerLayout = $('#authortool').layout({ //$('body').layout({
      // enable showOverflow on west-pane so popups will overlap north pane
      enableCursorHotkey: false,
      west__showOverflowOnHover: false
		, north__showOverflowOnHover: true
		, north__size: 85
		, west__size: 300
		, east__size: 300
		, east__initClosed: false
		, north__closable: false, north__resizable: false
   });
   var eastLayout = $('div.ui-layout-east').layout({
      enableCursorHotkey: false,
      minSize: 50	// ALL panes
		, north__paneSelector: ".east-north"
		, north__size: 200
		, center__paneSelector: ".east-center"
   });
   
	*/
}


/**************************/
/* Frame Layout Theme  */
.ui-layout-pane { /* all 'panes' */
	border: 1px solid #BBB;
	padding: 10px;
	overflow:  hidden;
}
.ui-layout-content {
	overflow: auto;
}
.ui-layout-resizer { /* all 'resizer-bars' */
	background: #DDD;
}
.ui-layout-toggler { /* all 'toggler-buttons' */
	background: #AAA;
}
	<div class="ui-layout-east">
		<div class="east-north tabset">
			<ul>
				<li><a href="#tabsvars">Variables</a></li>
				<li><a href="#tabsvarssnapshots">Snapshots</a></li>
			</ul>
			<div class="ui-layout-content">
				<div id="tabsvars">
					<button id="vars_load"> </button>
					<button id="vars_save"> </button>
					<p>Variables</p>
				</div>
				<div id="tabsvarssnapshots">
					<button id="vars_load2"> </button>
					<button id="vars_save2"> </button>
					<p>Variables</p>
				</div>
			</div>
		</div>
		<div class="east-center tabset"> 
			<ul>
				<li><a href="#tabstracer">Tracer</a></li>
				<li><a href="#tabsextra">Extra</a></li>
			</ul>
			<div class="ui-layout-content">
				<div id="tabstracer"> 
			<ul id="tracer">
				<li> Player debug tracing goes here </li>
			</ul>
			
			
				</div>
				<div id="tabsextra"> 
					<p>extra</p>
				</div>
			</div>
			
	 </div>
	</div>

	<div class="ui-layout-south"><span id="CAJAStatus"></span><span style="float:right;text-align:right">All Contents &copy; CALI, The Center for Computer-Assisted Legal
		Instruction. All Rights Reserved.</span> </div>
/************** Menu bar ************/
ul.megamenu {
	background-color: transparent;
	z-index:2;
}
ul.megamenu a.mm-item-link:link, ul.megamenu a.mm-item-link:visited {
	color: #000;
}
ul.megamenu div ul {
	padding-left: 1em;
	list-style-type: none;
	padding: 0;
	margin: 0;
}
ul.megamenu div ul li {
	padding: .5em;
}
ul.megamenu div ul li:hover {
	background-color: #eee;
}

			if (0){
				function makeField(field){
					var field1=form.record(field);
					field1.append(form.pickList({label:'Type:',value: field.type,change:function(val,field,form){
						field.type=val;
						updateFieldLayout(form,field);
						}},fieldTypesList ));
					field1.append(form.htmlarea({label:'Label:',   value:field.label, 
						change:function(val,field){field.label=val;}}));
					field1.append(form.text({label:'Variable:', value: field.name,
						change:function(val,field){field.name=val}}));
					field1.append(form.text({label:'Default value:',name:'default', value:  field.value,
						change:function(val,field){field.value=val}}));
					field1.append(form.checkbox({label:'Validation:', checkbox:'User must fill in', value:field.optional,
						change:function(val,field){field.optional=val}}));
					field1.append(form.text({label:'Max chars:',name:'maxchars', value: field.maxChars,
						change:function(val,field){field.maxChars=val;}}));
					field1.append(form.checkbox({label:'Calculator:',name:'calculator',checkbox:'Calculator available?', value:field.calculator,
						change:function(val,field){field.calculator=val}}));
					field1.append(form.checkbox({label:'Calendar:', name:'calendar',checkbox:'Calendar available?', value:field.calendar,
						change:function(val,field){field.calendar=val}}));
					field1.append(form.text({label:'Min value:',name:'min',placeholder:'min', value: field.min,
						change:function(val,field){field.min=val}}));
					field1.append(form.text({label:'Max value:',name:'max',placeholder:'max', value: field.max,
						change:function(val,field){field.max=val}}));
					field1.append(form.htmlarea({label:'If invalid say:',value: field.invalidPrompt,	change:function(val,field){field.invalidPrompt=val}}));
					updateFieldLayout(field1,field);
					return field1;
				}			
				var fs=form.fieldset('Fields');
				fs.append(form.tableRowCounter('fields','Number of fields:',0, CONST.MAXFIELDS,page.fields.length));
				var fields=[];
				for (var f in page.fields) {
					fields.push({ record:page.fields[f], row: [ makeField(page.fields[f])]});
				}/*
				for (var f=page.fields.length;f<CONST.MAXFIELDS;f++) {
					fields.push({ record:blankField, row: [ makeField(blankField)], visible:false });
				}*/
				fs.append(form.tableRows('fields','',fields));
			}
/*
		$('.editicons .ui-icon-circle-plus',$tbl).click(function(){//live('click',function(){
			var row = $(this).closest('tr');
			row.clone(true,true).insertAfter(row).fadeIn();
			row.data('record',$.extend({},row.data('record')));
			save();
		});
		$('.editicons .ui-icon-circle-minus',$tbl).click(function(){//.live('click',function(){
			var line = $(this).closest('tr').remove();
			save();
		});
		*/			/*
		function save(){// save revised order or added/removed items
			var list=[];
			trace('Save table items');
			$('tr:gt(0)',$tbl).each(function(idx){
				trace(idx);
				list.push($(this).data('record'));
			});
			data.save(list);
		}
*/

	
	,tableManager:function(data){
		var div = $('<div/>');//.append($('<label/>').text(data.label));
		/*
		var s='<select list="'+data.name+'" class="ui-state-default ui-select">';
		for (var o=data.min;o<=data.max;o++)s+="<option>"+o+"</option>";
			s+="</select>";
		s=$(s).val(data.list.length).change(function(){
			var val = ($('option:selected',this).val());
			$tbody = $(this).parent().find('table tbody');
			var rows = $('tr',$tbody).length;
			for (var r=0;r<rows;r++)
				$('tr:nth('+r+')',$tbody).showit(r<val);
			for (var r=rows;r<val;r++)
				$('tr:last',$tbody).clone(true).appendTo($tbody);//no longer used?
				
			});
		div.append(s);
		*/
		
		var $tbl=$('<table/>').addClass('list').data('data',data).attr('list',data.name);
		
		if (typeof data.columns!=="undefined")
		{
			var tr="<tr valign=top>" + "<th>-</th>" ;//+ "<th>#</th>";
			for (var col in data.columns)
			{
				tr+="<th>"+data.columns[col]+"</th>";
			}
			tr+="</tr>";
			$tbl.append($(tr));
		}
		function addRow(record)
		{
			var $row=$('<tr valign=top class="ui-corner-all" name="record"/>');
			$row.append($('<td class="editicons"/>')
				.append('<span class="ui-draggable sorthandle ui-icon ui-icon-arrowthick-2-n-s"/><span class="ui-icon ui-icon-circle-plus"/><span class="ui-icon ui-icon-circle-minus"/>'));
			//$row.append($("<td>"+(i+1)+"</td>"));
			//$row.append($("<td/>").append(data.create(data.list[i])));
			var cols = data.create(record);
			for (var c in cols){
				$row.append($('<td/>').append(cols[c]));
			}			
			$row.data('record',record); 
			$tbl.append($row);
		}
		
		for (var i=0;i<data.list.length;i++)
			addRow(data.list[i]);
			
		function save(){// save revised order or added/removed items
			var list=[];
			trace('Save table items');
			$('tr:gt(0)',$tbl).each(function(idx){
				trace(idx);
				list.push($(this).data('record'));
			});
			data.save(list);
		}
		$('tbody',$tbl).sortable({
			handle:"td .sorthandle",
			update:function(event,ui){
				save();
			}})//.disableSelection();

		$('.editicons .ui-icon-circle-plus',$tbl).click(function(){//live('click',function(){
			var row = $(this).closest('tr');
			row.clone(true,true).insertAfter(row).fadeIn();
			row.data('record',$.extend({},row.data('record')));
			save();
		});
		$('.editicons .ui-icon-circle-minus',$tbl).click(function(){//.live('click',function(){
			var line = $(this).closest('tr').remove();
			save();
		});
		div.append($tbl);
		div.append($('<button id="newrow"/>').button({label:'Add',icons:{primary:"ui-icon-plusthick"}}).click(function(){
			addRow($.extend({},data.blank));
			save();
		}));
		return div;
	} 
	
	
			/*
			fs.append(form.tableManager({name:'Fields',picker:'Number of fields',min:0,max:CONST.MAXFIELDS,list:page.fields,blank:blankField
				,columns:['Label','Var Name','Default Value','Type','Required?','Max Chars','Calc?','Calendar?','Min/Max Value','Invalid Prompt']
				,save:function(newlist){page.fields=newlist; }
				,create:function(field){
					var cols=[
						form.htmlarea({  value:field.label, 							change:function(val,field){field.label=val;}})
						,form.text({  value: field.name, placeholder:'variable',						change:function(val,field){field.name=val}})
						,form.text({  name:'default', placeholder:'default value',	value:  field.value, 				change:function(val,field){field.value=val}})
						,form.pickList({  value: field.type,change:function(val,field,form){
							field.type=val;
							updateFieldLayout(form,field);
							}},fieldTypesList)
						,form.checkbox({ checkbox:'', value:field.required, change:function(val,field){field.required=val}})
						,form.text({name:'maxchars', width:'3em', placeholder:'max chars',	value: field.maxChars,			change:function(val,field){field.maxChars=val;}})
						,form.checkbox({ name:'calculator',checkbox:'', value:field.calculator,change:function(val,field){field.calculator=val}})
						,form.checkbox({  name:'calendar',checkbox:'', value:field.calendar, change:function(val,field){field.calendar=val}})
						,form.text({ name:'min', placeholder:'min',	value: field.min, 						change:function(val,field){field.min=val}})
						.append(form.text({ name:'max',placeholder:'max',	 value: field.max, 						change:function(val,field){field.max=val}}))
						,form.htmlarea({value: field.invalidPrompt,	change:function(val,field){field.invalidPrompt=val}})
					];
					//updateFieldLayout(field1,field);
					return cols;
				}}));
				*/
			/*
			fs.append(form.tableRowCounter('buttons','Number of buttons:',1, CONST.MAXBUTTONS,page.buttons.length));
			function makeButton(b)
			{
				var record=form.record(b);
				record.append(form.text({label:'Label:', 				value: b.label,	change:function(val){b.label=val}}));
				record.append(form.text({label:'Var Name:', 			value: b.name, 	change:function(val){b.name=val}}));
				record.append(form.text({label:'Var Value:',			value: b.value,	change:function(val){b.value=val}}));
				record.append(form.pickpage({label:'Destination:', value: b.next, 	change:function(val){b.next=val;trace(b.next);}}));
				return record;
			}
			var buttons=[];
			for (var b in page.buttons) {
				buttons.push({ row: [ makeButton(page.buttons[b])]});
			}
			var blankButton=new TButton();
			for (var b=page.buttons.length;b<CONST.MAXBUTTONS;b++) {
				buttons.push({ row: [ makeButton(blankButton)], visible:false });
			}
			fs.append(form.tableRows('buttons','',buttons));
			*/
			fs.append(form.tableManager({name:'Buttons',picker:'Number of buttons',min:1,max:CONST.MAXBUTTONS,list:page.buttons,blank:blankButton
				,columns: ['Label','Var Name','Default value','Destination']
				,save:function(newlist){
					page.buttons=newlist; }
				,create:function(b){
					var cols=[
						form.text({ 		value: b.label,placeholder:'caption',		change:function(val,b){b.label=val}})
						,form.text({ 		value: b.name, placeholder:'variable',		change:function(val,b){b.name=val}})
						,form.text({ 		value: b.value,placeholder:'value',		change:function(val,b){b.value=val}})
						,form.pickpage({	value: b.next, 	change:function(val,b){b.next=val;}})
					];
					//updateFieldLayout(field1,field);
					return cols;
				}}));
			
			/*
			fs.append(form.tableManager({name:'Fields',picker:'Number of fields',min:0,max:CONST.MAXFIELDS,list:page.fields,blank:blankField,
				create:function(field){
					var field1=form.record(field); 
					field1.append(form.pickList({label:'Type:',value: field.type,change:function(val,field,form){
						field.type=val;
						updateFieldLayout(form,field);
						}},fieldTypesList ));
					field1.append(form.htmlarea({label:'Label:',   value:field.label, 							change:function(val,field){field.label=val;}}));
					field1.append(form.text({label:'Variable:', value: field.name, 						change:function(val,field){field.name=val}}));
					field1.append(form.text({label:'Default value:',name:'default', value:  field.value, 				change:function(val,field){field.value=val}}));
					field1.append(form.checkbox({label:'Validation:', checkbox:'User must fill in', value:field.optional, change:function(val,field){field.optional=val}}));
					field1.append(form.text({label:'Max chars:',name:'maxchars', value: field.maxChars,			change:function(val,field){field.maxChars=val;}}));
					field1.append(form.checkbox({label:'Calculator:',name:'calculator',checkbox:'Calculator available?', value:field.calculator,change:function(val,field){field.calculator=val}}));
					field1.append(form.checkbox({label:'Calendar:', name:'calendar',checkbox:'Calendar available?', value:field.calendar, change:function(val,field){field.calendar=val}}));
					field1.append(form.text({label:'Min value:',name:'min', value: field.min, 						change:function(val,field){field.min=val}}));
					field1.append(form.text({label:'Max value:',name:'max', value: field.max, 						change:function(val,field){field.max=val}}));
					field1.append(form.htmlarea({label:'If invalid say:',value: field.invalidPrompt,	change:function(val,field){field.invalidPrompt=val}}));
					updateFieldLayout(field1,field);
					return field1;
				}}));
				*/
TGuide.prototype.noviceStep=function(div,stepid)
{	// Show all pages in specified step
	var t=$('<div/>');//.addClass('editq');
	var step=this.steps[stepid];
	t.append(form.h1("Step #"+step.number+" " + step.text));
	var stepPages=[];
	for (var p in this.pages)
	{
		var page = this.pages[p];
		if (page.step==stepid)
			stepPages.push(page);
	}
	t.append(form.note("There are "+stepPages.length+" pages in this step."));
	for (var p in stepPages)
	{
		var page = stepPages[p];
		t.append(form.h2("Page "+(parseInt(p)+1)+" of "+stepPages.length));
		this.novicePage(t,page.name);
	}
	div.append(t);
}

TGuide.prototype.dump=function()
{	// Generate report of entire CAJA contents
	var txt="",p, f, b, page, field, button,txtp;
	
	function row(a,b,c,d){return '<tr><td>'+a+'</td><td>'+b+'</td><td>'+c+'</td><td>'+d+'</td></tr>\n'};
	txt += row('title','','',this.title)
		+row('viewer','','',this.viewer)
		+row('description','','',this.description);
	for (p in this.pages)
	{
		page = this.pages[p];
		txtp= row(page.id,'','id',page.id)
			+  row(page.id,'','name',page.name)
			+  row(page.id,'','text',page.text);
		for (f in page.fields)
		{
			field=page.fields[f];
			txtp += row(page.id,'field'+f,'label',field.label);
			txtp += row(page.id,'field'+f,'type',field.type);
			txtp += row(page.id,'field'+f,'name',field.name);
			txtp += row(page.id,'field'+f,'optional',field.optional);
			txtp += row(page.id,'field'+f,'invalidPrompt',field.invalidPrompt);
		}
		for (b in page.buttons)
		{
			button=page.buttons[b];
			txtp += row(page.id,'button'+b,'label',button.label);
			txtp += row(page.id,'button'+b,'next',button.next);
		}
		txt += txtp;
	}
	return '<table class="CAJAReportDump">'+txt+'</table>';
}




function js2xml(o)
{ 
	var t="";
	if (typeof o==="object")
	{
		for (var p in o)
			if (parseInt(p)>= 0)
				t += js2xml(o[p]);
			else
				t += "<"+p+">" + js2xml(o[p]) + "</"+p+">";
	}
	else
	if (typeof o !== 'function')
		t = o;
	return t;
}
	/*
	layout:function(div,curstep,steps,question,learnmore)
	{
		var stepcount=steps.length-curstep;
		var html=this.header;
		$(div).html(html);
		$('.interact',div).html(a2jviewer.layoutstep(stepcount));
		$('.A2JViewer .ui-form.question').html(question);
		$('.A2JViewer .ui-form.learnmore').html(learnmore);
		$('.stepnumber.step1').text(steps[curstep].number);
		$('.steptext.step1').text(steps[curstep].text);
		$('.circle1').attr('src',''+IMG+'step_circle_'+(curstep%3)+'.png');
		if (curstep<steps.length-1)
		{
			$('.stepnumber.step2').text(steps[curstep+1].number);
			$('.steptext.step2').text(steps[curstep+1].text);
			$('.circle2').attr('src',''+IMG+'step_circle_'+((curstep+1)%3)+'.png');
		}
		$('.A2JViewer button').button()
	},*/
	
	
	
	<p>8/3/2012 Novice mode instead. </p>
		<p>5/09/2012 Entire interview/lesson as an editable text file. jQuery provides immediate parsing to detect information - using Context Sensitive tool bar.</p>

				var ff={group:"Field",
					fields:[
						 {label:'Name',type:'text',id:'name',value: field.name}
						,{label:'Label',type:'text',id:'label',value: field.label}
						,{label:'Optional',type:'text',id:'optional',value: field.optional}
						,{label:'If invalid say:',type:"htmlarea",id:"invalidPrompt",value: field.invalidPrompt}
					]};
				tf.fieldsets.push(ff)//t+=walk(ff);		
	
		var tf= {
			title:"Page",
			fieldsets: [
				{	group:"Page info",
					fields:[
						 {label:"Name:", id:"name", type:"text", value: page.name }
						,{label:"Page type/style:", id:"typestyle", type:"text", value: page.type+"/"+page.style } 
						,{label:"Text:",id:"text",type:"htmlarea", rows:4, value:page.text}
					]
				} 
				]
		};
function walk(f)
{// 9/2012 old idea to define author edit forms as JSON. 
	var t;
	t="";
	for (var e in f)
	{
		var elt=f[e];
		switch(e){
			case "title":
				t+=form.h1(elt);
				break;
			case "group":
				t+=form.h2(elt);
				break;
			case "fieldsets":
				for (var fs in elt)
					t+=walk(elt[fs]);
				break;
			case "fields":
				//t+='<table class="list" width=100%>';
				for (var fi in elt){
					var field=elt[fi];
					var value=field.id;
					if (value.indexOf("meta.")==0)
						value=guide[value.substr(5)];
					var group="";
					switch (field.type){
						case "text":
							if (typeof field.value==="undefined") field.value="";
							t+=form.text(field.label,"group",field.id,field.value);
//							t+="<tr><td><label>"+field.label+'</label></td><td><input class="editable" type="text" name="'+group+field.id+'" value="'+htmlEscape(value)+'"></td></tr>';
							break;
						case "textarea":
							if (typeof field.rows==="undefined") field.rows=1; 
							if (typeof field.value==="undefined") field.value="";
							t+=form.textarea(field.label,"group",field.id,field.value, field.rows);
//							t+="<tr><td><label>"+field.label+'</label></td><td><textarea  class="editable"  name="'+group+field.id+'" rows='+field.rows+'>'+value+'</textarea></td></tr>';
							break;
						case "htmlarea":
							if (typeof field.rows==="undefined") field.rows=1; 
							if (typeof field.value==="undefined") field.value="";
							t+=form.htmlarea(field.label,"group",field.id,field.value,field.rows);
//							t+="<tr><td><label>"+field.label+'</label></td><td><div contenteditable=true class="editable tinyMCEtext" id="tinyMCE_'+group+field.id+'" name="'+field.id+'" rows='+field.rows+'>'+value+'</div></td></tr>';
							break;
						default:
							t+=form.h1("Unknown field type: " + field.type);
					}
				}
				//t+="</table>";
				break;
			default:
				t+=form.h1("Unknown elt: " + e);
		}
	}
	return t;
}
		/*
			var tf= {
				title:"Meta",
				fieldsets: [
					{	group:"About",
						fields:[
							 {label:"Title:",id:"meta.title",type:"text" }
							,{label:"Description:",id:"description",type:"textarea", rows:4}
							,{label:"Jurisdiction:",id:"jurisdiction",type:"text" }
							,{label:"Credits:",id:"credits",type:"textarea", rows:4}
							,{label:"Approximate Completion Time:",id:"completionTime",type:"text" }
						]
					}
					,{ group:"Authors",
						fields:[{label:"Name",id:"name",type:"text"}]
					}
					,{ group:"Revisions",
						fields:[
							 {label:"Current Version",id:"version",type:"text",}
							,{label:"Revision History:",id:"history",type:"textarea", rows:7}
							]
					}
					]
			}
			t+=walk(tf); 
*/






var clist=dlist=[];
			for (var d in page.details){
				var detail=page.details[d];
				clist.push({row:[
					{label:detail.label},
					{type:'scorepicker',value: detail.score},
					{type:'htmlarea',id:GROUP+"CHOICE"+d,value:detail.text}
				]});
				var fb=page.feedbacks[fbIndex(0,d)];
				dlist.push({row:
							  [{label:detail.label}
								,{type:'scorepicker',value:detail.score},
								{"SCORE",form.picklist("branchstyle",["Display feedback","Display feedback then jump","No feedback, just jump"])
+ form.htmlarea("",GROUP+"CHOICE"+d,"fb"+d,fb.text)]});
			}
			t+=form.h1('Choices');
			t+=form.tablecount("Number of choices",2,7) + form.tablerange(list);
			list=[];
			for (d in page.details){
			}  
			t+=form.h1('Feedback');
			t+=form.tablerange(list);
			
			
			
			
			

/* jquery.megamenu.min.js */
var isIE6=navigator.userAgent.toLowerCase().indexOf("msie 6")!=-1;jQuery.fn.megamenu=function(a){a=jQuery.extend({activate_action:"mouseover",deactivate_action:"mouseleave",show_method:"slideDown",hide_method:"slideUp",justify:"left",enable_js_shadow:true,shadow_size:3,mm_timeout:250},a);var b=this;if(a.activate_action=="click"){a.mm_timeout=0}b.children("li").each(function(){jQuery(this).addClass("mm-item");jQuery(".mm-item").css({"float":a.justify});jQuery(this).find("div:first").addClass("mm-item-content");jQuery(this).find("a:first").addClass("mm-item-link");var d=jQuery(this).find(".mm-item-content");var e=jQuery(this).find(".mm-item-link");d.hide();jQuery(document).bind("click",function(){jQuery(".mm-item-content").hide();jQuery(".mm-item-link").removeClass("mm-item-link-hover")});jQuery(this).bind("click",function(f){f.stopPropagation()});d.wrapInner('<div class="mm-content-base"></div>');if(a.enable_js_shadow==true){d.append('<div class="mm-js-shadow"></div>')}var c=0;jQuery(this).bind(a.activate_action,function(h){h.stopPropagation();var g=jQuery(this).find("a.mm-item-link");var f=jQuery(this).find("div.mm-item-content");clearTimeout(c);c=setTimeout(function(){g.addClass("mm-item-link-hover");f.css({top:(e.offset().top+e.outerHeight())-1+"px",left:(e.offset().left)-5+"px"});if(a.justify=="left"){var j=b.offset().left+b.outerWidth();var k=e.offset().left+d.outerWidth()-5;if(k>=j){f.css({left:(e.offset().left-(k-j))-2+"px"})}}else{if(a.justify=="right"){var i=b.offset().left;var l=e.offset().left-f.outerWidth()+e.outerWidth()+5;if(l<=i){f.css({left:i+2+"px"})}else{f.css({left:l+"px"})}}}if(a.enable_js_shadow==true){f.find(".mm-js-shadow").height(f.height());f.find(".mm-js-shadow").width(f.width());f.find(".mm-js-shadow").css({top:(a.shadow_size)+(isIE6?2:0)+"px",left:(a.shadow_size)+(isIE6?2:0)+"px",opacity:0.5})}switch(a.show_method){case"simple":f.show();break;case"slideDown":f.height("auto");f.slideDown("fast");break;case"fadeIn":f.fadeTo("fast",1);break;default:f.each(a.show_method);break}},a.mm_timeout)});jQuery(this).bind(a.deactivate_action,function(h){h.stopPropagation();clearTimeout(c);var g=jQuery(this).find("a.mm-item-link");var f=jQuery(this).find("div.mm-item-content");switch(a.hide_method){case"simple":f.hide();g.removeClass("mm-item-link-hover");break;case"slideUp":f.slideUp("fast",function(){g.removeClass("mm-item-link-hover")});break;case"fadeOut":f.fadeOut("fast",function(){g.removeClass("mm-item-link-hover")});break;default:f.each(a.hide_method);g.removeClass("mm-item-link-hover");break}if(f.length<1){g.removeClass("mm-item-link-hover")}})});this.find(">li:last").after('<li class="clear-fix"></li>');this.show()};

 //  jQuery(".megamenu").megamenu({ 'show_method': 'simple', 'hide_method': 'simple', mm_timeout: 125, 'enable_js_shadow': true, 'shadow_size': 5, 'deactivate_action': 'mouseleave click' });




/* */
