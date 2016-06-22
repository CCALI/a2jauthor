<?php
  error_reporting(E_ALL);

  $guideId = uniqid();
  $pathToGuidesFolder = '../guides/';
  $tempZipFileLocation = $_FILES['file']['tmp_name'];

  function removeDirectoryAndContents($path) {
    $files = glob($path . '/*');

    foreach ($files as $file) {
      unlink($file);
    }

    rmdir($path);
    return;
  }

  // 'routes' based on GET or zip file present
  if ($_GET['delete']) {
    // Recommended best practice to protect against code injection
    parse_str($_SERVER['QUERY_STRING'], $urlparams);
    $idToRemove = $urlparams['delete'];

    removeDirectoryAndContents($pathToGuidesFolder . '/' . $idToRemove);
  }

  if ($tempZipFileLocation !="") {
    $zip = new ZipArchive;
    $res = $zip->open($tempZipFileLocation);
    if ($res === TRUE) {
      $oldFolderName = trim($zip->getNameIndex(0), '/');

      $zip->extractTo('/Applications/MAMP/tmp/php/');
      $zip->close();

      rename("/Applications/MAMP/tmp/php/" . $oldFolderName, $pathToGuidesFolder . $guideId);
    }

    // generate viewer link with proper query params
    $xmlGuideUrl = 'index.html?templateURL=../guides/'.$guideId.'/Guide.xml&fileDataURL=../guides/'.$guideId;

    // redirect and launch newly uploaded guide
    header("Location: " . $xmlGuideUrl);
    exit();
  }
?>

<!-- Create a clickable list of all guides, launching the guide/viewer -->

<h3>Current Guide List</h3>
<ul id="guideList">
  <?php foreach (glob('../guides/*', GLOB_ONLYDIR) as $directoryName) : ?>
    <?php $viewerUrl = 'index.html?templateURL=../guides/'. $directoryName .'/Guide.xml&fileDataURL=../guides/'. $directoryName; ?>
    <li>
      <a href="?delete=<?php echo $directoryName; ?>">[Delete]</a>
      <a id="<?php echo $directoryName; ?>" href="<?php echo $viewerUrl; ?>">
        <?php echo basename($directoryName); ?>
     </a>
    </li>
  <?php endforeach; ?>
</ul>

<!-- Form for uploading/posting guides -->

<form enctype="multipart/form-data" action="dashboard.php" method="post" target="_self">
  <label for="POST-file">Select Guide to Upload:</label>
  <p>
    <input type="file" name="file" accept=".zip">
  </p>
  <input type="submit" value="Send">
</form>
