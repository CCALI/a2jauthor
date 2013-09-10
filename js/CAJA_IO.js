/*	CALI Author 5 / A2J Author 5 (CAJA)
	All Contents Copyright The Center for Computer-Assisted Legal Instruction

	Shared IO

	Required by Author and Viewers

*/



function fixPath(file)
{	// keep fully qualified path, otherwise default to file within guide's folder
	if (file.indexOf('http')===0)
	{
		return file;
	}
	return guidePath+urlSplit(file).file;
}


function loadGuideFile2(guideFile,startTabOrPage)
/** @param {TGuide} guideFile */
{
   $.ajax({
      url: guideFile,
      dataType:  "xml", // IE will only load XML file from local disk as text, not xml.
      timeout: 45000,
      error:
			/*** @this {{url}} */
			function(data,textStatus,thrownError){
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
	
	/** @type {Object} */
	var url=urlSplit(guideFile);
	guideFile = url.path+url.file;
	guidePath = url.path;
	if (url.hash!=="")
	{
      startTabOrPage= "PAGE " +url.hash;
	}

   loadNewGuidePrep(guideFile,startTabOrPage);
   window.setTimeout(function(){loadGuideFile2(guideFile,startTabOrPage);},500);
}

function ws(data,results)
{	// Contact the webservice to handle user signin, retrieval of guide lists and load/update/cloning guides.
	$.ajax({
		url:'CAJA_WS.php',
		dataType:'json',
		type: 'POST',
		data: data,
		success: function(data){ 
			//trace(String.substr(JSON.stringify(data),0,299));
			results(data);
		},
		error: function(err,xhr) { dialogAlert({title:"Error",message:xhr.responseText }); }
	});
}  

function guideSave()
{
	if (gGuide!==null && gGuideID!==0)
	{
		setProgress('Saving '+gGuide.title + AJAXLoader);
		ws( {cmd:'guidesave',gid:gGuideID, guide: exportXML_CAJA_from_CAJA(gGuide), title:gGuide.title}, function(response){
			setProgress(response.error!==null ? response.error : response.info);
		});
	}
}



/* */
