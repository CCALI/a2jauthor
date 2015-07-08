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
var SELECTED = 'ui-state-active';


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

function ws(data,results)
{ // Contact the webservice to handle user signin, retrieval of guide lists and load/update/cloning guides.
  $.ajax({
    url:'CAJA_WS.php',
    dataType:'json',
    type: 'POST',
    data: data,
    success: function(data){
      //trace(String.substr(JSON.stringify(data),0,299));
      results(data);
    },
    error: function(err,xhr) {
      dialogAlert({title:'Error loading file',body:xhr.responseText});
      setProgress('Error: '+xhr.responseText);
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
        gotoTabOrPage('tabsGuides');
        $('#splash').hide();
        $('#cajaheader').removeClass('hidestart');
        $('#authortool').removeClass('hidestart');//.addClass('authortool').show();
      }
      else
      { // ### If user not logged in inform them and redirect to main site.
        var $d=$( "#dialog-confirm" );
        $d.html('<p><span class="ui-icon ui-icon-alert" style="float: left; margin: 0 7px 20px 0;"></span>'
              +'Please login to your a2jauthor.org account first. Access to the A2J Author tool requires authentication first. To be authenticated, please fill out the survey that was emailed to you after you first registered for this site. If you have any problems after filling out the survey, please contact webmaster@a2jauthor.org.'
              +'</p>');
         $d.dialog( {
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
  //$('#guideSave').button({label:'Save Now',icons:{primary:"ui-icon-disk"}}).click(function(){guideSave();});
  $('#settings').click(function(){$('#settings-form').dialog('open');});

  // 2014-06-09 SJG adding context-sensitive help links.
  //$('.tabHeader, #tabsMapper .tabFooter').append('<button class="CSH"/>');
  $('.CSH').click(function(){
    var csh = $(this).attr('CSH');//parent().parent().attr('id');
    var url = 'http://author.a2jauthor.org/csh5/' + csh;
    window.open( url );
  });


  // JPM Handles Expand/Collapse button on pages list
  function expandCollapsePageList() {
    var ecText = $("#expandCollapse").text();
    if (ecText === '<span class="glyphicon-minus"></span> Collapse All') {
      $("#expandCollapse").html('<span class="glyphicon-plus"></span> Expand All');
      $("#CAJAOutline > ul > li + ul").slideUp(300);
      $('#expandCollapse').button({label:'<span class="glyphicon-plus"></span> Expand All'});
    }
    else {
      $("#expandCollapse").html('<span class="glyphicon-minus"></span> Collapse All');
      $("#CAJAOutline > ul > li + ul").slideDown(300);
      $('#expandCollapse').button({label:'<span class="glyphicon-minus"></span> Collapse All'});
    }
  }
  // JPM Expand/Collapse button for pages list.
  $('#expandCollapse')
    .button({label:'<span class="glyphicon-minus"></span> Collapse All'})
    .click(function(){
      expandCollapsePageList();
    });
  // JPM expand/collapse all panel buttons on various tabs/popups
  $(".ecPanelButton") // SJG apply to all ec buttons operating on LEGEND tags
      .button({label:'<span class="glyphicon-minus"></span> Collapse All'})
      .click(function(){
        if ($(this).text() === '<span class="glyphicon-minus"></span> Collapse All') {
             $(this).parents('.panel').find("legend ~ div").slideToggle(300);
             $(this).button({label:'<span class="glyphicon-plus"></span> Expand All'});
        }
        else {
             $(this).parents('.panel').find("legend ~ div").slideDown(300);
             $(this).button({label:'<span class="glyphicon-minus"></span> Collapse All'});
        }
  });


  //$('#guideCreate').button({icons:{primary:"ui-icon-document"}}).click(function(){createBlankGuide(); });
  $('#guideOpen').button({disabled:false}).click(openSelectedGuide);
  $('#guideArchive').button({disabled:false}).click(archiveSelectedGuide);



  $('#guideZIP').button({  disabled:false, icons:{primary:"ui-icon-disk"}}).click(function()
  { // 01/08/2014 ZIP the guide and related files.
    function guideZipped(data)
    {
      setProgress('');
      gGuideID=data.gid;
      if (data.zip!==''){
        window.open( data.zip);
      }
    }
    setProgress('Generating ZIP',true);
    ws({cmd:'guidezip',gid:gGuideID},guideZipped);
   });

  $('#guidePublish').button({  disabled:false, icons:{primary:"ui-icon-disk"}}).click(function()
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
  $('#guideMobile').button({label:'Test in Mobile',icons:{primary:'ui-icon-pencil'}}).click(function(){
    // 2015-01-14
    // E.g., http://localhost/app/js/viewer/mobile/mobile.min.html?templateURL=/app/userfiles/public/dev/guides/Guide334/2015-01-12-12-46-35/Guide.xml&fileDataURL=images%2F&getDataURL=%2Fresume.aspx&setDataURL=%2Fsave.aspx&autoSetDataURL=%2Fautosave.aspx&exitURL=https%3A%2F%2Fgoogle.com&logURL=&errRepURL=&desktopURL=index.html#!view/pages/page/06-Where%20will%20you%20file%20the%20affidavit%3F
    // Open new window with a unique URL that author can test on mobile.
    // URL needs to load a JSON so we do a save first to ensure our json is updated.
    setProgress('Generating Mobile files',true);
    gGuide.lastSaveXML=''; //force a save.
    guideSave(function(){
      // open a new window pointing to the interview specifically.
      // Short url as possible?
      // security needed or just browse directly??
      window.open('../viewer/mobile.min.html?templateURL=' +
              gGuidePath +'Guide.xml');
    });
  });


  $('#reportFull').button().click(reportFull);
  $('#reportTranscript').button().click(reportTranscript);

  $('#guideDownload').button({  disabled:false, icons:{primary:"ui-icon-disk"}}).click(function()
  { // 05/08/2014 Download as .a2j file.
    // 06/06/2014 Use .a2j5 extension so A2J4 doesn't try to open it.
    if (gGuide.filename.indexOf('.a2j5')<0) {
      gGuide.filename+= '.a2j5';
    }
    downloadTextFile( exportXML_CAJA_from_CAJA(gGuide), gGuide.filename);
   });

  $('#guideClone').button({disabled:true}).click(function(){
    dialogAlert({title:'Clone interview'});
   });

  $('.guidemenu nav li').click(function(){
    $('.guidemenu nav li').removeClass('active');
    $(this).addClass('active');
    gotoTabOrPage($(this).attr('ref'));
  });

  $(document).on("click", '.editicons .ui-icon-circle-plus',function(){// clone a table row
    var $tbl=$(this).closest('table');
    var row = $(this).closest('tr');
    var settings=$tbl.data('settings');
    if ($('tbody tr',$tbl).length>=settings.max) {return;}
    row.clone(true,true).insertAfter(row).fadeIn();
    row.data('record',$.extend({},row.data('record')));
    form.listManagerSave($(this).closest('table'));
  });
  $(document).on("click", ".editicons .ui-icon-circle-minus",  function(){// delete a table row
    var $tbl=$(this).closest('table');
    var settings=$tbl.data('settings');
    if ($('tbody tr',$tbl).length<=settings.min) {return;}
    $(this).closest('tr').remove();
    form.listManagerSave($tbl);
  });

// JPM - added button to slide/hide page list on mapper
  $('#tabsMapper button').first()
    .button({disabled:false,label:'Hide Page List',icons:{primary:'ui-icon-arrowthick-1-w'}}).next()
    .button({disabled:false,label:'Fit',icons:{primary:'ui-icon-arrow-4-diag'}}).next()
    .button({label:'Zoom in',icons:{primary:'ui-icon-zoomin'}}).next()
    .button({label:'Zoom out',icons:{primary:'ui-icon-zoomout'}});

  $('#tabsMapper button:eq(0)').click(mapZoomSlide);
  $('#tabsMapper button:eq(1)').click(mapZoomClick);
  $('#tabsMapper button:eq(2)').click(mapZoomClick);
  $('#tabsMapper button:eq(3)').click(mapZoomClick);

  $('.tabsPages .tabFooter button').first()
    .button({label:'Edit',icons:{primary:'ui-icon-pencil'}}).click(function(){
      gotoPageEdit(pageEditSelected());
    }).next()
    .button({label:'New Page',icons:{primary:'ui-icon-document'}}).click(function(){
      pageEditNew();
    }).next()
    .button({label:'New Popup',icons:{primary:'ui-icon-document'}}).click(function(){
      pagePopupEditNew();
    }).next()
    .button({label:'Clone',icons:{primary:'ui-icon-newwin'}}).click(function(){
      pageEditClone(pageEditSelected());
    }).next()
    .button({label:'Delete',icons:{primary:'ui-icon-trash'}}).click(function(){
      pageEditDelete(pageEditSelected());
    });



  $('#vars_load').button({label:'Load',icons:{primary:"ui-icon-locked"}}).next().button({label:'Save',icons:{primary:"ui-icon-locked"}});
  $('#vars_load2').button({label:'Load',icons:{primary:"ui-icon-locked"}}).next().button({label:'Save',icons:{primary:"ui-icon-locked"}});

  $('#showlogic').buttonset();
  $('#showlogic1').click(function(){gPrefs.showLogic=1;gGuide.noviceTab("tabsLogic",true);});
  $('#showlogic2').click(function(){gPrefs.showLogic=2;gGuide.noviceTab("tabsLogic",true);});

  $('#showtext').buttonset();
  $('#showtext1').click(function(){gPrefs.showText=1;gGuide.noviceTab("tabsText",true);});
  $('#showtext2').click(function(){gPrefs.showText=2;gGuide.noviceTab("tabsText",true);});


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
    {text:'Close',click:function(){
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
  $('#var-add').button({icons:{primary:'ui-icon-new'}}).click(varAdd);
  $('#clause-add').button({icons:{primary:'ui-icon-new'}}).click(clauseAdd);

  $('#uploadCMPFile').button({icons:{primary:'ui-icon-folder-open'}});
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
      guideSave();
    }
  }, CONST.AutoSaveInterval);


  $('#guideupload').fileupload({
     url:CONST.uploadGuideURL,
     dataType: 'json',
     done: function (e, data) {
      setTimeout(signin,500);
     },
     progressall: function (e, data) {
        var progress = parseInt(data.loaded / data.total * 100, 10);
        $('#guideuploadprogress .bar').css('width', progress + '%'
      );
    }
  });

  $('.bootstrap-styles button').removeClass("ui-widget");
  $('.bootstrap-styles button').removeClass("ui-button");
  $('.bootstrap-styles button').removeClass("ui-state-default");
  $('.bootstrap-styles button').removeClass("ui-corner-all");
  $('.bootstrap-styles button').removeClass("ui-button-text-only");
  //$('.bootstrap-styles span.ui-button-text').unwrap();
  //$('.bootstrap-styles span.ui-button-text').replaceWith($('.bootstrap-styles span.ui-button-text').html());

  signin();
}

window.onbeforeunload=function()
{
  if (gGuide  && gGuideID && (gGuideID!==0))
  { // If we've got a guide loaded, ask if we want to leave.
    return 'Leave A2J Author?';
  }
  else
  {
    return null;
  }
};
$(document).ready(main);

/* */
