
TGuide.prototype.noviceTab=function(div,tab)
{	// 08/03/2012 Edit panel for guide sections 
	var t=$('<div/>').addClass('editq');
	var guide = this;
	
	switch (tab){
		case "tabsAbout":
			var GROUP="ABOUT";
			var fs = form.fieldset('About');
			fs.append(form.text({label:'Title:',  value:guide.title, change:function(val){guide.title=val}}));
			fs.append(form.htmlarea({label:'Description',value:guide.description,change:function(val){guide.description=val}}));
			fs.append(form.text({label:'Jurisdiction:', value:guide.jurisdiction, change:function(val){guide.jurisdiction=val}}));
			fs.append(form.htmlarea({label:'Credits:',value:guide.credits,change:function(val){guide.credits=val}}));
			fs.append(form.text({label:'Approximate Completion Time:',value:guide.completionTime,change:function(val){guide.completionTime=val}}));
			t.append(fs);
			
			var fs = form.fieldset('Authors');
			for (var a in guide.authors)
			{
				var author = guide.authors[a];
				fs.append(form.text({label:'Name:', value:author.name, 					change:function(val){author.name=val}}));
				fs.append(form.text({label:'Title:', value:author.title, 				change:function(val){author.title=val}}));
				fs.append(form.text({label:'Organization:', value:author.organization,change:function(val){author.organization=val}}));
				fs.append(form.text({label:'EMail:', value:author.email, 				change:function(val){author.email=val}}));
				fs.append(form.clone());
			}
			t.append(fs);
			
			var fs = form.fieldset('Revision History');  
			fs.append(form.text({label:'Current Version:',value:guide.version,change:function(val){guide.version=val}}));
			fs.append(form.htmlarea({label:'Revision Notes',value:guide.notes,change:function(val){guide.notes=val}}));
			t.append(fs);

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

TGuide.prototype.novicePage = function (div, pagename) {	// Create editing wizard for given page.
   var t = ""; 
	
   var page = this.pages[pagename]; 
	
   var t = $('<div/>').addClass('editq');


	if (page == null || typeof page === "undefined") {
		t.append(form.h2( "Page not found " + pagename)); 
	}
	else {
		var GROUP = page.id;
		trace("Loading page "+pagename);
		


		var fs=form.fieldset('Page info',page);
		fs.append(form.pickStep({label:'Step:',value: page.step, change:function(val,page){page.step=parseInt(val);/* TODO Move page to new outline location */}} ));
		fs.append(form.text({label:'Name:', value:page.name,change:function(val,page){page.name=val; /* TODO Rename all references to this page in POPUPs, JUMPs and GOTOs */ }} ));
		if (page.type != "A2J") {
			fs.append(form.h2("Page type/style: " + page.type + "/" + page.style));
		}
		fs.append(form.htmlarea({label:'Notes:',value: page.notes,change:function(val,page){page.notes=val}} ));
		t.append(fs);
		
		var pagefs=form.fieldset('Question text',page);  
		
		pagefs.append(form.htmlarea(	{label:'Text:',value:page.text,change:function(val,page){page.text=val}} ));
		pagefs.append(form.pickAudio(	{label:'Text audio:', 	value:	page.textAudioURL,change:function(val,page){page.textAudioURL=val}} ));
		pagefs.append(form.text(		{label:'Learn More prompt:',	value:page.learn,	change:function(val,page){page.learn=val}} ));
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
			trace("HELP CHANGE");
			updateShowMe(form,val);
			}},  [0,'Text',1,'Show Me Graphic',2,'Show Me Video']));
		pagefs.append(form.htmlarea(	{label:"Help:",value:page.help,change:function(val,page){page.help=val}} ));
		pagefs.append(form.pickAudio(	{name:'helpAudio',label:'Help audio:',value:page.helpAudioURL,			change:function(val,page){page.helpAudioURL=val}} ));
		pagefs.append(form.text(		{name:'helpGraphic',label:'Help graphic:',value:page.helpImageURL,	change:function(val,page){page.helpImageURL=val}} ));
		pagefs.append(form.text(		{name:'helpVideo', label:'Help video:',	value:page.helpVideoURL,	change:function(val,page){page.helpVideoURL=val}} ));
		pagefs.append(form.htmlarea(	{name:'helpReader', label:'Help Text Reader:', value:page.helpReader,change:function(val,page){page.helpReader=val}} ));
		pagefs.append(form.text(		{label:'Repeating Variable:',	value:page.repeatVar,						change:function(val,page){page.repeatVar=val}} ));
		t.append(pagefs);
		updateShowMe(pagefs,getShowMe());
		pagefs=null;
		
		
		if (page.type == "A2J" || page.fields.length > 0) {
		
			var fs=form.fieldset('Fields'); 
			fs.append(form.tableRowCounter('fields','Number of fields',0, CONST.MAXFIELDS,page.fields.length));

			function updateFieldLayout(form,field){
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
				
				form.find('[name="maxchars"]').showit(canMaxChars);
				form.find('[name="min"]').showit(canMinMax );
				form.find('[name="max"]').showit(canMinMax );
				form.find('[name="default"]').showit(canDefaultValue);
				form.find('[name="calculator"]').showit(canUseCalc);
				form.find('[name="calendar"]').showit(canCalendar);
			}
			function makeField(field){
				var field1=form.record(field);
				//var field1=$('<div class=record/>');//form.fieldset('Field');
				//field1.data('record',field);
				field1.append(form.pickList({label:'Type:',value: field.type,change:function(val,field,form){
					field.type=val;
					updateFieldLayout(form,field);
					}},fieldTypesList ));
				field1.append(form.htmlarea({label:'Label:',   value:field.label, 							change:function(val,field){field.label=val;}}));
				field1.append(form.text({label:'Variable:', value: field.name, 						change:function(val,field){field.name=val}}));
				field1.append(form.text({label:'Default value:',name:'default', value:  field.value, 				change:function(val,field){field.value=val}}));
				field1.append(form.checkbox({label:'Validation:', checkbox:'User must fill in', value:field.optional, change:function(val,field){field.optional=val}}));
				field1.append(form.text({label:'Max chars:',name:'maxchars', value: field.maxChars,			change:function(val,field){field.maxChars=val;}}));
				field1.append(form.checkbox({label:'Calculator:',name:'calculator',checkbox:'Calculator available?', value:field.calculator,	change:function(val,field){field.calculator=val}}));
				field1.append(form.checkbox({label:'Calendar:', name:'calendar',checkbox:'Calendar available?', value:field.calendar, 			change:function(val,field){field.calendar=val}}));
				field1.append(form.text({label:'Min value:',name:'min', value: field.min, 						change:function(val,field){field.min=val}}));
				field1.append(form.text({label:'Max value:',name:'max', value: field.max, 						change:function(val,field){field.max=val}}));
				field1.append(form.htmlarea({label:'If invalid say:',value: field.invalidPrompt,	change:function(val,field){field.invalidPrompt=val}}));
				updateFieldLayout(field1,field);
				return field1;
			}
			
			var fields=[];
			for (var f in page.fields) {
				fields.push({ row: ['Field ', makeField(page.fields[f])]});
			}
			var blankField=new TField();
			blankField.type=CONST.ftText;
			for (var f=page.fields.length;f<CONST.MAXFIELDS;f++) {
				fields.push({ row: ['Field ', makeField(blankField)], visible:false });
			}
			fs.append(form.tableRows('fields','',fields));
			t.append(fs);
	  	}
		if (page.type == "A2J" || page.buttons.length > 0) {
			var fs=form.fieldset('Buttons');
			fs.append(form.tableRowCounter('buttons','Number of buttons',1, CONST.MAXBUTTONS,page.buttons.length));
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
				buttons.push({ row: ['Button ', makeButton(page.buttons[b])]});
			}
			var blankButton=new TButton();
			for (var b=page.buttons.length;b<CONST.MAXBUTTONS;b++) {
				buttons.push({ row: ['Field ', makeButton(blankButton)], visible:false });
			}
			fs.append(form.tableRows('buttons','',buttons));
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

	div.append('<div class=xml>'+htmlEscape(page.xml)+'</div>');


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
	page=null;
}
