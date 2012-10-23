/*	CALI Author 5 - CAJA Authoring   
 	03/30/2012 
 */



/* 
function DEBUGSTART(){
	var SAMPLES = [
		"tests/data/Field Characters Test.a2j#0-1 Intro",
		"tests/data/A2J_FieldTypesTest_Interview.xml#1-1 Name",
		"tests/data/CBK_CAPAGETYPES_jqBookData.xml", 
		"tests/data/CBK_CAPAGETYPES_jqBookData.xml#MC Choices 3: 4 choices", 
		"tests/data/A2J_NYSample_interview.xml",
		"tests/data/A2J_MobileOnlineInterview_Interview.xml",
		"tests/data/A2J_ULSOnlineIntake081611_Interview.xml#1b Submit Application for Review",
		"tests/data/CBK_EVD03_jqBookData.xml"
	];
	$(SAMPLES).each(function(i,elt){$('#samples').append('<li><a href="#sample">'+elt+'</a></li>')})
//	<li><a href="#sample">tests/data/A2J_FieldTypesTest_Interview.xml#1-1 Name</a></li>
//	<li><a href="#sample">tests/data/A2J_NYSample_interview.xml</a></li>
//	<li><a href="#sample">tests/data/A2J_MobileOnlineInterview_Interview.xml</a></li>
//	<li><a href="#sample">tests/data/A2J_ULSOnlineIntake081611_Interview.xml#1b Submit Application for Review</a></li>
//	<li><a href="#sample">tests/data/CBK_CAPAGETYPES_jqBookData.xml#Text Select 2</a></li>
//	<li><a href="#sample">tests/data/CBK_CAPAGETYPES_jqBookData.xml#MC Choices 3: 4 choices</a></li>
//	<li><a href="#sample">tests/data/CBK_EVD16_jqBookData.xml</a></li>
//	<li><a href="#sample">tests/data/CBK_EVD03_jqBookData.xml</a></li>
//	var t="";	for( var m=1000;m<2500;m++) t+= m +" " ;	$('#Mapper').append( t);
	loadGuide($('a[href="#sample"]').first().text(), "TAB ABOUT");
	$('#authortool').removeClass('hidestart').addClass('authortool');
	$('.welcome').hide();
	layoutPanes();
} /* */
 
 
var form={
	id:0, 
	 h1:function(h){
		return $("<h1>"+h+"</h1>");}
	,h2:function(h){
		return $("<h2>"+h+"</h2>").click(function(){$(this).next().toggle()});}
	,fieldset:function(legend){
		return $("<fieldset><legend >"+legend+"</legend></fieldset>")//.click(function(){$(this).next().toggle()});
		}
	,note:function(t){
		return $("<div>"+t+"</div>")}
		
		
	,number:    function(label,value,minNum,maxNum,handler){
		return "<label>"+label+'</label><input class="editable" type="text" name="'+group+id+'" value="'+htmlEscape(value)+'"> ';}
		
	,text: function(label,value,handler){
		var e=$("<label>"+label+'</label><span class=editspan> <input class="editable" type="text""/> </span>');
		$('input',e).blur(function(){ handler.change($(this).val() ) } ).val(decodeEntities(value));
		return e;
	}
	,codearea:function(label,value,handler){ 
		this.id++;
		var e= $('<div>'+(label!="" ? ('<label>'+label+'</label>') : '') +
			'<span class=editspan><div contenteditable=true class="text editable taller codearea "  rows='+4+'>'+value+'</div></span></div>');
		$('.editable',e).blur(function(){var val=$(this).html();$(this).data('data').change(val);}).data('data',handler) ;
		return e;
	}
	,textarea: function(label,value,handler){
		var rows=4;
		if (typeof rows=="undefined") rows=2;
		var e=$('<label>'+label+'</label><span class=editspan><textarea  class="text editable taller" rows='+rows+'>'+value+'</textarea></span>');
		$('.editable',e).blur(function(){var val=$(this).html();$(this).data('data').change(val);}).data('data',handler) ;
		return e;
	}
	,htmlarea: function(label,value,handler){ 
		this.id++;
		var e= $('<div>'+(label!="" ? ('<label>'+label+'</label>') : '') +
			'<span class=editspan><div contenteditable=true class="text editable taller tinyMCEtext" id="tinyMCE_'+this.id+'"  name="'+this.id+'" rows='+4+'>'+value+'</div></span></div>');
		$('.editable',e).blur(function(){var val=$(this).html();$(this).data('data').change(val);}).data('data',handler) ;
		return e;
		} 
	,div:function(clas,t){
		return '<div class="'+clas+'">'+t+'</div>';}

	,pickstep:function(label,value,handler){
		var o='';
		for (var s=0;s<gGuide.steps.length;s++){
			var step = gGuide.steps[s];
			o+="<option value="+s+">"+step.number+". "+ (step.text)+"</option>";
		}
		var e =$('<div><label>'+label+'</label>' + '<select class="ui-state-default ui-select-input">'+o+'</select></div>');
		$('.ui-select-input',e).change(function(){var val=$('option:selected',this).val();  $(this).data('data').change(val);}).data('data',handler).val(value);
		return e;
	}
	,pickpage:function(label,value,handler){ 
		value = gGuide.pageDisplayName(value); 
		var e =$( (label!="" ? ('<label>'+label+'</label>') : '') + '<span class=editspan><input class="ui-state-default ui-combobox-input autocomplete picker page dest" type="text" ></span>');
		$('.picker',e).blur(function(){var val=$(this).val();$(this).data('data').change(val);}).data('data',handler).val(decodeEntities(value));
		return e;
	}
	,picklist:function(label,style,list,value){//let user choose number of said item
		var c=label+'<select class="ui-state-default ui-select '+style+'">';
		for (var o=0;o<list.length;o++)
			if (typeof list[o] === "object")
				c+="<option value="+list[o].value+">"+list[o].label+"</option>";
			else
				c+="<option value="+o+">"+list[o]+"</option>";
		c+="</select>";
		return $(c).val(value);
	}
	,pickscore:function(value){
		return this.picklist('','picker score',[
			{value:'RIGHT',label:'Right'},
			{value:'WRONG',label:'Wrong'},
			{value:'MAYBE',label:'Maybe'},
			{value:'INFO',label:'Info'}],value);
	}
	,pickbranch:function(){ 
		return this.picklist("",'picker branch',["Show feedback and return to question","Show feedback then branch to this page","Just branch directly to this page"])
		.change(function(){
			var br=$(this).val();
			$(this).parent().children('.text').toggle(br!=2);
			$(this).parent().children('.dest').toggle(br!=0);
			trace(br);
		})
	}
	,clone:function(){return 'Clone buttons';}
	,tablecount:function(label,minelts,maxelts, tablename){//let user choose number of said item
		var c=$('<label/>').text(label);
		var s='<select class="ui-state-default ui-select">';
		for (var o=minelts;o<=maxelts;o++)s+="<option>"+o+"</option>";
			s+="</select>";
		return $('<div/>').append(c.after(s).data('table',tablename));
	}
	,tablerange:function(list,headings){
		var $tbl=$('<table>').addClass('list');
		if (headings!==null){
			var tr="<tr valign=top>";
			for (var col in headings)
			{
				tr+="<th>"+headings[col]+"</th>";
			}
			tr+="</tr>";
			$tbl.append($(tr));
		}
		for (var row in list){
			var $row=$("<tr valign=top/>");
			for (var col in list[row].row)
			{
				//t+="<td>"+list[row].row[col]+"</td>";
				$row.append($("<td/>").append(list[row].row[col]));
			}
			//t+="<td>add/remove</td>";
			$tbl.append($row);
		}
		return $tbl;
//		return "<table class='list' >"+t+"</table>";
	}
	,row:function(cols){ return "<tr valign=top><td>"+cols.join("</td><td>")+"</td></tr>";}
	,rowheading:function(cols){ return "<tr valign=top><th>"+cols.join("</th><th>")+"</th></tr>";}
};



$(document).ready(function () {
   // Everything loaded, execute.
   lang.set('en');

   if (typeof tinyMCE === "undefined") tinyMCE = {};


   // Activate TABS
//'   $("#tabnav").tabs(); // first tab on by default
//'   $("#tabviews").tabs({ selected: 0 });
	$('.tabset').tabs();
	
	//$('button').button();
	$('#vars_load').button({label:'Load',icons:{primary:"ui-icon-locked"}}).next().button({label:'Save',icons:{primary:"ui-icon-locked"}});
	$('#vars_load2').button({label:'Load',icons:{primary:"ui-icon-locked"}}).next().button({label:'Save',icons:{primary:"ui-icon-locked"}});
	$('#tabviews').bind('tabsselect', function(event, ui) {
		if (ui.panel.id == 'tabsPageView' ){ 
			a2jviewer.layoutpage(ui.panel,gGuide,gGuide.steps,gPage);
			
//			var question = gPage.text;
//			var learnmore = makestr(gPage.learnmore);
//			a2jviewer.layout(ui.panel,gPage.step,gGuide.steps,question,learnmore);
		}
		});
  // layoutPanes();


   //   if (typeof initAdvanced != "undefined")      initAdvanced();




   //Ensure HTML possible for combo box pick list
   //https://github.com/scottgonzalez/jquery-ui-extensions/blob/master/autocomplete/jquery.ui.autocomplete.html.js
   $.extend($.ui.autocomplete.prototype, {
      _renderItem: function (ul, item) {
         return $("<li></li>")
				.data("item.autocomplete", item)
				.append($("<a></a>")[this.options.html ? "html" : "text"](item.label))
				.appendTo(ul);
      }
   });

   // Tips
   //window.setTimeout(hovertipInit, 1);

   // Click on section header to expand/collapse.
   if (0) $(".header").click(function () {
      $(this).next().toggle();
      //$(this).toggleClass('.sectionheader .collapsable');
   });


   // Draggable
   $('.hotspot').draggable({ containment: 'parent' }).resizable().fadeTo(0.1, 0.9);


	$('#tabsMapper button').click(function(){ 
		mapperScale = mapperScale * parseFloat($(this).attr('zoom')); 
		$('.map').css({zoom:mapperScale,"-moz-transform":"scale("+mapperScale+")","-webkit-transform":"scale("+mapperScale+")"});
	});
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

	if (typeof DEBUGSTART!=="undefined")
	{
		DEBUGSTART();
	}
	else
		signinask();

   // Menu bar
   jQuery(".megamenu").megamenu({ 'show_method': 'simple', 'hide_method': 'simple', mm_timeout: 125, 'enable_js_shadow': true, 'shadow_size': 5, 'deactivate_action': 'mouseleave click' });
   $('.megamenu li div ul li a').click(function () {
      var attr = $(this).attr('href'); 
      switch (attr) {
			case '#save':
				if (gGuide!=null)
					if (gGuideID!=0)
						guideSave();
				break;
         case '#sample': 
            loadGuide($(this).text(), "tabsAbout");
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
            alert('Unhandled ' + attr);
      }
      return false;
   });


});
function checkLength( o, n, min, max ) {
	if ( o.val().length > max || o.val().length < min ) {
		 o.addClass( "ui-state-error" );
		 updateTips( "Length of " + n + " must be between " +
			  min + " and " + max + "." );
		 return false;
	} else {
		 return true;
	}
}

function signin(data)
{
	gUserID=data.userid;
	gGuideID=0;
	gUserNickName=data.nickname;
	if (gUserID==0)
	{
		//status('Unknown user');
		//html('Please register...');
	}
	else
	{
		$('#memenu').text(gUserNickName);
		$('#tabsCAJA').html("Welcome "+gUserNickName+" user#"+gUserID+'<p id="guidelist">Loading your guides '+AJAXLoader +"</p>");
		$("#login-form" ).dialog( "close" );
		$('#authortool').removeClass('hidestart').addClass('authortool');
		$('.welcome').hide();
		layoutPanes();
		$('#tabviews').tabs( { disabled: [1,2,3,4,5,6,7,8,9]});
		ws({cmd:'guides'},listguides);
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
			 "Sign in": function() {
				  var bValid = true;
				 // allFields.removeClass( "ui-state-error" );
		
				  //bValid = bValid && checkLength( name, "username", 3, 16 );
				  //bValid = bValid && checkLength( password, "password", 4, 16 ); 
				  ws({cmd:'login',username:$('#username').val(),userpass:$('#userpass').val()},signin);
			 },
			 Cancel: function() {
				  $( this ).dialog( "close" );
			 }
		},
		close: function() {
			 //allFields.val( "" ).removeClass( "ui-state-error" );
		}
	});
	$( "#login-form" ).dialog( "open" );
}

function layoutPanes()
{
   // Splitter layout
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
   //$('.ui-layout-center').layout({		center__onresize:  $.layout.callbacks.resizeTabLayout												});
}

function toxml()
{  // convert page at selection start into XML

}
function startCAJA(startTabOrPage)
{ 
//	$('.CAJAContent').html(gGuide.dump());
	trace( gGuide.firstPage);
	
	$('#tabviews').tabs( { disabled:false});
		
	if (makestr(startTabOrPage)=="")
		startTabOrPage="PAGE "+(gGuide.firstPage);
	trace("Starting location "+startTabOrPage);
	
	if(editMode==1)
		$('#advanced').html(gGuide.convertToText());
	else
		gotoTabOrPage(startTabOrPage);
	$('#CAJAIndex').html(gGuide.convertIndex());
	$('#CAJAListAlpha').html(gGuide.convertIndexAlpha());
	$('#CAJAIndex li').click(showPageToEdit);
	
	
	buildMap();
	
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
	$('#advanced > P, #advanced > DIV > P').each(function(){parseP($(this))});
	prompt('.');
	return false;
}


function showPageToEdit()
{	// Clicked on index, scroll to the right place in the document.
	var target=$(this).attr('target')
//	if (editMode==1)
		showPageToEditTextOnly(target)
//	else
		gotoTabOrPage(target);
}
function gotoPageShortly(dest)
{	// navigate to given page (after tiny delay)
	window.setTimeout(function(){
		gotoTabOrPage("PAGE "+(dest));
		$('#tabviews').tabs('select','#tabsPageView');
		//a2jviewer.layoutpage($('#tabsPageView'),gGuide,gGuide.steps,gPage);
	},1);
}
function gotoTabOrPage(target)
{
	// Remove existing editors 
	
	for (var edId in tinyMCE.editors)
		tinyMCE.editors[edId].remove();
 
 	trace("gotoTabOrPage:"+target);
	
	if (target.indexOf("PAGE ")==0)
	{
		$('#CAJAContent').html('');
		gGuide.novicePage($('#CAJAContent'),target.substr(5));
		
//		alert( $("#tabviews .ui-tabs-selected").attr('id'));
//			a2jviewer.layoutpage(ui.panel,gGuide,gGuide.steps,gPage);
		
		$('#tabviews').tabs('select','#tabsPageEdit');
	}
	else
	if (target.indexOf("STEP ")==0)
	{
		$('#CAJAContent').html('');
		gGuide.noviceStep($('#CAJAContent'),target.substr(5));
		
		$('#tabviews').tabs('select','#tabsPageEdit');
	}
	else{
		gGuide.noviceTab($('#'+target).empty(),target);
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


/*
TGuide.prototype.editTabs={};
TGuide.prototype.editTabs['interview']=[
	 {label:'lang.eiTitle',type:'text'}
	,{label:'lang.eiDescription',type:'textarea'}
	,{label:'lang.eiJurisdiction',type:'text'}
	,{label:'lang.eiAuthor',type:'textarea'}
	,{label:'lang.eiLogoGraphic',type:'graphic'}
];
*/

function pickPage(request,response)
{	// autocomplete page lists including internal text
	var matcherStarts = new RegExp(  '^'+$.ui.autocomplete.escapeRegex(request.term), "i" );
	var matcherContains = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
	var listStarts=[];
	var listContains=[];
	for (var p in gGuide.sortedPages)
	{
		var page=gGuide.sortedPages[p];
		var label= page.name;
		if (matcherStarts.test(page.name))
			listStarts.push({label:pickHilite(label,request.term),value:page.name});
		else
		if (matcherContains.test(page.name))
			listContains.push({label:pickHilite(label,request.term),value:page.name});
		/* search name and text
		var label="<b>"+page.name +"</b>: "+ page.text;
		if (matcherStarts.test(page.name))
			listStarts.push({label:pickHilite(label,request.term),value:page.name});
		else
		if (matcherContains.test(page.name))
			listContains.push({label:pickHilite(label,request.term),value:page.name});
		else
		if (matcherContains.test(label))
			listContains.push({label:pickHilite(label,request.term),value:page.name});
		*/
	}
	response(listStarts.concat(listContains).slice(0,30));
}


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


TGuide.prototype.convertIndex=function()
{	// Build outline for entire interview includes meta, step and question sections.
	var inSteps=[], s, p, page, ts;
	for (s in this.steps)
	{
		inSteps[s]="";
	}
	for (p in this.sortedPages)
	{
		page = this.sortedPages[p]; 
		inSteps[page.step] += '<li target="PAGE '+page.name+'">'+page.name+'</li>';
	}	
	ts="";
	for (s in this.steps)
	{
		ts+='<li target="STEP '+s+'">'+this.steps[s].number+". "+this.steps[s].text+"</li><ul>"+inSteps[s]+"</ul>";
	}

			
	return "<ul>"
			+ '<li target="tabsAbout">'+lang.tabAbout+'</li>'
			+ '<li target="tabsVariables">'+lang.tabVariables+'</li>'
			+ '<li target="tabsConstants">'+lang.tabConstants+'</li>'
			+ '<li target="tabsSteps">'+lang.tabSteps+'</li><ul>'+ts+'</ul>'
			+"</ul>";
}

TGuide.prototype.convertIndexAlpha=function()
{	// Build outline of just pages
	var txt="", p, page;
	for (p in this.sortedPages)
	{
		page = this.sortedPages[p]; 
		txt += '<li target="PAGE '+page.name+'">'+page.name+'</li>';
	}	
	return "<ul>" + txt +"</ul>";
}



function ws(data,results)
{	// Contact the webservice to handle user signin, retrieval of guide lists and load/update/cloning guides.
	//trace(JSON.stringify(data));
	$.ajax({
		url:'CAJA_WS.php',
		dataType:'json',
		type: 'POST',
		data: data,
		success: function(data){ 
			//trace(String.substr(JSON.stringify(data),0,299));
			results(data);
		},
		error: function(err,xhr) { alert("error:"+xhr.responseText ); }
	})
}  







//*** Mapper ***
var mapperScale=1;
var mapSize= 1 ; //0 is small, 1 is normal

function buildMap()
{	// Contruct mapper flowcharts. 
	var $map = $('.map');
	$map.empty();
	//$('.MapViewer').removeClass('big').addClass(mapSize==1 ? 'big':'');
	/*
	if (mapSize==0)
	{	// Render only boxes, no lines
		// Could be used for students but need to remove popups and add coloring.
		var YSC=.15;// YScale
		var XSC=.1 ;
		for (var p in book.pages)
		{
			var page=book.pages[p];
			if (page.mapbounds != null)
			{
				var nodeLeft=XSC*parseInt(page.mapbounds[0]);
				var nodeTop=YSC*parseInt(page.mapbounds[1]);
				$(".map").append(''
					+'<div class="node tiny" rel="'+page.mapid+'" style="left:'+nodeLeft+'px;top:'+nodeTop+'px;"></div>'
					//+'<span class="hovertip">'+page.name+'</span>'
				);
			}
		}
	}*/
	if (mapSize==1)
	{	// Full size boxes with question names and simple lines connecting boxes.
		var YSC=1.35;// YScale
		var NW=56;//half node width
		for (var p in gGuide.pages)
		{
			var page=gGuide.pages[p];
			if (page.mapx>0) 
			{
				var nodeLeft=page.mapx;
				var nodeTop= page.mapy;
				$map.append(''
					+(page.type=="Pop-up page" ? '':'<div class="arrow" style="left:'+(nodeLeft+50)+'px; top:'+(nodeTop-16)+'px;"></div>')
					+'<div class="node" rel="'+page.mapid+'" style="left:'+nodeLeft+'px;top:'+nodeTop+'px;">'+page.name+'</div>'
					+lineV(nodeLeft+NW,nodeTop+46,10)
					);
				var downlines=false;
				/* Outgoing branches to show:  
						A2J - Buttons with Destination, Script GOTOs
						CA - Next page, Feedback branches, Script GOTOs
				*/
				if (page.mapBranches==null)
				{
					var branches=[];
					for (var b in page.buttons)
					{
						var btn = page.buttons[b];
						branches.push({label:btn.label, dest: btn.next} );
					}
					page.mapBranches=branches;
				}
				/*
				var nBranches=page.mapBranches.length;
				var boffset = nBranches %2 * .5;
				for (var b in page.mapBranches)
				{
					var branch = page.mapBranches[b];
					var branchLeft=nodeLeft + (b+boffset)*30;
					var branchTop= nodeTop + 100;
					var branchWidth=50;
					if (branch.dest!="")
					{
						var destLeft= branch.dest.mapx+NW;
						var destTop = branch.dest.mapy;
						if (destTop>nodeTop) downlines=true;
						var x1 =branchLeft+branchWidth/2;// nodeLeft+NW-(b-nBranches/2)*5;
						var y1 =branchTop+18;// nodeTop+46;
						var y2 = y1 + 10 +((nBranches-b)*2);
						var x2,x3;
						if (destLeft<x1 ) {x2=destLeft;x3=x1;} else {x2=x1;x3=destLeft};
						$(".map").append(''
							+(destTop>nodeTop ?  lineV( x1,y1, y2-y1) + lineH(x2,y2,x3-x2):'')
							);
					}
					$(".map").append('<div class="branch" rel="'+branch.dest+'" style="left:'+(branchLeft)+'px; top:'+branchTop+'px; width:'+branchWidth+'px;">'+branch.text+'</div>');
				}*/
			}
		}
		$('.branch',$map).click(function(){focusNode($('.map > .node[rel="'+$(this).attr('rel')+'"]'));	});
	}
	$('.node',$map).click(function(){	focusNode($(this));});
//	focusPage()
}
function lineV(left,top,height)
{
	return '<div class="line" style="left:'+left+'px;top:'+top+'px;width:1px;height:'+height+'px;"></div>';
}
function lineH(left,top,width)
{
	return '<div class="line" style="left:'+left+'px;top:'+top+'px;width:'+width+'px;height:1px;"></div>';
}

function focusPage()
{
	focusNode($('.map > .node[rel="'+page.mapid+'"]'))
}






function BlankGuide(){
	var guide = new TGuide();

	guide.title="My guide";
	guide.notes="Guide created on "+new Date();
	guide.authors=[{name:'My name',organization:"My organization",email:"email@example.com",title:"My title"}];
	guide.sendfeedback=false;
	var page=guide.addUniquePage("Welcome");
	page.type="A2J";
	page.text="Welcome to Access to Justice";
	page.buttons=[{label:"Continue",next:"",name:"",value:""}];
	guide.steps=[{number:0,text:"Welcome"}];
	guide.vars=[]; 
	guide.sortedPages=[page];
	guide.firstPage=page.id;
	return guide;
}

function guideSave()
{
	var guide = gGuide;
	prompt('Saving '+guide.title + AJAXLoader);
	ws( {cmd:'guidesave',gid:gGuideID, guide: exportXML_CAJA_from_CAJA(guide), title:guide.title}, function(response){
		if (response.error!=null)
			prompt(response.error);
		else
			prompt(response.info);
	});
}
function createBlankGuide()
{	// create blank guide internally, do Save As to get a server id for future saves.
	var guide=BlankGuide();

	ws({cmd:'guidesaveas',gid:0, guide: exportXML_CAJA_from_CAJA(guide), title: guide.title},function(data){
		if (data.error!=null)
			status(data.error);
		else{
			var newgid = data.gid;//new guide id
			ws({cmd:'guides'},function (data){
				listguides(data);
				ws({cmd:'guide',gid:newgid},guideloaded);
			 });
		}
	});
}


function listguides(data)
{
	var blank = {id:'a2j', title:'New empty guide'};
	gGuideID=0;
	var mine = [];
	var others = [];
	var start = '<li class=guide gid="' + blank.id + '">' + blank.title + '</li>';
	$.each(data.guides, function(key,g) { var str='<li class=guide gid="' + g.id + '">' + g.title + '</li>'; if (g.owned)mine.push(str);else others.push(str);});
	
	$('#guidelist').html("New guides <ol>"+start+"</ol>My guides <ol>"+mine.join('')+"</ol>" + "Sample guides <ol>"+others.join('')+"</ol>");
	$('li.guide').click(function(){
		var gid=$(this).attr('gid');
//		$(this).html('Loading guide '+$(this).text()+AJAXLoader);
		var guideFile=$(this).text();
		$('li.guide[gid="'+gid+'"]').html('Loading guide '+guideFile+AJAXLoader).addClass('.warning');
		loadNewGuidePrep(guideFile,'');
		if(gid=='a2j')
			createBlankGuide();
		else
			ws({cmd:'guide',gid:gid},guideloaded);
		//loadGuide($('a[href="#sample"]').first().text(), "TAB ABOUT");
	});
}
