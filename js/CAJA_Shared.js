/*	CALI Author 5 / A2J Author 5 (CAJA)
	All Contents Copyright The Center for Computer-Assisted Legal Instruction

	Shared GUI/IO
	Required by Author and Viewers
	12/12/2012 
*/


function dialogAlert(args)
{  // args.title = dialog title, args.message = message body
   if (typeof args === "string"){
		args={message:args};
	}
   if (args.title===null){
		args.title="Alert";
	}
   var $d=$( "#dialog-confirm" );
   $d.html('<p><span class="ui-icon ui-icon-alert" style="float: left; margin: 0 7px 20px 0;"></span>'+args.message+'</p>');
   $d.dialog({
      title: args.title,
      resizable: false,
      width: 350,
      height:250,
      modal: true,
      buttons: {
          OK: function() {
              $( this ).dialog( "close" );
          }
      }
   });
}

function loadGuideFile2(guideFile,startTabOrPage)
/** @param {TGuide} guideFile */
{
   $.ajax({
      url: guideFile,
      dataType:  "xml", // IE will only load XML file from local disk as text, not xml.
      timeout: 45000,
      error: function(data,textStatus,thrownError){
        dialogAlert('Error occurred loading the XML from '+this.url+"\n"+textStatus);
       },
      success: function(data){
         var cajaDataXML;
			cajaDataXML = data;
         cajaDataXML=$(cajaDataXML); 
         // global variable guide
         gGuide =  parseXML_Auto_to_CAJA(cajaDataXML);
         gGuide.filename=guideFile;
         guideStart(startTabOrPage);         
      }
   });
}

function loadGuideFile(guideFile,startTabOrPage)
/** @param {TGuide} guideFile */
{  // Load guide file XML directly
   guideFile=guideFile.split("#");
   if (guideFile.length===1)
   {
      guideFile=guideFile[0];
   }
   else
   {
      startTabOrPage= "PAGE " +guideFile[1];
      guideFile=guideFile[0];
   }
   loadNewGuidePrep(guideFile,startTabOrPage);
   window.setTimeout(function(){loadGuideFile2(guideFile,startTabOrPage);},500);
}


/* */
