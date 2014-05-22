<?php
/*
	A2J Author 5 * Justice * 正义 * công lý * правосудие
	All Contents Copyright The Center for Computer-Assisted Legal Instruction

	04/15/2013

	Called by the A2J Viewer to retrieve a user's answer file. 
	Always called at the start of an interview. 
	If there's no data, return a blank document. 
*/


/*	Sample code to be completed:
	$answersID=$_GET["answersID"];
	if (isset($answersID))
		if ($answerID
		$getData="answers/$answersID";
	else
		$getData="blank_answerset";
*/		
		
	header("Content-type: text/plain");	//header("mime-type","plaintext/xml");
	echo file_get_contents("../tests/data/sample_answers-1.anx");
	//echo file_get_contents($getData.'.xml');	
	
	
?>
