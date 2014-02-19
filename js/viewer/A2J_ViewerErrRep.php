<?php
/*
	A2J Author 5 * Justice * 正义 * công lý * правосудие
	All Contents Copyright The Center for Computer-Assisted Legal Instruction
*/
header("Content-Type: text/html; charset=utf-8"); 
?>

Thanks for your error report:
<form action="A2J_Log.php?user=1" method="POST">
What were you doing when we messed up? <input name="Reason" type=text>
<BR><input type=submit  value="Submit Report">
<BR>Extra stuff:<BR>
<?php
// 8/16/11 Handle error reports that user submits from A2J Viewer.
$fields=array("FlashVersion","OSVersion","PlayerType","LanguageOS","ErrorMessage","A2JVersion","CurrentQuestion",
	"TemplateURL","GetDataURL","FileDataURL","ViewerURL");

foreach ($fields as $field)
	echo "$field: <input type=text  name=\"$field\" value=\"".htmlspecialchars(stripslashes($_POST[$field]))."\"><BR>\n";

?>

</form>