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
	01/2015 add mobile JSON handler -- 08/2016 deprecated and removed
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
require "../../../CONFIG.php";
//check connection
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

	$userid = intval($user->uid);
	$canAuthor = in_array('a2j author', array_values($user->roles));
} else {
	// Running locally, just use demo or devuser (26 ,45 for a2jauthor.org).
	session_start();//  09/05/2013 WARNING! LEAVE session_start() OFF TO ACCESS DRUPAL SESSIONS!
	$userid=LOCAL_USER;
	$canAuthor=true;
}

header("Content-type: text/plain; charset=utf-8");

switch ($command){
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
		error_reporting(E_ALL | E_STRICT);

		$user_dir = (empty($_SESSION['userdir'])) ? '00000' : $_SESSION['userdir'];
		$user_guides_dir = $user_dir . '/guides/';
		$user_guides_path = GUIDES_DIR . $user_guides_dir;

		// place uploaded file in the user's guides folder
		define('UPLOAD_DIR', $user_guides_path);
		define('UPLOAD_URL', $user_guides_path);

		// fail early if there is any error in the $_FILEs['interview'] object
		check_for_upload_errors('interview');

		// 10/03/2013 Upload existing XML/A2J file to a new guide.
		$title = $mysqli->real_escape_string('Untitled uploaded guide');
		$sql = "insert into guides (title, editoruid, archive) values ('{$title}', '{$userid}', 0)";

		if ($res = $mysqli->query($sql)) {
			$new_guide_folder_path = $user_guides_path . "Guide{$mysqli->insert_id}";
			process_uploaded_guide_file($new_guide_folder_path);
		} else {
			fail_and_exit(500, 'Uh-oh, something went wrong saving the guide');
		}

		$new_guide_id = $mysqli->insert_id;
		$new_guide_xml_path = $new_guide_folder_path . '/Guide.xml';
		$xml = file_get_contents($new_guide_xml_path);

		// A2J Guide without the UTF-8 encoding is probably Windows-1252.
		if (stripos($xml, 'encoding="UTF-8"') == FALSE) {
			$xml = iconv('Windows-1252', 'UTF-8', $xml);  // Convert to UTF-8.
			file_put_contents($new_guide_xml_path, $xml);
		}

		// replace the empty guide title with the real one and set the filename
		// column which is the path to Guide.xml relative to the 'userfiles' folder
		$title = $mysqli->real_escape_string(get_guide_title_from_xml($xml));
		$guide_xml_path = $user_guides_dir . "Guide{$new_guide_id}/Guide.xml";
		$sql = "update guides set title='{$title}', filename='{$guide_xml_path}' where gid={$new_guide_id}";

		if ($res = $mysqli->query($sql)) {
			writelognow();
			exit(); // return immediately with upload info.
		} else {
			fail_and_exit(500, 'Uh-oh, something went wrong saving the guide');
		}

		break;

	case 'guidezip':
			$gid=intval($mysqli->real_escape_string($_REQUEST['gid']));
			createGuideZip($gid);
		break;

	case 'guideZIPLHIQA':
	case 'guideZIPTESTCALI':

	// enable below for CodeBug php debugging
	// xdebug_break();

	// 08/10/2015 ZIP guide, POST to LHI, return LHI's result.
	// The zip code is identical to the 'guidezip' handler above. Extra steps are below.
	$gid=intval($mysqli->real_escape_string($_REQUEST['gid']));
	$zipFull = createGuideZip($gid);

		// Once zip is built, proceeed to posting it to the host site, LHI.
		// POST the ZIP file using standard HTTP POST. Server returns a URL to redirect to.
		if ($command=="guideZIPTESTCALI"){
		  $LHI_POST_URL = "http://viewerdev.a2jauthor.org/uploader/A2JFilePUT.php";
		}
		else
		if ($command=="guideZIPLHIQA"){
		  $LHI_POST_URL = "https://rebuildqa.lawhelpinteractive.org/Upload/A2JLoader.aspx?Session=" . $gid;
		}else{
		  $LHI_POST_URL = "https://www.lawhelpinteractive.org/Upload/A2JUpload.aspx"; // LHI production site
		}

		$ch = curl_init($LHI_POST_URL);
		curl_setopt($ch, CURLOPT_POST, true);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER ,true);
		// PHP 5.6 and newer requires CURLOPT_SAFE_UPLOAD set to false
		curl_setopt($ch, CURLOPT_SAFE_UPLOAD, false);
		curl_setopt($ch, CURLOPT_POSTFIELDS, array(
			'file' => '@'. $zipFull
		));
		// because Marlabs is using a self-signed cert we need to tell CURL to just carry on
		// this should be removed in production
		// curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
		$res  = curl_exec($ch);
		if ($res === FALSE) {
		  die(curl_error($ch));
		}
		// Extract strURL markup from  LHI's HTML response and return to caller.
		//var_dump($res);
		//die;
		$tag = "strURL";
		$tagstart=strpos($res,"<$tag>");
		$tagend=strpos($res,"</$tag>",$tagstart);
		if ($tagstart!==false) {
		  $res=trim(substr($res,$tagstart+strlen($tag)+2,$tagend-$tagstart-strlen($tag)-2));
		}
		// $result['url']=$res ;
		$result['url']=$LHI_POST_URL;
		// Caller should open a new window with this URL.
		// The new window is where author completes LHI process completely separate from A2J Author site.
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
			foreach($files as $file) {
				$ext = pathinfo($file, PATHINFO_EXTENSION);

				if (($ext!='') && ($file!=$guideNameOnly) && ($ext!='zip') && in_array($ext, array('xml','gif','png','jpg','mp3','mp4', 'json'))) {
					copy(GUIDES_DIR.$guideDir.'/'.$file,$GuidePublicDir.'/'.$file);
				}
			}

			copy(GUIDES_DIR.$guideName, $GuidePublicDir.'/Guide.xml');
			copy(replace_extension(GUIDES_DIR.$guideName,'json'), $GuidePublicDir.'/Guide.json');//01/14/2015
			file_put_contents($GuidePublicDir . '/templates.json', guide_templates_index_string($row['gid']));

			//http://localhost/caja/userfiles/public/dev/guides/A2JFieldTypes/2014-07-22-14-06-12
			file_put_contents($GuidePublicDir.'/index.php', '<?php header("Location: /app/js/viewer/A2J_Viewer.php?gid=".$_SERVER["REQUEST_URI"]."Guide.xml"); ?>');

			$result['url']=GUIDES_URL.$newSubGuideDir;
			trace($result['url']);
			// Caller will redirect to download the zip.
		}
		break;

	case 'currentuser':
		$result['username'] = ($userid == 45) ? "dev" : $user->name;
		break;

	default:
		$err="Unknown command";
		break;
}

$result['userid']=$userid;
if($err!="") $result['error']=$err;

$return = json_encode($result);
echo $return;


/**********************************************************/
/************** helper functions **************************/
/**********************************************************/


function check_for_upload_errors($upload_name) {
	$upload_errors = [
		1 => 'The uploaded file exceeds the upload_max_filesize',
		2 => 'The uploaded file exceeds the MAX_FILE_SIZE value in the HTML form',
		3 => 'The uploaded file was only partially uploaded',
		4 => 'No file was uploaded',
		6 => 'Missing a temporary folder',
		7 => 'Failed to write file to disk.',
		8 => 'A PHP extension stopped the file upload.',
	];

	$error_code = $_FILES[$upload_name]['error'];
	$error_message = $upload_errors[$error_code];

	switch ($error_code) {
		case UPLOAD_ERR_OK:
			break; //noop

		case UPLOAD_ERR_INI_SIZE:
		case UPLOAD_ERR_FORM_SIZE:
		case UPLOAD_ERR_PARTIAL:
		case UPLOAD_ERR_NO_FILE:
			fail_and_exit(400, $error_message);

		case UPLOAD_ERR_NO_TMP_DIR:
		case UPLOAD_ERR_CANT_WRITE:
		case UPLOAD_ERR_EXTENSION:
			fail_and_exit(500, $error_message);

		default:
			fail_and_exit(500, 'Unknown upload error');
	}
}

function cleanup_failed_guide_upload() {
	global $mysqli;

	$new_guide_id = $mysqli->insert_id;
	$new_guide_dir = UPLOAD_DIR . "Guide{$new_guide_id}/";

	$mysqli->query("DELETE FROM guides WHERE gid='{$new_guide_id}'");

	if (is_dir($new_guide_dir)) {
		delete_directory($new_guide_dir);
	}
}

function process_uploaded_guide_file($destination_path) {
	global $mysqli;

	$file_data = $_FILES['interview'];
	$temp_file_path = $file_data['tmp_name'];
	$mime_type = mime_content_type($temp_file_path);

	if ($mime_type == 'application/zip') {
		unzip($temp_file_path, $destination_path);
		find_guide_file_and_rename($destination_path);
	} else {
		$filename = $file_data['name'];

		if (has_a2j_or_xml_ext($filename) == TRUE) {
			mkdir($destination_path);
			move_uploaded_file($temp_file_path, $destination_path . '/Guide.xml');
		} else {
			cleanup_failed_guide_upload();
			fail_and_exit(422, "No valid .a2j or .xml file was provided");
		}
	}
}

function find_guide_file_and_rename($path) {
	global $mysqli;

	$possible_xml_files = array("interview.xml", "guide.xml");

	if (($files = scandir($path)) != FALSE) {
		$guide_files = array_map("strtolower", array_filter($files, "is_valid_guide_file"));

		if (count($guide_files) === 0) {
			cleanup_failed_guide_upload();
			fail_and_exit(422, "No valid .a2j or .xml file was found in the .zip file");
		}

		if (count($guide_files) > 1) {
			cleanup_failed_guide_upload();

			// zip contains both an interview.xml and guide.xml
			if (count(array_intersect($possible_xml_files, $guide_files)) === 2) {
				fail_and_exit(422, "The .zip file cannot contain both an interview.xml and guide.xml");
			}

			// zip contains multiple .a2j files
			if (count(array_filter($guide_files, "has_a2j_ext")) > 1) {
				fail_and_exit(422, "The .zip file cannot contain multiple .a2j files");
			}

			fail_and_exit(422, "The .zip cannot contain both an interview.xml or guide.xml and an .a2j file");
		}

		// rename the found guide file to Guide.xml
		$guide_file_path = $path . "/" . array_values($guide_files)[0];
		rename($guide_file_path, $path . "/Guide.xml");
	} else {
		cleanup_failed_guide_upload();
		fail_and_exit(422, "Unable to open .zip file");
	}
}

function get_guide_title_from_xml($xml) {
	$guide_xml = new SimpleXMLElement($xml);

	$result = $guide_xml->TITLE; // A2J 4 format

	// A2J 5 would be $guide_xml->INFO->TITLE;
	if ($result == '') {
		$result = $guide_xml->INFO->TITLE;
	}

	return $result;
}

function fail_and_exit($http_code, $message) {
	http_response_code($http_code);
	header('Content-type: application/json');

	$response = [
		"error" => [ "code" => $http_code, "message" => $message ]
	];

	echo json_encode($response);
	exit();
}

/**
 * Checks if the filename extension starts with a2j
 */
function has_a2j_ext($file) {
	$ext = pathinfo($file, PATHINFO_EXTENSION);
	return (($ext != "") && (strpos($ext, "a2j") === 0));
}

function has_a2j_or_xml_ext($file) {
	return (has_a2j_ext($file) || $ext == "xml");
}

/**
 * Given a filename will check if file is a valid guide definition file
 *
 * Any file with an extension that starts with `a2j` is valid or a file named
 * `interview.xml` or `guide.xml`; the casing is not relevant since the function
 * will lowercase the filename before the comparison.
 */
function is_valid_guide_file($file) {
	$filename = strtolower($file);

	return has_a2j_ext($filename) ||
		($filename == "interview.xml" || $filename == "guide.xml");
}

/**
 * Extracts the zip archive content to the indicated destination
 *
 * Returns the folder name of the unzipped archive
 * **This code assumes the archive will contain a root folder**
 */
function unzip($zip_path, $destination) {
	$zip = new ZipArchive;

	if ($zip->open($zip_path) === TRUE) {
		$foldername = $zip->getNameIndex(0);
		$zip->extractTo($destination);
		$zip->close();
	} else {
		fail_and_exit(400, 'Unable to open .zip file');
	}
}

/**
 * Creates a zip file of Guide files and resources.
 *
 * Given the `gid` of a Guide Interview, this method will create a zip file
 * of all guide resources, including associated templates, in the local guide folder.
 * If the zip file exists, it will overwrite the current zipped file.
 *
 * @param string gid Guide gid used to query mysql
 * @return string $zipFull the full local path name to the created zip file
 **/

function createGuideZip($gid) {
	global $result, $mysqli, $userid;
	$result['zip']='';
	$res=$mysqli->query("select * from guides where gid=$gid and (isPublic=1  or isFree=1  or editoruid=$userid)");
	if ($row=$res->fetch_assoc())
	{
		$result['gid']=$row['gid'];
		$guideName = $row['filename'];
		$path_parts = pathinfo($guideName);

		$guideDir = $path_parts['dirname'];
		$guideNameOnly = $path_parts['filename'];
		$zip = new ZipArchive();
		$zipNameOnly = 'A2J5 Guide'.$gid.' Archive.zip';
		$zipName = $guideDir.'/'.$zipNameOnly;
		$zipFull = GUIDES_DIR.$zipName;
		$zipRes = $zip->open($zipFull, ZipArchive::CREATE | ZipArchive::OVERWRITE);

		if ($zipRes !== TRUE) {
			trace("cannot open $zipFull");
		} else {
			trace("created $zipFull");
			$zip->addFile(GUIDES_DIR.$guideName,'Guide.xml');

			add_guide_json_file($guideName, $zip);
			$zip->addFromString("templates.json", guide_templates_index_string($gid));

			$files = scandir(GUIDES_DIR.$guideDir);

			// Ideally, scan Guide and only zip files used in the interview.
			// Currently, just add all files in the folder of the guide.
			// $zip->addPattern('/\.(?:jpg|xml|png|gif)$/', GUIDES_DIR.$guideDir);
			foreach($files as $file) {
				$ext = pathinfo($file, PATHINFO_EXTENSION);

				if (($ext != '') && ($file != $guideNameOnly) && ($ext != 'zip')) {
					$filePath = GUIDES_DIR.$guideDir.'/'.$file;
					$zip->addFile($filePath, $file);
				}
			}

			$zip->close();
			$result['zip'] = GUIDES_URL.$guideDir.'/'.$zipNameOnly;
			// Caller will redirect to download the zip.
			return $zipFull;
		}
	}
}

/**
 * Adds the json guide file to provided zip if it exists.
 *
 * Given the guide name and a zip file object, this method will check for the
 * existence of json file matching guide_name in the guide's directory, if the
 * file exists, it will add it to the zip file object as "Guide.json".
 *
 * @param string $guide_name File name of the xml guided interview
 * @param ZIP $zip An opened ZipArchive instance
 * @return void
 */
function add_guide_json_file($guide_name, $zip) {
	$xml_guide_path = GUIDES_DIR . $guide_name;
	$json_guide_path = replace_extension($xml_guide_path, 'json');

	if (file_exists($json_guide_path)) {
		$zip->addFile($json_guide_path, 'Guide.json');
	}
}

/**
 * JSON encoded list of templates that belong to provided guide id.
 *
 * This function reads the user's template index file and if it exists it will
 * filter down the list of templates using the guide_id passed as a parameter,
 * then it will return a json string of that filtered list.
 *
 * @param int $guide_id The numerical id of the guided interview
 * @return string
 */
function guide_templates_index_string($guide_id) {
	$guide_templates_list = [];
	$userdir = $_SESSION['userdir'];
	$user_template_index_path = GUIDES_DIR . $userdir . "/templates.json";

	if (file_exists($user_template_index_path)) {
		$user_template_index_contents = file_get_contents($user_template_index_path);

		// array with objects containing guideId and templateId properties e.g
		// [{ guideId: 5, templateId: 10 }, { guideId: 6, templateId: 11 }]
		$user_template_index_list = json_decode($user_template_index_contents);

		$guide_templates_list = array_filter($user_template_index_list,
			function($ti) use($guide_id) {
				return $ti->guideId == $guide_id;
			}
		);
	}

	return json_encode($guide_templates_list);
}

function getGuideFileDetails($filename) {	// 2014-08-26 Get info about guide
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

function listGuides($sql) {
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


function replace_extension($filename, $new_extension) {
    $info = pathinfo($filename);
    return $info['dirname'] . '/' . $info['filename'] . '.' . $new_extension;
}

function trace($msg) {
	global $traces;
	$traces[]=$msg;
}

function delete_directory($dir) {
	if ($handle = opendir($dir)) {
		while (($file = readdir($handle)) !== false) {
			if ($file != "." && $file != "..") {
				if (is_dir($dir . $file)) {
					if (!@rmdir($dir . $file)) { // Empty directory? Remove it
						delete_directory($dir . $file . '/'); // Not empty? Delete the files inside it
					}
				} else {
					@unlink($dir . $file);
				}
			}
		}
		closedir($handle);
		@rmdir($dir);
	}
}

writelognow();

function writelognow()
{
	// global $return, $traces;
	// if (writelog)
	// {	//log if local only
	// 	ob_start();
	// 	echo "\n\n----------------\n\n";
	// 	echo "GET\n";var_dump ($_GET);
	// 	echo "FILES\n";var_dump ($_FILES);
	// 	echo "POST\n";var_dump ($_POST);
	// 	echo "REQUEST\n";var_dump ($_REQUEST);
	// 	echo "RESULT\n";var_dump ($return);
	// 	echo "Traces\n";var_dump ($traces);
	// 	$msg=ob_get_clean();
	// 	//error_log($msg,3,sys_get_temp_dir().'/CAJA_WS.log');
	// 	file_put_contents(sys_get_temp_dir().'/CAJA_WS.log',$msg,FILE_APPEND);
	// }
}

?>
