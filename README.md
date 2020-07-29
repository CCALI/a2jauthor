[![Build Status](https://travis-ci.com/CCALI/CAJA.svg?token=2eqmqTqtZG7xAzR9G89f&branch=develop)](https://travis-ci.com/CCALI/CAJA)

A2J Author 7.0 (previously know as CAJA)
====

This the repo for the browser-based versions of A2J Author.

Before following the instructions for setup below.  It is assumed that you have npm and nodejs already installed. Currently tested on Node v12.x-LTS and npm v6.x


## To setup:
```
npm install
```


## To build the Author production code:

From the root folder run
```
npm run build
```

## To run Author tests:

From the root folder run
```
$ npm test
```

or you can run tests in your browser by loading [http://localhost:3000/a2jauthor/test/](http://localhost:3000/a2jauthor/test/)


## To run server locally:

From the root folder (`CAJA/`) run

```
$ npm start
```

Then, if you want to load the author app go to
[http://localhost:3000/js/author](http://localhost:3000/js/author) or go to
[http://localhost:3000/js/viewer](http://localhost:3000/js/viewer) if you want
to load the viewer app instead.

### Server Configuration

In production mode, the server uses a configuration file called `config.json`
that is expected to be in the parent directory of the folder where the git repo
is cloned. This file should have the following structure:
```
{
  "SERVER_URL": "http://bitovi.a2jauthor.org/",
  "GUIDES_DIR": "f:/www/caja.cali.org/caja/userfiles/",
  "GUIDES_URL": "/caja/userfiles/",
  "SQL_HOST": "localhost",
  "SQL_USERNAME": "z",
  "SQL_PASSWD": "z",
  "SQL_DBNAME": "caja",
  "SQL_PORT": 3356,
  "DRUPAL_HOST": "localhost",
  "DRUPAL_USERNAME": "z",
  "DRUPAL_PASSWD": "z",
  "DRUPAL_DBNAME": "D7commons",
  "DRUPAL_PORT": 3356
}
```
The SERVER_URL and GUIDES_DIR properties are used by the A2J DAT Node server, but
this file will also be used by CAJA_WS.php, the PHP web services file.

### Keep in mind when setting a production environment:

You need to make sure `author/index.production.html` is loaded instead of `author/index.html` because the latter will load the development files one by one even if you follow the instructions to build the app.

The simplest way to accomplish this is to rename `author/index.html` to something like `author/index.dev.html` and then rename `author/index.production.html` to `author/index.html`.

## Documentation
*Note: these commands should run in the `CAJA/js` directory.*

To build the documentation *and* update the documentjs template, run:

```
$ npm run build-docs
```

To build the documentation and view the documentation, run:

```
$ npm run serve-docs
```

The documentation site should be running at `http://localhost:8080`.

## To deploy the A2J Author app

- clone the repo in your web root on your server
- cd into the repo
- npm install
- npm run build
- mv index.production.html index.html

## Templates tab - Template authoring and test assemble

In order to create and test assemble templates, you will be required to install and build the A2J Document Assembly Tool (A2J DAT) found here: [link to DAT]. Config options and instructions are found in that repo, but the basic steps are:

- cd to your web root
- git clone a2jdat
- cd a2jdat/
- npm install
- npm run build
- npm run build server
- npm run start

A2J Author expects the DAT to be running on port 3000, which is the default. Most often you will clone the DAT repo into the same parent folder as A2J Author, for example:

<webroot>
 - a2jauthor/
 - a2jdat/
