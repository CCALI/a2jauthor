[![Build Status](https://api.travis-ci.com/CCALI/CAJA.svg?token=CrXpSAsYvh8VrmswxMau&branch=bitovi)](https://magnum.travis-ci.com/CCALI/CAJA/)

CAJA
====

This the private repo for the browser-based versions of A2J Author and Viewer.

## To setup:

### wkhtmltopdf

Before installing the server side dependencies, you need to install `wkhtmltopdf`
on your system first, `wkhtmltopdf` is a command line tool that renders HTML into PDF. The
easiest way to do this is to [download](http://wkhtmltopdf.org/downloads.html#stable) a
prebuilt version for your system

Once `wkhtmltopdf` command line tool is available on your system, install the
node dependencies from the root folder of the app by running the following command:

```
npm install
```

Then you need to install the dependencies of the CanJS Author and Viewer apps
which are located in `CAJA/js/`

```
$ cd js
$ npm install
```


## To build the server code:

From the root folder (`CAJA/`) run
```
$ npm run build
```
This will also be done automatically when starting the server (see below).


## To run server tests:

From the root folder (`CAJA/`) run
```
$ npm test
```


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
The SERVER_URL and GUIDES_DIR properties are used by the Node server, but
this file will also be used by CONFIG.PHP, which also uses the database
connection information.

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


### Keep in mind when setting a production environment:

You need to make sure `author/index.production.html` and `viewer/index.production.html` are loaded instead of `author/index.html` and `viewer/index.html` because the latter will load the development files one by one even if you follow the instructions to build the app.

The simplest way to accomplish this is to rename `author/index.html` to something like `author/index.dev.html` and then rename `author/index.production.html` to `author/index.html` (same thing should be done to the viewer index file).


## To run client tests:

```
$ npm test
```

or, if your local server is running (you ran `npm start` before) you can run tests in your browser
by loading [http://localhost:3000/js/author/test/](http://localhost:3000/js/author/test/) or
[http://localhost:3000/js/viewer/test/](http://localhost:3000/js/viewer/test/)


## To generate the documentation:

```
$ cd js
$ grunt documentjs
```

If you want to view the generated docs in your brower just do:

```
$ cd author/docs
$ python -m SimpleHTTPServer
```

You should see something like the following:

`Serving HTTP on 0.0.0.0 port 8000 ...`

Open up a brower and navigate to [http://localhost:8000](http://localhost:8000)
you should see the docs page!
