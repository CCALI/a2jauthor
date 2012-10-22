<?php
// 010/05/2012 Simple CAJA Author Web Service API
// A Fuse to handle all a2j author editing stuff
session_start();
header("Content-type: text/plain; charset=utf-8");

$userid=$_SESSION['userid'];if (!isset($userid))$userid=0;
$userdir=$_SESSION['userdir'];if (!isset($userdir))$userdir=0;
$command=$_REQUEST['cmd'];
$result=array();
$err="";

$mysqli=""; require "../CONFIG.php";
// check connection
if (mysqli_connect_errno()) {
  exit('Connect failed: '. mysqli_connect_error());
}

switch ($command)
{
	case 'login':
		// login user, return name and user id.
		// get user,pass
		$user=$mysqli->real_escape_string($_REQUEST['username']);
		$pass=$mysqli->real_escape_string($_REQUEST['userpass']);
		// look up user/pass
		$res=$mysqli->query("select * from usersbeta where username='$user' and plainpass='$pass'");//HASH the pass! (actually we'll link to Drupal users eventually instead.
		if ($row=$res->fetch_assoc()){
			$result['nickname']=$row['nickname'];
			$userid=$row['uid']; 
			$userdir=$row['folder'];
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
			//usleep(500000);
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
			// rename existing auto name file with a date time stamp and save update to autoname
			$oldtitle=GUIDE_DIR($row['title']);
			$filename=GUIDE_DIR($row['filename']);
			if (file_exists($filename)){
				trace(filemtime($filename));
				$revname=$filename .' Backup_Version-'.date('Y-m-d-H-i-s',filemtime($filename)).'.xml';//implode('/',$revname);
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
			$newdirbase = $userdir.'/'."Guide".$newgid;
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

	case 'guideclone':
		break;//OUTDATED 
		// clone a guide 'gid' (Don't care if borrowing)
		// return new guide's 'gid'
		$gid=intval($mysqli->real_escape_string($_REQUEST['gid']));
		$res=$mysqli->query("select * from guides where gid=$gid");
		if ($row=$res->fetch_assoc()){
			$oldfile = $row['filename'];
			$newfile = basename($oldfile);
			$newdirbase = $userdir.'/'.pathinfo($oldfile,PATHINFO_FILENAME);
			$newdir = $newdirbase;
			$e=0;
			while (file_exists($newdir)){
				$e += 1;
				$newdir=$newdirbase.' '.$e;
			}
			$newfile = $newdirbase.'/'.$newfile;
			trace($newfile);
			
			// clone much of the existing record, copy the files
			$sql="insert into guides (title,filename,editoruid,clonedfromgid) values ('Copy of ".$mysqli->real_escape_string($row['title'])."', '".$mysqli->real_escape_string($newfile)."', ".$userid.",".$gid.")";
			trace($sql);
			if ($res=$mysqli->query($sql)){
				// Clone existing guide and copy guide to a new folder for the editor.
				$newgid=$mysqli->insert_id;
				$result['gid']=$newgid;
				$oldlocation=GUIDE_DIR($oldfile);
				$newlocation=GUIDE_DIR($newfile);
				$result['url']=$newlocation;
				trace($oldlocation);
				trace($newlocation);
				mkdir(GUIDE_DIR($newdir));
				trace("Copy: ".$oldlocation.' to '.$newlocation);
				//chmod($newlocation,0775);
				copy($oldlocation,$newlocation) or trace("Error copy");
			}
		}
		else
			$err="Not found";
		break;
		
	default:
		$err="Unknown command";
		break;
}
$result['userid']=$userid;
if($err!="") $result['error']=$err;

$return  = json_encode($result);
echo $return;

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
			$guides[]=array( "id"=> $row['gid'], "title"=> $row['title'], "owned"=> $row["editoruid"]==$userid); 
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
