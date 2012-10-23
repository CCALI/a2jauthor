
TGuide.prototype.noviceTab=function(div,tab)
{	// 08/03/2012 Edit panel for guide sections 
	var t=$('<div/>').addClass('editq');
	var guide = this;
	
	switch (tab){
		case "tabsAbout":
			var GROUP="ABOUT";
			var fs = form.fieldset('About');
			fs.append(form.text('Title:',  guide.title, {change:function(val){guide.title=val}}));
			fs.append(form.htmlarea('Description', guide.description , {change:function(val){guide.description=val}}));
			fs.append(form.text('Jurisdiction:', guide.jurisdiction, {change:function(val){guide.jurisdiction=val}}));
			fs.append(form.htmlarea('Credits:',guide.credits, {change:function(val){guide.credits=val}}));
			fs.append(form.text('Approximate Completion Time:',guide.completionTime, {change:function(val){guide.completionTime=val}}));
			t.append(fs);
			
			var fs = form.fieldset('Authors');
			for (var a in guide.authors)
			{
				var author = guide.authors[a];
				fs.append(form.text('Name:', author.name, 					{change:function(val){author.name=val}}));
				fs.append(form.text('Title:', author.title, 					{change:function(val){author.title=val}}));
				fs.append(form.text('Organization:', author.organization,	{change:function(val){author.organization=val}}));
				fs.append(form.text('EMail:', author.email, 					{change:function(val){author.email=val}}));
				fs.append(form.clone());
			}
			t.append(fs);
			
			var fs = form.fieldset('Revision History');  
			fs.append(form.text('Current Version:',guide.version, {change:function(val){guide.version=val}}));
			fs.append(form.htmlarea('Revision Notes',guide.notes, {change:function(val){guide.notes=val}}));
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
		

//         t.append($('<h2/>').text('Your Page & all Info'));
//         t.children('h2').click(function () { alert('click h2'); });

		var fs=form.fieldset('Page info');
		fs.append(form.pickstep('Step:', page.step, {change:function(val){page.step=parseInt(val);}} ));
		fs.append(form.text('Name:', page.name, {change:function(val){page.name=val; /* TODO Rename all references to this page in POPUPs, JUMPs and GOTOs */ }} ));
		if (page.type != "A2J") {
			fs.append(form.h2("Page type/style: " + page.type + "/" + page.style));
		}
		t.append(fs);
		
		var fs=form.fieldset('Page text');
//         t.append(form.h2('Page info'));
//        t.append(form.text('Name:', GROUP, "name", page.name));

		fs.append(form.htmlarea('Text:', 				page.text,	{change:function(val){page.text=val}} ));
		fs.append(form.text('Learn More prompt:',		page.learn,	{change:function(val){page.learn=val}} ));
		fs.append(form.htmlarea("Learn More help:",	page.help,	{change:function(val){page.help=val}} ));
		
		t.append(fs);
		
		if (page.type == "A2J" || page.fields.length > 0) {
			var fs=form.fieldset('Fields');
			for (var f in page.fields) {
				var field = page.fields[f]; 
				fs.append(form.text('Type:',  field.type, {change:function(val){field.type=val}}));
				fs.append(form.text('Name:',  field.name, {change:function(val){field.name=val}}));
				fs.append(form.text('Label:',   field.label, {change:function(val){field.label=val}}));
				fs.append(form.text('Optional:',  field.optional, {change:function(val){field.optional=val}}));
				fs.append(form.htmlarea('If invalid say:',   field.invalidPrompt, {change:function(val){field.invalidPrompt=val}}));
			}
			t.append(fs);
	  	}
		if (page.type == "A2J" || page.buttons.length > 0) {
			var fs=form.fieldset('Buttons');
			for (var bi in page.buttons) {
				var b = page.buttons[bi];
				fs.append(form.text('Label:',  b.label, {change:function(val){b.label=val}}));
				fs.append(form.text('Var Name:',  b.name, {change:function(val){b.name=val}}));
				fs.append(form.text('Var Value:', b.value , {change:function(val){b.value=val}}));
				fs.append(form.pickpage('Destination:',  b.next, {change:function(val){b.next=val;trace(b.next);}}));
			}
			t.append(fs);
		}
		var fs=form.fieldset('Advanced Logic');
		fs.append(form.codearea('Logic:', page.scripts, {change:function(val){page.scripts=val; /* TODO Compile for syntax errors */}} ));
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
				 .append(form.pickpage('', fb.next, {}))
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
