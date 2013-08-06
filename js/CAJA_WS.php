<?php
// 010/05/2012 Simple CAJA Author Web Service API
// A Fuse to handle all a2j author editing stuff

//07/01/2013 HACK to login to demo
//7/15/2013 Directory restructure

session_start();
header("Content-type: text/plain; charset=utf-8");

$command=$_REQUEST['cmd'];
$result=array();
$err="";
$mysqli="";
$drupaldb="";
require "./CONFIG.php";
// check connection
if (mysqli_connect_errno()) {
  exit('Connect failed: '. mysqli_connect_error());
}

switch ($command)
{
	case 'login':
		//Use Drupal to login;
		//This will need to be abstracted out for folks not using Drupal
		$user=$drupaldb->real_escape_string($_REQUEST['username']);
		$pass=$drupaldb->real_escape_string($_REQUEST['userpass']);

		
		if ($user=='demo')//07/01/2013 HACK to login to demo until switch to drupal 7 hash.
			$pass='$S$DK05WJZFlhtSX7gZlKdJ7R/ytQx65R7LfoEsYjDQa4dowr4Y2Lhz';
		else
			$pass = MD5($pass);
				
		
		
		
		$res=$drupaldb->query("select * from users where name='$user' and pass='$pass'");
		if ($row=$res->fetch_assoc()){
			$checkuser=$mysqli->query("select * from usersbeta where username='$user'");
			$numrows=$checkuser->num_rows;
			if (!$numrows){
			  mkdir(GUIDES_DIR.$user, 0700);
			  mkdir(GUIDES_DIR.$user.'/guides', 0700);
			  $uid=$row['uid'];
			  //the next lines do a deep dive into Drupal profiles
			  //and will need to be custom to each server install
			  $nameres=$drupaldb->query("SELECT group_concat(pv.value SEPARATOR ' ') AS fullname from profile_values pv where pv.uid = $uid and pv.fid in (1,2)");
			  $namerow=$nameres->fetch_assoc();
			  $fullname=$namerow['fullname'];
			  //end Drupal profile stuff
			  $mysqli->query("insert into usersbeta (username, pass, nickname, folder) values ('$user', '$pass', '$fullname', '$user')");
			  $checkuser=$mysqli->query("select * from usersbeta where username='$user'");
			}
			$userrow=$checkuser->fetch_assoc();
			$result['nickname']=$userrow['nickname'];
			$userid=$userrow['uid']; 
			$userdir=$userrow['folder'];
			
		}
		else
		{
			$userid=0;
			$userdir=0;
		}
		
		$result['userid']=$userid;
		$_SESSION['userid']=$userid;
		$_SESSION['userdir']=$userdir;
		break;
	case 'logout':
		// do logout, clear seession user id
		$userid=0;
		$userdir=0;
		$result['userid']=$userid;
		$_SESSION['userid']=$userid;
		$_SESSION['userdir']=$userdir;
		break;

		
	case 'guides':
		// list of free, public or user owned guides
		listGuides("select * from guides where isPublic=1 or isFree=1  or (editoruid=$userid) order by (editoruid=$userid) desc, title asc ");
		break;

	case 'guides/owned':
		// list of user owned guides
		listGuides("select * from guides where editoruid=$userid order by title asc");
		break;

	case 'guide':
		// return XML of guide if it's public, free or user owned.
		$gid=intval($mysqli->real_escape_string($_REQUEST['gid']));
		$res=$mysqli->query("select * from guides where gid=$gid   and (isPublic=1  or isFree=1  or editoruid=$userid)");
		if ($row=$res->fetch_assoc()){
			$result['gid']=$row['gid'];
			$result['editoruid']=$row['editoruid'];
			$result['guide']= file_get_contents(GUIDE_DIR($row['filename'],TRUE));
			trace(GUIDE_DIR($row['filename']));
		}
		else
		{// not found
		}
		break;
		
	case 'guidesave':
		// update the guide (only if user matches guide's editor
		$gid=intval($mysqli->real_escape_string($_REQUEST['gid']));
		$title=($mysqli->real_escape_string($_REQUEST['title']));
		$xml=$_REQUEST['guide'];
		$res=$mysqli->query("select * from guides where gid=$gid and editoruid=$userid");
		if ($row=$res->fetch_assoc()){
		  $result['info']="Will update!";
		  // Rename existing auto name file with a date time stamp and save update to autoname
		  $oldtitle=GUIDE_DIR($row['title']);
		  $filename=GUIDE_DIR($row['filename']);
		  $path_parts = pathinfo($filename);
		  $filedir = $path_parts['dirname'];
		  $filenameonly=$path_parts['filename'];
		  if (file_exists($filename)){ 
				//trace(filemtime($filename));
				$verdir = $filedir.'/Versions';
				if (!file_exists($verdir))
				{
				  mkdir($verdir);
				}
				$revname=$verdir.'/'.$filenameonly.' Backup_Version-'.date('Y-m-d-H-i-s',filemtime($filename)).'.xml';
				rename($filename, $revname);
				if ($title!="" && $title != $oldtitle)
				{
					$sql="update guides set title='".$mysqli->real_escape_string($title)."' where gid = $gid";
					$res=$mysqli->query($sql);
				}
			}
			trace('saving to '.$filename);
			file_put_contents($filename,$xml);
		}
		else
			$err="No permission to update this guide";
		break;

	case 'guidesaveas':
		// Saving XML to new record. if gid > 0 we're cloning. if = 0 we've got a new guide.
		$oldgid=intval($mysqli->real_escape_string($_REQUEST['gid']));
		$title=($mysqli->real_escape_string($_REQUEST['title']));
		$xml=$_REQUEST['guide'];
		$res=$mysqli->query("select * from guides where gid=$oldgid");
		if ($row=$res->fetch_assoc())
		{ 
			if ($title=="") $title = $row['title'];
		} 
		trace($oldgid);
		// Create new entry in guide table including a reference to the cloned guide.
		$sql="insert into guides (title,editoruid,clonedfromgid) values ('".$mysqli->real_escape_string($title)."', ".$userid.",".$oldgid.")";
		if ($res=$mysqli->query($sql)){
			// Save as content to new folder owned by editor
			$newgid=$mysqli->insert_id;
			$newdirbase = $userdir.'/guides/'."Guide".$newgid;
			trace($newdirbase);
			$newdir = $newdirbase;
			$newfile = "Guide.xml";
			$newfile = $newdirbase.'/'.$newfile;
			$newlocation=GUIDE_DIR($newfile);
			trace($newlocation);
			mkdir(GUIDE_DIR($newdir));
			$filename=GUIDE_DIR($newfile);
			trace('saving to '.$filename);
			file_put_contents($filename,$xml);
			$sql="update guides set filename='".$mysqli->real_escape_string($newfile)."' where gid = $newgid";
			if ($res=$mysqli->query($sql)){
			}
			//chmod($newlocation,0775);
//			copy($oldlocation,$newlocation) or trace("Error copy");
			$result['url']=$newlocation;
			$result['gid']=$newgid;
		}
		break;

		
/*
	case 'answerfile':
		// INCOMPLETE return XML of answerfile given answer id. No security check currently.
		$aid=intval($mysqli->real_escape_string($_REQUEST['gid']));
		$res=$mysqli->query("select * from answer_files where aid=$aid ");
		if ($row=$res->fetch_assoc()){
			$result['aid']=$row['aid'];
			//$result['editoruid']=$row['editoruid'];
			$result['answers']= $row['xml'];
		}
		else
		{// not found
		}
		break;				
		*/
		

		
		
	default:
		$err="Unknown command";
		break;
}
$result['userid']=$userid;
if($err!="") $result['error']=$err;

$return  = json_encode($result);
echo $return;

function getGuideFileDetails($filename)
{
	$filename=GUIDE_DIR($filename);
	//		file_put_contents($filename,$xml);
	//$xml=simplexml_load_file($filename,null, LIBXML_NOCDATA);
	//trace($xml);
	//$details = $xml->xpath('/description');
	$details="";
	return $details;
}

function GUIDE_DIR($gid)
{
	return GUIDES_DIR.$gid;
	//return GUIDES_DIR.str_pad($gid,8,'0',STR_PAD_LEFT );
}
function listGuides($sql)
{
	global $userid,$mysqli,$result;
	trace($sql);
	if ($userid!=0)
	{
		$res=$mysqli->query($sql);
		while($row=$res->fetch_assoc()){
			$guides[]=array( "id"=> $row['gid'], "title"=> $row['title'],
				"owned"=> $row["editoruid"]==$userid,
				"details"=> getGuideFileDetails( $row['filename'])); 
		  } 
	}
	$result['guides']=$guides;
}




function trace($msg)
{
	global $traces;
	$traces[]=$msg;
}
if (writelog)
{	//log if local only
	ob_start();
	echo "------\nGET\n";var_dump ($_GET);
	echo "------\nFILES\n";var_dump ($_FILES);
	echo "------\nPOST\n";var_dump ($_POST);
	//echo "------\nSERVER\n";var_dump ($_SERVER);
	echo "------\nREQUEST\n";var_dump ($_REQUEST);
	echo "------\nRESULT\n";var_dump ($return);
	echo "------\nTraces\n";var_dump ($traces);
	$msg=ob_get_clean();
	//error_log($msg,3,sys_get_temp_dir().'/CAJA_WS.log');
	file_put_contents(sys_get_temp_dir().'/CAJA_WS.log',$msg);
	
}



?>
