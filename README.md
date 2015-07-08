CAJA
====

This the private repo for the browser-based versions of CALI Author and A2J Author.

## To setup:

```
$ cd js
$ npm install
```

## To run locally:

```
$ npm start
```

Then visit [http://localhost:3000](http://localhost:3000)

## To build:

```
$ cd js
$ grunt build
```

If you want to view the app in production mode, just start the server (`npm start`)
and go to [http://localhost:3000/author/index.production.html](http://localhost:3000/author/index.production.html).

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

The static html documentation will be generated into the `author/docs` folder, for
both the JavaScript files and CSS/less styles.

If you want to view the generated docs in your brower just navigate to
[http://localhost:3000/author/docs/](http://localhost:3000/author/docs/)
you should see the docs page!
