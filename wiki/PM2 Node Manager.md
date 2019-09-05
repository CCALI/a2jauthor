### How to start the templates node server

First, you need to cd into the folder where the app code is contained, at the root of this folder there should be a `package.json` file, once you've done that, run the following command:

```
pm2 start npm --name "templates-api" -- run start
```

the name "templates-api" in this example is arbitrary, it helps to identify the process when running commands like `pm2 list`. E.g:

| App name | id | mode | pid | status | restart | uptime | memory | watching
|----------|----|------|-----|--------|---------|--------|--------|---------
| templates-api | 0 | fork | 24800 | online | 0 | 10m | 34.262 MB | disabled

Some `pm2` commands require either the app id or the app name, if you want to stop the "templates-api" server you could run:

```
npm2 stop templates-api
```

or

```
npm2 stop 0
```

Using meaningful app names could be specially useful when multiple node server instances are active, which could be the case of the different environments where the app is deployed (staging, testing, development, etc).

### How to provide a different port to the node server

By default, the templates node server will listen on the port `3000` you can provide a different port number using the `PORT` environment variable. E.g:

```
PORT=3002 pm2 start npm --name "templates-api-staging" -- run start
```
