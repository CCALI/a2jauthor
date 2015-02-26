<!doctype html>
<!--
	A2J Author 5 * Justice * justicia * 正义 * công lý * 사법 * правосудие
	All Contents Copyright The Center for Computer-Assisted Legal Instruction
	2012-2015
	A2J Viewer Plugin
	Edit the config object parameters as needed.
	Touch detection deteremines whether desktop or mobile version will load.
	For demoing, there's a clone of this page in .html format (no PHP code).
	02/26/2015 Mobile/Desktop switcher
-->

<html>
	<head>
		<title>Access to Justice Author 5 - Viewer</title>
		<script src="modernizr.js"></script>
		<script src="jquery.min.js"></script>
		<script src="jquerypp.cookie.js"></script>
	</head>

	<body>
	
		<div align="center">
			<img src="images/A2J5_Icon_512.png"/>
			<P>Loading... <img alt="Loading..." src="images/ajax-loader.gif" width="16" height="16" /></P>
		</div>
		<script type="text/javascript">
<?php
	// For demo purposes, extract guide and answer file ids from the querystring and pass them on to the Viewer.
	$gid=$_GET["gid"];
	$aid=$_GET["aid"];
?> 
			var config = {
				// Override these Javascript variables as needed to setup default interview/answer file loading.

				// templateURL points to the interview XML. This demo just passes what's on the querystring.
				//templateURL: '/interview.xml',
				templateURL:"<?=$gid?>", 

				// fileDataURL is the folder of interview's assets, usually the folder of the interview XML
				//fileDataURL: 'images/', 
				fileDataURL:"../tests/data/", 

				// getDataURL loads an answer file at start, used for RESUME
				getDataURL: "A2J_ViewerAnswerGet.php?answersID=<?=$aid?>&rnd="+Math.random(),

				// setDataURL saves answer file and leaves the viewer (its response replaces viewer's frame)
				setDataURL:	"A2J_ViewerAnswerSet.php?answersID=<?=$aid?>", 

				// autoSetDataURL silently saves answer file periodically. (Optional).
				autoSetDataURL:	"A2J_ViewerAutoSetData.php?answersID=<?=$aid?>",

				// exitURL replaces the viewer's frame with this URL on EXIT (user 'fails' interview)
				//exitURL: 'https://google.com', //"A2J_ViewerExit.php?interviewID=<?=$gid?>",
				exitURL: 	"A2J_ViewerExit.html",

				// logURL accepts silent logging data.
				// E.g., https://lawhelpinteractive.org/a2j_logging
				//	logURL: '',
				logURL:   	"A2J_ViewerLog.php", 

				// errRepURL accepts user's public submission of an error to which they can add an optional comment.
				// E.g., "https://lawhelpinteractive.org/problem_reporting_form",
				//errRepURL: ''
				errRepURL:	"A2J_ViewerErrRep.php"
			};
			//alert($.cookie('useDesktop'));

			if ( ( 0|| Modernizr.touch )&& ('true'!==$.cookie('useDesktop'))) {
				//This is a touch enabled device, we'll redirect to mobile site.

				//desktopURL will redirect a mobile user back to
				//the desktop landing page.
				config.desktopURL = 'desktop.min.html';
				window.location = 'mobile.min.html?' + $.param(config);
			}
			else {
				window.location = 'desktop.min.html?' + $.param(config);
				//A2JViewerFrame = document.getElementById('A2JViewerFrame');
				//A2JViewerFrame.contentWindow.postMessage(config, '*');
			}
		</script>
	</body>
</html>
