CAJA
====

This the private repo for the browser-based versions of CALI Author and A2J Author.

## To setup:

```
cd js
npm install
```

## To run locally:

`npm start`

Then visit `http://localhost:3000`

## To build:

```
cd js
grunt build
```

If you want to view the app in production mode, just start the server (`npm start`)
and go to `http://localhost:3000/author/index.production.html`.


## To generate the documentation:

```
cd js
grunt documentjs
```

The JS documentation will be written to `/docs` and the styles documentation will live in `/styles`.

If you want to view the generated docs in your brower just do:

```
cd ../docs  // or cd ../styles if you want to see the live style guide.
python -m SimpleHTTPServer
```

You should see something like the following:

`Serving HTTP on 0.0.0.0 port 8000 ...`

Finally, open up a brower and navigate to `http://localhost:8000`; you should see the docs page!
