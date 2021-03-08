# CAJA Development Environment Setup
How to set up, run, and debug a production clone.
Written for OSX

## Prerequsites:
- wkhtmltopdf used to generate assembled documents, easiest to install using Homebrew: http://brewformulas.org/Wkhtmltopdf
- (recommend using nvm to install Node/npm: https://jamesauble.medium.com/install-nvm-on-mac-with-brew-adb921fb92cc)
- node.js version v12.20.1 
- npm 6.14.19
- MAMP Settings, under MAMP -> preferences
    - Ports Tab -> Apache port 80 MySQL port 3306 (Set MAMP ports to default button)
    - Web Server -> Click 'select' and browse to your username and select `Sites` folder
    - if the `Sites` folder doesn't exist, create it in Mac Finder or from Mac terminal `mkdir ~/Sites`

## Getting Started

1. Create an `a2j` directory: `cd ~/Sites && mkdir a2j && cd a2j`
2. Create a file `~/Sites/a2j/config.json` with the settings below,
    updating the directory paths as needed for your username.

    ```
        {
            "CAJA_WS_URL": "http://localhost/a2j/author/CAJA_WS.php",
            "GUIDES_DIR": "/Users/your_username/Sites/a2j/userfiles/",
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
            "WKHTMLTOPDF_ZOOM": 1.0,
            "WKHTMLTOPDF_DPI": 300,
            "VIEWER_PATH": "/Users/your_username/Sites/a2j/viewer"
        }
    ```

3. Clone the Author repo to the `author` directory:
    `cd ~/Sites && git clone git@github.com:CCALI/a2jauthor.git author`
4. Download and install dependencies:
    - `cd ~/Sites/a2j/author && npm install`
5. Seed the database, Enter these commands in the Mac terminal (MAMP should be running)
    - Login to mysql: `/Applications/MAMP/Library/bin/mysql -u root -p`
    - Enter password: `root`
    - Import Database `source ~/Sites/a2j/author/wiki/resources/caja_default_2018-10-09.sql`
    - type `quit` to exit
6. Seed the guide files:
    - Unzip `~/Sites/a2j/author/wiki/resources/userfiles.zip`to `~/Sites/a2j/`
    - Ensure that the guides are available at `~/Sites/a2j/userfiles/dev/guides/`.

7. Start the servers
    - Ensure MAMP is running both apache and MySQL
    - `cd ~/Sites/a2j/author`
    - `npm run dev`

You should now be able to access the development app at [http://localhost/a2j/author/](http://localhost/a2j/author/). This will serve pre-minified assets and will reflect client-side changes on reload.

You should also be able to access the production copy at [http://localhost/a2j/author/index.production.html](http://localhost/a2j/author/index.production.html). The Interviews tab will display the guides listed in the database.

## Node Proxy

It is necessary to set up a proxy in apache in order to communicate with the node server's api routes. (See [/wiki/resources](../wiki/resources_) for sample configs)

1. Add proxy config to apache conf:
    - Open `/Applications/MAMP/conf/apache/httpd.conf` in your editor. This may require `sudo` to edit.
    - Add these lines to the end of the file:

        ```
        # Proxy for a2j
        ProxyPass /api http://localhost:3000/api
        ProxyPassReverse /api http://localhost:3000/api
        ProxyBadHeader Ignore
        ```

3. Restart MAMP

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


