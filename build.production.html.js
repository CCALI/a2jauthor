
const fs = require('fs')

const version = Date.now()
const html = template(version)

function template (version) {
  return `<!DOCTYPE HTML>
  <!--
    A2J Author 7 * Justice * justicia * 正义 * công lý * 사법 * правосудие
    All Contents Copyright The Center for Computer-Assisted Legal Instruction
    04/15/2013
    2016-03-25 5.5.1 Production
  -->
  <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <!-- Favicon Image Support from: https://sympli.io/blog/2017/02/15/heres-everything-you-need-to-know-about-favicons-in-2017/-->
      <link rel="icon" type="image/png" href="favicons/favicon-16x16.png" sizes="16x16">
      <link rel="icon" type="image/png" href="favicons/favicon-32x32.png" sizes="32x32">
      <link rel="icon" type="image/png" href="favicons/favicon-96x96.png" sizes="96x96">

      <!-- Favicon Image Support for Apple (and Android) -->
      <link rel="apple-touch-icon" href="favicons/favicon/iPhone-120x120.png"> <!-- 120px -->
      <link rel="apple-touch-icon" sizes="180x180" href="favicons/iPhone-180x180.png">
      <link rel="apple-touch-icon" sizes="152x152" href="favicons/iPhone-152x152.png">
      <link rel="apple-touch-icon" sizes="167x167" href="favicons/iPhone-167x167.png">

      <title>A2J Author 7</title>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

      <style type="text/css">
        .hidestart { display: none; }
      </style>
    </head>

    <body class="ui-widget-content">
      <div id="author-app"></div>

      <script>
        // ckeditor loads its config file (styles and default plugins) by
        // injecting script tags into the document, without CKEDITOR_BASEPATH
        // being set properly it won't work. Use absolute file path, not relative.
        CKEDITOR_BASEPATH = 'ckeditor/';
        window.less = {async: true, fileSync: true};
      </script>

      <script src=node_modules/steal/steal.production.js?v=${version}" cache-key="v" cache-version="${version}" main="a2jauthor/app"></script>
    </body>
  </html>`
}

fs.writeFileSync(__dirname + '/index.production.html', html, 'utf-8')
