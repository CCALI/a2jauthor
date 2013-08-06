<?php
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
session_start();
require "../CONFIG.php";
$gid=intval($mysqli->real_escape_string($_REQUEST['gid']));
$res=$mysqli->query("select * from guides where gid=$gid and editoruid=$userid");
if ($row=$res->fetch_assoc()){
	$result['info']="OK";
	$filename=$row['filename'];
	$path_parts = pathinfo($filename);
	$filedir =  $path_parts['dirname'];
	define(UPLOAD_DIR, GUIDES_DIR.$filedir.'/');
	define(UPLOAD_URL, GUIDES_URL.$filedir.'/');
}

error_reporting(E_ALL | E_STRICT);
require('UploadHandler.php');
$upload_handler = new UploadHandler();
	
if ( 1 )
{	//log if local only
	ob_start();
	echo "------\nGET\n";var_dump ($_GET);
	echo "------\nFILES\n";var_dump ($_FILES);
	echo "------\nPOST\n";var_dump ($_POST);
	//echo "------\nSERVER\n";var_dump ($_SERVER);
	echo "------\nREQUEST\n";var_dump ($_REQUEST);
	echo "------\nRESULT\n";var_dump (UPLOAD_DIR);
	echo "------\nTraces\n";var_dump (UPLOAD_URL);
	$msg=ob_get_clean();
	file_put_contents(sys_get_temp_dir().'/Uploader.log',$msg);
	
}