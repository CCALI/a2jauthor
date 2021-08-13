<?php
/*
	CALI Author 7 / A2J Author 7 (CAJA) * Justice * justicia * 正义 * công lý * 사법 * правосудие
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

require_once "vendor/Requests/library/Requests.php";
Requests::register_autoloader();

define('DATE_FORMAT',	  'Y-m-d-H-i-s'); // date stamp for file names
define('DATE_FORMAT_UI', 'Y-m-d H:i:s'); // date stamp for human reading

$command=$_REQUEST['cmd'];
$result=array();
$err="";
$mysqli="";
$drupaldb="";
$isProductionServer=TRUE;

if (file_exists("../CONFIG.php")) { // legacy php config file for Author
	require "../CONFIG.php";
} else { // unified config.json file for Author/DB/DAT config settings
	$config = file_get_contents("../config.json");
	$config_data = json_decode($config);
	// define local vars from config.json
	$isProductionServer = $config_data->isProductionServer;
	define("LOCAL_USER", $config_data->LOCAL_USER);
	define("GUIDES_DIR", $config_data->GUIDES_DIR);
	define("GUIDES_URL", $config_data->GUIDES_URL);
}


date_default_timezone_set("America/Chicago");

if ($isProductionServer) {
	define('D7_DB_HOST', $config_data->D7_DB_HOST);
	define('D7_DB_NAME', $config_data->D7_DB_NAME);
	define('D7_DB_USER', $config_data->D7_DB_USER);
	define('D7_DB_PASSWORD', $config_data->D7_DB_PASSWORD);
	define("DRUPAL_ROOT_DIR", $config_data->DRUPAL_ROOT_DIR);

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
	$user_email = intval($user->email);
	$canAuthor = in_array('a2j author', array_values($user->roles));
} else {
	// Running locally, just use demo or devuser (26 ,45 for a2jauthor.org).
	session_start();//  09/05/2013 WARNING! LEAVE session_start() OFF TO ACCESS DRUPAL SESSIONS!
	$userid=LOCAL_USER;
	$canAuthor=true;
	$user_email = 'dev@localhost';
}

header("Content-type: text/plain; charset=utf-8");

$return = file_get_contents(
	$config_data->url . $_SERVER['REQUEST_URI'] . '&userid=' . $userid);

echo $return;
