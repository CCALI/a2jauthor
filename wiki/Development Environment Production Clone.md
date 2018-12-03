# CAJA Development Environment Setup
How to set up, run, and debug a production clone.
Written for OSX

## Prerequsites:
- wkhtmltopdf used to generate assembled documents, easiest to install using Homebrew: http://brewformulas.org/Wkhtmltopdf
- node.js version v8.9.4
- npm 5.6.0
- MAMP
    - Kill system apache: `sudo apachectl stop`
    - Apache port 80
    - MySQL port 8889
    - "Document Root" directory pointed at `~/Sites`. You may need to create this directory.

## Getting Started

1. Create a CALI directory: `cd ~/Sites && mkdir CALI && cd CALI`
2. Create a file `~/Sites/CALI/config.json` with the settings below,
    updating the directory paths as needed.

    ```
    {
        "SERVER_URL": "http://localhost/CALI/app",
        "GUIDES_DIR": "/Users/mitchel/Sites/CALI/userfiles/",
        "GUIDES_URL": "/CALI/userfiles/",
        "SQL_HOST": "localhost",
        "SQL_USERNAME": "root",
        "SQL_PASSWD": "root",
        "SQL_DBNAME": "caja",
        "SQL_PORT": 3306,
        "DRUPAL_HOST": "localhost",
        "DRUPAL_USERNAME": "root",
        "DRUPAL_PASSWD": "root",
        "DRUPAL_DBNAME": "D7commons",
        "DRUPAL_PORT": 3306,
        "WKHTMLTOPDF_PATH": "/usr/local/bin/wkhtmltopdf",
        "WKHTMLTOPDF_ZOOM": 1.0,
        "WKHTMLTOPDF_DPI": 300,
        "VIEWER_PATH": ""
    }
    ```

3. Clone the repo to the `app` directory:
    `cd ~/Sites/CALI && git clone git@github.com:CCALI/CAJA.git app`
4. Download and install dependencies (2 locations):
    - `cd ~/Sites/CALI/app && npm install`
    - `cd ~/Sites/CALI/app/js && npm install`
5. Seed the database
    - Start mysql: `/Applications/MAMP/Library/bin/mysql -u root -p`
    - `Enter password: root`
    - `mysql> source ~/Sites/CALI/app/wiki/resources/caja_default_2018-10-09.sql`
    - CTRL-c to exit
6. Seed the guide files:
    - Unzip to `~/Sites/CALI/app/wiki/resources/userfiles.zip`to `~/Sites/CALI/`
    - Ensure that the guides are available at `~/Sites/CALI/userfiles/dev/guides/`.
7. Set php config, located at `~/Sites/CALI/app/CONFIG.php` to the following, replacing the username `mitchel` with your own.

    ```
    <?php
        define("SERVER_URL","");
        define("DRUPAL_ROOT_DIR", "");
        define("GUIDES_DIR","/Users/mitchel/Sites/CALI/userfiles/");
        define("GUIDES_URL", "/CALI/userfiles/");

        // db variables
        define('DB_NAME', "");
        define('DB_USER', "");
        define('DB_PASSWORD', '');
        define('DB_HOST', '');

        define('D7_DB_NAME', "");
        define('D7_DB_USER', "");
        define('D7_DB_PASSWORD', '');
        define('D7_DB_HOST', '');

        $mysqli = new mysqli('localhost','root','root','caja',3306);
        define('LOCAL_USER', 45);

        $isProductionServer = FALSE; //or FALSE
    ?>
    ```

8. Build the app
    - Wait until both `npm install`'s have finished
    - `cd ~/Sites/CALI/app`
    - `npm run build`
    - `npm run build:server`
    - `npm run build:client`
9. Start the servers
    - Ensure MAMP is running both apache and MySQL
    - `cd ~/Sites/CALI/app && npm run dev`

You should now be able to access the development app at [http://localhost/CALI/app/js/author](http://localhost/CALI/app/js/author). This will serve pre-dist assets and will reflect client-side changes on reload. There is no database or file connection, and the data is mocked.

You should also be able to access the production copy at [http://localhost/CALI/app/js/author/index.production.html](http://localhost/CALI/app/js/author/index.production.html). The Interviews tab will display the guides listed in the database, but access will be limited. That requires a proxy.

## CKEDITOR Path
CKEditor is a third party plugin used for template creation and editing.  The path is defined in:
```<webroot>/CALI/app/js/author/index.html``` and ```index.production.html```

and has to be relative to the web root.  With the above folder structure, it should look like this:

```CKEDITOR_BASEPATH = '/CALI/app/js/ckeditor/';```

It needs to be restored to ```CKEDITOR_BASEPATH = '/app/js/ckeditor/';``` before committing and pushing code as it will break the tests on Github/Travis.

## Local Database
To allow your local database to serve and save guide files, while still refreshing dev changes on reload, edit `configDependencies` in `js/package.json`:

With Fixtures:
```
    "configDependencies": [
        "author/utils/load-fixtures",
        "author/utils/set-global-for-lodash"
    ],
```
Without Fixtures, local database active:
```
    "configDependencies":
        "author/utils/set-global-for-lodash",
```

Do not commit this change to the repo.

## Node Proxy

It is necessary to set up a proxy in apache in order to communicate with the node server's api routes.

1. Add proxy config to apache conf:
    - Open `/Applications/MAMP/conf/apache/httpd.conf` in your editor. This may require `sudo` to edit.
    - Add these lines to the end of the file:

        ```
        # Proxy for CALI
        ProxyPass /api http://localhost:3000/api
        ProxyPassReverse /api http://localhost:3000/api
        ProxyBadHeader Ignore
        ```

2. Restart MAMP

You should now have access to a working production copy of the app at [http://localhost/CALI/app/js/author/index.production.html](http://localhost/CALI/app/js/author/index.production.html). Client-side changes will require running `npm run build:client`. Changes in `~/Sites/CALI/app/src/` will require restarting the node server.

## Debugging PHP  ----NOTE---- Both Atom and VS Code provide php debug extensions
`js/author/CAJA_WS.php` handles api transactions, user management, and file IO. You'll likely need to debug this file at some point.

## follow their setup directions - the following may be deprecated

1. Activate xdebug:
    - Navigate to [http://localhost/MAMP/index.php?language=English&page=phpinfo](http://localhost/MAMP/index.php?language=English&page=phpinfo)
    - Find the value of "Loaded Configuration File".
    - Open that file in your editor.
    - Find and uncomment the line that has the word or heading "xdebug", likely starting with "zend_extension=".
    - Below that line, add the following configuration lines:

        ```
        xdebug.default_enable=1
        xdebug.remote_enable=1
        xdebug.remote_host=localhost
        xdebug.remote_port=9000
        xdebug.remote_handler=dbgp
        xdebug.remote_autostart=1
        ```
2. Restart MAMP.
3. Navigate back to [http://localhost/MAMP/index.php?language=English&page=phpinfo](http://localhost/MAMP/index.php?language=English&page=phpinfo). Search the page for "xdebug" and ensure the options set in step 1 are available.


