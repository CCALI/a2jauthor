

TGuide.prototype.novicePage = function (div, pagename) {	// Create editing wizard for given page.
   var t = ""; 
	
   var page = this.pages[pagename]; 
	 
	var t=$('<div/>').addClass('tabsPanel editq');

	trace("Loading page "+pagename);
	form.clear();
	if (page == null || typeof page === "undefined") {
		t.append(form.h2( "Page not found " + pagename)); 
	}
	else 
	if (page.type == CONST.ptPopup ) {
		var fs=form.fieldset('Popup info',page);
		fs.append(form.text({label:'Name:',name:'pagename', value:page.name,change:function(val,page,form){
			if (gGuide.pageRename(page,val)==false) $(this).val(page.name);
		}} ));
		fs.append(form.htmlarea({label:'Notes:',value: page.notes,change:function(val,page){page.notes=val}} ));
		fs.append(form.htmlarea(	{label:'Text:',value:page.text,change:function(val,page){page.text=val}} ));
		fs.append(form.pickAudio(	{label:'Text audio:', placeholder:'mp3 file',	value:	page.textAudioURL,
			change:function(val,page){page.textAudioURL=val}} ));
		t.append(fs);
	}
	else	
	{ 
		


		var fs=form.fieldset('Page info',page);
		fs.append(form.pickStep({label:'Step:',value: page.step, change:function(val,page){page.step=parseInt(val);/* TODO Move page to new outline location */}} ));
		fs.append(form.text({label:'Name:', value:page.name,change:function(val,page,form){
			if (gGuide.pageRename(page,val)==false) $(this).val(page.name);
		}} ));
		if (page.type != "A2J") {
			fs.append(form.h2("Page type/style: " + page.type + "/" + page.style));
		}
		fs.append(form.htmlarea({label:'Notes:',value: page.notes,change:function(val,page){page.notes=val}} ));
		t.append(fs);
		
		var pagefs=form.fieldset('Question text',page);  
		
		pagefs.append(form.htmlarea(	{label:'Text:',value:page.text,change:function(val,page){page.text=val}} ));
		pagefs.append(form.pickAudio(	{label:'Text audio:', placeholder:'mp3 file',	value:	page.textAudioURL,change:function(val,page){page.textAudioURL=val}} ));
		pagefs.append(form.text(		{label:'Learn More prompt:',placeholder:'Learn more',	value:page.learn,	change:function(val,page){page.learn=val}} ));
		function getShowMe(){
			if (page.helpVideoURL!="") return 2; 
			else if (page.helpImageURL!="") return 1; 
			else return 0;
		}
		function updateShowMe(form,showMe){
			trace('udpate show me',showMe);
			form.find('[name="helpAudio"]').showit(showMe!=2);
			form.find('[name="helpGraphic"]').showit(showMe==1);
			form.find('[name="helpReader"]').showit(showMe>=1);
			form.find('[name="helpVideo"]').showit(showMe==2);			
		}
		pagefs.append(form.pickList({label:'Help style:',value:getShowMe(), change:function(val,page,form){
			updateShowMe(form,val);
			}},  [0,'Text',1,'Show Me Graphic',2,'Show Me Video']));
		pagefs.append(form.htmlarea(	{label:"Help:",value:page.help,change:function(val,page){page.help=val}} ));
		pagefs.append(form.pickAudio(	{name:'helpAudio',label:'Help audio:',placeholder:'',	value:page.helpAudioURL,
			change:function(val,page){page.helpAudioURL=val}} ));
		pagefs.append(form.pickImage(		{name:'helpGraphic',label:'Help graphic:',placeholder:'',	value:page.helpImageURL,
			change:function(val,page){page.helpImageURL=val}} ));
		pagefs.append(form.pickVideo(		{name:'helpVideo', label:'Help video:',placeholder:'',		value:page.helpVideoURL,
			change:function(val,page){page.helpVideoURL=val}} ));
		pagefs.append(form.htmlarea(	{name:'helpReader', label:'Help Text Reader:', value:page.helpReader,
			change:function(val,page){page.helpReader=val}} ));
		pagefs.append(form.text(		{label:'Repeating Variable:',placeholder:'',	value:page.repeatVar,
			change:function(val,page){page.repeatVar=val}} ));
		t.append(pagefs);
		updateShowMe(pagefs,getShowMe());
		pagefs=null;
		
		
		if (page.type == "A2J" || page.fields.length > 0) {
		
			var blankField=new TField();
			blankField.type=CONST.ftText;
			blankField.label="Label";
			
			function updateFieldLayout(ff,field){
				var canMinMax = field.type==CONST.ftNumber || field.type==CONST.ftNumberDollar || field.type==CONST.ftNumberPick || field.type==CONST.ftDateMDY;
				var canList = field.type==CONST.ftTextPick;
				var canDefaultValue=	field.type!=CONST.ftCheckBox && field.type!=CONST.ftCheckBoxNOTA && field.type!=CONST.ftGender;
				var canOrder =   field.type==CONST.ftTextPick || field.type==CONST.ftNumberPick || 	field.type==CONST.ftDateMDY;
				var canUseCalc = (field.type == CONST.ftNumber) || (field.type == CONST.ftNumberDollar);
				var canMaxChars= field.type==CONST.ftText || field.type==CONST.ftTextLong || field.type==CONST.ftNumber 
					|| field.type==CONST.ftNumberDollar || 	field.type==CONST.ftNumberPhone || field.type==CONST.ftNumberZIP;				
				var canCalendar = field.type==CONST.ftDateMDY;
				//var canCBRange= curField.type==CField.ftCheckBox || curField.type==CField.ftCheckBoxNOTA;
				// Can it use extra long labels instead of single line?
				//	useLongLabel = curField.type==CField.ftCheckBox ||	curField.type==CField.ftCheckBoxNOTA ||curField.type==CField.ftRadioButton ||urField.type==CField.ftCheckBoxMultiple;
				//	useLongText =curField.type==CField.ftTextLong;
				
				ff.find('[name="maxchars"]').showit(canMaxChars);
				ff.find('[name="min"]').showit(canMinMax );
				ff.find('[name="max"]').showit(canMinMax );
				ff.find('[name="default"]').showit(canDefaultValue);
				ff.find('[name="calculator"]').showit(canUseCalc);
				ff.find('[name="calendar"]').showit(canCalendar);
			}
			
			var fs=form.fieldset('Fields');
			fs.append(form.listManager({name:'Fields',picker:'Number of fields:',min:0,max:CONST.MAXFIELDS,list:page.fields,blank:blankField
				,save:function(newlist){
					page.fields=newlist;
					}
				,create:function(ff,field){
					ff.append(form.pickList({label:'Type:',value: field.type,change:function(val,field,ff){
						field.type=val;
						updateFieldLayout(ff,field);
						}},fieldTypesList ));
					ff.append(form.htmlarea({label:'Label:',   value:field.label, 
						change:function(val,field){field.label=val;}}));
					ff.append(form.text({label:'Variable:', placeholder:'Variable name', value: field.name,
						change:function(val,field){field.name=val}}));
					ff.append(form.text({label:'Default value:',name:'default', placeholder:'Default value',value:  field.value,
						change:function(val,field){field.value=val}}));
					ff.append(form.checkbox({label:'Required:', checkbox:'', value:field.required,
						change:function(val,field){field.required=val}}));
					ff.append(form.text({label:'Max chars:',name:'maxchars', placeholder:'Max Chars',value: field.maxChars,
						change:function(val,field){field.maxChars=val;}}));
					ff.append(form.checkbox({label:'Show Calculator:',name:'calculator',checkbox:'Calculator available?', value:field.calculator,
						change:function(val,field){field.calculator=val}}));
					ff.append(form.checkbox({label:'Show Calendar:', name:'calendar',checkbox:'Calendar available?', value:field.calendar,
						change:function(val,field){field.calendar=val}}));
					ff.append(form.text({label:'Min value:',name:'min',placeholder:'min', value: field.min,
						change:function(val,field){field.min=val}}));
					ff.append(form.text({label:'Max value:',name:'max',placeholder:'max', value: field.max,
						change:function(val,field){field.max=val}}));
					ff.append(form.htmlarea({label:'If invalid say:',value: field.invalidPrompt,	change:function(val,field){field.invalidPrompt=val}}));
					
					updateFieldLayout(ff,field);
					return ff;
				}
				}));
			
			
			t.append(fs);
	  	}
		if (page.type == "A2J" || page.buttons.length > 0) {
			var blankButton=new TButton();
			
			var fs=form.fieldset('Buttons');
			fs.append(form.listManager({name:'Buttons',picker:'Number of buttons',min:1,max:CONST.MAXBUTTONS,list:page.buttons,blank:blankButton
				,save:function(newlist){
					page.buttons=newlist; }
				,create:function(ff,b){
					ff.append(form.text({ 		value: b.label,label:'Label:',placeholder:'button label',		change:function(val,b){b.label=val}}));
					ff.append(form.text({ 		value: b.name, label:'Variable Name:',placeholder:'variable',		change:function(val,b){b.name=val}}));
					ff.append(form.text({ 		value: b.value,label:'Default value',placeholder:'Default value',		change:function(val,b){b.value=val}}));
					ff.append(form.pickpage({	value: b.next,label:'Destination:', 	change:function(val,b){
					trace(b.next,val);
					b.next=val;}}));
					return ff;
				}}));
			t.append(fs);
		}
		var fs=form.fieldset('Advanced Logic');
		fs.append(form.codearea({label:'Before:',	value:page.codeBefore,	change:function(val){page.codeBefore=val; /* TODO Compile for syntax errors */}} ));
		fs.append(form.codearea({label:'After:',	value:page.codeAfter, 	change:function(val){page.codeAfter=val; /* TODO Compile for syntax errors */}} ));
		t.append(fs);

		if (page.type == "Book page") { }
		else
		{
		/*
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
				 .append(form.pickpage('', fb.next, {}))
				 .append(form.htmlarea("", GROUP + "CHOICE" + d, "fb" + d, fb.text));
					var brtype = makestr(fb.next) == "" ? 0 : (makestr(fb.text) == "" ? 2 : 1);
					$('select.branch', $fb).val(brtype).change();
					clist.push({ row: [detail.label, form.pickscore(fb.grade), form.htmlarea("", GROUP + "CHOICE" + d, "detail" + d, detail.text)] });
					dlist.push({ row: [detail.label, form.pickscore(fb.grade), $fb] });
				}
				t.append(form.h1('Choices'));
				t.append(form.tableRowCounter("Number of choices", 2, 7, 'choices').after(form.tablerange('choices', clist)));

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

*/
}

		//pageText += html2P(expandPopups(this,page.text));

   }

   div.append(t);
	form.finish(t);
	div.append('<div class=xml>'+htmlEscape(page.xml)+'</div>');

	gPage = page;
}
function tabGUI()
{
	//$('table.list').hover(function(){$('.editicons',this).showIt(1);},function(){$('.editicons',this).showIt(0);});
	$('.editicons .ui-icon-circle-plus').live('click',function(){// clone a table row
		var $tbl=$(this).closest('table');
		var row = $(this).closest('tr');
		var settings=$tbl.data('settings');
		if ($('tbody tr',$tbl).length>=settings.max) return;
		row.clone(true,true).insertAfter(row).fadeIn();
		row.data('record',$.extend({},row.data('record')));
		form.listManagerSave($(this).closest('table'));
	});
	$('.editicons .ui-icon-circle-minus').live('click',function(){// delete a table row
		var $tbl=$(this).closest('table');
		var settings=$tbl.data('settings');
		if ($('tbody tr',$tbl).length<=settings.min) return;
		$(this).closest('tr').remove();
		form.listManagerSave($tbl);
	});
	
	$('#tabsMapper button').click(function(){ 
		var zoom=parseFloat($(this).attr('zoom'));
		if (zoom>0)
			mapperScale = mapperScale * zoom; 
		trace(mapperScale);
		$('.map').css({zoom:mapperScale,"-moz-transform":"scale("+mapperScale+")","-webkit-transform":"scale("+mapperScale+")"});
	});
	$('#tabsMapper button').first().button({label:'Fit',icons:{primary:'ui-icon-arrow-4-diag'}}).next().button({label:'Zoom in',icons:{primary:'ui-icon-zoomin'}}).next().button({label:'Zoom out',icons:{primary:'ui-icon-zoomout'}});
	
	
	$('#vars_load').button({label:'Load',icons:{primary:"ui-icon-locked"}}).next().button({label:'Save',icons:{primary:"ui-icon-locked"}});
	$('#vars_load2').button({label:'Load',icons:{primary:"ui-icon-locked"}}).next().button({label:'Save',icons:{primary:"ui-icon-locked"}});
	
	$('#showlogic').buttonset();
	$('#showlogic1').click(function(){gShowLogic=1;noviceTab(gGuide,"tabsLogic",true)});
	$('#showlogic2').click(function(){gShowLogic=2;noviceTab(gGuide,"tabsLogic",true)});
	$('#showtext').buttonset();
	$('#showtext1').click(function(){gShowText=1;noviceTab(gGuide,"tabsText",true)});
	$('#showtext2').click(function(){gShowText=2;noviceTab(gGuide,"tabsText",true)});
}


function noviceTab(guide,tab,clear)
{	// 08/03/2012 Edit panel for guide sections 
	var div = $('#'+tab);
	//if (div.html()!="") return;
	var t = $('.tabContent',div);
	if (clear) t.html("");
	if (t.html()!="") return;
	
//	var t=$('<div/>').addClass('tabsPanel editq')//.append($('<div/>').addClass('tabsPanel2'));//editq
	form.clear();
	
	switch (tab){
		case "tabsConstants":
			var fs = form.fieldset('Constants');
			t.append(fs);
			break;
		
		case "tabsLogic":
			t.append(form.note('All logic blocks in this interview'));
			for (var p in guide.sortedPages)
			{
				var page=guide.sortedPages[p];
				if (page.type!=CONST.ptPopup)
				if ((gShowLogic==2) || (gShowLogic==1 && (page.codeBefore!="" || page.codeAfter!="")))
				{
					var pagefs=form.fieldset(page.name, page);
					if (gShowLogic==2 || page.codeBefore!="")
						pagefs.append(form.codearea({label:'Before:',	value:page.codeBefore,	change:function(val,page){
							page.codeBefore=val; /* TODO Compile for syntax errors */}} ));
					if (gShowLogic==2 || page.codeAfter!="")
						pagefs.append(form.codearea({label:'After:',	value:page.codeAfter, 	change:function(val,page){
							page.codeAfter=val ; /* TODO Compile for syntax errors */}} ));
					t.append(pagefs);
				}
			}
			
			break;
			
		case "tabsText":
			t.append(form.note('All non-empty page text blocks in this interview'));
			for (var p in guide.sortedPages)
			{
				var page=guide.sortedPages[p];
				var pagefs=form.fieldset(page.name, page);
				pagefs.append(form.htmlarea({label:'Text:',					value:page.text,			change:function(val,page){page.text=val; }} ));
				if (page.type!=CONST.ptPopup){
					if (gShowText==2 || page.learn!="") 			pagefs.append(form.text({label:'Learn More prompt:',placeholder:"",	value:page.learn,
															change:function(val,page){page.learn=val }} ));
					if (gShowText==2 || page.help!="") 			pagefs.append(form.htmlarea({label:"Help:",					value:page.help,
															change:function(val,page){page.help=val}} ));
					if (gShowText==2 || page.helpReader!="") 	pagefs.append(form.htmlarea({label:'Help Text Reader:',	value:page.helpReader,
															change:function(val,page){page.helpReader=val}} ));

					for (var f in page.fields)
					{
						var field = page.fields[f];
						var ff=form.fieldset('Field '+(parseInt(f)+1),field);
						ff.append(form.htmlarea({label:'Label:',   value:field.label, 
							change:function(val,field){field.label=val;}}));
						if (gShowText==2 || field.value!="") ff.append(form.text({label:'Default value:',placeholder:"",name:'default', value:  field.value,
							change:function(val,field){field.value=val}}));
						if (gShowText==2 || field.invalidPrompt!="") ff.append(form.htmlarea({label:'If invalid say:',value: field.invalidPrompt,
							change:function(val,field){field.invalidPrompt=val}}));						
						pagefs.append(ff);
					}
					for (var bi in page.buttons)
					{
						var b = page.buttons[bi];
						var bf=form.fieldset('Button '+(parseInt(bi)+1),b);
						if (gShowText==2 || b.label!="")
							bf.append(form.text({ 		value: b.label,label:'Label:',placeholder:'button label',		change:function(val,b){b.label=val}}));
						if (gShowText==2 || b.value!="")
							bf.append(form.text({ 		value: b.value,label:'Default value',placeholder:'Default value',		change:function(val,b){b.value=val}}));
						pagefs.append(bf);
					}
				}
				t.append(pagefs);
			}
			
			break;
		
		case "tabsAbout":
			var fs = form.fieldset('About');
			fs.append(form.text({label:'Title:', placeholder:'Interview title', value:guide.title, change:function(val){guide.title=val}}));
			fs.append(form.htmlarea({label:'Description:',value:guide.description,change:function(val){guide.description=val}}));
			fs.append(form.text({label:'Jurisdiction:', value:guide.jurisdiction, change:function(val){guide.jurisdiction=val}}));
			fs.append(form.htmlarea({label:'Credits:',value:guide.credits,change:function(val){guide.credits=val}}));
			fs.append(form.text({label:'Approximate Completion Time:',placeholder:'e.g., 2-3 hours',value:guide.completionTime,change:function(val){guide.completionTime=val}}));
			t.append(fs);
			
			var fs = form.fieldset('Authors');
			var blankAuthor=new TAuthor();
			
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

			var fs = form.fieldset('Revision History');  
			fs.append(form.text({label:'Current Version:',value:guide.version,change:function(val){guide.version=val}}));
			fs.append(form.htmlarea({label:'Revision Notes',value:guide.notes,change:function(val){guide.notes=val}}));
			t.append(fs);
			
			var fs=form.fieldset('Authors');
			fs.append(form.listManager({name:'Authors',picker:'Number of authors',min:1,max:12,list:guide.authors,blank:blankAuthor
				,save:function(newlist){
					guide.authors=newlist; }
				,create:function(ff,author){
						ff.append(form.text({  label:"Author's name:", placeholder:'author name',value:author.name,
							change:function(val,author){author.name=val}}));
						ff.append(form.text({  label:"Author's job title:", placeholder:'job title',value:author.title,
							change:function(val,author){author.title=val}}));
						ff.append(form.text({  label:"Author's Organization:", placeholder:'organization',value:author.organization,
							change:function(val,author){author.organization=val}}));
						ff.append(form.text({  label:"Author's email:", placeholder:'email',value:author.email,
							change:function(val,author){author.email=val}}));
					return ff;
				}}));
				
			t.append(fs);
			

			break;

		case "tabsVariables":
			t.append(form.h1('Variables'));
			var tt=form.rowheading(["Name","Type","Comment"]); 
			//sortingNatural
			var sortvars=[];
			for (vi in guide.vars) sortvars.push(guide.vars[vi]);
			sortvars.sort(function (a,b){ if (a.sortName<b.sortName) return -1; else if (a.sortName==b.sortName) return 0; else return 1;});
			for (vi in sortvars)
			{
				v=sortvars[vi];
				tt+=form.row([v.name,v.type,v.comment]);
			}
			t.append('<table class="A2JVars">'+tt+"</table>");
			break;
			
		case 'tabsSteps':
			var fs=form.fieldset('Steps'); 
			fs.append(form.tableRowCounter('Steps','Number of steps',2, CONST.MAXSTEPS,guide.steps.length)); 
			var steps=[];
			for (var s in guide.steps)
			{
				var step=guide.steps[s];
				//tt+=form.row([step.number,step.text]);
				steps.push({ row: [form.text({value:step.number,class:'narrow'}),form.text({value:step.text})]});
			}
			//t+='<table class="A2JSteps">'+tt+"</table>";
			fs.append(form.tableRows('Steps',['Step','Sign'],steps).addClass('A2JSteps'));
			t.append(fs);
			
			break;
	}
	form.finish(t);
	//div.append(t);
}
