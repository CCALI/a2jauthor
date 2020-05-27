# CAJA App Suite 7.0 Install Notes:

## Structure
cali/
  config.json -> single config file used by Node/DAT and a2jauthor/CAJA_WS.php
  config_envi.ini -> keys for a2j.org
  ecosystem.config.js -> PM2 config file to handle DAT instance/clusters
  - a2jauthor/ -> author app
  - a2jdat/    -> document assembly tool/Node app for text templates
  - a2jdeps/   -> shared dependencies w/ a2jauthor, a2jviewer, a2jdat
  - a2jstyles/ -> shared styles w/ a2jauthor, a2jviewer, a2jdeps
  - a2jviewer/ -> viewer app
  - userfiles/ -> parent directory of guide files (ex. /userfiles/dev/guides/Guide610/Guide.xml)

## Install
install order: a2jstyles -> a2jdeps -> a2jdat -> a2jauthor -> a2jviewer

### Parent directory
Create a parent director for the apps/config files (for example, in your Sites folder)
mkdir cali
cd cali

### a2jstyles
git clone git@github.com:CCALI/a2jstyles.git
npm install (should only have bootstrap@3)
cd ..

### a2jdeps
git clone git@github.com:CCALI/a2jdeps.git
npm install
cd ..


### a2jdat
(--single-branch is needed until `develop` branch becomes main)
git clone --single-branch --branch develop git@github.com:CCALI/A2JDAT.git a2jdat
npm install
npm run build
npm run build:server
su - a2jprod
pm2 start /vol/data/sites/hydra.a2jauthor.org/ecosystem.config.js (current port 3003)
exit (log out as a2jprod)
cd ..

### a2jauthor
git clone git@github.com:CCALI/a2jauthor.git
npm install
npm run build
mv index.html index.dev.html
mv index.production.html index.html
cd ..

### a2jviewer
(--single-branch is needed until `develop` branch becomes main)
git clone --single-branch --branch develop git@github.com:CCALI/A2JViewer.git a2jviewer
npm install
npm run build
mv index.html index.dev.html
mv index.production.html index.html


## Load Apps
Author
https://hydra.a2jauthor.org/a2jauthor

Viewer
https://hydra.a2jauthor.org/a2jviewer

both should use PORT 3003 for DAT
