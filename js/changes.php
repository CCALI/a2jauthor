<!--
	A2J Author 5 (CAJA) 正义 * công lý * правосудие
	All Contents Copyright The Center for Computer-Assisted Legal Instruction
-->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>A2J 5 Changes</title>
<style type="text/css">
<!--
.Fixed, .New, .Changed {
	border-width: thick;
	border-right-style: solid;
}

.Fixed {
	border-color: #009F00;
}
.New {
	border-color: #FF7F55;
}
.Changed {
	border-color: #AA3FAA;
}
.internal {
	font-style: italic;
}
-->
</style>
</head>

<body>
<h1>A2J 5 Author and Viewer</h1>
<h1>Additions, Changes, and Fixes  </h1>
<table border="0" cellpadding="5" cellspacing="1">

<?php
	// 2014-09-19 Format changes.txt into friendly HTML page.
	$changes=file_get_contents("changes.txt");
	$changes=explode("\n",$changes);
	foreach($changes as $line) 
	{
		$line=trim($line);
		if (strpos($line,"# ")===0)
		{
			wi();
			echo "<tr><td colspan=2><h2>".substr($line,2)."</h2></td></tr>";
		}
		else
		if (strpos($line,"* ")===0)
		{	
			wi();
			$p=strpos($line,'-');
			if ($p>=0)
			{
				$issueMod = substr($line,2,$p-2);
				$issue=substr($line,$p+1);
			}
			else
			{
				$issue = $line;
			}
		}
		else
		{
			if ($issue!='' && $line!='')
				$issue .= '<br/>'.$line;
		}
	
	}
function wi()
{
	global $issue,$issueMod;
	$issue = trim($issue);
	if ($issue !='')
	{
		$issueClass='general';
		if (strpos($issue,'internal')===0)
		{
			$issueClass='internal';
		}
		echo '<tr valign=top><td class="'.$issueMod.' '.$issueClass.'" align=right>'.$issueMod.'</td><td class="'.$issueClass.'">'.$issue.'</td></tr>';
		$issue='';
	}
}
		
?>
<tr>
	<td colspan="2">A2J 5 Author/Viewer</td>
</tr>
<tr>
	<td>Fixed</td>
	<td>&nbsp;</td>
</tr>
<tr>
	<td>Added</td>
	<td>&nbsp;</td>
</tr>
<tr>
	<td>Changed</td>
	<td>&nbsp;</td>
</tr>
</table>

</body>
</html>
