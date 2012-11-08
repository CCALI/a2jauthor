/*	CALI Author 5 - CAJA Authoring   
 	03/30/2012 
 */


var gShowLogic=1;
var gShowText=1;


/*     * /
function DEBUGSTART(){
	var SAMPLES = [
		"tests/data/Field Characters Test.a2j#1-5 Fields Test 1",
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
 
 
function selectTab(target)
{
	$('#CAJAOutline li, #CAJAIndex li').each(function(){$(this).removeClass('ui-state-active')});
	$('li').filter(function(){ return target == $(this).attr('target')}).each(function(){$(this).addClass('ui-state-active')});
}
TGuide.prototype.pageRename=function(page,newName){
/* TODO Rename all references to this page in POPUPs, JUMPs and GOTOs */
	//trace("Renaming page "+page.name+" to "+newName);
	if (page.name==newName) return true;
	if (page.name.toLowerCase() != newName.toLowerCase())
	{
		if (this.pages[newName])
		{
			alert('Already a page named '+newName);
			return false
		}
	}
	// Rename GUI references
	var targetOld="PAGE "+page.name;
	var targetNew="PAGE "+newName;
	$('li').filter(function(){return targetOld==$(this).attr('target');}).each(function(){
		$(this).attr('target',targetNew);
		$(this).text(newName);
		})
	
	delete this.pages[page.name]
	page.name = newName;
	this.pages[page.name]=page;
	trace("RENAMING REFERENES");
	return true;
}
TGuide.prototype.convertIndex=function()
{	// Build outline for entire interview includes meta, step and question sections.
	var inSteps=[];
	var popups="";
	for (s in this.steps)
	{
		inSteps[s]="";
	}
	for (var p in this.sortedPages)
	{
		var page = this.sortedPages[p];
		var plink= '<li target="PAGE '+page.name.asHTML()+'">'+page.name.asHTML()+'</li>';
		if (page.type==CONST.ptPopup)
			popups += plink;
		else
			inSteps[page.step] += plink;
	}	
	var ts="";
	for (var s in this.steps)
	{
		ts+='<li target="STEP '+s+'">'+this.steps[s].number+". "+this.steps[s].text+"</li><ul>"+inSteps[s]+"</ul>";
	}			
	return "<ul>"
			+ '<li target="tabsAbout">'+lang.tabAbout+'</li>'
			+ '<li target="tabsVariables">'+lang.tabVariables+'</li>'
			+ '<li target="tabsConstants">'+lang.tabConstants+'</li>'
			+ '<li target="tabsSteps">'+lang.tabSteps+'</li><ul>'+ts+'</ul>'
			+ '<li target="tabsPopups">'+lang.en('Popups')+'</li><ul>'+popups+'</ul>'
			+"</ul>";
}

TGuide.prototype.convertIndexAlpha=function()
{	// Build outline of just pages
	var txt="";
	for (var p in this.sortedPages)
	{
		var page = this.sortedPages[p]; 
		txt += '<li target="PAGE '+page.name.asHTML()+'">'+page.name.asHTML()+'</li>';
		console.log(page.name);
	}
	return "<ul>" + txt +"</ul>";
}


var form={
	id:0
	
	,change: function(elt,val){
		var form= $(elt).closest('[name="record"]');
		trace("Changed value: "+elt);
		$(elt).data('data').change.call(elt,val,form.data('record'),form);
	}
	 ,h1:function(h){
		return $("<h1>"+h+"</h1>");}
		
	,h2:function(h){
		return $("<h2>"+h+"</h2>").click(function(){$(this).next().toggle()});}
		
		
	,note:function(t){
		return $('<div class="ui-widget"><div style="margin-top: 20px; padding: 0 .7em;" class="ui-state-highlight ui-corner-all">		<p><span style="float: left; margin-right: .3em;" class="ui-icon ui-icon-info"></span>'+t+'</div></div>')
	}


	,fieldset:function(legend,record){
		return $('<fieldset name="record"><legend >'+legend+'</legend></fieldset>').data('record',record);;//.click(function(){$(this).toggleClass('collapse')});
	}
	,record:function(record){
		return $('<div name=record class=record/>').data('record',record);
	}
	,div:function(){
		return $('<div />');
	}
	//,number:    function(label,value,minNum,maxNum,handler){
	//	return "<label>"+label+'</label><input class="editable" type="text" name="'+group+id+'" value="'+htmlEscape(value)+'"> ';}
	
	,checkbox: function(data){
		var e=$('<div name="'+data.name+'">'
			+(typeof data.label!=='undefined' ? ('<label>'+data.label+'</label>') : '')
			+'<span  class=editspan > <input class="ui-state-default ui-checkbox-input" type="checkbox" />'+data.checkbox+'</span></div>');
		$('input',e).blur(function(){ form.change($(this),$(this).is(':checked'))}).attr( 'checked',data.value==true ).data('data',data);
		return e;
	}
	
	
	,pickpage:function(data){ 
		//data.value = gGuide.pageDisplayName(data.value); 

		var dval = gGuide.pageDisplayName(data.value);
			
		var e =$( ''
			+(typeof data.label!=='undefined' ? ('<label>'+data.label+'</label>') : '')
			+ '<span class=editspan><input class="  ui-combobox-input editable autocomplete picker page dest" type="text" ></span>');
		$('.picker',e).blur(function(){
			var val=$(this).val();
			form.change($(this),val);
		}).data('data',data).val(decodeEntities(dval));
		$('.autocomplete.picker.page',e).autocomplete({ source: pickPage, html: true,
	      change: function () { // if didn't match, restore to original value
	         var matcher = new RegExp('^' + $.ui.autocomplete.escapeRegex($(this).val().split("\t")[0]) + "$", "i");
	         var newvalue = $(this).val();//.split("\t")[0];
				trace(newvalue);
	         $.each(gGuide.sortedPages, function (p, page) {
					if (page.type!=CONST.ptPopup)
						if (matcher.test(page.name)) {
							newvalue = gGuide.pageDisplayName(page.name);
							return false;
						}
	         });
	         $(this).val(newvalue); 
	      }})
			.focus(function () {
			   $(this).autocomplete("search");
			});
		return e;
	}
	,text: function(data){
		var e=$('<div name="'+data.name+'">'
			+(typeof data.label!=='undefined' ? ('<label>'+data.label+'</label>') : '')
			+'<span class=editspan> <input class="  editable" placeholder="'+data.placeholder+'" type="text" /> </span></div>');
		if (typeof data.class!=='undefined') $('input',e).addClass(data.class);
		if (typeof data.width!=='undefined') $('input',e).css('width',data.class);
		$('input',e).blur(function(){ form.change($(this),$(this).val());}).val(decodeEntities(data.value)).data('data',data);
		return e;
	}
	,htmlarea: function(data){//label,value,handler,name){ 
		this.id++;
		var e= $('<div name="'+data.name+'">'
			+(typeof data.label!=='undefined' ? ('<label>'+data.label+'</label>') : '')
			+'<span class=editspan>'
			+'<div contenteditable=true class="  htmledit  text editable taller" id="tinyMCE_'+this.id+'"  name="'+this.id+'" rows='+1+'>'
			+data.value+'</div></span></div>');
		$('.editable',e).focus(function(){$(this).addClass('tallest')}).blur(function(){
		//$(this).removeClass('tallest');
		form.change($(this),$(this).html());}).data('data',data) ;
		return e;
	} 
	,textarea: function(data){
		var rows=2;
		var e=$('<div name="'+data.name+'">'
			+(typeof data.label!=='undefined' ? ('<label>'+data.label+'</label>') : '')
			+'<span class=editspan><textarea  class="     text editable taller" rows='+rows+'>'+data.value+'</textarea></span></div>');
		$('.editable',e).blur(function(){form.change($(this),$(this).html());}).data('data',data);
		return e;
	}
	
	,pickAudio:function(data){ return this.text(data);}
	,pickImage:function(data){ return this.text(data);}
	,pickVideo:function(data){ return this.text(data);}
	,codearea:function(data){ 
		this.id++;
		var e= $('<div>'
			+(typeof data.label!=='undefined' ? ('<label>'+data.label+'</label>') : '')
			+'<span class=editspan><div contenteditable=true class="     text editable taller codeedit"  rows='+4+'>'+data.value+'</div></span></div>');
		$('.editable',e).blur(function(){form.change($(this),$(this).html())}).data('data',data);
		return e;
	}

	,pickList:function(data,listValueLabel){//list is array to ensure preserved order. Note: js object properties don't guarantee order
		var c="";
		for (var o=0;o<listValueLabel.length;o+=2)
			c+='<option value="'+listValueLabel[o]+'">'+listValueLabel[o+1]+'</option>';
		var e =$('<div name="'+data.name+'">'
			+(typeof data.label!=='undefined' ? ('<label>'+data.label+'</label>') : '')
			+'<span class=editspan><select class="     ui-select-input">'+c+'</select></span></div>');
		$('.ui-select-input',e).change(function(){form.change($(this),$('option:selected',this).val())}).data('data',data).val(data.value);
		return e;
	}
	,pickStep:function(data){
		var list=[];
		for (var s=0;s<gGuide.steps.length;s++){
			var step = gGuide.steps[s];
			list.push(s,step.number+". "+ (step.text));
		}
		return this.pickList(data,list);
		//var e =$('<div><label>'+label+'</label>' + '<select class="ui-state-default ui-select-input">'+o+'</select></div>');
		//$('.ui-select-input',e).change(function(){var val=$('option:selected',this).val();  $(this).data('data').change(val);}).data('data',handler).val(value);
		//return e;
	}
	,pickscore:function(label,value,handler){
		return this.pickList('','picker score',[
			'RIGHT','Right',
			'WRONG','Wrong',
			'MAYBE','Maybe',
			'INFO','Info'],value,handler);
	}
	,pickbranch:function(){ 
		return this.pickList("",'picker branch',[
		0,"Show feedback and return to question",
		1,"Show feedback then branch to this page",
		2,"Just branch directly to this page"])
		.change(function(){
			var br=$(this).val();
			$(this).parent().children('.text').toggle(br!=2);
			$(this).parent().children('.dest').toggle(br!=0);
			trace(br);
		})
	}
	
		
	//,clone:function(){return 'Clone buttons';}
	
	,tableRows:function(name,headings,rowList){
		var $tbl=$('<table/>').addClass('list').data('table',name).attr('list',name);
		if (typeof headings==="object"){
			var tr="<tr valign=top>";
			for (var col in headings)
			{
				tr+="<th>"+headings[col]+"</th>";
			}
			tr+="</tr>";
			$tbl.append($(tr));
		}
		for (var row in rowList){
			var $row=$("<tr valign=top/>");
			if (rowList[row].visible==false) $row.addClass('hidden');
			//$row.append($('<td class="editicons"/>').append('<span class="ui-draggable sorthandle ui-icon ui-icon-arrowthick-2-n-s"/><span class="ui-icon ui-icon-circle-plus"/><span class="ui-icon ui-icon-circle-minus"/>'));
			for (var col in rowList[row].row)
			{
				$row.append($("<td/>").append(rowList[row].row[col]));
			}
			
			$tbl.append($row);
			$row.data('record',rowList[row].record);
		
/*
			$row.hover(
				function(){ // start hovering
					$('.editicons').remove();
					$(this).append('<span class="editicons"><a href="#" class="ui-icon ui-icon-circle-plus"></a><a href="#" class="ui-icon ui-icon-circle-minus"></a></span>');
					$('.editicons .ui-icon-circle-plus').click(function(){
						// Insert blank statement above
						//alert($(this).closest('li').html());
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
			
		}
		$('tbody',$tbl).sortable({
			//handle:"td:eq(0)",
			handle:"td:eq(0) .sorthandle",
			update:function(){ }})//.disableSelection();

		$('.editicons .ui-icon-circle-plus',$tbl).click(function(){//live('click',function(){
			var row = $(this).closest('tr');
			row.clone(true,true).insertAfter(row).fadeIn();
		});
		$('.editicons .ui-icon-circle-minus',$tbl).click(function(){//.live('click',function(){
			var line = $(this).closest('tr').fadeOut("slow").empty();
		});
			
		return $tbl;
	}
	
	,tableRowCounter:function(name,label,minelts,maxelts,value)
	{	//let user choose number of said item
		var c=$('<label/>').text(label);
		var s='<select list="'+name+'" class="  ui-select">';
		for (var o=minelts;o<=maxelts;o++)s+="<option>"+o+"</option>";
			s+="</select>";
		return $('<div/>').append(c.after(s).change(function(){form.tableRowAdjust(name,$('option:selected',this).val());}).val(value));
	}
	
	,tableRowAdjust:function(name,val)
	{	// Adjust number of rows. set visible for rows > val. if val > max rows, clone the last row.
		$tbl = $('table[list="'+name+'"]');
		var settings=$tbl.data('settings');
		$tbody = $('tbody',$tbl);//'table[list="'+name+'"] tbody');
		var rows = $('tr',$tbody).length;
		trace('Changing rows from '+rows+' to '+val);
		//if (rows == val) return;
		
		for (var r=0;r<rows;r++)
			$('tr:nth('+r+')',$tbody).showit(r<val);
		for (var r=rows;r<val;r++)
			form.listManagerAddRow($tbl,$.extend({},settings.blank));
		form.listManagerSave($tbl);
	}
	
	,listManagerSave:function($tbl){// save revised order or added/removed items
		var settings=$tbl.data('settings');
		var list=[];
		$('tr',$tbl).not(':hidden').each(function(idx){ //:gt(0)
			list.push($(this).data('record'));
		});
		settings.save(list);
		$('select[list="'+settings.name+'"]').val(list.length);
	}
	,listManagerAddRow:function($tbl,record){
		var settings=$tbl.data('settings');
		var $row=$('<tr valign=top class="ui-corner-all" name="record"/>');
		$row.append($('<td class="editicons"/>')
			.append('<span class="ui-draggable sorthandle ui-icon ui-icon-arrowthick-2-n-s"/>'
			+'<span class="ui-icon ui-icon-circle-plus"/><span class="ui-icon ui-icon-circle-minus"/>'));
		$row.append($('<td/>').append(settings.create(form.div(),record)));
		$row.data('record',record); 
		$tbl.append($row);
	}
	,listManager:function(settings){
		// data.name:'Fields' data.,picker:'Number of fields:',data.min:0,data.max:CONST.MAXFIELDS,data.list:page.fields,data.blank:blankField,data.save=function to save,data.create=create form elts for record
		var div = $('<div/>');
		var $tbl=$('<table/>').addClass('list').data('settings',settings).attr('list',settings.name);
		div.append(form.tableRowCounter(settings.name,settings.picker,settings.min,settings.max,settings.list.length));
		for (var i=0;i<settings.list.length;i++)
			form.listManagerAddRow($tbl,settings.list[i]);
		$('tbody',$tbl).sortable({
			handle:"td .sorthandle",
			update:function(event,ui){
				form.listManagerSave((ui.item.closest('table')));
			}})

		div.append($tbl);
		/*(		div.append($('<button id="newrow"/>').button({label:'Add',icons:{primary:"ui-icon-plusthick"}}).click(function(){
			addRow($.extend({},settings.blank));
			save();
		}));
		*/
		return div;
	}
	
	
	
	
	,row:function(cols){ return "<tr valign=top><td>"+cols.join("</td><td>")+"</td></tr>";}
	,rowheading:function(cols){ return "<tr valign=top><th>"+cols.join("</th><th>")+"</th></tr>";}
};


$(document).ready(function () {
   // Everything loaded, execute.
   lang.set('en');

   if (typeof tinyMCE === "undefined") tinyMCE = {};

   // Activate TABS
	$('.tabset').tabs();	
	tabGUI();
	
	
	$('#tabviews').bind('tabsselect', function(event, ui) {
		switch (ui.panel.id){
			case 'tabsPageView':
				a2jviewer.layoutpage(ui.panel,gGuide,gGuide.steps,gPage); 
				break;
			case 'tabsAbout':
			case 'tabsVariables':
			case 'tabsSteps':
			case 'tabsLogic':
			case 'tabsText':
			case 'tabsConstants':
				noviceTab(gGuide,ui.panel.id);
				break;
	
			default:
		}
		}); 

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
		$('#tabsCAJA .tabContent').html("Welcome "+gUserNickName+" user#"+gUserID+'<p id="guidelist">Loading your guides '+AJAXLoader +"</p>");
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
   //$('.ui-layout-center').layout({		center__onresize:  $.layout.callbacks.resizeTabLayout	});
}

function toxml()
{  // convert page at selection start into XML

}
function startCAJA(startTabOrPage)
{ 
	trace( gGuide.firstPage);
	
	$('#tabviews').tabs( { disabled:false});
	
	$('#tabsVariables .tabContent, #tabsLogic  .tabContent,#tabsSteps .tabContent, #tabsAbout .tabContent, #tabsConstants .tabContent, #tabsTex .tabContentt').html("");
	//#tabsLogic, 
		
	if (makestr(startTabOrPage)=="")
		startTabOrPage="PAGE "+(gGuide.firstPage);
	trace("Starting location "+startTabOrPage);
	
	//if(editMode==1)
	//	$('#advanced').html(gGuide.convertToText());
	//else
		gotoTabOrPage(startTabOrPage);
	$('#CAJAOutline').html(gGuide.convertIndex());
	$('#CAJAIndex').html(gGuide.convertIndexAlpha());
	$('#CAJAOutline li, #CAJAIndex li').click(showPageToEdit);
	
	buildMap();
	
	//if (editMode==1)
	//{
	//	setMode(2);
	//	showPageToEditTextOnly(startTabOrPage);
	//}
}


function showPageToEdit()
{	// Clicked on index, scroll to the right place in the document.
	var target=$(this).attr('target')
//	if (editMode==1)
//		showPageToEditTextOnly(target)
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
	selectTab(target);
	
	for (var edId in tinyMCE.editors)
		tinyMCE.editors[edId].remove();
 
 	trace("gotoTabOrPage:"+target);
	
	if (target.indexOf("PAGE ")==0)
	{
		$('#tabsPageEdit').html('');
		gGuide.novicePage($('#tabsPageEdit'),target.substr(5));
		$('#tabviews').tabs('select','#tabsPageEdit');
		$('#tabsLogic  .tabContent, #tabsText .tabContent').html("");//clear these so they refresh with new data. TODO - update in place
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

function pageGOTOList()
{	// List of page ids we can go to including the built-ins like no where, exit.
	var pages=[qIDNOWHERE,qIDSUCCESS,qIDFAIL,qIDEXIT,qIDBACK,qIDRESUME];
	for (var p in gGuide.sortedPages)
	{
		var page=gGuide.sortedPages[p];
		if (page.type!=CONST.ptPopup)
			pages.push(page.name);
	}
	return pages;
}


function pickPage(request,response)
{	// autocomplete page lists including internal text
	request.term = request.term.split("\t")[0]
	var matcherStarts = new RegExp(  '^'+$.ui.autocomplete.escapeRegex(request.term), "i" );
	var matcherContains = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
	var lists=[[],[]];
	var regex= new RegExp(
			"(?![^&;]+;)(?!<[^<>]*)(" +
			$.ui.autocomplete.escapeRegex(request.term) +
			")(?![^<>]*>)(?![^&;]+;)", "gi"
		);
	function hilite(html){return html.replace(regex, "<span class=hilite>$1</span>");}
	//var pages=pageGOTOList();
	for (var p in gGuide.sortedPages)
	{
		var page=gGuide.sortedPages[p];
		if (page.type!=CONST.ptPopup)
		{
			var list;
			if (matcherStarts.test(page.name)) list=0;
			else
			if (matcherContains.test(page.name)) list=1;
			else list=-1;
			if (list>=0)
			{
				var label = "<b>"+page.name +"</b>: "+  decodeEntities(page.text);
				lists[list].push({label:hilite(label),value:page.name});
			}
		}
	}
	response(lists[0].concat(lists[1]).slice(0,30));
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
