[![Build Status](https://api.travis-ci.com/CCALI/CAJA.svg?token=CrXpSAsYvh8VrmswxMau&branch=bitovi)](https://magnum.travis-ci.com/CCALI/CAJA/)

A2J Author 6.0 (previously know as CAJA)
====

This the private repo for the browser-based versions of A2J Author and Viewer.

Before following the instructions for setup below.  It is assumed that you have npm and nodejs already installed.

- /user/sam/git/caja is where this all gets installed (replace "sam" with whatever username you are on your system.
- npm and nodejs are installed at the system level using appget or other install tool dependent on your Linux/Mac distro.
- According to John, you cannot run this on Windows machines at all due to the path length limitation of 256 characters.  This is actually a limitation of the Windows API, not the NTFS file system, but it makes it almost impossible to work on reasonably complex javascript projects on Windows.


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


## To generate the viewer app distributable files:

From the root folder (`CAJA`) run the following command:

```
$ npm run build:viewer-zip
```

That will build the viewer app and it will create a ZIP file located in the same
directory where the repo folder is located, that ZIP file will contain the built
app along with some other files needed to run the standalone viewer app in a
production environment.


## Documentation
*Note: these commands should run in the `CAJA/js` directory.*

To build the documentation, run:

```
$ npm run build-docs
```

To view the documentation, run:

```
$ npm run serve-docs
```

The documentation site should be running at `http://localhost:8080`.

## To deploy the author (and viewer) app

There is a deploy script available in the `deploy` folder, it basically sets up
an ssh connection to a remote server and executes the commands to make sure the
minified scripts along with other assets and files required to run the app in a
production environment are copied over to the remote server.

Before you run that bash script, you need to provide some configuration options,
for that open in a text editor the file `deploy.conf`, let's say you have a staging
environment hosted at `staging.a2jauthor.org`, your username in that server is `jmayer`
and you'd like to use the following path `/home/jmayer/public_html/CAJA` to locate
the app assets. Your `deploy.conf` would look like this:

```
[staging]
user jmayer
host staging.a2jauthor.org
path /home/jmayer/public_html/CAJA
needs_tty yes
```

With that in place, you just need to run in your terminal the following command:

```
$ ./deploy/deploy.sh staging
```

By default, the deploy script will build the app, run the tests and continue to
deploy the files to the host server if everything went well. You can skip the build
process or the tests, if you want to take a look at the available options, just run:

```
$ ./deploy/deploy.sh -h
```

The deployment configuration file also allows you to set up commands to be executed
before and/or after the deployment is done, if for instance you want to restart
all of the NodeJS apps running in the staging environment mentioned above after the
deployment has been completed (assuming you're using [`pm2`](https://github.com/Unitech/pm2)
as your NodeJS process manager), you just need to change your `deploy.conf` to
look like this:

```
[staging]
user jmayer
host staging.a2jauthor.org
path /home/jmayer/public_html/CAJA
needs_tty yes
post-deploy pm2 restart all
```
and you're done!
