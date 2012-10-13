/* 02/20/2012 Parse XML of A2J, CALI Author or native CAJA into CAJA structure */
// Code shared by A2J Author, A2J Viewer, CALI Author and CALI 5 Viewer


TGuide.prototype.pageIDtoName=function(id)
{
	if (this.mapids[id])
	{
		id = this.mapids[id].name;
	}
	else
	{
		var autoIDs={};
		autoIDs[qIDNOWHERE]=	lang.qIDNOWHERE;//"[no where]"
		autoIDs[qIDSUCCESS]=	lang.qIDSUCCESS;//"[Success - Process Form]"
		autoIDs[qIDFAIL]=   	lang.qIDFAIL;//"[Exit - User does not qualify]"
		autoIDs[qIDEXIT]=		lang.qIDEXIT;//"[Exit - Save Incomplete Form]"//8/17/09 3.0.1 Save incomplete form
		autoIDs[qIDBACK]=		lang.qIDBACK;//"[Back to prior question]"//8/17/09 3.0.1 Same as history Back button.
		autoIDs[qIDRESUME]=	lang.qIDRESUME;//"[Exit - Resume interview]"//8/24/09 3.0.2
		if (typeof autoIDs[id]=="undefined")
			id=lang.UnknownID.printf(id,props(autoIDs)) //"[Unknown id "+id+"]" + props(autoIDs);
		else
			id=autoIDs[id];
	}
	return id;
}




function parseXML_CAJA_to_CAJA(CAJA)
{	// Parse parseCAJA
	var caja=new TGuide();
	caja.viewer="CAJA";
	caja.title = CAJA.find('TITLE').text();
	return caja;
}

function parseXML_Auto_to_CAJA(cajaData)
{	// Parse XML into CAJA
	var caja;
	trace("Parse XML data");
	if ((cajaData.find('A2JVERSION').text())!="")
		caja=parseXML_A2J_to_CAJA(cajaData);// Parse A2J into CAJA
	else
	if ((cajaData.find('CAJAVERSION').text())!="")
		caja=parseXML_CAJA_to_CAJA(cajaData);// Parse CALI Author into CAJA
	else
		caja=parseXML_CA_to_CAJA(cajaData);// Parse Native CAJA
		
	caja.sortedPages=caja.sortedPages.sort(function (a,b){ if (a.sortName<b.sortName) return -1; else if (a.sortName==b.sortName) return 0; else return 1;});

	return caja;
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













TGuide.prototype.novicePage = function (div, pagename) {	// Create editing wizard for given page.
   var t = "";
   var page = this.pages[pagename];


   var t = $('<div/>').addClass('editq');

   if (1) {
      if (page == null) {
         t.append(form.h2( "Page not found " + pagename)); 
      }
      else {
         var GROUP = page.id;

         t.append($('<h2/>').text('Your Page & all Info'));
         t.children('h2').click(function () { alert('click h2'); });


         t.append(form.h2('Page info'));
         t.append(form.text('Name:', GROUP, "name", page.name));

         if (page.type != "A2J") {
            t.append(form.h2("Page type/style: " + page.type + "/" + page.style));
         }
         t.append(form.htmlarea('Text', GROUP, "text", page.text));


         var b, d, detail, fb, t1, t2, list;

         if (page.type == "A2J" || page.fields.length > 0) {
            //t+=form.h1('Fields');
            for (var f in page.fields) {
               var field = page.fields[f];
               var GROUPFIELD = GROUP + "_FIELD" + f;
               t.append(form.text('Name', GROUPFIELD, 'name', field.name));
               t.append(form.text('Label', GROUPFIELD, 'label', field.label));
               t.append(form.text('Optional', GROUPFIELD, 'optional', field.optional));
               t.append(form.htmlarea('If invalid say:', GROUPFIELD, "invalidPrompt", field.invalidPrompt));
            }
         }

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
					 .append(form.pickpage("dest", makestr(fb.next)))
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

         t.append(form.htmlarea("Learn more help", "help", makestr(page.help)));
         t.append(form.textarea('Notes', GROUP, "note", makestr(page.notes)));

      }
      //t+=form.h1('XML')+htmlEscape(page.xml);

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

   //	div.append(htmlEscape($(t).html()));
   div.append(htmlEscape(page.xml));


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
         $.each(caja.pages, function (p, page) {
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
}







function prompt(status)
{
	if (status==null) status="";
	$('#CAJAStatus').text( status );
	trace(status);
}



function loadGuide(guideFile,startTabOrPage)
{
	guideFile=guideFile.split("#");
	if (guideFile.length==1)
	{
		guideFile=guideFile[0];
	}
	else
	{
		startTabOrPage= "PAGE " +guideFile[1];
		//if (editMode==0) startTabOrPage = "PAGE " + startTabOrPage;
		guideFile=guideFile[0];
	}
	prompt('Loading '+guideFile);
	prompt('Start location will be '+startTabOrPage);
	$('.CAJAContent').html('Loading '+guideFile+AJAXLoader);
	
	$('#CAJAIndex, #CAJAListAlpha').html('');
	
	window.setTimeout(function(){loadGuide2(guideFile,startTabOrPage)},500);
}
function loadGuide2(guideFile,startTabOrPage)
{
	var cajaDataXML;
	$.ajax({
			url: guideFile,
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
				caja.filename=guideFile;
				startCAJA(startTabOrPage);
				
			}
		});
}


function styleSheetSwitch(theme)
{
	//<link href="cavmobile.css" title="cavmobile" media="screen" rel="stylesheet" type="text/css" />
	trace('styleSheetSwitch='+theme); 
	theme = "http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.23/themes/"+theme.toLowerCase()+"/jquery-ui.css";
	$('link[title=style]').attr('href',theme);
}

