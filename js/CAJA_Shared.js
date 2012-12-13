// 12/12/2012 Shared GUI/IO
// Required by Author and Viewers



function DialogAlert(args)
{  // args.title = dialog title, args.message = message body
   if (typeof args === "string") args={message:args};
   if (args.title==null) args.title="Alert";
   var $d=$( "#dialog-confirm" );
   $d.html('<p><span class="ui-icon ui-icon-alert" style="float: left; margin: 0 7px 20px 0;"></span>'+args.message+'</p>');
   $d.dialog({
      title: args.title,
      resizable: false,
      width: 350,
      height:140,
      modal: true,
      buttons: {
          OK: function() {
              $( this ).dialog( "close" );
          }
      }
   });
}

function loadGuideFile2(guideFile,startTabOrPage)
{
   var cajaDataXML;
   $.ajax({
      url: guideFile,
      dataType: ($.browser.msie) ? "text" : "xml", // IE will only load XML file from local disk as text, not xml.
      timeout: 45000,
      error: function(data,textStatus,thrownError){
        DialogAlert('Error occurred loading the XML from '+this.url+"\n"+textStatus);
       },
      success: function(data){
         //var cajaDataXML;
         if ($.browser.msie)
         {  // convert text to XML. 
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
         // global variable guide
         gGuide =  parseXML_Auto_to_CAJA(cajaDataXML);
         gGuide.filename=guideFile;
         guideStart(startTabOrPage);         
      }
   });
}

function loadGuideFile(guideFile,startTabOrPage)
{  // Load guide file XML directly
   guideFile=guideFile.split("#");
   if (guideFile.length==1)
   {
      guideFile=guideFile[0];
   }
   else
   {
      startTabOrPage= "PAGE " +guideFile[1];
      guideFile=guideFile[0];
   }
   loadNewGuidePrep(guideFile,startTabOrPage);
   window.setTimeout(function(){loadGuideFile2(guideFile,startTabOrPage)},500);
}


/* */
