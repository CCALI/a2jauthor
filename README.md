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

Once `wkhtmltopdf` command line tool is available on your system, install the
node dependencies from the root folder of the app by running the following command:



## To build the main application:

1.) clone the repo as a subfolder in the root of the drupal install


2.) From the root folder (`a2jauthor/`) run
```
$ npm run deploy
```


## To run tests:

From the root folder (`a2jauthor/`) run
```
$ npm test
```


## Server setup:

There are two

### Server Configuration: config.json

In production mode, the server uses a configuration file called `config.json`
that is expected to be in the parent directory of the folder where the git repo
is cloned. This file should have the following structure:
```
{
  
  "isProductionServer": true,
  "LOCAL_USER": "45",
  "SERVER_URL": "http://bitovi.a2jauthor.org/",
  "GUIDES_DIR": "/www/caja.cali.org/caja/userfiles/",
  "GUIDES_URL": "/caja/userfiles/",
  "SQL_HOST": "localhost",
  "SQL_USERNAME": "SQL USERNAME",
  "SQL_PASSWD": "SQL PASSWD",
  "SQL_DBNAME": "SQL DBNAME",
  "SQL_PORT": 3356,
  "DRUPAL_HOST": "localhost",
  "DRUPAL_USERNAME": "DRUPAL USERNAME",
  "DRUPAL_PASSWD": "DRUPAL PASSWD",
  "DRUPAL_DBNAME": "DRUPAL DBNAME",
  "DRUPAL_PORT": 3356
  "VIEWER_PATH": "/path/to/viewer/a2j-viewer/viewer",
  "WKHTMLTOPDF_PATH": "/usr/bin/local/wkhtmltopdf",
  "WKHTMLTOPDF_DPI": 300,
  "WKHTMLTOPDF_ZOOM": 1.6711
}
```
The `SERVER_URL` and `GUIDES_DIR` properties are used by the Node server, but
this file will also be used by `CONFIG.PHP`, which also uses the database
connection information.

`GUIDES_DIR` must be web accessible
`isProductionServer` is optional for production

### Server Configuration: config_env.ini
config_env.ini is used to setup allowed file types, analytics, and a2j.org




### Debugging the server:

Prepend any of the `npm` commands above with `DEBUG=A2J:*`
For example, to debug the server running locally:
```
$ DEBUG=A2J:* npm start
```
Then any `debug(...)` messages in the code will be displayed in the console.


## To build the Author and Viewer client code:

```
$ npm run build:client
```

If you want to view the app in production mode, just start the server (`npm start`)
and go to [http://localhost:3000/js/author/index.production.html](http://localhost:3000/js/author/index.production.html)
or [http://localhost:3000/js/viewer/index.production.html](http://localhost:3000/js/viewer/index.production.html)


## To run client tests:

```
$ npm test
```

or, if your local server is running (you ran `npm start` before) you can run tests in your browser
by loading [http://localhost:3000/js/author/test/](http://localhost:3000/js/author/test/) or
[http://localhost:3000/js/viewer/test/](http://localhost:3000/js/viewer/test/)
