[![Build Status](https://api.travis-ci.com/CCALI/CAJA.svg?token=CrXpSAsYvh8VrmswxMau&branch=bitovi)](https://magnum.travis-ci.com/CCALI/CAJA/)

CAJA
====

This the private repo for the browser-based versions of A2J Author and Viewer.

## To setup:

First install the server side dependencies, there is a small ExpressJS service
that generates PDF as part of the document assembly feature; from the root folder
run

```
npm install
```

Then you need to install the dependencies of the CanJS Author and Viewer apps
which are located in  the `js` folder inside the root:

```
$ cd js
$ npm install
$ npm install -g grunt-cli
```

## To run locally:

From the root folder (`CAJA/`) run

```
$ npm start
```

Then, if you want to load the author app go to
[http://localhost:3000/js/author](http://localhost:3000/js/author) or go to
[http://localhost:3000/js/viewer](http://localhost:3000/js/viewer) if you want
to load the viewer app instead.

## To build the Author and Viewer:

```
$ cd js
$ grunt build
```

If you want to view the app in production mode, just start the server (`npm start`)
and go to [http://localhost:3000/js/author/index.production.html](http://localhost:3000/js/author/index.production.html)
or [http://localhost:3000/js/viewer/index.production.html](http://localhost:3000/js/viewer/index.production.html)

## To run tests:

```
$ npm test
```

or, if your local server is running (you ran `npm start` before) you can run tests in your browser
by loading [http://localhost:3000/js/author/test](http://localhost:3000/js/author/test)

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
