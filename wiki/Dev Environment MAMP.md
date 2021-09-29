# CAJA Development Environment Setup
How to set up, run, and debug a production clone.
Written for Mac OS

## Prerequsites:
- wkhtmltopdf used to generate assembled documents, download and install instructions https://wkhtmltopdf.org/downloads.html
- node.js version v12.20.1
- npm 6.14.10
- MAMP
    - First kill system apache: `sudo apachectl stop`
    - Apache port 80
    - MySQL port 8889
    - "Document Root" directory pointed at `~/Sites`. You may need to create this directory.

## Getting Started

1. Create an a2j directory: `cd ~/Sites && mkdir a2j && cd a2j`
2. Create a file `~/Sites/a2j/config.json` with the settings below,
    updating the directory paths as needed for your username.

    ```
    {
        "SERVER_URL": "http://localhost/a2j/app",
        "GUIDES_DIR": "/Users/mitchel/Sites/a2j/userfiles/", <--- replace mitchel for your username here
        "GUIDES_URL": "/a2j/userfiles/",
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

3. Clone the repos as siblings in the `a2j` directory:
    `cd ~/Sites/a2j`
    `git clone git@github.com:CCALI/a2jauthor author`
    `git clone git@github.com:CCALI/a2jdat dat`
    --- optional: needed for local Viewer and Deps development ---
    `git clone git@github.com:CCALI/a2jviewer viewer`
    `git clone git@github.com:CCALI/a2jdeps deps`
4. Iinstall dependencies for Author:
    - `cd ~/Sites/a2j/author && npm install`
5. Seed the database
    - Start mysql: `/Applications/MAMP/Library/bin/mysql -u root -p`
    - `Enter password: root`
    - `mysql> source ~/Sites/a2j/app/wiki/resources/caja_default_2018-10-09.sql`
    - CTRL-c to exit
6. Seed the guide files:
    - Unzip `~/Sites/a2j/app/wiki/resources/userfiles.zip`to `~/Sites/a2j/`
    - Ensure that the guides are available at `~/Sites/a2j/userfiles/dev/guides/`.
7. Create and/or Set config.json, located at `~/Sites/a2j/app/config.json` to the following, replacing the username `mitchel` with your own username.

    ```
    {
        "CAJA_WS_URL": "http://localhost/a2j/author/CAJA_WS.php",
        "GUIDES_DIR": "/Users/mitch/Sites/a2j/userfiles/",
        "GUIDES_URL": "/a2j/userfiles/",
        "isProductionServer": false,
        "LOCAL_USER": 45,
        "DB_NAME": "caja",
        "DB_USER": "root",
        "DB_PASSWORD": "root",
        "DB_HOST": "localhost",
        "DB_PORT": 3306,
        "DRUPAL_ROOT_DIR": "",
        "WKHTMLTOPDF_PATH": "/usr/local/bin/wkhtmltopdf",
        "WKHTMLTOPDF_ZOOM": 1.6,
        "WKHTMLTOPDF_DPI": 300,
        "VIEWER_PATH": "/Users/mitch/Sites/a2j/viewer"
    }
    ```

8. Start the DAT for template authoring and document assembly 
    - Ensure MAMP is running both apache and MySQL
    - `cd ~/Sites/a2j/dat`
    -  `npm install` 
    - `npm run dev`
    - To run DAT in Node debug mode with Google Chrome (more messages, and node breakpoints)
    - `npm run dev:debug`

You should now be able to access the development app at [http://localhost/CALI/app/js/author](http://localhost/CALI/app/js/author). This will serve pre-dist assets and will reflect client-side changes on reload.

You should also be able to access the production copy at [http://localhost/CALI/app/js/author/index.production.html](http://localhost/CALI/app/js/author/index.production.html).

## CKEDITOR Path
CKEditor is a third party plugin used for template creation and editing.  The path is defined in:
```<webroot>/a2j/author/index.html``` and ```index.production.html```

and has to be relative to the web root.  With the above folder structure, it should look like this:

```CKEDITOR_BASEPATH = 'ckeditor/';```

## Node Proxy

It is necessary to set up a proxy in apache in order to communicate with the node server's api routes. (See [/wiki/resources](../wiki/resources_) for sample configs)

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

You should now have access to a working production copy of the A2J Author App at [http://localhost/a2j/author]
Note: if the Templates tab does not work, make sure you have opened a terminal to ~/Sites/a2j/dat/ and run `npm run dev`

## Debugging PHP  ----NOTE---- Both Atom and VS Code provide php debug extensions
`CAJA_WS.php` handles api transactions, user management, and file IO. You'll likely need to debug this file at some point.

## follow their setup directions - the following may be deprecated depending on your local setup.

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
4. At this point, you can use a php debugging extension like [https://marketplace.visualstudio.com/items?itemName=felixfbecker.php-debug](https://marketplace.visualstudio.com/items?itemName=felixfbecker.php-debug) to add breakpoints to your php code.


