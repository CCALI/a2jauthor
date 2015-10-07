CAJA
====

This the private repo for the browser-based versions of CALI Author and A2J Author.

## To setup:

```
$ cd js
$ npm install
$ npm install -g bower
$ npm install -g grunt-cli
$ bower install
```

## To run locally:

```
$ npm start
```

Then visit [http://localhost:3000](http://localhost:3000)

## To build the Author:

```
$ cd js
$ grunt build
```

If you want to view the app in production mode, just start the server (`npm start`)
and go to [http://localhost:3000/author/index.production.html](http://localhost:3000/author/index.production.html).

## To build the mobile Viewer:

```
$ cd js
$ grunt
```

If you want to view the app in production mode, just start the server (`npm start`)
and go to [http://localhost:3000/client/index.html](http://localhost:3000/client/index.html).

## To run tests:

```
$ grunt test
```

or, if your local server is running (you ran `npm start` before) you can run tests in your browser
by loading [http://localhost:3000/author/test](http://localhost:3000/author/test)

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
