/*
	A2J Author 5 * Justice * justicia * 正义 * công lý * 사법 * правосудие
	All Contents Copyright The Center for Computer-Assisted Legal Instruction

	Authoring App Tabs GUI
	Code for each tab in the Authoring app
	04/15/2013

*/

/* global gGuidePath,gPage,gGuide,gUserID,gGuideID,gUserNickName, gPrefs*/

function updateAttachmentFiles() {
  // Load list of uploaded existing files:
  gGuide.attachedFiles = {};

  $.ajax({
    // Uncomment the following to send cross-domain cookies:
    // xhrFields: {withCredentials: true},
    url: $('#fileupload').fileupload('option', 'url'),
    dataType: 'json',
    context: $('#fileupload')[0]
  }).always(function() {
    $(this).removeClass('fileupload-processing');
  }).done(function(result) {
    gGuide.attachedFiles = result.files;
    $('#attachmentFiles').empty();

    if(gGuide.attachedFiles) {
      //if gGuide.attachedFiles is empty we don't need to loop through them
      $.each(gGuide.attachedFiles, function(index, file) {
        $('<tr><td>' +
          '<a target=_blank href="' + gGuidePath + (file.name) + '">' + file.name + '</a>' +
          '</td><td>' + file.size + '</td></tr>'
        ).appendTo('#attachmentFiles');
      });
    }
  });
}

// List of pages within their steps.
function getTOCStepPages(includePages, includePops, includeSpecial) {
  var s;
  var popups = '';
  var inSteps = [];

  for (s = 0; s < CONST.MAXSTEPS; s += 1) {
    inSteps[s] = '';
  }

  var p;
  var plink;

  for (p in gGuide.sortedPages) {
    /** @type {TPage} */
    var page = gGuide.sortedPages[p];
    var tip = '<em class="description">' + decodeEntities(page.text).substr(0, 64) + '</em><span class="field-tags pull-right hidden-xs">' + page.tagList() + '</span>';
    plink = '<a class="page-item list-group-item unselectable" rel="PAGE ' + page.name.asHTML() + '"><span class="title">' + page.name.asHTML() + '</span>' + tip + '</a>';

    if (page.type === CONST.ptPopup) {
      popups += plink;
    } else {
      inSteps[page.step] += plink;
    }
  }

  var ts = '';
  ts += '<div class="pages-container">';
  ts += '<h3 class="page-title">Pages</h3>';

  if (includePages) {
    // List all steps including those for pages that are in steps that we may have removed.
    for (s in inSteps) {
      if (inSteps[s] !== '') {
        ts += '<div class="panel panel-info accordion" id="step' + s + '">';
        ts += '<div class="panel-heading" role="tab" id="collapseListGroupHeading1">';
        ts += '<h4 class="panel-title"><a role="button" class="step" rel="STEP ' + s + '" data-stepnum="' + s + '">Step ' + gGuide.stepDisplayName(s) + '</a></h4>';
        ts += '</div>';
        ts += '<div id="panel' + s + '" class="panel-body panel-collapse" role="tabpanel" aria-expanded="true">';
        ts += '<div class="list-group">' + inSteps[s] + '</div>';
        ts += '</div></div>';
      }
    }
  }

  ts += '</div>';

  // Popups as destinations.
  if (includePops) {
    ts += '<div class="popups-container">';
    ts += '<h3 class="page-title">Popups</h3>';
    ts += '<div class="list-group">' + popups + '</div>';
    ts += '</div>';
  }

  // Special branch destinations.
  if (includeSpecial) {
    if (includeSpecial === "noWhereOnly") { // Exit Point in Steps only allows 'NoWhere'
      var branchIDs = [
        CONST.qIDNOWHERE
      ];
    } else {
      var branchIDs = [
        CONST.qIDNOWHERE,
        CONST.qIDSUCCESS,
        CONST.qIDFAIL,
        CONST.qIDEXIT,
        CONST.qIDBACK,
        CONST.qIDRESUME,
        CONST.qIDASSEMBLE,
        CONST.qIDASSEMBLESUCCESS
      ];
    }

    var i;
    var tss = '';
    for (i in branchIDs) {
      var branchID = branchIDs[i];
      plink = '<a class="page-item list-group-item unselectable" rel="PAGE ' + branchID + '">' + gGuide.pageDisplayName(branchID) + '</a>';
      tss += plink;
    }

    ts += '<div class="special-container">';
    ts += '<h3 class="page-title">Special Branching</h3>';
    ts += '<div class="list-group">' + tss + '</div>';
    ts += '</div>';
  }

  return ts;
}

function updateTOC()
{	// Build outline for entire interview includes meta, step and question sections.
	// 2014-06-02 TOC updates when page name, text, fields change. Or page is added/deleted.
	// Also we update the mapper since it also displays this info.
	var ts = getTOCStepPages(true,true);
	$('.pageoutline').html(ts);


	// JPM Clicking a step toggle slides step's page list.
	$('#CAJAOutline .panel-heading .step').click(function(){
  	var stepNum = $(this).data('stepnum');
  	$('#step'+stepNum).toggleClass('collapsed');
		$('#panel'+stepNum).slideToggle(300);
	});

	// JPM Clicking a step toggle slides step's page list.
	$('#CAJAOutlineMap .panel-heading .step').click(function()
	{	// 2014-08-12 Toggle step's page list and fade in/out it's nodes in the mapper.
		// Determine which step it is, then fade back if mapper
		var stepNum = $(this).data('stepnum');
		var step = $(this).attr('rel').split(' ')[1];
		var $nodes=$('.node.Step'+step);
		var $lines=$('.line.Step'+step);

		$('#CAJAOutlineMap #step'+stepNum).toggleClass('collapsed');
		$('#CAJAOutlineMap #panel'+stepNum).slideToggle(300);

		if ($('#CAJAOutlineMap #step'+stepNum).hasClass('collapsed'))
		{	// If step is collapse, fade it.
			$nodes.addClass('faded');
			$lines.addClass('faded');
		}
		else
		{	// Step not collapsed, display normally.
			$nodes.removeClass('faded');
			$lines.removeClass('faded');
		}
	});


	// JPM Only 'select' Pages, not Steps
	$('.pageoutline a.page-item[rel^="PAGE "]')
		.click(function(e){
			if (!e.ctrlKey){
				$('.pageoutline a.page-item').removeClass(SELECTED);
			}
			$(this).toggleClass(SELECTED);
		})
		.dblclick(function (){
			var rel=$(this).attr('rel');
			$('.pageoutline a.page-item').removeClass(SELECTED);
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
		return '<div class="alert alert-'+kind+'"><p><span class="glyphicon-attention"></span>'+t+'</p></div>';
	}
	,note:function(t){
		return $(form.noteHTML('info',t));
	}
	,noteAlert:function(t){
		return $(form.noteHTML('alert',t));
	}
	,fieldset:function(legend,record,accordion){
		return $('<fieldset name="record" class="'+accordion+'"><legend>'+legend+'</legend></fieldset>').data('record',record);//.click(function(){$(this).toggleClass('collapse')});
	}
	,div:function(legend,record){
		return $(legend).data('record',record);
	}
	,record:function(record){
		return $('<div name=record class=record/>').data('record',record);
	}
	,div:function(){
		return $('<div />');
	}
	//,number:    function(label,value,minNum,maxNum,handler){
	//	return "<label>"+label+'</label><input class="editable" type="text" name="'+group+id+'" value="'+htmlEscape(value)+'"> ';}

	,checkbox: function(data) {
		var e=$('<div name="'+data.name+'">'
			+'<div class="checkbox">'
			+'<label>'
			+'<input type="checkbox" /> '+data.checkbox
			+(typeof data.label!=='undefined' ? ( data.label ) : '')
			+'</label></div></div>');

    var input = $('input',e);

    input.change(function(){
      form.change($(this),$(this).is(':checked'));
    });

    input.attr('checked', data.value===true).data('data',data);

		return e;
	}


	,pickpage:function(data)
	{	// 2014-06-02 Pick page via popup picker instead.
		var pageDispName = gGuide.pageDisplayName(data.value);
		var e=$('<div class="bootstrap-styles" name="'+data.name+'">' + (typeof data.label!=='undefined' ? ('<label>'+data.label+'</label>') : '') + ('<button class="btn btn-primary" />')+'</div>');
		$('button',e).button({label:pageDispName}).addClass('glyphicon-link').data('data',data).click(function(){
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
    // In Steps, Starting Point lists only Author Pages, Exit Point includes built-in 'noWhere' to clear it
    if (data.label === "Starting Point: ") {
		  var ts = getTOCStepPages(true,false,false);
    } else if (data.label === "Exit Point: ") {
      var ts = getTOCStepPages(true,false,"noWhereOnly");
    } else {
  		var ts = getTOCStepPages(true,false,true);
    }

		//$('#CAJAOutline').clone().appendTo('#page-picker-list');
		//$('#page-picker-list li[rel^="tabsPopups"],#page-picker-list li[rel^="tabsPopups"] + ul').empty();
		//$('#page-picker-list .pageoutline li').removeClass(SELECTED);
		$('#page-picker-list').html('<ul class="list-group">' + ts + '</ul>');

		var e=pageNameRelFilter('#page-picker-list .list-group-item',pageName);
		e.toggleClass(SELECTED);
		// TODO SJG Scrolling to focus the selected page is not working. Why!?!?
		//$('#page-picker-list .pageoutline').scrollTop(0);
		//scrollToElt($('#page-picker-list .pageoutline'),e);

		// JPM Only 'select' Pages, not Steps
		$('#page-picker-list .list-group-item[rel^="PAGE "]')
			.click(function(e){
				$('#page-picker-list .list-group-item').removeClass(SELECTED);
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
  		dialogClass: "modal bootstrap-styles",
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
						var newPageDest = makestr($('#page-picker-list .list-group-item.'+SELECTED).first().attr('rel')).substr(5);
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

		var e=pageNameRelFilter('#page-picker-list .list-group-item',pageName);
		e.toggleClass(SELECTED);
		$('#page-picker-list .list-group-item[rel^="PAGE "]')
			.click(function(e){
				$('#page-picker-list .list-group-item').removeClass(SELECTED);
				$(this).toggleClass(SELECTED);

			})
			.dblclick(function (){
				// TODO - double click to select and set
				//var name= $(this).data().value;
				//$('page-picker-dialog').dialog( "close" );
			});

		$('#page-picker-dialog').data(data).dialog({
  		dialogClass: "modal bootstrap-styles",
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
            var newPageDest = makestr($('#page-picker-list .list-group-item.'+SELECTED).first().attr('rel')).substr(5);
						data.value = newPageDest;
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
	},

  // Pick variable name from list of defined variables
  varPicker: function(data) {
    var dval = (data.value);
    var label = data.label ? '<label class="control-label">' + data.label + '</label>' : '';

    var $el = $(
      '<div ' + (data.name ? 'name="' + data.name + '"' : '') + '>' +
      label +
      '<div class="editspan form-group">' +
        '<input class="form-control ui-combobox-input editable autocomplete picker varname dest" type="text" >' +
      '</div>' +
      '</div>'
    );

    var $pickerInput = $el.find('.picker.autocomplete');

    var onBlur = function() {
      var val = $(this).val();
      form.change($(this), val);
    };

    // Create list of sorted variable names with type info.
    var sortedVars = gGuide.varsSorted();

    var source = sortedVars.map(function(variable) {
      return {
        value: variable.name,
        label: variable.name + ' ' + variable.type
      };
    });

    $pickerInput
      .blur(onBlur)
      .data('data', data)
      .val(decodeEntities(dval));

    $pickerInput.autocomplete({
      source: source,
      appendTo: '.page-edit-form-panel',
      change: function() {
        var newvalue = $(this).val();
        $(this).val(newvalue);
      }
    })
    .focus(function() {
      $(this).autocomplete('search');
    });

    return $el;
  },

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

  text: function(data) {
    var label = data.label != null ?
      '<label class="control-label">' + data.label + '</label>' : '';

    var $el = $(
      '<div class="editspan form-group" ' + (data.name ? 'name="' + data.name + '"' : '') + '>' +
        label +
        '<input class="form-control ui-widget editable" type="text">' +
      '</div>'
    );

    $el.find('input')
      .blur(function() {
        form.change($(this), $(this).val());
      })
      .val(decodeEntities(data.value))
      .data('data', data);

    return $el;
  },

  pasteFix:function(srchtml,ALLOWED_TAGS)
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
		//if (html!=srchtml) {	trace(srchtml);trace(html);}
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
		html = form.pasteFix(html,['DIV','P','BR','UL','OL','LI','A','B','I','U','BLOCKQUOTE']);
 		return html;
	}
	,htmlarea: function(data){//label,value,handler,name){
		form.id++;
		var e= $('<div name="'+data.name+'">'
			+'<div class="editspan form-group">'
			+(typeof data.label!=='undefined' ? ('<label class="control-label">'+data.label+'</label>') : '')
			+'<div contenteditable=true class="htmledit form-control text editable taller" id="tinyMCE_'+form.id+'"  name="'+form.id+'" rows='+1+'>'
			+data.value+'</div></div></div>');
		$('.editable',e).focus(
      function(){
        $(this).addClass('tallest');
        form.editorAdd($(this));
      });
    $('.editable', e).blur(function(){
      form.editorRemove(this);
      var html=form.htmlFix($(this).html());
      form.change($(this), html);
		});
    $('.editable', e).data('data',data);

    //these event bindings are for IE11 to handle any
    //updates to the `contenteditable`
    //since blur event is not called properly
    $('.editable', e).on('DOMNodeInserted', function(){
      var html=form.htmlFix($(this).html());
			form.change($(this), html);
    });
    $('.editable', e).on('DOMNodeRemoved', function(){
      var html=form.htmlFix($(this).html());
			form.change($(this), html);
    });
    $('.editable', e).on('DOMCharacterDataModified', function(){
      var html=form.htmlFix($(this).html());
			form.change($(this), html);
    });

		return e;
	},

  textArea: function(data) {
    var label = data.label != null ?
      ('<label class="control-label">' + data.label + '</label>') : '';

    var $el = $(
      '<div name="' + data.name + '">' +
        '<div class="editspan form-group">' +
          label +
          '<textarea class="form-control text editable taller" rows="2">' +
            data.value +
          '</textarea>' +
        '</div>' +
      '</div>'
    );

    var onBlur = function() {
      var val = $(this).val(); // form.htmlFix($(this).html());
      form.change($(this), val);
    };

    $el.find('.editable').blur(onBlur).data('data', data);

    return $el;
  },

  pickFile: function(mask) {
    var $fileupload = $(
      '<div class="fileinput-button form-group">' +
        '<button class="btn btn-primary">' +
          '<span class="glyphicon-plus"></span> Upload...' +
        '</button>' +
        '<input class="form-control fileupload" type="file" name="files[]" >' +
      '</div>'
    );

    if (gGuideID !== 0) {
      $fileupload.find('.fileupload').fileupload({
        dataType: 'json',
        url: CONST.uploadURL + gGuideID,

        done: function(evt, data) {
          var filename = data.result.files[0].name;

          // 2014-11-24 after loading file, blur calls update.
          $(evt.target)
            .closest('.form-upload')
            .find('.filename-input-container')
            .find('input[type=text]')
            .val(filename)
            .blur();

          setTimeout(updateAttachmentFiles, 250);
        },

        progressall: function(evt, data) {
          var progress = parseInt(data.loaded / data.total * 100, 10);
          $('#progress .bar').css('width', progress + '%');
        }
      });
    }

    return $fileupload;
  },

  pickAudio: function(data) {
    var inputs = form.text(data);
    var button = form.pickFile('');

    var $leftCol = $('<div class="col-xs-9 filename-input-container"></div>');
    var $rightCol = $('<div class="col-xs-3"></div>');

    var $wrapper = $(
      '<div name="' + data.name + '" class="form-upload row clearfix">' +
      '</div>'
    );

    $leftCol.append(inputs);
    $rightCol.append(button);

    $wrapper.append($leftCol);
    $wrapper.append($rightCol);

    return $wrapper;
  },

  pickImage: function(data) {
    return form.pickAudio(data);
  },

  pickVideo: function(data) {
    return form.pickAudio(data);
  },

  pickXML: function(data) {
    return form.pickAudio(data);
  },

  clear:function(){
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
		$(elt).parent().removeClass('has-error');
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
			$(elt).parent().addClass('has-error');
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
					'<span class="text-danger"><span class="glyphicon-attention"></span>'+err.text+'</span></span>'
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
		var e= $('<div class="editspan form-group">'
			+(typeof data.label!=='undefined' ? ('<label class="control-label">'+data.label+'</label>') : '')
			+'<div spellcheck="false" contenteditable=true spellcheck=false class="form-control text editable taller codeedit"  rows='+4+'>'+data.value+'</div><div class="errors help-block"></div></div>');
		$('.editable',e).blur(function(){
			form.codeCheckSoon(this);
			$('SPAN',$(this)).remove();
			form.change($(this),form.codeFix($(this).html()));
			}).data('data',data);
		form.codeCheckSoon($('.codeedit',e));
		return e;
	},

  // list is array to ensure preserved order. Note: js object properties don't guarantee order
  pickList: function(data, listValueLabel) {
    var i;
    var options = '';

    // listValueLabel :: [Integer, String, ...]
    // where the integer value represents the `option` tag value and the string
    // is the `option` tag label
    for (i = 0; i < listValueLabel.length; i += 2) {
      options +=
        '<option value="' + listValueLabel[i] + '">' +
          listValueLabel[i + 1] +
        '</option>';
    }

    var label = data.label != null ?
      ('<label class="control-label">' + data.label + '</label>') : '';

    var $selectFormGroup = $(
      '<div name="' + data.name + '">' +
        '<div class="editspan form-group">' +
          label +
          '<select class="form-control">' +
            options +
          '</select>' +
        '</div>' +
      '</div>'
    );

    var $selectInput = $selectFormGroup.find('select');

    $selectInput
      .change(function() {
        form.change($(this), $('option:selected', this).val());
      })
      .data('data', data)
      .val(data.value);

    // trace(data.value,$('.ui-select-input',e).val());
    if ($selectInput.val() !== String(data.value)) {
      $selectInput.append($('<option value="' + data.value + '">{' + data.value + '}</option>'));
      $selectInput.val(data.value);
    }

    return $selectFormGroup;
  },

  pickStep: function(data) {
    var list = [];
    var steps = gGuide.steps || [];

    steps.forEach(function(step, index) {
      list.push(index, gGuide.stepDisplayName(index));
    });

    return form.pickList(data, list);
  },

  // Let user choose number of said item
  tableRowCounter: function(name, label, minelts, maxelts, value) {
    var option;
    var $label = $('<label/>').text(label);
    var $select = $('<select list="' + name + '" class="form-control picklist"></select>');

    // validating that value is within the limits
    if (value < minelts) {
      value = minelts;
    } else if (value > maxelts) {
      value = maxelts;
    }

    // append `option` tags to `$select`
    for (option = minelts; option <= maxelts; option++) {
      $select.append($('<option />', {
        text: option,
        selected: (option === value)
      }));
    }

    var onChange = function() {
      form.tableRowAdjust(name, $('option:selected', this).val());
    };

    // wait for the next turn on the event loop to adjust the number of rows
    // based on the default option of the row counter select box, this makes
    // sure that if the min is greater than zero, the table will have that min
    // number of rows on screen. See https://github.com/CCALI/CAJA/issues/1100
    setTimeout(function() {
      var $selected = $select.find('option:selected');
      form.tableRowAdjust(name, $selected.val());
    });

    $select.change(onChange).val(value);
    return $('<div/>').append($label.add($select));
  },

  // Adjust number of rows. set visible for rows > val. if val > max rows, clone the last row.
  tableRowAdjust: function(name, val) {
    var $tbl = $('table[list="' + name + '"]');
    var settings = $tbl.data('settings');
    var $tbody = $tbl.find('tbody'); //'table[list="'+name+'"] tbody');
    var rows = $tbody.find('tr').length;
    var r;

    for (r = 0; r < rows; r++) {
      $tbody.find('tr:nth(' + r + ')').showit(r < val);
    }

    for (r = rows; r < val; r++) {
      form.listManagerAddRow($tbl, $.extend({}, settings.blank));
    }

    form.listManagerSave($tbl);
  },

  listManagerSave:function($tbl)
	{	// save revised order or added/removed items
		var settings=$tbl.data('settings');
		var list=[];
		$('tr',$tbl).not(':hidden').each(function(idx){ //:gt(0)
			list.push($(this).data('record'));
		});
		settings.save(list);
		$('select[list="'+settings.name+'"]').val(list.length);
	},

  listManagerAddRow: function($tbl, record) {
    var settings = $tbl.data('settings');

    var $row = $(
      '<tr valign=top class="step-step' + record.number + '" name="record"/>'
    );

    $row.append(
      '<td class="editicons">' +
        '<span class="ui-draggable sorthandle glyphicon-move"></span>' +
        '<span class="ui-icon-circle-plus glyphicon-plus-circled"></span>' +
        '<span class="ui-icon-circle-minus glyphicon-minus-circled"></span>' +
      '</td>'
    );

    $row.append(settings.create(form.div(), record));
    $row.data('record', record);
    $tbl.append($row);
  },

  // data.name:'Fields' data.,picker:'Number of fields:',data.min:0,data.max:CONST.MAXFIELDS,data.list:page.fields,data.blank:blankField,data.save=function to save,data.create=create form elts for record
  listManager: function(settings) {
    var $div = $('<div/>');

    var $tbl = $('<table/>')
      .addClass('list table table-striped')
      .data('settings', settings)
      .attr('list', settings.name);

    $div.append(form.tableRowCounter(
      settings.name,
      settings.picker,
      settings.min,
      settings.max,
      settings.list.length
    ));

    var list = settings.list || [];

    list.forEach(function(item) {
      form.listManagerAddRow($tbl, item);
    });

    $tbl.find('tbody').sortable({
      handle: 'td .sorthandle',
      update: function(event, ui) {
        form.listManagerSave((ui.item.closest('table')));
      }
    });

    $div.append($tbl);

    return $div;
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

		case "tabsClauses":
			guide.buildTabClauses(t);
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
						pagefs=form.fieldset(page.name, page,'accordion');
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
				pagefs=form.fieldset(page.name, page,'accordion');
				pageNameFieldsForTextTab(pagefs,page);
				t.append(pagefs);
			}

			break;

		case 'tabsReports':
			// Generate read-only report. Guide info, variable list, step info, pages.

			break;


    case 'tabsAbout':
      $('#about-tabs > li').removeClass('active');
      $('.tab-pane').removeClass('active');

      $('#about-tabs > li').first().addClass('active');
      $('#tab-about').addClass('active');

      // ------------------------------------------
      // About tab
      tabAbout = form.div('About');

      var cols444 = $(
        '<div class="row">' +
          '<div class="col-sm-4 language"></div>' +
          '<div class="col-sm-4 avatar"></div>' +
          '<div class="col-sm-4 gender"></div>' +
        '</div>'
      );

      tabAbout.append(form.text({
        label: 'Title:',
        placeholder: 'Interview title',
        value: guide.title,
        change: function(val) {
          guide.title = val;
        }
      }));

      tabAbout.append(form.htmlarea({
        label: 'Description:',
        value: guide.description,
        change: function(val) {
          guide.description = val;
        }
      }));

      tabAbout.append(form.text({
        label: 'Jurisdiction:',
        value: guide.jurisdiction,
        change: function(val) {
          guide.jurisdiction = val;
        }
      }));

      tabAbout.append(cols444);

      tabAbout.append(form.htmlarea({
        label: 'Credits:',
        value: guide.credits,
        change: function(val) {
          guide.credits = val;
        }
      }));

      tabAbout.append(form.text({
        label: 'Approximate Completion Time:',
        placeholder: '',
        value: guide.completionTime,
        change: function(val) {
          guide.completionTime = val;
        }
      }));

      $('#tab-about').html(tabAbout);

      var l;
      var list = [];

      for (l in Languages.regional) {
        // l is language code like en or es.
        list.push(l, Languages.regional[l].LanguageEN + ' (' + Languages.regional[l].Language + ') {' + l + '}');
      }

      $('.language').append(form.pickList({
        label: 'Language:',
        value: guide.language,
        change: function(val) {
          guide.language = val;
          Languages.set(guide.language);
          $('.A2JViewer', '#page-viewer').html('');
        }
      }, list));

      list = ['avatar1', 'Avatar 1', 'avatar2', 'Avatar 2', 'avatar3', 'Avatar 3'];

      $('.avatar').append(form.pickList({
        label: 'Avatar:',
        value: guide.avatar,
        change: function(val) {
          guide.avatar = val;
        }
      }, list));

      list = ['Female', 'Female Guide', 'Male', 'Male Guide'];

      if (guide.guideGender !== 'Male') {
        guide.guideGender = 'Female';
      }

      $('.gender').append(form.pickList({
        label: 'Guide Gender:',
        value: guide.guideGender,
        change: function(val) {
          guide.guideGender = val;
        }
      }, list));

      // ------------------------------------------
      // Layout tab
      tabLayout = form.div('Layout');

      tabLayout.append(form.pickImage({
        label: 'Logo graphic:',
        placeholder: 'Logo URL',
        value: guide.logoImage,
        change: function(val) {
          guide.logoImage = val;
        }
      }));

      tabLayout.append(form.pickImage({
        label: 'End graphic:',
        placeholder: 'End (destination graphic) URL',
        value: guide.endImage,
        change: function(val) {
          guide.endImage = val;
        }
      }));

      $('#tab-layout').html(tabLayout);

      // -------------------------------
      // Feedback tab
      tabFeedback = form.div('Feedback');

      tabFeedback.append(form.checkbox({
        label: 'Allow Send feedback?',
        checkbox: '',
        value: guide.sendfeedback,
        change: function(val) {
          guide.sendfeedback = val;
        }
      }));

      tabFeedback.append(form.text({
        label: 'Feedback email:',
        value: guide.emailContact,
        change: function(val) {
          guide.emailContact = val;
        }
      }));

      $('#tab-feedback').html(tabFeedback);

      fs = form.fieldset('Authors');
      var blankAuthor = new TAuthor();

      // ------------------------------------------
      // Revision history tab
      tabHistory = form.div('Revision History');

      tabHistory.append(form.text({
        label: 'Current Version:',
        value: guide.version,
        change: function(val) {
          guide.version = val;
        }
      }));

      tabHistory.append(form.htmlarea({
        label: 'Revision Notes',
        value: guide.notes,
        change: function(val) {
          guide.notes = val;
        }
      }));

      $('#tab-revision').html(tabHistory);

      // ------------------------------------------
      // Authors tab
      tabAuthors = form.div('Authors');

      tabAuthors.append(form.listManager({
        name: 'Authors',
        picker: 'Number of authors',
        min: 1,
        max: 12,
        list: guide.authors,
        blank: blankAuthor,
        save: function(newlist) {
          guide.authors = newlist;
        },

        create: function(ff, author) {
          var colRow = $('<div class="row"></div>');
          var colLeft = $('<div class="col-sm-6"></div>');
          var colRight = $('<div class="col-sm-6"></div>');

          colLeft.append(form.text({
            label: 'Author\'s Name:',
            placeholder: 'name',
            value: author.name,
            change: function(val, author) {
              author.name = val;
            }
          }));

          colRight.append(form.text({
            label: 'Author\'s Title:',
            placeholder: 'title',
            value: author.title,
            change: function(val, author) {
              author.title = val;
            }
          }));

          colLeft.append(form.text({
            label: 'Author\'s Organization:',
            placeholder: 'organization',
            value: author.organization,
            change: function(val, author) {
              author.organization = val;
            }
          }));

          colRight.append(form.text({
            label: 'Author\'s email:',
            placeholder: 'email',
            value: author.email,
            change: function(val, author) {
              author.email = val;
            }
          }));

          ff.append(colRow);
          ff.append(colLeft);
          ff.append(colRight);

          return ff;
        }
      }));

      $('#tab-authors').html(tabAuthors);

      $('#about-tabs > li > a').click(function(event) {
        $('#about-tabs > li').removeClass('active');
        $(this).parent().addClass('active');

        $('.tab-pane').removeClass('active');
        var panelId = $(this).data('panel');
        $('#' + panelId).addClass('active');
      });

      break;

    case 'tabsSteps':
      fs = form.fieldset('Start/Exit points', '', 'accordion');

      var cols66 = $(
        '<div class="row">' +
          '<div class="col-sm-6 starting"></div>' +
          '<div class="col-sm-6 exit"></div>' +
        '</div>'
      );

      fs.append(cols66);
      t.append(fs);

      $('.starting').append(form.pickpage({
        value: guide.firstPage,
        label: 'Starting Point: ',
        change: function(val) {
          guide.firstPage = val;
        }
      }));

      $('.exit').append(form.pickpage({
        value: guide.exitPage,
        label:'Exit Point: ',
        change:function(val) {
          guide.exitPage = val;
        }
      }));

      fs = form.fieldset('Steps', '', 'accordion');
      var blankStep = new TStep();

      fs.append(form.listManager({
        grid: true,
        name: 'Steps',
        picker: 'Number of Steps:',
        min: 1,
        max: CONST.MAXSTEPS,
        list: guide.steps,
        blank: blankStep,

        save: function(newlist) {
          guide.steps = newlist;
          updateTOC();
        },

        create: function(ff, step) {
          var colRow = $('<div class="row"></div>');
          var colNumber = $('<div class="col-sm-3"></div>');
          var colTitle = $('<div class="col-sm-9"></div>');

          colNumber.append(form.text({
            label: 'Step Number:',
            placeholder: '#',
            value: step.number,
            change: function(val, step) {
              step.number = val;
              updateTOC();
            }
          }));

          colTitle.append(form.text({
            label: 'Step Sign:',
            placeholder: 'title',
            value: step.text,
            change: function(val, step) {
              step.text = val;
              updateTOC();
            }
          }));

          colRow.append(colNumber);
          colRow.append(colTitle);
          ff.append(colRow);

          return ff;
        }
      }));

      t.append(fs);
      break;
  }

	form.finish(t);

	 $("legend",t).click(function(){
			 $(this).siblings('div').slideToggle(300);
			 $(this).parent().toggleClass( 'collapsed');
	 });



};

function resumeEdit()
{
	$('#authortool').show();
	$('#page-viewer').hide();
	if ($pageEditDialog!==null){$pageEditDialog.dialog('open');}
}

// ### Attach Author editing buttons to the A2J viewer
function authorViewerHook() {
  A2JViewer.IMG = '../viewer/images/';

  $('.A2JViewer').append('<div class="debugmenu"><button/><button/><button/><button/></div>');

  $('.A2JViewer div.debugmenu button')
    .first().button({
      label: 'Variables/Script',
      icons: {primary:'ui-icon-wrench'}
    })
    .click(function() {
      $('.A2JViewer').toggleClass('test', 100);
    })
    .next().button({
      label: 'Fill',
      icons: {primary:'ui-icon-pencil'}
    })
    .click(function() {
      A2JViewer.fillSample();
    })
    .next().button({
      label: 'Resume Edit',
      icons: {primary:'ui-icon-arrowreturnthick-1-w'}
    })
    .click(function() {
      resumeEdit();
    })
    .next().button({
      label: 'Edit this',
      icons:{primary:'ui-icon-pencil'}
    })
    .click(function() {
      gotoPageEdit(gPage.name);
    });
}

function updateTOCOnePage()
{	// TODO - just update only this page's TOC and Mapper entry.
	updateTOC();
}


function vcGatherUsage( name )
{	// 2015-03-27 Search for variable or constant
	// This is a Lazy search so plain text words are also found.
	// TODO - exclude non-macro/logic bits.
	var html='';
	var count=0;
	var p;
	var nameL=name.toLowerCase();
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
	return 'Used in '+count+' pages' + '<ul>'+html+'</ul>';
}




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
					html = '<a target="_blank" href="'+url+'">'+txt+'</a>';
				}
				restoreSelection(sel);
				var didExecute = document.execCommand('insertHTML',false,  html );
        if(!didExecute) {
          //this one is for the team at Microsoft who decided to drop support for
          //document.execCommand('insertHTML', false, html) and didn't even bother
          //returning an error. *kudos*
          var frag = document.createDocumentFragment();
          var htmlElement = document.createElement("span");
          htmlElement.innerHTML = html;
          frag.appendChild(htmlElement);
          var selection = document.getSelection();
          var range = selection.getRangeAt(0);
          range.deleteContents();
          range.insertNode(frag);
        }
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
