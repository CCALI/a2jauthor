/*	CALI Author 5 - CAJA Authoring editor 
 	03/30/2012 
 */

// Declare global variables
var caja; // type TCAJA (CBK or A2J)




$(document).ready(function()
{  
	// Everything loaded, execute.
	lang.set('en'); 
	
	
	// Declare TinyMCE Editor options
	// Notice: The simple theme does not use all options some of them are limited to the advanced theme
	if (typeof tinyMCE=="undefined")
		tinyMCE={};
	else
	tinyMCE.init({
		theme : "advanced",
		//theme_advanced_toolbar_location : "top",
		//theme_toolbar_location : "top",
		theme_advanced_toolbar_location : "external",
		theme_advanced_layout_manager: 'SimpleLayout',
		//mode : "none",
		
	 //	plugins: "autoresize",//8/3/12 SJG hid the progress spinner - too distracting
		
		theme_advanced_buttons1 : "cut,copy,paste,undo,redo,separator,bold,italic,underline,separator,sub,sup,separator,justifyleft,justifycenter,separator,bullist,numlist,blockquote,separator,outdent,separator,indent,separator,link,image,charmap,spellchecker,separator",
		theme_advanced_buttons2 : "",
		theme_advanced_buttons3 : "",
	//theme_advanced_buttons1 : "separator,insertdate,inserttime,preview,zoom,separator,forecolor,backcolor",
	//theme_advanced_buttons2 : "bullist,numlist,separator,outdent,indent,separator,undo,redo,separator",
	//theme_advanced_buttons3 : "hr,removeformat,visualaid,separator,sub,sup,separator,charmap"
	
		// 8/2/12 SJG Keep underline as U rather than text-decoration
		inline_styles : false, 
		formats : {
			underline : {inline : 'u', exact : true}
		},
		//http://www.tinymce.com/wiki.php/Configuration:valid_elements
		valid_elements : "@[id|class|style|title|dir<ltr?rtl|lang|xml::lang|onclick|ondblclick|"
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
	
	// Activate TABS
	//$("#PageTabs").tabs(3); // first tab on by default
	$("#tabnav").tabs(); // first tab on by default
	//$("#NavPagesTabs").tabs(); // first tab on by default	<br />
	$( "#tabviews" ).tabs({ selected: 0
								 //, doesn't work show:  $.layout.callbacks.resizeTabLayout
								 });

// 9/17/12 No splitter for now.
// Splitter layout
	var outerLayout = $('body').layout({
		// enable showOverflow on west-pane so popups will overlap north pane
		enableCursorHotkey:false,
		west__showOverflowOnHover: false
		,north__showOverflowOnHover: true
		,north__size: 85
		, west__size: 300
		, east__size: 300
		, east__initClosed: false
		, north__closable: false, north__resizable: false
	});
	var eastLayout = $('div.ui-layout-east').layout({
		enableCursorHotkey:false,
			minSize:				50	// ALL panes
		,	north__paneSelector:	".east-north"
		,	north__size:			400
		,	center__paneSelector:	".east-center"
	}); 
	//$('.ui-layout-center').layout({		center__onresize:  $.layout.callbacks.resizeTabLayout												});



	if (typeof initAdvanced!="undefined")
	 	initAdvanced(); 


	// Menu bar
	jQuery(".megamenu").megamenu({ 'show_method':'simple','hide_method':'simple', mm_timeout: 125, 'enable_js_shadow':true, 'shadow_size':5,'deactivate_action':'mouseleave click' });
	$('.megamenu li div ul li a').bind('click',(function(){
		var attr=$(this).attr('href');
		switch (attr){
			case '#sample':
				//alert('Loading sample '+$(this).text());
				loadFile($(this).text());
				break;
			case '#mode1': setMode(1); break;
			case '#mode2': setMode(2); break;
			case '#mode3': setMode(3); break;
			case '#bold':  document.execCommand('bold',false,null); break;
			case '#italic':  document.execCommand('italic',false,null); break;
			case '#indent':  document.execCommand('indent',false,null); break;
			case '#outdent':  document.execCommand('outdent',false,null); break;
			case '#text2xml': toxml(); break;
			case '#collapse': hidem(1); break;
			case '#reveal': hidem(0); break;
			default:
				alert('Unhandled '+attr);
		} 
	}));



	//Ensure HTML possible for combo box pick list
	//https://github.com/scottgonzalez/jquery-ui-extensions/blob/master/autocomplete/jquery.ui.autocomplete.html.js
	$.extend( $.ui.autocomplete.prototype, {
		_renderItem: function( ul, item) {
			return $( "<li></li>" )
				.data( "item.autocomplete", item )
				.append( $( "<a></a>" )[ this.options.html ? "html" : "text" ]( item.label ) )
				.appendTo( ul );
	}});

	// Tips
	//window.setTimeout(hovertipInit, 1);
 
	// Click on section header to expand/collapse.
	if (0) $(".header").click(function(){
		$(this).next().toggle();
		//$(this).toggleClass('.sectionheader .collapsable');
	});

	
	// Draggable
	$('.hotspot').draggable({ containment: 'parent' }).resizable().fadeTo(0.1,0.9);
	 

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



	if ( 1 )
		loadFile( $('a[href="#sample"]').first().text());
	else{
		for (i=1;i<150;i++)
			$('.CAJAContent').append("<p>Line #"+i);
		for (i=1;i<100;i++)
			$('#CAJAIndex').append("<p>Outline #"+i);
		for (i=1;i<100;i++)
			$('#CAJAListAlpha').append("<p>Page alpha #"+i);
	}


});

		
function toxml()
{  // convert page at selection start into XML

}
var startTabOrPage;

function startCAJA()
{
	$('.CAJAContent').attr("CONTENTEDITABLE",editMode==1);
//	$('.CAJAContent').html(caja.dump());
	if(editMode==1)
		$('#CAJAContent').html(caja.convertToText());
	else
		gotoTabOrPage(startTabOrPage);
	$('#CAJAIndex').html(caja.convertIndex());
	$('#CAJAListAlpha').html(caja.convertIndexAlpha());
	$('#CAJAIndex li').click(showPageToEdit);
	if (editMode==1)
	{
		setMode(2);
		showPageToEditTextOnly(startTabOrPage);
	}
}

function setMode(mode)
{
	if (editMode==0){
		editMode=1;
		startCAJA();
		return false;
	}
	textonlyMode=mode;
	prompt('scanning');
	//$('.CAJAContent P').removeClass('hilite').filter(function(){ return $(this).text().indexOf('Question ')==0;}).addClass('hilite');
	$('.inform').remove();
	
	//alert($('.CAJAContent > P').length);
	$('.CAJAContent > P, .CAJAContent > DIV > P').each(function(){parseP($(this))});
	prompt('.');
	return false;
}
function showPageToEdit()
{	// Clicked on index, scroll to the right place in the document.
	var target=$(this).attr('target')
	if (editMode==1)
		showPageToEditTextOnly(target)
	else
		gotoTabOrPage(target);
}

function gotoTabOrPage(target)
{
	// Remove existing editors 
	
	for (var edId in tinyMCE.editors)
		tinyMCE.editors[edId].remove();
 

	
	$('#CAJAContent').html('');
	
	var html;
	if (target.indexOf("TAB ")==0)
		html=caja.noviceTab($('#CAJAContent'),target.substr(4));
	else
	if (target.indexOf("PAGE ")==0)
		html=caja.novicePage($('#CAJAContent'),target.substr(5));
	else
	if (target.indexOf("STEP ")==0)
		html=caja.noviceStep($('#CAJAContent'),target.substr(5));

	
	
	// Attach editors
	//attach all immediate $('.tinyMCEtext').each(function(){tinyMCE.execCommand("mceAddControl", false, $(this).attr('id'));	});
/*	$('.tinyMCEtext').click(function(){
		var id=$(this).attr('id');
		tinyMCE.execCommand("mceAddControl", false, id);
		tinyMCE.execCommand('mceFocus',true,id);
		
		});
*/



}



function prompt(status)
{
	if (status==null) status="";
	$('#CAJAStatus').text( status );
	trace(status);
}



function loadFile(bookFile)
{
	bookFile=bookFile.split("#");
	if (bookFile.length==1)
	{
		startTabOrPage="TAB ABOUT";
		bookFile=bookFile[0];
	}
	else
	{
		startTabOrPage=bookFile[1];
		if (editMode==0) startTabOrPage = "PAGE " + startTabOrPage;
		bookFile=bookFile[0];
	}
	prompt('Loading '+bookFile);
	prompt('Start location will be '+startTabOrPage);
	$('.CAJAContent').html('Loading '+bookFile+AJAXLoader);
	
	
	$('#CAJAIndex, #CAJAListAlpha').html('');
	
	
	window.setTimeout(function(){loadFile2(bookFile)},500);
}
function loadFile2(bookFile)
{
	var cajaDataXML;
	$.ajax({
			url: bookFile,
			dataType: ($.browser.msie) ? "text" : "xml", // IE will only load XML file from local disk as text, not xml.
			timeout: 45000,
			error: function(data,textStatus,thrownError){
			  alert('Error occurred loading the XML from '+this.url+"\n"+textStatus);
			 },
			success: function(data){
				//var cajaDataXML;
				if ($.browser.msie)
				{	// convert text to XML. 
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
				// global variable caja
				caja =  parseXML_Auto_to_CAJA(cajaDataXML);
				startCAJA();
				
			}
		});
}
