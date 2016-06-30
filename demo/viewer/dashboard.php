<?php
  error_reporting(E_ALL);

  // replace spaces and drop zip extension
  $minusDotZip = isset($_FILES['file']['name']) ? pathinfo($_FILES['file']['name'], PATHINFO_FILENAME) : '';
  $hyphenatedZipFileName = strtolower(str_replace(" ","-", $minusDotZip));
  // set uniq Id and path for guides
  $guideId = uniqid() . '-' . $hyphenatedZipFileName;
  $guidesPath = '../guides/';
  // grab temp zip file
  $tempZipFilePath = isset($_FILES['file']['tmp_name']) ? $_FILES['file']['tmp_name'] : '';

  function removeDirectoryAndContents($path) {
    $files = glob($path . '/*');

    foreach ($files as $file) {
      unlink($file);
    }

    rmdir($path);

    header("Location: dashboard.php");
  }

  // 'routes' based on GET or zip file being present
  $getSent = isset($_GET['delete']) ? $_GET['delete'] : '';
  if ($getSent !== '') {
    // Recommended best practice to protect against code injection
    parse_str($_SERVER['QUERY_STRING'], $urlParams);
    $idToRemove = $urlParams['delete'];

    removeDirectoryAndContents($guidesPath . '/' . $idToRemove);
  }

  if ($tempZipFilePath !== '') {
    $zip = new ZipArchive;
    $opened = $zip->open($tempZipFilePath);
    if ($opened === TRUE) {
      $extractPath = $guidesPath . '/' . $guideId;
      // check for proper file structure
      if($zip->getFromName('Guide.json')) {
        $extracted = $zip->extractTo($extractPath);
      } else {
        echo '<h4>Badly formatted .zip file, please choose another.</h4>';
      }

      $zip->close();
    }

    // generate viewer link with proper query params
    $xmlGuideUrl = 'index.html?templateURL=../guides/'.$guideId.'/Guide.xml&fileDataURL=../guides/'.$guideId;

    // redirect and launch newly uploaded guide
    if ($extracted) {
      header("Location: " . $xmlGuideUrl);
      exit();
    }
  }
?>

<!-- Create a clickable list of all guides, launching the guide/viewer -->

<h3>Current Guide List</h3>
<ul>
  <?php foreach (glob('../guides/*', GLOB_ONLYDIR) as $directoryName) : ?>
    <?php $viewerUrl = 'index.html?templateURL=../guides/'. $directoryName .'/Guide.xml&fileDataURL=../guides/'. $directoryName; ?>
    <li>
      <a href="?delete=<?php echo $directoryName; ?>">[Delete]</a>
      <a href="<?php echo $viewerUrl; ?>">
        <?php echo basename($directoryName); ?>
     </a>
    </li>
  <?php endforeach; ?>
</ul>

<!-- Form for uploading/posting guides -->
<h3>Upload New Guide</h3>
<p>Choose a .zip file exported from the A2J Author:</p>
<form action="dashboard.php" method="post" target="_self" enctype="multipart/form-data">
  <input type="file" name="file" accept=".zip">
  <input type="submit" value="Upload">
</form>
