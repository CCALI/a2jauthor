<?php
  error_reporting(E_ALL);

  $guideId = uniqid();
  $pathToGuidesFolder = '../guides/';
  $tempZipFileLocation = $_FILES['file']['tmp_name'];
  // truncate zip file string to grab tmp parent directory
  $tempDirectoryLocation = substr($tempZipFileLocation, 0, strrpos($tempZipFileLocation, '/') + 1);

  function removeDirectoryAndContents($path) {
    $files = glob($path . '/*');

    foreach ($files as $file) {
      unlink($file);
    }

    rmdir($path);
  }

  // 'routes' based on GET or zip file present
  if ($_GET['delete']) {
    // Recommended best practice to protect against code injection
    parse_str($_SERVER['QUERY_STRING'], $urlParams);
    $idToRemove = $urlParams['delete'];

    removeDirectoryAndContents($pathToGuidesFolder . '/' . $idToRemove);
  }

  if ($tempZipFileLocation !="") {
    $zip = new ZipArchive;
    $res = $zip->open($tempZipFileLocation);
    if ($res === TRUE) {
      $oldFolderName = trim($zip->getNameIndex(0), '/');

      $zip->extractTo($tempDirectoryLocation);
      $zip->close();
      // error check here for successful extraction before rename/move?
      rename($tempDirectoryLocation . $oldFolderName, $pathToGuidesFolder . $guideId);
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
<ul>
  <?php foreach (glob('../guides/*', GLOB_ONLYDIR) as $directoryName) : ?>
    <?php $viewerUrl = 'index.html?templateURL=../guides/'. $directoryName .'/Guide.xml&fileDataURL=../guides/'. $directoryName; ?>
    <li>
      <a href="?delete=<?php echo $directoryName; ?>">[Delete]</a>
      <a "<?php echo $directoryName; ?>" href="<?php echo $viewerUrl; ?>">
        <?php echo basename($directoryName); ?>
     </a>
    </li>
  <?php endforeach; ?>
</ul>

<!-- Form for uploading/posting guides -->

<form action="dashboard.php" method="post" target="_self" enctype="multipart/form-data">
  <label for="file">Select Guide to Upload:</label>
  <p>
    <input type="file" name="file" accept=".zip">
  </p>
  <input type="submit" value="Send">
</form>
