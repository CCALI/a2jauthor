ConfigFileReadMe.md

The two config files, config.json and CONFIG.php are to be placed at the root
directory of the A2J app.  For example:

webroot
  |
  |-- CALI
      |-- app
      |-- userfiles
      |-- config.json
      |-- CONFIG.php

  The config.json is used by the Document Assembly API served by
  NodeJS and the CONFIG.php file is used by A2J Author app itself.
  It is required in js/author/CAJA_WS.php.  Update the sample files
  with your settings, found in the resources folder, and move them
  to the root directory that contains the A2J app, as above.

  The `userfiles` folder contains Guide Interviews, sorted by author and then guide numbers.  It's structure should be:

  userfiles
    |
    |-- public (used to store free or publicly accessible guide interviews)
    |
    |-- <author_name> (ex: jfrank)
              |-- guides
                    |-- Guide###
                        |-- templates.json (maps GuideInterview to templates)



