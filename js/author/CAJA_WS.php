<?php
/*
	CALI Author 5 / A2J Author 5 (CAJA) * Justice * justicia * 正义 * công lý * 사법 * правосудие
	All Contents Copyright The Center for Computer-Assisted Legal Instruction

	10/05/2012 Simple CAJA Author Web Service API
	A Fuse to handle all a2j author editing stuff
	07/01/2013 HACK to login to demo
	07/15/2013 Directory restructure
	05/2014 Loads author system only if user is logged into Drupal with an 'a2j author' role setting.
	07/2014 Create public versions
	08/2014 add more file details
	01/2015 add mobile JSON handler
	 all guide saves should include a JSON form
	 zip/publish should ensure guide.json also exists for each guide.xml.
*/

define('DATE_FORMAT',	  'Y-m-d-H-i-s'); // date stamp for file names
define('DATE_FORMAT_UI', 'Y-m-d H:i:s'); // date stamp for human reading

$command=$_REQUEST['cmd'];
$result=array();
$err="";
$mysqli="";
$drupaldb="";
require "../CONFIG.php";
// check connection
if (mysqli_connect_errno()) {
  exit('Connect failed: '. mysqli_connect_error());
}

date_default_timezone_set("America/Chicago");
/*
{	// One COULD get user id from Drupal's session cookie then lookup that user in Drupal User table but needs more research.
	//$prefix = ini_get('session.cookie_secure') ? 'SSESS' : 'SESS';
	//session_name($prefix . substr(hash('sha256',".a2jauthor.org"), 0, 32));
	//session_start();
	//var_dump(session_name());
}
*/


if ($isProductionServer) {
	//	09/05/2013 SJG Get Drupal userid from session
	// If user not signed in, userid will be 0.
	chdir(DRUPAL_ROOT_DIR);
	define('DRUPAL_ROOT', getcwd());
	// Require the bootstrap include
	require_once DRUPAL_ROOT . '/includes/bootstrap.inc';
	//Load Drupal
	// Minimum bootstrap to get user's session info is DRUPAL_BOOTSTRAP_SESSION.
	drupal_bootstrap(DRUPAL_BOOTSTRAP_SESSION);
	$userid = $isBitoviServer ? 45 : intval($user->uid);
	$canAuthor = $isBitoviServer ? true : in_array('a2j author', array_values($user->roles));
} else {
	// Running locally, just use demo or devuser (26 ,45 for a2jauthor.org).
	session_start();//  09/05/2013 WARNING! LEAVE session_start() OFF TO ACCESS DRUPAL SESSIONS!
	//$usertest=$_REQUEST['u'];
	//if ($usertest == 'dev') $userid=45;
	$canAuthor=true;
	$userid=LOCAL_USER;
}


header("Content-type: text/plain; charset=utf-8");


switch ($command)
{
	case 'test':
		//var_dump($_SESSION);
		//var_dump($user);
		//var_dump( array_values($user->roles));
		break;


	case 'login':
		$username='';
		$userdir='';

		if ($isProductionServer && !$isBitoviServer) {
			if (($userid>0) && ($canAuthor)) {
				// User logged in to Drupal, get their user id, etc.
				// Can also get Roles here.
				// 03/31/2014  Only A2J Author role permitted to access author.
				$username = $user->name;

				// Get user's A2J user entry.
				$checkuser=$mysqli->query("select * from users where uid=$userid");
				$numrows=$checkuser->num_rows;
				if (!$numrows)
				{	// No entry, create their user file folder and A2J user record.
					mkdir(GUIDES_DIR.$username, 0775);//0700);
					mkdir(GUIDES_DIR.$username.'/guides', 0775);//0700);
					//the next lines do a deep dive into Drupal profiles
					//and will need to be custom to each server install
					//Drupal 6: $nameres=$drupaldb->query("SELECT group_concat(pv.value SEPARATOR ' ') AS fullname from profile_values pv where pv.uid = $userid and pv.fid in (1,2)");
					$nameres=$drupaldb->query("SELECT * from realname where uid = $userid");
					$namerow=$nameres->fetch_assoc();
					$fullname=$namerow['realname'];
					//end Drupal profile stuff
					$mysqli->query("insert into users (uid, username,   nickname, folder) values ($userid, '$username',   '$fullname', '$username')");
					$checkuser=$mysqli->query("select * from users where uid=$userid");
				}
				$userrow=$checkuser->fetch_assoc();
				$result['nickname']=$userrow['nickname'];
				$userdir=$userrow['folder'];
			} else {
				$userid=0;
			}
		} else {
			$username='DEV';
			$result['nickname']='Dev User';
			$userdir='dev';
		}

		$result['userid']=$userid;
		$result['username']=$username;
		$result['userdir']=$userdir;
		$_SESSION['userdir']=$userdir;
		break;


	case 'logout':
		// do logout, clear seession user id
		$userid=0;
		$result['userid']=$userid;
		$_SESSION['userid']=$userid;
		break;


	case 'guides':
		// list of free, public or user owned guides
		listGuides("select * from guides where archive=0 and (isPublic=1 or isFree=1  or (editoruid=$userid)) order by (editoruid=$userid) desc, title asc ");
		break;
	case 'guidessys':
		//array scandir ( string $directory [, int $sorting_order = SCANDIR_SORT_ASCENDING [, resource $context ]] )
		break;

	case 'guides/owned':
		// list of user owned guides
		listGuides("select * from guides where archive=0 and (editoruid=$userid) order by title asc");
		break;

	case 'guides/owned/archive':
		// list of user owned guides that were archived
		listGuides("select * from guides where archive=1 and (editoruid=$userid) order by title asc");
		break;

	case 'guide':
		// return XML of guide if it's public, free or user owned.
		$gid=intval($mysqli->real_escape_string($_REQUEST['gid']));
		$res=$mysqli->query("select * from guides where gid=$gid   and (isPublic=1  or isFree=1  or editoruid=$userid)");
		if ($row=$res->fetch_assoc())
		{
			$result['gid']=$row['gid'];
			$result['editoruid']=$row['editoruid'];
			$result['guide']= file_get_contents(GUIDES_DIR.$row['filename'],TRUE);
			//scandir()
			trace(GUIDES_DIR.$row['filename']);
			// 11/26/2013 Include guide's path so we can access local files.
			$result['path']=GUIDES_URL.$row['filename'];
		}
		else
		{// not found
		}
		break;

	case 'answerset':
		// 4/29/2014 INCOMPLETE return XML of answerfile given answer id. No security check currently.
		$gid=intval($mysqli->real_escape_string($_REQUEST['gid']));
		//$aid=intval($mysqli->real_escape_string($_REQUEST['aid']));
		$res=$mysqli->query("select * from guides where gid=$gid   and (isPublic=1  or isFree=1  or editoruid=$userid)");
		if ($row=$res->fetch_assoc())
		{
			$result['gid']=$row['gid'];
			$result['editoruid']=$row['editoruid'];
			$guideName = $row['filename'];
			$path_parts = pathinfo($guideName);
			$guideDir = $path_parts['dirname'];
			$guideNameOnly = $path_parts['filename'];
			$answerset=GUIDES_DIR.$guideDir.'/answerset.anx';
			$result['answerset']= file_get_contents($answerset,TRUE);
			// 11/26/2013 Include guide's path so we can access local files.
			//$result['path']=GUIDES_URL.$row['filename'];
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
		$json=$_REQUEST['json'];//01/14/2015

		$res=$mysqli->query("select * from guides where gid=$gid and editoruid=$userid");
		if ($row=$res->fetch_assoc()){
		  $result['info']="Will update!";
		  // Rename existing auto name file with a date time stamp and save update to autoname
		  $oldtitle=GUIDES_DIR.$row['title'];
		  $filename=GUIDES_DIR.$row['filename'];
		  $path_parts = pathinfo($filename);
		  $filedir = $path_parts['dirname'];
		  $filenameonly=$path_parts['filename'];
		  if (file_exists($filename))
		  {
				//trace(filemtime($filename));
				$verdir = $filedir.'/Versions';
				if (!file_exists($verdir))
				{
				  mkdir($verdir);
				}
				$revname=$verdir.'/'.$filenameonly.' Version_'.date(DATE_FORMAT,filemtime($filename)).'.xml';
				rename($filename, $revname);
				if ($title!="" && $title != $oldtitle)
				{
					$sql="update guides set title='".$mysqli->real_escape_string($title)."' where gid = $gid";
					$res=$mysqli->query($sql);
				}
			}
			trace('saving to '.$filename);
			file_put_contents($filename,$xml);
			file_put_contents(replace_extension($filename,'json'),$json);//01/14/2015
		}
		else
			$err="No permission to update this guide";
		break;

	case 'guidearchive':
		// 2014-08-26 archive the guide (only if user matches guide's editor
		// Archive bit is set in table row, files are NOT removed.
		$gid=intval($mysqli->real_escape_string($_REQUEST['gid']));
		$title=($mysqli->real_escape_string($_REQUEST['title']));
		$res=$mysqli->query("select * from guides where gid=$gid and editoruid=$userid");
		if ($row=$res->fetch_assoc())
		{
			$result['info']="Will archive!";
			$sql="update guides set archive=1 where gid=$gid";
			if ($res=$mysqli->query($sql))
			{
			}
		}
		else
			$err="No permission to archive this guide";
		break;


	case 'answersetsave':
		// 4/29/2014 Save answerset into guide's folder. overwrite anything else.
		$gid=intval($mysqli->real_escape_string($_REQUEST['gid']));
		$res=$mysqli->query("select * from guides where gid=$gid   and (isPublic=1  or isFree=1  or editoruid=$userid)");
		$xml=$_REQUEST['answerset'];
		if ($row=$res->fetch_assoc())
		{
			$result['info']="Will update!";
			$result['gid']=$row['gid'];
			$result['editoruid']=$row['editoruid'];
			$guideName = GUIDES_DIR.$row['filename'];
			$path_parts = pathinfo($guideName);
			$guideDir = $path_parts['dirname'];
			$filename=$guideDir.'/answerset.anx';
			if (file_exists($filename))
			{
				$verdir = $guideDir.'/Versions_Answersets';
				if (!file_exists($verdir))
				{
					mkdir($verdir);
				}
				$revname=$verdir.'/answerset Version_'.date(DATE_FORMAT,filemtime($filename)).'.anx';
				trace("renaming $filename to $revname");
				rename($filename, $revname);
			}

			trace('saving to '.$filename);
			file_put_contents($filename,$xml);
		}
		else
		{// not found
			$err="No permission to update this answerset";
		}
		break;



	case 'guidesaveas':
		// Saving XML to new record. if gid > 0 we're cloning. if = 0 we've got a new guide.
		$oldgid=intval($mysqli->real_escape_string($_REQUEST['gid']));
		$title=($mysqli->real_escape_string($_REQUEST['title']));
		$xml=$_REQUEST['guide'];
		$json=$_REQUEST['json'];//01/14/2015
		$res=$mysqli->query("select * from guides where gid=$oldgid");
		if ($row=$res->fetch_assoc())
		{
			if ($title=="") $title = $row['title'];
		}
		//trace($oldgid);
		// Create new entry in guide table including a reference to the cloned guide.
		$sql="insert into guides (title,editoruid,clonedfromgid) values ('".$mysqli->real_escape_string($title)."', ".$userid.",".$oldgid.")";
		if ($res=$mysqli->query($sql))
		{
			// Save as content to new folder owned by editor
			$newgid=$mysqli->insert_id;

			$userdir=$_SESSION['userdir'];if (!isset($userdir))$userdir='00000';
			$newdirbase = $userdir.'/guides/'."Guide".$newgid;
			//trace($newdirbase);
			$newdir = $newdirbase;
			$newfile = "Guide.xml";
			$newfile = $newdirbase.'/'.$newfile;
			$newlocation=GUIDES_DIR.$newfile;
			//trace($newlocation);
			mkdir(GUIDES_DIR.$newdir);
			$filename=GUIDES_DIR.$newfile;
			//trace('saving to '.$filename);
			file_put_contents($filename,$xml);
			file_put_contents(replace_extension($filename,'json'),$json);//01/14/2015
			$sql="update guides set filename='".$mysqli->real_escape_string($newfile)."' where gid = $newgid";
			if ($res=$mysqli->query($sql))
			{
			}
			chmod($newlocation,0775);
			//copy($oldlocation,$newlocation) or trace("Error copy");
			$result['url']=$newlocation;
			$result['gid']=$newgid;
		}
		break;



	case 'uploadfile':
		/*
		 * jQuery File Upload Plugin PHP Example 5.14
		 * https://github.com/blueimp/jQuery-File-Upload
		 *
		 * Copyright 2010, Sebastian Tschan
		 * https://blueimp.net
		 *
		 * Licensed under the MIT license:
		 * http://www.opensource.org/licenses/MIT
		 */

		// 07/2013 SJG - setup to save to user's guide's folder only.

		$gid=intval($mysqli->real_escape_string($_REQUEST['gid']));
		$res=$mysqli->query("select * from guides where gid=$gid and editoruid=$userid");
		if ($row=$res->fetch_assoc())
		{
			$result['info']="OK";
			$filename=$row['filename'];
			$path_parts = pathinfo($filename);
			$filedir =  $path_parts['dirname'];
			define('UPLOAD_DIR', GUIDES_DIR.$filedir.'/');
			define('UPLOAD_URL', GUIDES_URL.$filedir.'/');
			error_reporting(E_ALL | E_STRICT);
			include('UploadHandler.php');
			$upload_handler = new UploadHandler();
			exit();//Return immediately with upload info.
		}
		break;


	case 'uploadguide':
		// 10/03/2013 Upload existing XML/A2J file to a new guide.
		$title=($mysqli->real_escape_string('Untitled uploaded guide'));
		// Create new entry in guide table.
		$sql="insert into guides (title,editoruid) values ('".$mysqli->real_escape_string($title)."', ".$userid.")";
		if ($res=$mysqli->query($sql))
		{
			$newgid=$mysqli->insert_id;
			$userdir=$_SESSION['userdir'];if (!isset($userdir)) $userdir='00000';
			$newdirbase = $userdir.'/guides/'."Guide".$newgid;
			$newdir = $newdirbase;
			$guideName="Guide.xml";
			$newfile = $newdirbase.'/'.$guideName;
			$newlocation=GUIDES_DIR.$newfile;
			mkdir(GUIDES_DIR.$newdir);
			$filename=$newfile;
			$path_parts = pathinfo($filename);
			$filedir =  $path_parts['dirname'];
			$_FILES['files']['name'][0]=$guideName;
			define('UPLOAD_DIR', GUIDES_DIR.$filedir.'/');
			define('UPLOAD_URL', GUIDES_URL.$filedir.'/');
			error_reporting(E_ALL | E_STRICT);
			include('UploadHandler.php');
			$upload_handler = new UploadHandler();
			$sql="update guides set filename='".$mysqli->real_escape_string($newfile)."' where gid = $newgid";
			if ($res=$mysqli->query($sql)){}
			// Extract title from uploaded XML.
			$xml=file_get_contents($newlocation);

			if (stripos($xml,'encoding="UTF-8"')==FALSE)
			{	// A2J Guide without the UTF-8 encoding is probably Windows-1252.
				// Convert to UTF-8.
				$xml = iconv('Windows-1252','UTF-8',$xml);
				file_put_contents($newlocation,$xml);
			}

			$guideXML = new SimpleXMLElement($xml);
			$title = $guideXML->TITLE;//A2J 4 format
			if ($title=='')
				// A2J 5 would be $guideXML->INFO->TITLE;
				$title= $guideXML->INFO->TITLE;
			$sql="update guides set title='".$mysqli->real_escape_string($title)."' where gid = $newgid";
			if ($res=$mysqli->query($sql)){}
			chmod($newlocation,0775);
			//copy($oldlocation,$newlocation) or trace("Error copy");
			//$result['url']=$newlocation;
			//$result['gid']=$newgid;
			writelognow();
			exit();//Return immediately with upload info.
		}
		break;




	 case 'guidezip':
		// 01/08/2014 Zip guide XML and attached files.
		// Security Warning: Zip file is available to all users knowing the URL.
		// Improvement: ZIP on demand rather than via AJAX and then loading a static file?
		$result['zip']='';
	 	$gid=intval($mysqli->real_escape_string($_REQUEST['gid']));
		$res=$mysqli->query("select * from guides where gid=$gid and (isPublic=1  or isFree=1  or editoruid=$userid)");
		if ($row=$res->fetch_assoc())
		{
			$result['gid']=$row['gid'];
			$guideName = $row['filename'];
			$path_parts = pathinfo($guideName);
			$guideDir = $path_parts['dirname'];
			$guideNameOnly = $path_parts['filename'];
			$zip  = new ZipArchive();
			$zipNameOnly = 'A2J5 Guide'.$gid.' Archive'./*' '.date(DATE_FORMAT).*/'.zip';
			$zipName = $guideDir.'/'.$zipNameOnly;
			$zipFull = GUIDES_DIR.$zipName;
			if ($zip->open($zipFull,ZipArchive::OVERWRITE)!==TRUE)
			{
				trace("cannot open $zipFull");
			}
			else
			{
				trace("created $zipFull");
				$zip->addFile(GUIDES_DIR.$guideName,'Guide.xml');
				$zip->addFile(replace_extension(GUIDES_DIR.$guideName,'json'),'Guide.json');

				$files = scandir(GUIDES_DIR.$guideDir);
				// Ideally, scan Guide and only zip files used in the interview.
				// Currently, just add all files in the folder of the guide.
				//$zip->addPattern('/\.(?:jpg|xml|png|gif)$/', GUIDES_DIR.$guideDir);
				foreach($files as $file)
				{
					$ext = pathinfo($file,PATHINFO_EXTENSION);
					if( ($ext!='') && ($file!=$guideNameOnly) AND ($ext!='zip'))
					{
						$zip->addFile(GUIDES_DIR.$guideDir.'/'.$file,$file);
					}
				}
				$zip->close();
				$result['zip']=GUIDES_URL.$guideDir.'/'.$zipNameOnly;
				// Caller will redirect to download the zip.
			}
		}
		break;

	case 'guidepublish':
		//### Publish specified existing guide to custom unique public folder.
	 	$oldgid=intval($mysqli->real_escape_string($_REQUEST['gid']));
		$res=$mysqli->query("select * from guides where gid=$oldgid  and (isPublic=1  or isFree=1  or editoruid=$userid)");
		trace('Publishing gid '.$oldgid);

		if ($row=$res->fetch_assoc())
		{
			$result['gid']=$row['gid'];
			$guideName = $row['filename'];
			//trace('Publishing name '.$guideName);
			$path_parts = pathinfo($guideName);
			$guideDir = $path_parts['dirname'];
			$guideNameOnly = $path_parts['filename'];
			$newSubGuideDir = "public/".$guideDir."/".date(DATE_FORMAT);
			$GuidePublicDir =  GUIDES_DIR.$newSubGuideDir;
			trace('Public dir is "'.$GuidePublicDir.'"');
			mkdir($GuidePublicDir,0775,true);
			$files = scandir(GUIDES_DIR.$guideDir);
			//### Ideally, scan Guide and only zip files used in the interview.
			foreach($files as $file)
			{
				$ext = pathinfo($file,PATHINFO_EXTENSION);
				if( ($ext!='') && ($file!=$guideNameOnly) && ($ext!='zip') && in_array($ext,array('xml','gif','png','jpg','mp3','mp4')))
				{
					copy(GUIDES_DIR.$guideDir.'/'.$file,$GuidePublicDir.'/'.$file);
				}
			}
			copy(GUIDES_DIR.$guideName, $GuidePublicDir.'/Guide.xml');
			copy(replace_extension(GUIDES_DIR.$guideName,'json'), $GuidePublicDir.'/Guide.json');//01/14/2015

			//http://localhost/caja/userfiles/public/dev/guides/A2JFieldTypes/2014-07-22-14-06-12
			file_put_contents($GuidePublicDir.'/index.php', '<?php header("Location: /app/js/viewer/A2J_Viewer.php?gid=".$_SERVER["REQUEST_URI"]."Guide.xml"); ?>');

			$result['url']=GUIDES_URL.$newSubGuideDir;
			trace($result['url']);
			// Caller will redirect to download the zip.
		}
		break;



		/*
	case 'guidemobilesave':
		// 01/14/2015 Save json form of guide into guide's folder
		// TODO ensure json is updated for ZIP creation.
		$gid=intval($mysqli->real_escape_string($_REQUEST['gid']));
		$json=$_REQUEST['json'];
		$res=$mysqli->query("select * from guides where gid=$gid and editoruid=$userid");
		if ($row=$res->fetch_assoc()){
		  $result['info']="Will create json!";
		  $filename=GUIDES_DIR.'interview.json';
		  $path_parts = pathinfo($filename);
		  $filedir = $path_parts['dirname'];
		  $filenameonly=$path_parts['filename'];
			trace('saving json to '.$filename);
			file_put_contents($filename,$json);
		}
		else
			$err="No permission to update this guide";
		break;
		*/

  case 'currentuser':
    $result['username']=$user->name;
    break;

	default:
		$err="Unknown command";
		break;
}
$result['userid']=$userid;
if($err!="") $result['error']=$err;

$return  = json_encode($result);
echo $return;



function getGuideFileDetails($filename)
{	// 2014-08-26 Get info about guide
	$filename=GUIDES_DIR.$filename;
	$details="";
	if (file_exists($filename))
	{
		$details = Array();
		$details['modified' ] = date (DATE_FORMAT_UI, filemtime($filename));
		$details['size'] = filesize($filename);
		// Get XML info - XML could be A2J version 4. ignore for now.
		/*($olderr=error_reporting(0);
		$xml = simplexml_load_file($filename);
		error_reporting($olderr);
		if ($xml!=FALSE)
		{
		  $details['pagecount'] = count($xml->PAGES->PAGE);
		  $details['version' ] =  (string)$xml->INFO->VERSION;
			//,'description' => (string) $xml->INFO->DESCRIPTION
		}
		else{
			trace('getGuideFileDetails XML parsing error:'.$filename);

		}
		*/
		//trace('Details:'.$details);
	}
	else
	{
	  //trace('getGuideFileDetails file not found:'.$filename);
	}
	return $details;
}
/*
function GUIDE_DIR($gid)
{
	return GUIDES_DIR.$gid;
	//return GUIDES_DIR.str_pad($gid,8,'0',STR_PAD_LEFT );
}
*/
function listGuides($sql)
{
	global $userid,$mysqli,$result;
	trace($sql);
	if ($userid!=0)
	{
		$res=$mysqli->query($sql);
		while($row=$res->fetch_assoc())
		{
			$guides[]=array(
				"id"=> $row['gid'],
				"title"=> $row['title'],
				"owned"=> $row["editoruid"]==$userid,
				"details"=> getGuideFileDetails( $row['filename']));
		  }
	}
	$result['guides']=$guides;
}


function replace_extension($filename, $new_extension)
{
    $info = pathinfo($filename);
    return $info['dirname'] . '/' . $info['filename'] . '.' . $new_extension;
}

function trace($msg)
{
	global $traces;
	$traces[]=$msg;
}
writelognow();

function writelognow()
{
	global $return, $traces;
	if (writelog)
	{	//log if local only
		ob_start();
		echo "\n\n----------------\n\n";
		echo "GET\n";var_dump ($_GET);
		echo "FILES\n";var_dump ($_FILES);
		echo "POST\n";var_dump ($_POST);
		echo "REQUEST\n";var_dump ($_REQUEST);
		echo "RESULT\n";var_dump ($return);
		echo "Traces\n";var_dump ($traces);
		$msg=ob_get_clean();
		//error_log($msg,3,sys_get_temp_dir().'/CAJA_WS.log');
		file_put_contents(sys_get_temp_dir().'/CAJA_WS.log',$msg,FILE_APPEND);
	}
}



?>
