[![Build Status](https://travis-ci.com/CCALI/CAJA.svg?token=2eqmqTqtZG7xAzR9G89f&branch=develop)](https://travis-ci.com/CCALI/CAJA)

A2J Author 7.0 (previously know as CAJA)

##### This repo is part of the A2J Author Project which consists of four repos...
##### 1. A2JViewer - https://github.com/CCALI/a2jviewer
##### 2. A2J Author - https://github.com/CCALI/a2jauthor
##### 3. A2J Document Automation Tool - https://github.com/CCALI/a2jdat
##### 4. A2J Dependencies - https://github.com/CCALI/a2jdeps
====

This the public repo for the browser-based versions of A2J Author

# IF YOU ARE ATTEMPTING TO SELF HOST AND RUN THE A2JAUHTOR SUITE IT IS HIGHLY UNLIKELY THAT THIS IS THE REPO YOU ARE LOOKING FOR!!! YOU MOST LIKELY NEED THE A2JVIEWER AND A2J DOCUMENT AUTOMATION TOOL. THIS REPO IS FOR THE AUTHORING TOOL.


## Notes and pre-requisites
Before following the instructions for setup below.  It is assumed that you have npm and nodejs already installed.

- Currently only node 16 is supported. You must have nodejs and npm installed on your system for these instructions to work
- According to John, you cannot run this on Windows machines at all due to the path length limitation of 256 characters.  This is actually a limitation of the Windows API, not the NTFS file system, but it makes it almost impossible to work on reasonably complex javascript projects on Windows.

A2J Author currently requires an *AMP stack (Apache, MySQL, PHP) to be running. For local development on non-linux environments CALI uses MAMP. Make sure to update MAMP's webroot setting to the proper directory. See the [wiki](./wiki/Dev Environment MAMP.md) document for more details on setting up a MAMP environment.

For production, in addition to the above, A2J Author requires a functional drupal 7 environment. A basic installation can be performed by following the directions [here](https://www.drupal.org/docs/7/install/step-1-download-and-extract-drupal)

## To setup:

### wkhtmltopdf

Before installing the server side dependencies, you need to install `wkhtmltopdf`
on your system first, `wkhtmltopdf` is a command line tool that renders HTML into PDF. The
easiest way to do this is to [download](http://wkhtmltopdf.org/downloads.html#stable) a
prebuilt version for your system

Once `wkhtmltopdf` command line tool is available on your system, take note of the path as this will be needed for the config file.

### Setup the database

1.) open mysql and create a user for the app.
`CREATE USER 'a2j'@'localhost' IDENTIFIED BY 'password';`

2.) create the database for the app. This can be any available name. caja is a legacy name.


`CREATE DATABASE caja;`

`FLUSH PRIVILEGES;`

3.) grant all privileges to the above user
`GRANT ALL PRIVILEGES ON caja TO 'a2j'@'localhost' WITH GRANT OPTION;`

`FLUSH PRIVILEGES;`

4.) Seed the db with the command below
`mysql -u a2j -p caja < wiki/resources/caja_default_2021-03-23.sql`


## To build the main application:

1.) clone the repo as a subfolder in the root of the drupal install if this is production or webfolder if this is development.


2.) From the root folder (`a2jauthor/`) run
```
$ npm run deploy
```

## Server setup:

There are two configuration files necessary: `config.json` and `config_env.ini`

### Server Configuration: config.json

In production mode, the server uses a configuration file called `config.json`
that is expected to be in the parent directory of the folder where the git repo
is cloned. A sample is located at wiki/resources/config.json.sample.md. This file should have the following structure:
```
{
  "isProductionServer": true,
  "LOCAL_USER": "45",
  "SERVER_URL": "http://my.server.org/",
  "CAJA_WS_URL": "https:/my.server.org/a2jauthor/CAJA_WS.php",
  "GUIDES_DIR": "/www/my.server.org/a2jauthor/userfiles/",
  "VIEWER_PATH": "/path/to/viewer/a2j-viewer/viewer",
  "GUIDES_URL": "../userfiles/",
  "SQL_HOST": "localhost",
  "SQL_USERNAME": "a2j",
  "SQL_PASSWD": "PASSWD",
  "SQL_DBNAME": "caja",
  "SQL_PORT": 3356,
  "DRUPAL_HOST": "localhost",
  "DRUPAL_USERNAME": "DRUPAL USERNAME",
  "DRUPAL_PASSWD": "DRUPAL PASSWD",
  "DRUPAL_DBNAME": "DRUPAL DBNAME",
  "DRUPAL_PORT": 3356
  "WKHTMLTOPDF_PATH": "/usr/bin/local/wkhtmltopdf",
  "WKHTMLTOPDF_DPI": 300,
  "WKHTMLTOPDF_ZOOM": 1.6711
}
```

`isProductionServer` is optional for production

`LOCAL_USER` is used for development to assign an id for authorid. For CALI environments typically the dev user is 45.

`SERVER_URL` is the base URL for the server hosting the app

`CAJA_WS_URL` is the url path for `CAJA_WS.php`. This is used by the DAT.

`GUIDES_DIR` is the system path location of the guide files. Must be web accessible

`VIEWER_PATH` is identical to `GUIDES_DIR` in production but is the location of the viewer when setup for standalone viewer and DAT

`GUIDES_URL` is the relative url of guides with respect to CAJA_WS.php

`SQL_HOST` is the address of the mysql server

`SQL_USERNAME` is the mysql username for the app

`SQL_PASSWD` is the mysql username for the app

`SQL_DBNAME` is the mysql database for the app

`SQL_PORT` is the mysql port where the apps database lives

`DRUPAL_HOST` is the address of the mysql server for Drupal

`DRUPAL_USERNAME` is the mysql username for Drupal

`DRUPAL_PASSWD` is the mysql username for Drupal

`DRUPAL_DBNAME` is the mysql database for Drupal

`DRUPAL_PORT` is the mysql port where the Drupal database lives

`WKHTMLTOPDF_PATH` is the system path for wkhtmltopdf

`WKHTMLTOPDF_DPI` is the DAT property to control how wkhtmltopdf renders documents. Usually this should be set to 300

`WKHTMLTOPDF_ZOOM`is the DAT property to control how wkhtmltopdf renders documents. 
Usually this should be set to 1.6711 on linux but this might need to be tested and tweaked for your environment to render properly.

The `SERVER_URL` and `GUIDES_DIR` properties are used by the Node server, but
this file will also be used by `CONFIG.PHP`, which also uses the database
connection information.


### Server Configuration: config_env.ini
a second configuration file is necessary called `config_env.ini`. This is used to setup allowed file types, analytics, and a2j.org. This file 
is expected to be in the parent directory of the folder where the git repo, i.e. the same folder as config.json. A sample config is located here sample-configs/config_env.ini.sample

### Launch the app
To launch the app simply open a broswser and navigate to the a2jauthor folder e.g. http://a2jauthor.loc/a2jauthor

## To run tests:

From the root folder (`a2jauthor/`) run
```
$ npm test
```

## Debugging the server:

Prepend any of the `npm` commands above with `DEBUG=A2J:*`
For example, to debug the server running locally:
```
$ DEBUG=A2J:* npm start
```
Then any `debug(...)` messages in the code will be displayed in the console.

## To run client tests:

```
$ npm test
```

for questions contact tobias@cali.org
