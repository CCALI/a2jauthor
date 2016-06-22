<!-- This script scans the directory, ignoring non-folder files -->
<?php

$guide_name = str_replace(" ","_",$_FILES['file']['name']);
$temp_zip_file_location = $_FILES['file']['tmp_name'];
$guide_id = uniqid();

// since empty string above gives root folder, add data folder to path
$path_to_data_folder = pathinfo(realpath(''), PATHINFO_DIRNAME) . '/guides/';

if ($_GET['delete']) {
  parse_str($_SERVER['QUERY_STRING'], $urlparams);
  $id_to_remove = $urlparams['delete'];

  function removeDirectory($path) {
    $files = glob($path . '/*');

    foreach ($files as $file) {
      is_dir($file) ? removeDirectory($file) : unlink($file);
    }

    rmdir($path);
    return;
  }
  // if id matches expected length, remove, otherwise skip - securitay?
  if (mb_strlen($id_to_remove) === 13) {
    removeDirectory($path_to_data_folder . '/' . $id_to_remove);
  }
}

if ($temp_zip_file_location !="") {
  echo '<h5>Loading A2J Viewer</h5>';
  $zipfile = $temp_zip_file_location;

  $zip = new ZipArchive;
  $res = $zip->open($zipfile);
  if ($res === TRUE) {
    $old_folder_name = trim($zip->getNameIndex(0), '/');
    // extract it to the path we determined above
    $zip->extractTo($path_to_data_folder);
    $zip->close();
  }

  // renaming the folder name to uniq id allows for uploading of same guide file
  rename($path_to_data_folder . '/' . $old_folder_name, $path_to_data_folder . '/' . $guide_id);
  // open newly uploaded Guide
  $xml_guide_url = 'index.html?templateURL=../guides/'.$guide_id.'/Guide.xml&fileDataURL=../guides/'.$guide_id;
  // redirect and launch newly uploaded guide
  echo "<script>window.location = `{$xml_guide_url}`</script>";

}

error_reporting(E_ALL);

// Sort in ascending order - this is default
$dir_only = array();

foreach (glob('../guides/*', GLOB_ONLYDIR) as $keep) {
  $dir_only[] = basename($keep);  // truncates file url to only folder name
}

?>

<!-- Create a clickable list of all guides, launching the guide/viewer -->

<h3>Current Guide List</h3>
<ul id="guideList">
  <?php foreach ($dir_only as $index => $directoryName) : ?>
    <?php $viewerUrl = 'index.html?templateURL=../guides/'.$directoryName.'/Guide.xml&fileDataURL=../guides/'.$directoryName; ?>
    <li>
      <a href="?delete=<?php echo $directoryName; ?>">[Delete]</a>
      <a id="<?php echo $directoryName; ?>" href="<?php echo $viewerUrl; ?>">
        <?php echo $directoryName; ?>
     </a>
    </li>
  <?php endforeach; ?>
</ul>

<!-- Form for uploading/posting guides -->

<form enctype="multipart/form-data" action="dashboard.php" method="post" target="_self">
  <label for="POST-guide">Select Guide to Upload:</label>
  <p>
    <input type="file" name="file" accept=".zip">
  </p>
  <div>
   <input type="submit" value="Send">
  </div>
</form>
