<!--
	A2J Author 5 * Justice * 正义 * công lý * 사법 * правосудие
	All Contents Copyright The Center for Computer-Assisted Legal Instruction
	2012-2014
	This page is a demo showing integration of A2J Viewer into an existing web page.
	The viewer runs standalone in an IFRAME. We can pass parameters for interview
	file, interview asset folder, answer file saving/loading and error reporting
	from this page to the viewer's IFRAME.
	
	For demoing, there's a clone of this page in .html format (no PHP code). 
-->
<html>
<head>
	<title>Access to Justice Author 5 - Viewer</title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
</head>
<body>
	<iframe id="A2JViewerFrame" width="100%" height="100%" src="A2J_ViewerApp.html" onload='sendArgsToFrame();'></iframe> 
</body>

<SCRIPT LANGUAGE=JavaScript>
// This demo page will send starting arguments to the IFRAME which contains the Viewer.
function sendArgsToFrame(){
<?php
	// For demo purposes, extract guide and answer file ids from the querystring and pass them on to the Viewer.
	$gid=$_GET["gid"];
	$aid=$_GET["aid"];
?> 
	A2JViewerFrame=document.getElementById('A2JViewerFrame');
	A2JViewerFrame.contentWindow.postMessage({
		// Override these Javascript variables as needed to setup default interview/answer file loading.
		
		// templateURL points to the interview XML. This demo just passes what's on the querystring.
		templateURL:"<?=$gid?>", 
		
		// fileDataURL is the folder of interview's assets, usually the folder of the interview XML
		fileDataURL:"../tests/data/", 
		
		 // getDataURL loads an answer file at start, used for RESUME
		//getDataURL:	"../tests/data/Sample Short Interview Answers.anx",
		getDataURL: "A2J_ViewerAnswerGet.php?answersID=<?=$aid?>",
		
		// setDataURL saves answer file and leaves the viewer (its response replaces viewer's frame)
		setDataURL:	"A2J_ViewerAnswerSet.php?answersID=<?=$aid?>", 

		// autoSetDataURL silently saves answer file periodically. (Optional).
		autoSetDataURL:	"A2J_ViewerAutoSetData.php?answersID=<?=$aid?>",
		
		// exitURL replaces the viewer's frame with this URL on EXIT (user 'fails' interview)
		exitURL: 	"A2J_ViewerExit.html", //"A2J_ViewerExit.php?interviewID=<?=$gid?>",
		
		// logURL accepts silent logging data.
		// E.g., https://lawhelpinteractive.org/a2j_logging
		logURL:   	"A2J_ViewerLog.php", 
		
		// errRepURL accepts user's public submission of an error to which they can add an optional comment.
		// E.g., "https://lawhelpinteractive.org/problem_reporting_form";
		errRepURL:	"A2J_ViewerErrRep.php",
		
		'':''
	}, "*")
}
</SCRIPT>

</html>
