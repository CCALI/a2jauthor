/*
  A2J Author 5 * Justice * justicia * 正义 * công lý * 사법 * правосудие
  All Contents Copyright The Center for Computer-Assisted Legal Instruction

  Authoring App GUI
  Shell for the author app (the Main())
  04/15/2013

*/

/* global gGuidePath,gPage,gGuide,gUserID,gGuideID,gUserNickName */


// File upload URLs for a guide's files and a new guide.
CONST.uploadURL = 'CAJA_WS.php?cmd=uploadfile&gid=';
CONST.uploadGuideURL= 'CAJA_WS.php?cmd=uploadguide';

// Save interview every 5 minutes (if changed)
CONST.AutoSaveInterval = 5*60*1000;

// Reference for the page editing dialog box
var $pageEditDialog=null;
var SELECTED = 'item-selected';


/** @param {...}  status */
/** @param {...boolean}  showSpinner */
function setProgress(status, showSpinner)
{
  if (typeof status==='undefined'){
    status='';
  }
  //if (status!==''){ trace('setProgress',status);}
  if (showSpinner===true) {
    status += CONST.AJAXLoader;
  }
  $('#CAJAStatus').html( status );
}

// Contact the webservice to handle user signin, retrieval of guide lists and
// load/update/cloning guides.
function ws(data, results) {
  $.ajax({
    url: 'CAJA_WS.php',
    dataType: 'json',
    type: 'POST',
    data: data,
    success: function(data) {
      //trace(String.substr(JSON.stringify(data),0,299));
      results(data);
    },

    error: function(err, xhr) {
      dialogAlert({ title: 'Error loading file', body: xhr.responseText });
      setProgress('Error: ' + xhr.responseText);
    }
  });
}

function signin()
{
  if (gEnv!=='' && gStartArgs.templateURL!=='')
  {
    // ### Debug start option
    localGuideStart();
    return;
  }
  ws({cmd:'login'},
    /*** @param {{userid,nickname}} data */
    function (data){
      gUserID=data.userid;
      gGuideID=0;
      gUserNickName=data.nickname;
      if (gUserID!==0)
      { // ### Successful signin.
        $('#splash').hide();
        $('#cajaheader').removeClass('hidestart');
        $('#authortool').removeClass('hidestart');//.addClass('authortool').show();
      }
      else
      { // ### If user not logged in inform them and redirect to main site.
        var $d=$( "#dialog-confirm" );
        $d.html('<div class="alert alert-danger" role="alert"><span class="glyphicon-attention" style="float: left; margin: 0 7px 20px 0;"></span>'
              +'Please login to your a2jauthor.org account first. Access to the A2J Author tool requires authentication first. To be authenticated, please fill out the survey that was emailed to you after you first registered for this site. If you have any problems after filling out the survey, please contact webmaster@a2jauthor.org.'
              +'</div>');
         $d.dialog( {
           dialogClass: "modal bootstrap-styles",
          width: 400, height:300, modal: true,
          buttons: {
             Login: function()
             {
                window.location = '/';
            }
          }
        });
      }
    }
  );
}



function styleSheetSwitch(theme)
{
  //<link href="cavmobile.css" title="cavmobile" media="screen" rel="stylesheet" type="text/css" />
  //trace('styleSheetSwitch',theme);
  if (theme==='A2J') {
    theme = "jQuery/themes/"+theme.toLowerCase()+"/jquery-ui.css";
  }
  else{
    theme = "http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/themes/"+theme.toLowerCase()+"/jquery-ui.css";
    //1.8.23
  }
  $('link[title=style]').attr('href',theme);
}






function main()
{   // Everything loaded, now execute code.

  inAuthor=true;

   Languages.set(Languages.defaultLanguage);

  $('.authorenv').text(gEnv);
  $('.authorver').html(CONST.A2JVersionNum+" "+CONST.A2JVersionDate);
  $('#cajainfo').attr('title',versionString());
  $('#settings').click(function(){$('#settings-form').dialog('open');});

  // JPM Handles Expand/Collapse button on pages list
  function expandCollapsePageList() {
    var ecText = $("#expandCollapse").attr('data-state');
    if (ecText === 'collapsed') {
      $("#CAJAOutline .panel-collapse").slideUp(300);
      $("#CAJAOutline .accordion").addClass('collapsed');
      $('#expandCollapse').button({label:'<span class="glyphicon-expand"></span> Expand All'});
      $('#expandCollapse').attr("data-state", "expanded");
    }
    else {
      $("#CAJAOutline .panel-collapse").slideDown(300);
      $("#CAJAOutline .accordion").removeClass('collapsed');
      $('#expandCollapse').button({label:'<span class="glyphicon-collapse"></span> Collapse All'});
      $('#expandCollapse').attr("data-state", "collapsed");
    }
  }
  // JPM Expand/Collapse button for pages list.
  $('#expandCollapse')
    .button({label:'<span class="glyphicon-collapse"></span> Collapse All'})
    .click(function(){
      expandCollapsePageList();
    });
  // JPM expand/collapse all panel buttons on various tabs/popups
  $(".ecPanelButton") // SJG apply to all ec buttons operating on LEGEND tags

      .click(function(){
        var ecPanelButtonState = $(this).attr('data-state');

        if (ecPanelButtonState === 'collapsed') {
             $(this).parents('.tab-panel').find("legend ~ div").slideToggle(300);
             $(this).button({label:'<span class="glyphicon-expand"></span> Expand All'});
             $(this).attr("data-state", "expanded");
             $('fieldset').addClass('collapsed');
        }
        else {
             $(this).parents('.tab-panel').find("legend ~ div").slideDown(300);
             $(this).button({label:'<span class="glyphicon-collapse"></span> Collapse All'});
             $(this).attr("data-state", "collapsed");
             $('fieldset').removeClass('collapsed');
        }
  });

  // 01/08/2014 ZIP the guide and related files.
  $('#guideZIP').button({ disabled: false }).click(function() {
    setProgress('Generating ZIP', true);

    ws({ cmd: 'guidezip', gid: gGuideID }, function(data) {
      setProgress('');
      window.gGuideID = data.gid;

      if (data.zip !== '') {
        window.open(data.zip);
      }
    });
  });

  $('#guidePublish').button({  disabled:false}).click(function()
  { // 07/22/2014 Publish guide and related files to unique, permanent URL.
    function guidePublished(data)
    {
      setProgress('');
      //trace(data.url);
      if (data.url!==''){
        window.open( data.url);
      }
    }
    setProgress('Creating published guide',true);
    ws({cmd:'guidepublish',gid:gGuideID},guidePublished);
   });

  // 09/29/2106 Handle publishing guides to external test servers. URL is defined in CAJA_WS.php
  $('#guideZIPLHI').button({  disabled:false}).click(function()
  {  // 08/10/2015 ZIP the guide files, POST them to LHI, open new window for author to complete LHI process.
    function guideZipped(data)
    {
      setProgress('');
      gGuideID=data.gid;
      if (data.url!==''){
        window.open( data.url);
      }
    }
    setProgress('Publishing to LHI',true);
    ws({cmd:'guideZIPLHI',gid:gGuideID},guideZipped);
   });
  $('#guideZIPLHIQA').button({  disabled:false}).click(function()
  {  // 11/23/2015 ZIP the guide files, POST them to LHI, open new window for author to complete LHI process. For QA testing
    function guideZipped(data)
    {
      setProgress('');
      gGuideID=data.gid;
      if (data.url!==''){
        window.open( data.url);
      }
    }
    setProgress('Publishing to LHI - QA',true);
    ws({cmd:'guideZIPLHIQA',gid:gGuideID,server:'QA'},guideZipped);
   });
  $('#guideZIPTESTLHIQA').button({  disabled:false}).click(function()
  {  // 2/2016 ZIP the guide files,
    function guideZipped(data)
    {
      setProgress('');
      gGuideID=data.gid;
      if (data.url!==''){
        window.open( data.url);
      }
    }
    setProgress('Publishing to Test LHI - QA',true);
    ws({cmd:'guideZIPTESTLHIQA',gid:gGuideID,server:'QA'},guideZipped);
   });
  $('#guideZIPLHIDEV').button({  disabled:false}).click(function()
  {  // 2/2016 ZIP the guide files,
    function guideZipped(data)
    {
      setProgress('');
      gGuideID=data.gid;
      if (data.url!==''){
        window.open( data.url);
      }
    }
    setProgress('Publishing to LHI DEV',true);
    ws({cmd:'guideZIPLHIDEV',gid:gGuideID,server:'QA'},guideZipped);
   });
  $('#guideZIPMARLABS').button({  disabled:false}).click(function()
  {  // 2/2016 ZIP the guide files,
    function guideZipped(data)
    {
      setProgress('');
      gGuideID=data.gid;
      if (data.url!==''){
        window.open( data.url);
      }
    }
    setProgress('Publishing to Marlabs DEV',true);
    ws({cmd:'guideZIPMARLABS',gid:gGuideID,server:'QA'},guideZipped);
   });


  $('#reportFull').button().click(reportFull);
  $('#reportTranscript').button().click(reportTranscript);
  $('#reportCitation').button().click(reportCitation);

  $('#guideDownload').button({  disabled:false }).click(function()
  {
    // 05/09/2017 Use .a2j6 extension so A2J4 doesn't try to open it.
    // Also use guide title for filename
      gGuide.filename = gGuide.title + '.a2j6';

    downloadTextFile( exportXML_CAJA_from_CAJA(gGuide), gGuide.filename);
   });

  // clone a table row
  $(document).on('click', '.editicons .ui-icon-circle-plus', function() {
    var $tbl = $(this).closest('table');
    var $row = $(this).closest('tr');
    var $rows = $tbl.find('tbody tr');
    var settings = $tbl.data('settings');

    if ($rows.length >= settings.max) {
      return;
    }

    $row.clone(true, true)
      .attr('class', 'step-step' + ($rows.length + 1))
      .insertAfter($row).fadeIn()
      .data('record', $.extend({}, $row.data('record')));

    form.listManagerSave($(this).closest('table'));
  });

  // delete a table row
  $(document).on('click', '.editicons .ui-icon-circle-minus',  function() {
    var $tbl = $(this).closest('table');
    var settings = $tbl.data('settings');

    if ($tbl.find('tbody tr').length <= settings.min) {
      return;
    }

    $(this).closest('tr').remove();
    form.listManagerSave($tbl);
  });

// JPM - added button to slide/hide page list on mapper
  $('#tabsMapper button').first()
    .button({disabled:false,label:'<span class="glyphicon-left-thin"></span> Hide Page List'}).next()
    .button({disabled:false}).next()
    .button().next()
    .button();

  $('#MapperToolbar button:eq(0)').click(mapZoomSlide);
  $('#MapperToolbar button:eq(1)').click(mapZoomClick);
  $('#MapperToolbar button:eq(2)').click(mapZoomClick);
  $('#MapperToolbar button:eq(3)').click(mapZoomClick);

  $('#tabsPages #open-guide').click(function(){
      gotoPageEdit(pageEditSelected());
    });
  $('#tabsPages #clone-guide').click(function(){
      pageEditClone(pageEditSelected());
    });
  $('#tabsPages #delete-guide').click(function(){
      pageEditDelete(pageEditSelected());
    });
  $('#tabsPages #save-guide').click(function(){
      if (window.gGuide) {
        window.guideSave();
      }
    });

  $('#tabsPages #new-page').click(function(){
      pageEditNew();
    });
  $('#tabsPages #new-popup').click(function(){
      pagePopupEditNew();
    });

  $('#vars_load').button({label:'Load',icons:{primary:"ui-icon-locked"}}).next().button({label:'Save',icons:{primary:"ui-icon-locked"}});
  $('#vars_load2').button({label:'Load',icons:{primary:"ui-icon-locked"}}).next().button({label:'Save',icons:{primary:"ui-icon-locked"}});

  $('#showlogic1').click(function(){
    gPrefs.showLogic=1;
    gGuide.noviceTab("tabsLogic",true);
    $('#showlogic2').removeClass('active');
    $('#showlogic1').addClass('active');
  });
  $('#showlogic2').click(function(){
    gPrefs.showLogic=2;
    gGuide.noviceTab("tabsLogic",true);
    $('#showlogic1').removeClass('active');
    $('#showlogic2').addClass('active');
  });

  $('#showtext1').click(function(){
    gPrefs.showText=1;
    gGuide.noviceTab("tabsText",true);
    $('#showtext2').removeClass('active');
    $('#showtext1').addClass('active');
  });
  $('#showtext2').click(function(){
    gPrefs.showText=2;
    gGuide.noviceTab("tabsText",true);
    $('#showtext1').removeClass('active');
    $('#showtext2').addClass('active');
  });


   //Ensure HTML possible for combo box pick list
   //https://github.com/scottgonzalez/jquery-ui-extensions/blob/master/autocomplete/jquery.ui.autocomplete.html.js
   $.extend($.ui.autocomplete.prototype, {
      _renderItem:  function (ul, item) {
         return $("<li></li>")
        .data("item.autocomplete", item)
        //.append($("<a></a>")[this.options.html ? "html" : "text"](item.label))
        .append($("<a></a>").html(item.label))
        .appendTo(ul);
      }
   });

   // Tips
   //window.setTimeout(hovertipInit, 1);


   // Draggable
   $('.hotspot').draggable({ containment: 'parent' }).resizable().fadeTo(0.1, 0.9);


  // Load preferences
  $('#settings-form').dialog({
    autoOpen:false,
    width: 600,
    height: 500,
    modal: true,
    buttons:[
    {text:'Close',
    class: 'btn btn-default btn-wide-sm',
    click:function(){
      $(this).dialog("close");
      gPrefs.FKGradeAll =   $('#setting_FKGradeAll').is(':checked');
      gPrefs.showJS =    $('#setting_showJS').is(':checked');
      gPrefs.warnHotDocsNameLength =   $('#setting_warnHotDocsNameLength').is(':checked');
      gPrefs.save();
     }}
  ]});
  gPrefs.load();
  $('#setting_FKGradeAll').prop( 'checked', gPrefs.FKGradeAll);
  $('#setting_showJS').prop( 'checked', gPrefs.showJS);
  $('#setting_warnHotDocsNameLength').prop( 'checked', gPrefs.warnHotDocsNameLength);
  $('#cajasettings a').click(function(){
      var attr = $(this).attr('href');
      switch (attr) {
        case '#sample':
          loadGuideFile($(this).text(), "");
          break;
        case '#theme':
          styleSheetSwitch($(this).text());
          break;
        default:
          //trace('Unhandled ' + attr);
      }
      return false;
    });



  $('#page-viewer').hide();
  $('#var-add').button().click(varAdd);
  $('#clause-add').button().click(clauseAdd);

  $('#uploadCMPFile').button();
  $('#uploadCMPFileInput').on('change',function()
  { // Browse for HotDocs .CMP file on local desktop to upload to client (no server).
    var file = $('#uploadCMPFileInput')[0].files[0];
    var textType = /text.*/;
    setProgress("Loading...");
    if (file.type==='' || file.type.match(textType))
    {
      var reader = new FileReader();
      reader.onload = function(e)
      {
        var data = $.parseXML(reader.result);
        gGuide.HotDocsAnswerSetFromCMPXML($(data));
        setProgress('');
        A2JViewer.refreshVariables();
      };
      reader.readAsText(file);
    }
    else
    {
      setProgress("File not supported!");
    }
  });
  //$('#var-del').button({icons:{primary:'ui-icon-trash'}}).click(varDel);

  $( "#bold" ).button({label:'B'}).click(editButton);
  $( "#italic" ).button({label:'I'}).click(editButton);

  $( "#indent" ).button({text:false, icons: {primary:'ui-icon-arrowstop-1-e'}}).click(editButton);
  $( "#outdent" ).button({text:false, icons: {primary:'ui-icon-arrowstop-1-w'}}).click(editButton);

  $( "#link" ).button({text:false, icons: {primary:'ui-icon-link'}}).click(editButton);
  $( "#popup" ).button({label:'P'}).click(editButton);


  $( document ).tooltip({
    items: ".htmledit a", //skip title for now [title]",
    content: function(){
      var element=$(this);
      if (element.is("[title]")) {return element.attr("title");}
      if (element.is("a")) {return element.attr("href");}
      return '';
    }
  });

  // call guideSave every 5 minutes
  setInterval(function() {
    if (gGuide) {
      window.guideSave();
    }
  }, CONST.AutoSaveInterval);

  signin();
}

window.onbeforeunload = function() {
  // Chrome no longer let's you customize the message
  // If we've got a guide loaded, ask if we want to leave.
  if (gGuide && gGuideID && (gGuideID !== 0)) {
    return 'Leave A2J Author?';
  } else {
    return null;
  }
};

$(document).ready(main);

/* */
