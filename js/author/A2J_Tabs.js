/*******************************************************************************
	A2J Author 5 * Justice * justicia * 正义 * công lý * 사법 * правосудие
	All Contents Copyright The Center for Computer-Assisted Legal Instruction
	
	Authoring App Tabs GUI
	04/15/2013
	
******************************************************************************/

/* global gGuidePath,gPage,gGuide,gUserID,gGuideID,gUserNickName, gPrefs*/

function updateAttachmentFiles( )
{	// Load list of uploaded existing files:
	gGuide.attachedFiles={};
	$.ajax({
		  // Uncomment the following to send cross-domain cookies:
		  //xhrFields: {withCredentials: true},
		  url: $('#fileupload').fileupload('option', 'url'),
		  dataType: 'json',
		  context: $('#fileupload')[0]
	 }).always(function () {
		  $(this).removeClass('fileupload-processing');
	 }).done(function (result) {
		  gGuide.attachedFiles = result.files;
		  $('#attachmentFiles').empty();
			$.each(gGuide.attachedFiles, function (index, file) {
				 $('<tr><td>'+
					'<a target=_blank href="'+gGuidePath+(file.name)+'">'+file.name+'</a>'
					+'</td><td>'+file.size+'</td></tr>').appendTo('#attachmentFiles');
			});	
	 });
}


function getTOCStepPages(includePages,includePops,includeSpecial)
{	// List of pages within their steps. 
	var inSteps=[];
	var popups="";
	var s;
	for (s=0;s<CONST.MAXSTEPS;s++) 
	{
		inSteps[s]="";
	}
	var p, plink;
	for (p in gGuide.sortedPages)
	{
		/** @type {TPage} */
		var page = gGuide.sortedPages[p];
		var tip = decodeEntities(page.text).substr(0,64) + '<span class=taglist>' + page.tagList()  + '</span>';
		plink= '<li class="unselectable" rel="PAGE '+page.name.asHTML()+'">'+page.name.asHTML()
			+' <span class="tip">'+tip+'</span>' +'</li>';
		if (page.type===CONST.ptPopup)
		{
			popups += plink;
		}
		else
		{
			inSteps[page.step] += plink;
		}
	}	
	var ts="";
	if (includePages) {
		for (s in inSteps)
		{	// List all steps including those for pages that are in steps that we may have removed.
			if (inSteps[s]!=='') {
				ts+='<li rel="STEP '+s+'">Step ' + gGuide.stepDisplayName(s) +"</li><ul>"+inSteps[s]+"</ul>"; // STEP '+'?'+". "+'?'
			}
		}
	}
	if (includePops===true)
	{	// Popups as destinations. 
		ts += '<li rel="tabsPopups">'+Languages.en('Popups')+'</li><ul>'+popups+'</ul>';
	}
	if (includeSpecial===true)
	{	// Special branch destinations. 
		var branchIDs=[CONST.qIDNOWHERE,CONST.qIDSUCCESS,CONST.qIDFAIL,CONST.qIDEXIT,CONST.qIDBACK,CONST.qIDRESUME];
		var i;
		var tss='';
		for (i in branchIDs)
		{
			var branchID = branchIDs[i];
			plink= '<li class="unselectable" rel="PAGE '+branchID +'">'+ gGuide.pageDisplayName(branchID) +'</li>';
			tss += plink;
		}
		ts += '<li>Special Branching</li><ul>'+tss+'</ul>';
	}
	return ts;
}

function updateTOC()
{	// Build outline for entire interview includes meta, step and question sections.
	// 2014-06-02 TOC updates when page name, text, fields change. Or page is added/deleted.
	// Also we update the mapper since it also displays this info.
	var ts = getTOCStepPages(true,true);
	$('.pageoutline').html("<ul>" + ts + "</ul>");
	
	
	// JPM Clicking a step toggle slides step's page list.
	$('#CAJAOutline li[rel^="STEP "]').click(function(){
		$(this).next().slideToggle(300);
	});
	
	// JPM Clicking a step toggle slides step's page list.
	$('#CAJAOutlineMap li[rel^="STEP "]').click(function()
	{	// 2014-08-12 Toggle step's page list and fade in/out it's nodes in the mapper.
		// Determine which step it is, then fade back if mapper
		var step = $(this).attr('rel').split(' ')[1];
		var $nodes=$('.node.Step'+step);
		if ($(this).next().css("display") !== 'none')
		{	// If step is collapse, fade it. 
			$nodes.addClass('faded');
		}
		else
		{	// Step not collapsed, display normally. 
			$nodes.removeClass('faded');
		}
		$(this).next().slideToggle(300);
	});
	

	// JPM Only 'select' Pages, not Steps
	$('.pageoutline li[rel^="PAGE "]')
		.click(function(e){
			if (!e.ctrlKey){
				$('.pageoutline li').removeClass(SELECTED);
			}
			$(this).toggleClass(SELECTED);
		})
		.dblclick(function (){
			var rel=$(this).attr('rel');
			$('.pageoutline li').removeClass(SELECTED);
			$(this).addClass(SELECTED);
			gotoTabOrPage(rel);
		});
		
	// 2014-06-02 Sync mapper to TOC.
	buildMap();
}
var form={
	id:0
	
	,editorAdd:function(elt){
		if (elt.parent().parent().find('.texttoolbar').length===0){
			$('#texttoolbar').clone(true,true).attr('id','').prependTo(elt.parent()).show();
		}
	}
	,editorRemove:function(elt){
		//$('#texttoolbar').hide();
	}
	,change: function(elt,val){
		var form= $(elt).closest('[name="record"]');
		$(elt).data('data').change.call(elt,val,form.data('record'),form);
	}
	,h1:function(h){
		return $("<h1>"+h+"</h1>");
	}		
	,h2:function(h){
		return $("<h2>"+h+"</h2>").click(function(){$(this).next().toggle();});
	}
	,tuple:function(label,value){
		return '<tr><td>'+label+'</td><td>'+value+'</td></tr>';
	}
	,noteHTML:function(kind,t){
		return '<div class="ui-widget"><div style="margin-top: 20px; padding: 0 .7em;" class="ui-state-highlight ui-corner-all"><p><span style="float: left; margin-right: .3em;" class="ui-icon ui-icon-'+kind+'"></span>'+t+'</div></div>';
	}
	,note:function(t){
		return $(form.noteHTML('info',t));
	}
	,noteAlert:function(t){
		return $(form.noteHTML('alert',t));
	}
	,fieldset:function(legend,record){
		return $('<fieldset name="record"><legend >'+legend+'</legend></fieldset>').data('record',record);//.click(function(){$(this).toggleClass('collapse')});
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
		$('input',e).blur(function(){
			form.change($(this),$(this).is(':checked'));}).attr( 'checked',data.value===true).data('data',data);
		return e;
	}
	
	
	,pickpage:function(data)
	{	// 2014-06-02 Pick page via popup picker instead. 
		var pageDispName = gGuide.pageDisplayName(data.value);
		var e=$('<div name="'+data.name+'">' + (typeof data.label!=='undefined' ? ('<label>'+data.label+'</label>') : '') + ('<button/>')+'</div>');
		$('button',e).button({label:pageDispName,icons:{primary:'ui-icon-link'}}).data('data',data).click(function(){
			//alert(data.value);
			form.pickPageDialog($(this),data);
		});
		return e;
	}
	
	
	,pickPageDialog:function(pageButton,data)
	{	// Display page picker modal dialog, default selecting page named data.value.
		// Clone the TOC, select the default page name, scroll into view, remove popups.
		var pageName=data.value;
		
		
		// Special destinations of page ids we can go to including the built-ins like no where, exit.
		var ts = getTOCStepPages(true,false,true);
		
		//$('#CAJAOutline').clone().appendTo('#page-picker-list');
		//$('#page-picker-list li[rel^="tabsPopups"],#page-picker-list li[rel^="tabsPopups"] + ul').empty();
		//$('#page-picker-list .pageoutline li').removeClass(SELECTED);
		$('#page-picker-list').html('<ul>' + ts + '</ul>');
	
		var e=pageNameRelFilter('#page-picker-list li',pageName);
		e.toggleClass(SELECTED);
		// TODO SJG Scrolling to focus the selected page is not working. Why!?!?
		//$('#page-picker-list .pageoutline').scrollTop(0);
		//scrollToElt($('#page-picker-list .pageoutline'),e);
	
		// JPM Only 'select' Pages, not Steps
		$('#page-picker-list  li[rel^="PAGE "]')
			.click(function(e){
				$('#page-picker-list li').removeClass(SELECTED);
				$(this).toggleClass(SELECTED);
				//var rel=$(this).attr('rel');
				//trace(rel);
			})
			.dblclick(function (){
				// TODO - double click to select and set
				//var name= $(this).data().value;
				//$('page-picker-dialog').dialog( "close" );
			}); 
		$('#page-picker-dialog').data(data).dialog({
			autoOpen:true,
				width: 700,
				height: 500,
				modal:true,
				close:function(){
					$('#page-picker-list').empty();
				},
				buttons:[
				{text:'Change', click:function()
					{
						var newPageDest = makestr($('#page-picker-list li.'+SELECTED).first().attr('rel')).substr(5);
						data.value = newPageDest;
						var pageDispName = gGuide.pageDisplayName(newPageDest);
						pageButton.button({label:pageDispName});
						//data.change.call(rel,data);						
						form.change(pageButton, newPageDest);
						//trace('Changing destination  to "'+newPageDest+'"');
						$(this).dialog("close");
					}
				},
				{text:'Cancel',click:function()
					{
						$(this).dialog("close");
					}
				}
			]});
	}
	
	,pickPopupDialog:function(pageButton,data,doneFnc)
	{	// 2014-07-21 Display popup picker modal dialog, default selecting page named data.value.
		// Clone the TOC, select the default page name, scroll into view, remove non-popups.
		var pageName=data.value;
		
		// Special destinations of page ids we can go to including the built-ins like no where, exit.
		var ts = getTOCStepPages (false,true,false ); 
		
		$('#page-picker-list').html('<ul>' + ts + '</ul>');
	
		var e=pageNameRelFilter('#page-picker-list li',pageName);
		e.toggleClass(SELECTED);
		$('#page-picker-list  li[rel^="PAGE "]')
			.click(function(e){
				$('#page-picker-list li').removeClass(SELECTED);
				$(this).toggleClass(SELECTED);

			})
			.dblclick(function (){
				// TODO - double click to select and set
				//var name= $(this).data().value;
				//$('page-picker-dialog').dialog( "close" );
			}); 
		$('#page-picker-dialog').data(data).dialog({
			autoOpen:true,
				width: 700,
				height: 500,
				modal:true,
				close:function(){
					$('#page-picker-list').empty();
				},
				buttons:[
				/*{text:'New', click:function()
					{
						var newPageDest = makestr($('#page-picker-list li.'+SELECTED).first().attr('rel')).substr(5);
						data.value = newPageDest;
						//data.change.call(rel,data);
						//form.change(pageButton, newPageDest);
						trace('Changing destination  to "'+newPageDest+'"');
						doneFnc(newPageDest);
						$(this).dialog("close");
					}
				},
				*/
				{text:'Change', click:function()
					{
						var newPageDest = makestr($('#page-picker-list li.'+SELECTED).first().attr('rel')).substr(5);
						data.value = newPageDest;
						//data.change.call(rel,data);
						//form.change(pageButton, newPageDest);
						trace('Changing destination  to "'+newPageDest+'"');
						doneFnc(newPageDest);
						$(this).dialog("close");
					}
				},
				{text:'Cancel',click:function()
					{
						$(this).dialog("close");
					}
				}
			]});
	}
	
	,varPicker: function(data)
	{	// Pick variable name from list of defined variables
		var dval = (data.value);

		var e =$((typeof data.label!=='undefined' ? ('<label>'+data.label+'</label>') : '')
				+ '<span class=editspan><input class="  ui-combobox-input editable autocomplete picker varname dest" type="text" ></span>');

		$('.picker',e).blur(function(){
			var val=$(this).val();
			form.change($(this),val);
		}).data('data',data).val(decodeEntities(dval));
		
		// Create list of sorted variable names with type info.
		var sortedVars  = gGuide.varsSorted();
		var source=[];
		for (var vi in sortedVars) {
			var v = sortedVars[vi];
			source.push({label:v.name+' '+v.type,value:v.name});
		}
		$('.autocomplete.picker.varname',e).autocomplete({ source: source , 
	      change: function () { // if didn't match, restore to original value
	         //var matcher = new RegExp('^' + $.ui.autocomplete.escapeRegex($(this).val().split("\t")[0]) + "$", "i");
	         var newvalue = $(this).val();
				/*var sortedVars  = gGuide.varsSorted();
	         $.each(sortedVars, function (p, v) {
					if ( (matcher.test(v.name)))
					{
						newvalue = (v.name);
						return false;
					}
					return true;
	         });
	         */
	         $(this).val(newvalue); 
	      }})
			.focus(function () {
			   $(this).autocomplete("search");
			});
		return e;
	}
	
	/*
	,pickpageComboBox:function(data)
	{ 
		var dval = gGuide.pageDisplayName(data.value);
			
		var e =$((typeof data.label!=='undefined' ? ('<label>'+data.label+'</label>') : '')
				+ '<span class=editspan><input class="  ui-combobox-input editable autocomplete picker page dest" type="text" ></span>');
		$('.picker',e).blur(function(){
			var val=$(this).val();
			form.change($(this),val);
		}).data('data',data).val(decodeEntities(dval));
		$('.autocomplete.picker.page',e).autocomplete({ source: pickPage, html: true,
	      change: function () { // if didn't match, restore to original value
	         var matcher = new RegExp('^' + $.ui.autocomplete.escapeRegex($(this).val().split("\t")[0]) + "$", "i");
	         var newvalue = $(this).val();//.split("\t")[0];
				//trace(newvalue);
	         $.each(gGuide.sortedPages, function (p, page) {
					if ((page.type!==CONST.ptPopup) && (matcher.test(page.name)))
					{
						newvalue = gGuide.pageDisplayName(page.name);
						return false;
					}
					return true;
	         });
	         $(this).val(newvalue); 
	      }})
			.focus(function () {
			   $(this).autocomplete("search");
			});
		return e;
	}
	*/
	
	,text: function(data){
		var e=$('<div name="'+data.name+'">'
			+(typeof data.label!=='undefined' ? ('<label>'+data.label+'</label>') : '')
			+'<span class=editspan> <input class="ui-widget editable" '+
			//'placeholder="'+data.placeholder+'" '+
			'type="text" /> </span></div>');
		//if (typeof data.class!=='undefined') $('input',e).addClass(data.class);
		//if (typeof data.width!=='undefined') $('input',e).css('width',data.class);
		$('input',e).blur(function(){
			form.change($(this),$(this).val());
			//trace('Saving text',$(this).val());
			}).val(decodeEntities(data.value)).data('data',data);
		return e;
	}
	
	,pasteFix:function(srchtml,ALLOWED_TAGS)
	{	// 2014-11-06 Strip out HTML comments and any other unapproved code that Word usually adds.
		// TODO strip out other irrelevant code
		var html =$('<div>'+(srchtml)+'</div>').html(); // ensure valid HTML tags
		html = ' '+html.replace(/<!--(.|\s)*?-->/g,'')+' '; // strip HTML comments
		var parts = html.split('<');
		var html=makestr(parts[0]);
		for (var p in parts)
		{
			var part2=parts[p].split('>');
			var ta=part2[0].toUpperCase();			
			for (var t in ALLOWED_TAGS)
			{
				var tag = ALLOWED_TAGS [t];
				if (ta== tag   || ta=='/'+tag )
				{
					html += '<' + ta + '>'; 
				}
				else
				if (ta.indexOf(tag+' ')==0)
				{
					if (tag=='A'  ) {
						// Only Anchor tags will allow attributes
						html += '<' +  tag + part2[0].substr(1) + '>';
					}
					else{
						html += '<' + tag + '>'; 
					}
				}
			}
			html += makestr(part2[1]);
		}
		html = jQuery.trim(html.replace(/<BR\>/gi,"<BR/>")); // Matched tags fix.
		if (html!=srchtml) {	trace(srchtml);trace(html);}
		return html;
	}
	,codeFix:function(html)
	{	// Convert HTML into correctly formatted/line broken code.
		// Remove extraneous DIV markup due to copy/paste. 
		//trace('codefix before',html);
		html = html.replace(/<BR/gi,"\n<BR").replace(/<DIV/gi,"\n<DIV");// preserve line breaks
		html = form.pasteFix(html,[ 'A']);
		//var code=html.replace(/<br/gi,"\n<br").replace(/<div/gi,"\n<div").stripHTML().replace(/[\n]/gi,"<BR/>");
		html = html.replace(/[\n]/gi,"<BR/>");
		//trace('codefix after',html);
		return html;
	}
	,htmlFix:function(html)
	{	
		//trace('htmlFix before',html);
		html = form.pasteFix(html,['P','BR','UL','OL','LI','A','B','I','U','BLOCKQUOTE']);
 		//trace('htmlFix after ',html);
		return html;
	}
	,htmlarea: function(data){//label,value,handler,name){ 
		form.id++;
		var e= $('<div name="'+data.name+'">'
			+(typeof data.label!=='undefined' ? ('<label>'+data.label+'</label>') : '')
			+'<span class=editspan>'
			+'<div contenteditable=true class="  htmledit  text editable taller" id="tinyMCE_'+form.id+'"  name="'+form.id+'" rows='+1+'>'
			+data.value+'</div></span></div>');
		$('.editable',e).focus(function(){$(this).addClass('tallest');form.editorAdd($(this));}).blur(function(){
			//$(this).removeClass('tallest');
			form.editorRemove(this);
			var html=form.htmlFix($(this).html());
			//$(this).html(html);
			form.change($(this), html);
		}).data('data',data) ;
		return e;
	} 
	,textArea: function(data)
	{
		var rows=2;
		var e=$('<div name="'+data.name+'">'
			+(typeof data.label!=='undefined' ? ('<label>'+data.label+'</label>') : '')
			+'<span class=editspan><textarea  class="     text editable taller" rows='+rows+'>'+data.value+'</textarea></span></div>');
		$('.editable',e).blur(function(){form.change($(this),form.htmlFix($(this).html()));}).data('data',data);
		return e;
	}
	
	,pickFile : function(mask)
	{	
		var e=$('<span class="fileinput-button"><button class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary"><span class="ui-button-icon-primary ui-icon ui-icon-plus"></span><span class="ui-button-text" >Upload...</span></button><input class="fileupload" type="file" name="files[]"/></span>');
		//.addClass('fileupload-processing')
		if (gGuideID!==0) {
			$('.fileupload',e).fileupload({
				 url:CONST.uploadURL + gGuideID,
				 dataType: 'json',
				 done: function (e, data) {
					var filename = data.result.files[0].name;
					$(e.target).closest('div').find('input[type=text]').val(filename);
					//form.change($(this),filename);
					setTimeout(updateAttachmentFiles,250);
				 },
				 progressall: function (e, data) {
					  var progress = parseInt(data.loaded / data.total * 100, 10);
					  $('#progress .bar').css(
							'width',
							progress + '%'
					  );
				 }
			});
		}
		return e;
	}
	
	
	,pickAudio: function(data){
		return form.text(data).append(form.pickFile(''));
	}	
	,pickImage:function(data){ 
		return form.text(data).append(form.pickFile(''));
	}
	,pickVideo:function(data){
		return form.text(data).append(form.pickFile(''));
	}
	,pickXML:function(data){
		return form.text(data).append(form.pickFile(''));
	}
	
	,clear:function(){
		form.codeCheckList=[];
	}
	,finish:function(div){
	}
	,codeCheckIntervalID:0
	,codeCheckList:[]
	,codeCheckSoon:function(elt){
		if (form.codeCheckIntervalID===0){
			form.codeCheckIntervalID=setInterval(form.codeCheckInterval,100);
		}
		form.codeCheckList.unshift(elt);
	}
	,codeCheckInterval:function(){ // syntax check one code block
		if (form.codeCheckList.length===0){
			clearInterval(form.codeCheckIntervalID);
			form.codeCheckIntervalID=0;
		}
		else{
			form.codeCheck(form.codeCheckList.pop());
		}
	}
	,codeCheck:function(elt){
		$(elt).removeClass('haserr');
		$('SPAN',$(elt)).remove();
		var code=form.codeFix($(elt).html());
		$(elt).html(code);
		//trace('codeCheck',code);
		//TODO remove markup
		var script = gLogic.translateCAJAtoJS(code);
		var tt="";
		var t=[];
		if (script.errors.length>0)
		{
			$(elt).addClass('haserr');
		/*
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
			*/
			var e;
			for (e in script.errors)
			{
				var err=script.errors[e];
				//tt+=form.noteHTML('alert',"<b>"+err.line+":"+err.text+"</b>");
				
				$('BR:eq('+ (  err.line) +')',$(elt)).before(
					//(err.line)
					//'<span class="err">'+err.text+'</span>'
					//'<span class="ui-widget">
					'<span style="margin-top: 20px; padding: 0 .7em;" class="ui-state-highlight ui-corner-all"><span style="float: left; margin-right: .3em;" class="ui-icon ui-icon-'+'alert'+'"></span>'+err.text+'</span></span>'
					//</span>'
					);				
			}
		}
		if( gPrefs.showJS)
		{	// print JavaScript
			t=[];
			t.push('JS:');
			var l;
			for (l=0;l<script.js.length;l++)
			{
				t.push(script.js[l]);
			}
			tt+=("<BLOCKQUOTE class=Script>"+t.join("<BR>")+"</BLOCKQUOTE>");
		}
		//tt=propsJSON('SCRIPT',script);
		$('.errors',$(elt).closest('.editspan')).html(tt);
	}
	,codearea:function(data){ 
		form.id++;
		var e= $('<div>'
			+(typeof data.label!=='undefined' ? ('<label>'+data.label+'</label>') : '')
			+'<div class=editspan><div spellcheck="false" contenteditable=true spellcheck=false class="text editable taller codeedit"  rows='+4+'>'+data.value+'</div><div class="errors"></div></div></div>');
		$('.editable',e).blur(function(){
			form.codeCheckSoon(this);
			$('SPAN',$(this)).remove();
			form.change($(this),form.codeFix($(this).html()));
			}).data('data',data);
		form.codeCheckSoon($('.codeedit',e));
		return e;
	}

	,pickList:function(data,listValueLabel){//list is array to ensure preserved order. Note: js object properties don't guarantee order
		var c="";
		var o;
		for (o=0;o<listValueLabel.length;o+=2){
			c += '<option value="'+listValueLabel[o]+'">'+listValueLabel[o+1]+'</option>';
		}
		var e =$('<div name="'+data.name+'">'
			+(typeof data.label!=='undefined' ? ('<label>'+data.label+'</label>') : '')
			+'<span class=editspan><select class="     ui-select-input">'+c+'</select></span></div>');
		$('.ui-select-input',e).change(function(){
			form.change($(this),$('option:selected',this).val());
		}).data('data',data).val(data.value);
		//trace(data.value,$('.ui-select-input',e).val());
		if ($('.ui-select-input',e).val()!==String(data.value))
		{
			$('select',e).append($('<option value="'+data.value+'">{'+data.value+'}</option>'));
			$('.ui-select-input',e).val(data.value);
		}
		return e;
	}
	,pickStep:function(data){
		var list=[];
		var s;
		for (s=0;s<gGuide.steps.length;s++){
			//var step = gGuide.steps[s];
			list.push(s, gGuide.stepDisplayName(s)); // s,step.number+". "+ (step.text));
		}
		//(list);
		return form.pickList(data,list);
	}
	,tableRowCounter:function(name,label,minelts,maxelts,value)
	{	// Let user choose number of said item
		var c=$('<label/>').text(label);
		var s='<select list="'+name+'" class="  ui-select">';
		var o;
		for (o=minelts;o<=maxelts;o++)
		{
			s+="<option>"+o+"</option>";
		}
		s+="</select>";
		return $('<div/>').append(c.after(s).change(function(){form.tableRowAdjust(name,$('option:selected',this).val());}).val(value));
	}
	
	,tableRowAdjust:function(name,val)
	{	// Adjust number of rows. set visible for rows > val. if val > max rows, clone the last row.
		var $tbl = $('table[list="'+name+'"]');
		var settings=$tbl.data('settings');
		var $tbody = $('tbody',$tbl);//'table[list="'+name+'"] tbody');
		var rows = $('tr',$tbody).length;		
		var r;
		for (r=0;r<rows;r++){
			$('tr:nth('+r+')',$tbody).showit(r<val);
		}
		for (r=rows;r<val;r++){
			form.listManagerAddRow($tbl,$.extend({},settings.blank));
		}
		form.listManagerSave($tbl);
	}
	
	,listManagerSave:function($tbl)
	{	// save revised order or added/removed items
		var settings=$tbl.data('settings');
		var list=[];
		$('tr',$tbl).not(':hidden').each(function(idx){ //:gt(0)
			list.push($(this).data('record'));
		});
		settings.save(list);
		$('select[list="'+settings.name+'"]').val(list.length);
	}
	,listManagerAddRow:function($tbl,record)
	{	
		var settings=$tbl.data('settings');
		var $row=$('<tr valign=top class="ui-corner-all" name="record"/>');
		$row.append($('<td class="editicons"/>')
			.append('<span class="ui-draggable sorthandle ui-icon ui-icon-arrowthick-2-n-s"/>'
			+'<span class="ui-icon ui-icon-circle-plus"/><span class="ui-icon ui-icon-circle-minus"/>'));
		$row.append($('<td/>').append(settings.create(form.div(),record)));
		$row.data('record',record); 
		$tbl.append($row);
	}
	,listManager:function(settings)
	{	//   data.name:'Fields' data.,picker:'Number of fields:',data.min:0,data.max:CONST.MAXFIELDS,data.list:page.fields,data.blank:blankField,data.save=function to save,data.create=create form elts for record
		var div = $('<div/>');
		var $tbl=$('<table/>').addClass('list').data('settings',settings).attr('list',settings.name);
		div.append(form.tableRowCounter(settings.name,settings.picker,settings.min,settings.max,settings.list.length));
		var i;
		for (i=0;i<settings.list.length;i++){
			form.listManagerAddRow($tbl,settings.list[i]);
		}
		$('tbody',$tbl).sortable({
			handle:"td .sorthandle",
			update:function(event,ui){
				form.listManagerSave((ui.item.closest('table')));
			}});
		div.append($tbl);
		/*(		div.append($('<button id="newrow"/>').button({label:'Add',icons:{primary:"ui-icon-plusthick"}}).click(function(){
			addRow($.extend({},settings.blank));
			save();
		}));

		*/
		return div;
	}
	
};

TGuide.prototype.noviceTab = function(tab,clear)
{	//### 08/03/2012 Edit panel for guide sections 
	/** @type {TGuide} */
	var guide = this;
	var div = $('#'+tab);
	var t = $('.tabContent',div);
	if (clear){
		t.html("");
	}
	if (t.html()!==""){
		return;
	}
	form.clear();
	var fs;
	var p;
	var page;
	var pagefs;
	switch (tab){
			
		
		case "tabsVariables":
			guide.buildTabVariables(t);
			break;
			
		case "tabsConstants":
			fs = form.fieldset('Constants');
			t.append(fs);
			break;
		
		case "tabsLogic":
			t.append(form.note(
				gPrefs.showLogic=== 1 ? 'Showing only logic fields containing code' : 'Showing all logic fields'));
			
			var codeBeforeChange = function(val,page){
				page.codeBefore=val; /* TODO Compile for syntax errors */
				//trace('page.codeBefore',page.codeBefore);
			};
			var codeAfterChange = function(val,page){
				page.codeAfter=val; /* TODO Compile for syntax errors */
				//trace('page.codeAfter',page.codeAfter);
			};
			
			
			for (p in guide.sortedPages)
			{
				page=guide.sortedPages[p];
				if (page.type!==CONST.ptPopup)
				{
					if ((gPrefs.showLogic===2) || (gPrefs.showLogic===1 && (page.codeBefore!=="" || page.codeAfter!=="")))
					{
						pagefs=form.fieldset(page.name, page);
						if (gPrefs.showLogic===2 || page.codeBefore!==""){
							pagefs.append(form.codearea({label:'Before:',	value:page.codeBefore,change:codeBeforeChange} ));
						}
						if (gPrefs.showLogic===2 || page.codeAfter!==""){
							pagefs.append(form.codearea({label:'After:',	value:page.codeAfter,change:codeAfterChange} ));
						}
						t.append(pagefs);
					}
				}
			}
			
			break;
			
		case "tabsText":
			t.append(form.note(gPrefs.showText===1 ? 'All non-empty text blocks in this guide' : 'All text blocks in this guide'));
			for (p in guide.sortedPages)
			{
				page=guide.sortedPages[p];
				pagefs=form.fieldset(page.name, page);
				pageNameFieldsForTextTab(pagefs,page);
				t.append(pagefs);
			}
			
			break;
		
		case 'tabsReports':
			// Generate read-only report. Guide info, variable list, step info, pages. 
			
			break;
		
		
		case "tabsAbout":
			fs = form.fieldset('About');
			fs.append(form.text({label:'Title:', placeholder:'Interview title', value:guide.title, change:function(val){guide.title=val;}}));
			fs.append(form.htmlarea({label:'Description:',value:guide.description,change:function(val){guide.description=val;}}));
			fs.append(form.text({label:'Jurisdiction:', value:guide.jurisdiction, change:function(val){guide.jurisdiction=val;}}));
			
			var l,list=[];
			for (l in Languages.regional){
				// l is language code like en or es.
				list.push(l, Languages.regional[l].LanguageEN + ' (' + Languages.regional[l].Language+') {'+l+'}');
			} 
			fs.append(form.pickList({label:'Language:', value:guide.language, change:function(val){
				guide.language=val;
				Languages.set(guide.language);
				$('.A2JViewer','#page-viewer').html('');
				}},list));
			list=['avatar1','Avatar 1','avatar2','Avatar 2','avatar3','Avatar 3'];

			fs.append(form.pickList({label:'Avatar:',value:guide.avatar,change:function(val){
				guide.avatar=val;
				}},list));
			list=['Female','Female Guide','Male','Male Guide'];
			if (guide.guideGender!=='Male') {
				guide.guideGender='Female';
			}
			fs.append(form.pickList({label:'Guide Gender:',value:guide.guideGender,change:function(val){
				guide.guideGender=val;}},list));
			fs.append(form.htmlarea({label:'Credits:',value:guide.credits,change:function(val){guide.credits=val;}}));
			fs.append(form.text({label:'Approximate Completion Time:',placeholder:'',value:guide.completionTime,change:function(val){guide.completionTime=val;}}));
			t.append(fs);

			
			fs = form.fieldset('Layout');
			fs.append(form.pickImage({label:'Logo graphic:', placeholder: 'Logo URL',value:guide.logoImage, change:function(val){guide.logoImage=val;}}));
			fs.append(form.pickImage({label:'End graphic:', placeholder:'End (destination graphic) URL',value:guide.endImage, change:function(val){guide.endImage=val;}}));
			fs.append(form.pickList({label:'Mobile friendly?', value:guide.mobileFriendly, change:function(val){guide.mobileFriendly=val;}},['','Undetermined','false','No','true','Yes']));
			t.append(fs);
			
			fs = form.fieldset('Feedback');
			fs.append(form.checkbox({label:'Allow Send feedback?', checkbox:'', value:guide.sendfeedback,
						change:function(val,field){guide.sendfeedback=val;}}));
			fs.append(form.text({label:'Feedback email:',value:guide.emailContact,change:function(val){guide.emailContact=val;}}));
			t.append(fs);
			
			fs = form.fieldset('Authors');
			var blankAuthor=new TAuthor();
			
			fs = form.fieldset('Revision History');
			fs.append(form.text({label:'Current Version:',value:guide.version,change:function(val){guide.version=val;}}));
			fs.append(form.htmlarea({label:'Revision Notes',value:guide.notes,change:function(val){guide.notes=val;}}));
			t.append(fs);
			
			fs=form.fieldset('Authors');
			fs.append(form.listManager({name:'Authors',picker:'Number of authors',min:1,max:12,list:guide.authors,blank:blankAuthor
				,save:function(newlist){
					guide.authors=newlist; }
				,create:function(ff,author){
						ff.append(form.text({  label:"Author's Name:", placeholder:'name',value:author.name,
							change:function(val,author){author.name=val;}}));
						ff.append(form.text({  label:"Author's Title:", placeholder:'title',value:author.title,
							change:function(val,author){author.title=val;}}));
						ff.append(form.text({  label:"Author's Organization:", placeholder:'organization',value:author.organization,
							change:function(val,author){author.organization=val;}}));
						ff.append(form.text({  label:"Author's email:", placeholder:'email',value:author.email,
							change:function(val,author){author.email=val;}}));
					return ff;
				}}));
				
			t.append(fs);

			break;

		
		case 'tabsSteps':
		
			fs=form.fieldset('Start/Exit points');
			fs.append(form.pickpage({	value: guide.firstPage,label:'Starting Point:',	change:function(val){guide.firstPage=val;}}));
			fs.append(form.pickpage({	value: guide.exitPage,label:'Exit Point:',		change:function(val){guide.exitPage=val;}}));
			t.append(fs);
			fs=form.fieldset('Steps');
			var blankStep=new TStep();
			
			fs.append(form.listManager({grid:true,name:'Steps',picker:'Number of Steps:',min:1,max:CONST.MAXSTEPS,list:guide.steps,blank:blankStep
				,save:function(newlist){
					guide.steps=newlist;
					updateTOC();
				}
				,create:function(ff,step){
						ff.append(form.text({  label:"Step Number:", placeholder:'#',value:step.number,
							change:function(val,step){
								step.number=val;
								updateTOC();}}));
						ff.append(form.text({  label:"Step Sign:", placeholder:'title',value:step.text,
							change:function(val,step){
								step.text=val;
								updateTOC();
							}}));
					return ff;
				}}));		
			t.append(fs);
			break;
	}
	form.finish(t);



	 $("legend",t).click(function(){
			 $(this).siblings('div').slideToggle(300);
	 });
	 
	
	
};

function resumeEdit()
{
	$('#authortool').show();
	$('#page-viewer').hide();
	if ($pageEditDialog!==null){$pageEditDialog.dialog('open');}
}

function authorViewerHook()
{	//	### Attach Author editing buttons to the A2J viewer
	A2JViewer.IMG = "../viewer/images/";
	$('.A2JViewer').append('<div class="debugmenu"><button/><button/><button/><button/></div>');
	$('.A2JViewer div.debugmenu button').first()
		.button({label:'Variables/Script',icons:{primary:'ui-icon-wrench'}}).click(function(){$('.A2JViewer').toggleClass('test',100);})
		.next()
		.button({label:'Fill',icons:{primary:'ui-icon-pencil'}}).click(function(){
			A2JViewer.fillSample();
		})
		.next()
		.button({label:'Resume Edit',icons:{primary:'ui-icon-arrowreturnthick-1-w'}}).click(function(){
			resumeEdit();
		})
		.next()
		.button({label:'Edit this',icons:{primary:'ui-icon-pencil'}}).click(function(){
			gotoPageEdit(gPage.name);
		});
}





function updateTOCOnePage()
{	// TODO - just update only this page's TOC and Mapper entry.
	updateTOC();
}


TGuide.prototype.varDelete=function(name){
	var guide=this;
	delete guide.vars[name.toLowerCase()];
	gGuide.noviceTab('tabsVariables',true);
};

function varEdit(v/*TVariable*/)
{
	$('#varname').val(v.name);
	if (gPrefs.warnHotDocsNameLength) {
		// 2014-07-28 
		$('#varname').attr('maxlength',CONST.MAXVARNAMELENGTH);
	}
	$('#vartype').val(v.type);
	$('#varcomment').val(v.comment);
	$('#varrepeating').attr('checked', v.repeating);
	$('#varUsageList').html('...');
	$('#varusage').button({label:'Quick Find',icons:{primary:'ui-icon-link'}}).click(function()
	{	// 2014-09-24 List all references to this variable.
		// This is a Lazy search so plain text words are also found.
		// TODO - exclude non-macro/logic bits. 
		var html='';
		var count=0;
		var p;
		var nameL=v.name.toLowerCase();
		for (p in gGuide.pages)
		{	// Search text, help, fields and logic for variable name.
			/** @type TPage */
			var where=[]; //  list where it's on this page
			var page=gGuide.pages[p];
			for (var f in page.fields)
			{	// Search fields
				/** @type TField */
				var field=page.fields[f];
				if (field.name.toLowerCase() == nameL)
				{
					where.push('Field '+field.label);
				}
			}
			if ((page.text + ' ' + page.help).toLowerCase().indexOf(nameL)>=0)
			{
				where.push('Text/Help');
			}
			if ((  page.codeBefore + ' '+ page.codeAfter).toLowerCase().indexOf(nameL)>=0)
			{
				where.push('Logic');
			}
			if (where.length>0)
			{	// If we foudn anything, we'll list the page and its location.
				count++;
				html += ('<li>'+page.name +'</li><ul>'+'<li>'+where.join('<li>')+'</ul>');				
			}
		}
		$('#varUsageList').html('Used in '+count+' pages' + '<ul>'+html+'</ul>');
	});
	$('#var-edit-form').data(v).dialog({
		autoOpen:true,
			width: 450,
			height: 500,
			modal:true,
			close: function(){
			},
			buttons:[
			{text:'Delete', click:function(){
				var name= $(this).data().name;
				if (name===""){
					return;
				}
				dialogConfirmYesNo({title:'Delete variable '+name,message:'Delete this variable?',name:name,Yes:
				/*** @this {{name}} */
				function(){
					$('#var-edit-form').dialog("close");
					gGuide.varDelete(this.name);
				}});
			}},
			{text:'Close',click:function(){ 
				var name= $('#varname').val();
				if(name!==v.name)//rename variable
				{
					delete gGuide.vars[v.name.toLowerCase()];
					v.name=name;
					gGuide.vars[name.toLowerCase()]=v;
				}
				v.type=$('#vartype').val();
				v.comment=$('#varcomment').val();
				v.repeating=$('#varrepeating').is(':checked');
				gGuide.noviceTab('tabsVariables',true);
				$(this).dialog("close");
			 }}
		]});
	
}

function varAdd()
{  // Add new variable and edit.
	var v= new TVariable();
	varEdit(v);
}


TGuide.prototype.variableListHTML = function ()
{	// Build HTML table of variables, nicely sorted.
	var guide = this;
	var th=html.rowheading(["Name","Type","Repeating","Comment"]); 
	var sortvars=guide.varsSorted();//[];
	var vi;
	/*
	for (vi in guide.vars){
		sortvars.push(guide.vars[vi]);
	}
	sortvars.sort(function (a,b){return sortingNaturalCompare(a.name,b.name);});
	*/
	var tb='';
	for (vi in sortvars)
	{
		var v=sortvars[vi];
		tb+=html.row([v.name,v.type,v.repeating,v.comment
			+ (typeof v.warning==='undefined'?'':'<span class="warning">'+v.warning+'</spab>')]);
	}
	return '<table class="A2JVars">'+th + '<tbody>'+ tb + '</tbody>'+"</table>";	
};

TGuide.prototype.buildTabVariables = function (t)
{
	t.append(this.variableListHTML());
	$('tr',t).click(function(){
		varEdit(gGuide.vars[$('td:first',this).text().toLowerCase()]);
	});
};


// 2014-08-01 Get/restore selected text when setting hyperlink or popup.
// Chrome forgest selection when using Popup picker. 
//http://stackoverflow.com/questions/5605401/insert-link-in-contenteditable-element
function saveSelection() {
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            var ranges = [];
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                ranges.push(sel.getRangeAt(i));
            }
            return ranges;
        }
    } else if (document.selection && document.selection.createRange) {
        return document.selection.createRange();
    }
    return null;
}

function restoreSelection(savedSel) {
    if (savedSel) {
        if (window.getSelection) {
            sel = window.getSelection();
            sel.removeAllRanges();
            for (var i = 0, len = savedSel.length; i < len; ++i) {
                sel.addRange(savedSel[i]);
            }
        } else if (document.selection && savedSel.select) {
            savedSel.select();
        }
    }
}
function editButton()
{	// ### For the simple editor, handle simple styles.
		
	function editLinkOrPop(preferURL)
	{	// 2014-08-01 
		// Return selected text and url (a href) or blank if none.
		// Used when setting external link or popup link.
		// TODO - integrate CKEditor which will need custom Popup handling code
		var url='';
		var txt='';
		var sel = saveSelection();
		if (sel) {
			var range=sel[0];
			var div = document.createElement('div');
			div.appendChild(range.cloneContents());
			url = $('a',div).attr('href');
			txt =$(div).text();//div.innerHTML;
		}
		if (txt==='') {
			return;
		}
		
		var html='';
		function setHTML( )
		{
			if (url!==null && url!=='http://')
			{
				if (txt==='') {
					txt = url;
				}
				if (url==='') {
					html = txt; 
				}
				else
				{
					html = '<a href="'+url+'">'+txt+'</a>';
				}
				restoreSelection(sel);
				//trace('window.getSelection', window.getSelection());
				//trace('html',html);
				document.execCommand('insertHTML',false,  html );
				//trace('window.getSelection', window.getSelection());
			}
		}
		
		var pop='';		
		if ((!url) || url==='') {
			url='http://';
		}
		if (url.indexOf('POPUP')===0)
		{
			pop = url.substr(8);
		}
		if (pop==='' &&  preferURL)
		{
			url = window.prompt("URL?", url);
			setHTML();
		}
		else
		{
			//pop = window.prompt("Popup?", pop);
			form.pickPopupDialog('',{value:pop},function(newPop)
			{
				if (newPop!==null)
				{
					if (newPop==='')
					{
						url='';
					}
					else
					{
						url='POPUP://'+newPop;
					}
				}
				setHTML();
			});

		}
		
	}

	switch ($(this).attr('id')){
		case 'bold': document.execCommand('bold', false, null); break;
		case 'italic': document.execCommand('italic', false, null); break;
		case 'indent': document.execCommand('indent', false, null); break;
		case 'outdent': document.execCommand('outdent', false, null); break;
		case 'unlink':document.execCommand('unlink', false, null); break;
		case 'link':
			// Add new, edit or remove hyperlink.
			editLinkOrPop(true);
			break;
		case 'popup':
			// Add new, edit or remove popup.
			editLinkOrPop(false);
			break;
	}
}



/* */
