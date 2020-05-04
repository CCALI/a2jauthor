
const fs = require('fs');

const version = Date.now();
const html = template(version);

function template (version) {
  return `<!DOCTYPE HTML>
  <!--
    A2J Author 6 * Justice * justicia * 正义 * công lý * 사법 * правосудие
    All Contents Copyright The Center for Computer-Assisted Legal Instruction
    2012-2015
    A2J Viewer Plugin

    Internal Developer only
    See demo/viewer/viewer.html for Public demo version.
  -->
  <html>
    <head>
      <!-- Favicon Image Support from: https://sympli.io/blog/2017/02/15/heres-everything-you-need-to-know-about-favicons-in-2017/-->
      <link rel="icon" type="image/png" href="../favicons/favicon-16x16.png" sizes="16x16">
      <link rel="icon" type="image/png" href="../favicons/favicon-32x32.png" sizes="32x32">
      <link rel="icon" type="image/png" href="../favicons/favicon-96x96.png" sizes="96x96">

      <!-- Favicon Image Support for Apple (and Android) -->
      <link rel="apple-touch-icon" href="../favicons/iPhone-120x120.png"> <!-- 120px -->
      <link rel="apple-touch-icon" sizes="180x180" href="../favicons/iPhone-180x180.png">
      <link rel="apple-touch-icon" sizes="152x152" href="../favicons/iPhone-152x152.png">
      <link rel="apple-touch-icon" sizes="167x167" href="../favicons/iPhone-167x167.png">

      <title>A2J Viewer</title>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>

    <body>
      <div id="viewer-app"></div>

      <script> window.less = { async: true, useFileCache: true };</script>
      <script>
        localStorage.setItem('a2jConfig', JSON.stringify({
          // path (or url) to the interview XML file
          templateURL: '../../A2JGetInterview.aspx?data=2417^b4e01b9c-4573-4776-b195-cb9490ac0c3b^1c725dd1-8bf6-4dc5-955d-b0cfb94600a5',

          // folder containing images, templates and other assets related to the interview
          fileDataURL: 'http://localhost/54583/Assets/A2J_Modules/New York/Vacate_Judgment_Consumer_Debt_2417/',

          // endpoint to load an answer file at start, used for RESUME
          getDataURL: 'A2JGetData.aspx?data=0^b4e01b9c-4573-4776-b195-cb9490ac0c3b^2417^dcb160b4-7321-44c5-a99a-92d3e3efc1d6',

          // endpoint to save the answer's file and leaves the viewer (its response replaces viewer's frame)
          setDataURL: '../Engine/Index?q=6ick6e1t9CGdhvn+4ZDvkluGkgjfo/WZ9JkfJHXuyVKOBFj8ImxjPEfdygh4isgV7aDXg4hf5pKqRDHkQ/LZh1CBeIp9fuPfDT3jRXSaxrMEcuLrOVKIOfIyu6ceh9gTGkkbNFjDhQ+sLDrKt2jRnDaxpszkvXjFhhgqNtqM9V37wMgJq72zEoRPIUbEjRwHPg6i8g812pzK9gFIRHkVHcVAhM/dWQsqof9bXQ3azmANnQz6yXw1rJ75RpjlJ+KY7UGCwLxu86a5fLHzXWLwbg==',

          // (Optional) ajax endpoit to silently save the answer file periodically
          autoSetDataURL: 'A2J_ViewerAutoSetData.php?data=ExtraData4autoSetDataURL',

          // use to replace the viewer's frame on EXIT (user 'fails' interview)
          exitURL: 'A2J_ViewerExit.html',

          // endpoint to silent log data
          // E.g., https://lawhelpinteractive.org/a2j_logging
          logURL: 'A2J_ViewerLog.php?data=ExtraData4logURL',

          // errRepURL accepts user's public submission of an error to which they can add an optional comment.
          // E.g., 'https://lawhelpinteractive.org/problem_reporting_form'
          errRepURL: 'A2J_ViewerErrRep.php?data=ExtraData4errRepURL'
        }));
      </script>
      <script src="../node_modules/steal/steal.production.js?v=${version}" cache-key="v" cache-version="${version}" main="caja/viewer/app"></script>
    </body>
  </html>`;
}

fs.writeFileSync(__dirname + '/index.production.html', html, 'utf-8');
