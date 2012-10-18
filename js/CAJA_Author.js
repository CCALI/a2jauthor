/*	CALI Author 5 - CAJA Authoring   
 	03/30/2012 
 */
 
var DEBUGSTART=0;
 
 
var form={
	 h1:function(h){
		return $("<h1>"+h+"</h1>");}
	,h2:function(h){
		return $("<h2>"+h+"</h2>").click(function(){$(this).next().toggle()});}
	,fieldset:function(legend){
		return $("<fieldset><legend>"+legend+"</legend></fieldset>")//.click(function(){$(this).next().toggle()});
		}
	,note:function(t){
		return $("<div>"+t+"</div>")}
		
	,text:    function(label,group,id,value){
		return $("<label>"+label+'</label><span class=editspan> <input class="editable" type="text" name="'+group+id+'" value="'+htmlEscape(value)+'"/> </span>');}
		
	,number:    function(label,group,id,value,minNum,maxNum){
		return "<label>"+label+'</label><input class="editable" type="text" name="'+group+id+'" value="'+htmlEscape(value)+'"> ';}
		
	,textarea:function(label,group,id,value,rows){
		if (typeof rows=="undefined") rows=1;
		return $('<label>'+label+'</label><span class=editspan><textarea  class="text editable taller"  name="'+group+id+'" rows='+rows+'>'+value+'</textarea></span>');}
		
	,codearea:function(label,group,id,value){
		return $('<label>'+label+'</label><span class=editspan><div contenteditable=true class="text editable taller codearea" id="'+group+id+'"  name="'+id+'" >'+value+'</div></span>');}
		
		
	,htmlarea:function(label,group,id,value,data){
//		var field= $('<div>'+(label!="" ? ('<label>'+label+'</label>') : '') +'<div class=widetext><div contenteditable=true class="text editable tinyMCEtext" id="tinyMCE_'+group+id+'"  name="'+id+'" rows='+4+'>'+value+'</div></div></div>');
		
		var field= $('<div>'+(label!="" ? ('<label>'+label+'</label>') : '') +'<span class=editspan><div contenteditable=true class="text editable taller tinyMCEtext" id="tinyMCE_'+group+id+'"  name="'+id+'" rows='+4+'>'+value+'</div></span></div>');
		$('.editable',field).blur(function(){var val=$(this).html();  $(this).data('data').change(val);}).data('data',data) ;
		return field;
		}
//	,htmlarea:function(label,group,id,value,rows){if (typeof rows=="undefined") rows=1;return '<label>'+label+'</label><textarea class="tinyMCEtext" style="width:100%" id="tinyMCE_'+group+id+'" name="'+id+'" rows='+rows+'>'+value+'</textarea><BR/>';}
	,div:function(clas,t){
		return '<div class="'+clas+'">'+t+'</div>';}
		
	,pickpage:function(label,group,id,value){ 
		value = gGuide.pageIDtoName(value);
		return $( (label!="" ? ('<label>'+label+'</label>') : '') + '<span class=editspan><input class="ui-state-default ui-combobox-input autocomplete picker page dest" type="text" name="'+id+'" value="'+htmlEscape(value)+'"></span>');
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


   // Menu bar
   jQuery(".megamenu").megamenu({ 'show_method': 'simple', 'hide_method': 'simple', mm_timeout: 125, 'enable_js_shadow': true, 'shadow_size': 5, 'deactivate_action': 'mouseleave click' });
   $('.megamenu li div ul li a').bind('click', (function () {
      var attr = $(this).attr('href');
      switch (attr) {
			case '#save':
				if (gGuide!=null)
					if (gGuideID!=0)
					{
						prompt('Saving '+gGuide.title + AJAXLoader);
						ws( {cmd:'guidesave',gid:gGuideID, guide: exportXML_CAJA_from_CAJA(gGuide)}, function(response){
							if (response.error!=null)
								prompt(response.error);
							else
								prompt(response.info);
						} ) ;
					}
				break;
         case '#sample':
            //alert('Loading sample '+$(this).text());
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
   }));



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


	if (DEBUGSTART)
	{
		loadGuide($('a[href="#sample"]').first().text(), "TAB ABOUT");
		$('#authortool').removeClass('hidestart').addClass('authortool');
		$('.welcome').hide();
		layoutPanes();
	}
	else
		signinask();


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
		, north__size: 400
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
		startTabOrPage="PAGE "+gGuide.pageIDtoName(gGuide.firstPage);
	trace("Starting location "+startTabOrPage);
	
	if(editMode==1)
		$('#advanced').html(gGuide.convertToText());
	else
		gotoTabOrPage(startTabOrPage);
	$('#CAJAIndex').html(gGuide.convertIndex());
	$('#CAJAListAlpha').html(gGuide.convertIndexAlpha());
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
		gotoTabOrPage("PAGE "+gGuide.pageIDtoName(dest));
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

TGuide.prototype.noviceTab=function(div,tab)
{	// 08/03/2012 Edit panel for guide sections 
	var t=$('<div/>').addClass('editq');
	switch (tab){
		case "tabsAbout":
			var GROUP="ABOUT";
			t.append(form.h1('About'));
			t.append(form.text('Title:',GROUP,"title",this.title));
			t.append(form.textarea('Description',GROUP,"description",this.description,4));
			t.append(form.text('Jurisdiction:',GROUP,"jurisdiction",this.jurisdiction));
			t.append(form.textarea('Credits:',GROUP,"credits",this.credits));
			t.append(form.text('Approximate Completion Time:',GROUP,"completionTime",this.completionTime));
			
			t.append(form.h1('Authors'));
			t.append(form.text('Name:',GROUP,"name",this.name));
			
			t.append(form.h1('Revision History'));
			t.append(form.text('Current Version:',GROUP,"version",this.version));
			t.append(form.textarea('Revision History',GROUP,"history",this.history,7));

			break;
			
		case "tabsVariables":
			t.append(form.h1("Variables"));
			var tt=form.rowheading(["Name","Type","Comment"]); 
			//sortingNatural
			var sortvars=[];
			for (vi in this.vars) sortvars.push(this.vars[vi]);
			sortvars.sort(function (a,b){ if (a.sortName<b.sortName) return -1; else if (a.sortName==b.sortName) return 0; else return 1;});
			for (vi in sortvars)
			{
				v=sortvars[vi];
				tt+=form.row([v.name,v.type,v.comment]);
			}
			t+='<table class="A2JVars">'+tt+"</table>";
			break;
			
		case 'tabsSteps':
			t.append(form.h1("Steps"));
			var s;
			var tt=form.rowheading(["Number","Sign"]); 
			for (s in this.steps)
			{
				var step=this.steps[s];
				tt+=form.row([step.number,step.text]);
			}
			t+='<table class="A2JSteps">'+tt+"</table>";
			break;
	}
	
	div.append(t);
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






TGuide.prototype.novicePage = function (div, pagename) {	// Create editing wizard for given page.
   var t = ""; 
	
   var page = this.pages[pagename]; 
	
   var t = $('<div/>').addClass('editq');

   if (1) {
      if (page == null || typeof page ==="undefined") {
         t.append(form.h2( "Page not found " + pagename)); 
      }
      else {
         var GROUP = page.id;

//         t.append($('<h2/>').text('Your Page & all Info'));
//         t.children('h2').click(function () { alert('click h2'); });

			var fs=form.fieldset('Page info');
        	fs.append(form.text('Name:', GROUP, "name", page.name));
         if (page.type != "A2J") {
            t.append(form.h2("Page type/style: " + page.type + "/" + page.style));
         }
			t.append(fs);
			
			var fs=form.fieldset('Page text');
//         t.append(form.h2('Page info'));
//        t.append(form.text('Name:', GROUP, "name", page.name));

         fs.append(form.htmlarea('Text:', GROUP, "text", page.text,{change:function(val){
																											 //trace('value is '+val);
																											 page.text=val}}));
			
			fs.append(form.text('Learn More prompt:', "learnmore", 'name', page.learn));
         fs.append(form.htmlarea("Learn More help:", "help", 'help',page.help));
			t.append(fs);
			
			
			
         var b, d, detail, fb, t1, t2, list;

         if (page.type == "A2J" || page.fields.length > 0) {
				var fs=form.fieldset('Fields');
            for (var f in page.fields) {
               var field = page.fields[f];
               var GROUPFIELD = GROUP + "_FIELD" + f;
               fs.append(form.text('Name:', GROUPFIELD, 'name', field.name));
               fs.append(form.text('Label:', GROUPFIELD, 'label', field.label));
               fs.append(form.text('Optional:', GROUPFIELD, 'optional', field.optional));
               fs.append(form.htmlarea('If invalid say:', GROUPFIELD, "invalidPrompt", field.invalidPrompt));
            }
	 			t.append(fs);
        }
         if (page.type == "A2J" || page.buttons.length > 0) {
				var fs=form.fieldset('Buttons');
            for (var bi in page.buttons) {
               var b = page.buttons[bi];
               var BFIELD = GROUP + "btn" + bi;
               fs.append(form.text('Label:', BFIELD, 'label', b.label));
               fs.append(form.text('Var Name:', BFIELD, 'name', b.name)); 
               fs.append(form.text('Var Value:', BFIELD, 'value', b.value)); 
               fs.append(form.pickpage('Destination:', BFIELD, 'dest', b.next));
					 
            }
	 			t.append(fs);
         }
			var fs=form.fieldset('Advanced Logic');
			fs.append(form.codearea('Logic:','logic','logic',page.scripts));
			t.append(fs);

         if (page.type == "Book page") { }
         else
            if (page.type == "Multiple Choice" && page.style == "Choose Buttons") {
               for (var b in page.buttons) {
                  //				t1+=form.short(page.
                  t.append(text2P("Feedback for Button(" + (parseInt(b) + 1) + ")"));
                  fb = page.feedbacks[fbIndex(b, 0)];
                  pageText += html2P(fb.text);
               }
            }
            else if (page.type == "Multiple Choice" && page.style == "Choose List") {
               var clist = [];
               var dlist = [];
               for (var d in page.details) {
                  var detail = page.details[d];
                  var fb = page.feedbacks[fbIndex(0, d)];
                  var $fb = $('<div/>').append(form.pickbranch())
					 .append(form.pickpage('','',"dest", fb.next))
					 .append(form.htmlarea("", GROUP + "CHOICE" + d, "fb" + d, fb.text));
                  var brtype = makestr(fb.next) == "" ? 0 : (makestr(fb.text) == "" ? 2 : 1);
                  $('select.branch', $fb).val(brtype).change();
                  clist.push({ row: [detail.label, form.pickscore(fb.grade), form.htmlarea("", GROUP + "CHOICE" + d, "detail" + d, detail.text)] });
                  dlist.push({ row: [detail.label, form.pickscore(fb.grade), $fb] });
               }
               t.append(form.h1('Choices'));
               t.append(form.tablecount("Number of choices", 2, 7, 'choices').after(form.tablerange('choices', clist)));

               t.append(form.h1('Feedback'));
               t.append(form.tablerange(dlist));

            }
            else if (page.type == "Multiple Choice" && page.style == "Choose MultiButtons") {
               for (d in page.details) {
                  var detail = page.details[d];
                  t.append(form.h1("Subquestion " + (parseInt(d) + 1)));
                  t.append(form.htmlarea("","","", detail.text));
               }
               for (d in page.details) {
                  for (b in page.buttons) {
                     var button = page.buttons[b];
                     fb = page.feedbacks[fbIndex(b, d)];
                     t.append(form.h1("Feedback for subquestion " + (parseInt(d) + 1) + ", Choice(" + button.label + ")"));
                     t.append(form.htmlarea("","G",b,fb.text));
                  }
               }
            }
            else if (page.type == "Multiple Choice" && page.style == "Radio Buttons") { }
            else if (page.type == "Multiple Choice" && page.style == "Check Boxes") { }
            else if (page.type == "Multiple Choice" && page.style == "Check Boxes Set") { }
            else if (page.type == "Text Entry" && page.style == "Text Short Answer") { }
            else if (page.type == "Text Entry" && page.style == "Text Select") {
               t.append(form.htmlarea("Text user will select from", "SELECT", "textselect", page.initialText, 8));
               list = [];
               for (ti in page.tests) {
                  var test = page.tests[ti];
                  list.push({ row: [
									 form.number("", "", "test" + ti, test.slackWordsBefore, 0, 9999),
								  form.number("", "", "test" + ti, test.slackWordsAfter, 0, 9999),
												  form.htmlarea("", GROUP + "test" + ti, "test" + ti, test.text, 4)
				 ]
                  });
               }
               t.append(form.h2('Selection matches'));
               t.append(form.tablecount("Number of tests", 1, 5) + form.tablerange(list, ["Slack words before", "Slack words after", "Words to match"]));

               t.append(form.textarea("script"));
            }
            else if (page.type == "Text Entry" && page.style == "Text Essay") { }
            else if (page.type == "Prioritize" && page.style == "PDrag") { }
            else if (page.type == "Prioritize" && page.style == "PMatch") { }
            else if (page.type == "Slider") { }
            else if (page.type == "GAME" && page.style == "FLASHCARD") { }
            else if (page.type == "GAME" && page.style == "HANGMAN") { }



         //pageText += html2P(expandPopups(this,page.text));

         t.append(form.textarea('Notes', GROUP, "note", makestr(page.notes)));

      }
      //t+=form.h1('XML')+htmlEscape(page.xml);
	   t.append(htmlEscape(page.xml));

   }

   /*
   var t=$('<input/>',{
   id:'test',
   click:function(){alert('hi');},
   addClass:'ui-input'
   });
   );*/

   //	editq.append(t);
   //	form.html(t);
   div.append(t);



   //	div.append(form.div("editq",t));

   // Attach event handlers
   /*
   $('.picker.branch').change(function(){
   var br=$(this).val();
   $(this).parent().children('.text').toggle(br!=2);
   $(this).parent().children('.dest').toggle(br!=0);
   })
   */

   $('.autocomplete.picker.page').autocomplete({ source: pickPage, html: true,
      change: function () { // if didn't match, restore to original value
         var matcher = new RegExp('^' + $.ui.autocomplete.escapeRegex($(this).val()) + "$", "i");
         var newvalue = $(this).data('org'); //attr('orgval');
         $.each(gGuide.pages, function (p, page) {
            if (matcher.test(page.name)) {
               newvalue = page.name
               return false;
            }
         });
         $(this).val(newvalue);
         $(this).data('org', $(this).val());
         //			$(this).attr('orgval',$(this).val());
      } 
   })
		.focus(function () {
		   console.log($(this).val());
		   $(this).autocomplete("search");
		});
		
	gPage = page;
}


