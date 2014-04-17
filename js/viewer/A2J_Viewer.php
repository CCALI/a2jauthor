<!--
	A2J Author 5 * Justice * 正义 * công lý * 사법 * правосудие
	All Contents Copyright The Center for Computer-Assisted Legal Instruction
	2012-2014
	Shell for integrating A2J Viewer into an existing web page.
-->
<html>
<head>
	<title>Access to Justice Author 5 - Viewer Sampler</title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
</head>
<body>
	<iframe id="A2JViewerFrame" width="100%" height="100%" src="A2J_ViewerApp.html" onload='sendArgsToFrame();'></iframe> 
</body>

<SCRIPT LANGUAGE=JavaScript>
// This demo page will send starting arguments to the IFRAME which contains the Viewer.
function sendArgsToFrame(){
<?php
	// For demo purposes, we extract guide and answer file ids from the querystring and pass them on to the Viewer.
	$gid=$_GET["gid"];
	$aid=$_GET["aid"];
?>
	A2JViewerFrame.contentWindow.postMessage({
// Override these Javascript variables as needed to setup default interview/answer file loading.
		templateURL:"<?=$gid?>",
		fileDataURL:"../tests/data/",
		getDataURL:	"A2J_ViewerGetData.php?answersID=<?=$aid?>",
		setDataURL:	"A2J_ViewerSetData.php?answersID=<?=$aid?>",
		exitURL: 	"A2J_ViewerExit.php?interviewID=<?=$gid?>",
		logURL:   	"A2J_ViewerLog.php", //"https://lawhelpinteractive.org/a2j_logging";
		errRepURL:	"A2J_ViewerErrRep.php",//"https://lawhelpinteractive.org/problem_reporting_form";
		'':''
	}, "*")
}
</SCRIPT>

</html>
