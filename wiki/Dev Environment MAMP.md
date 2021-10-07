# CAJA Development Environment Setup
How to set up, run, and debug a production clone.
Written for Mac OS

## Prerequsites:

- wkhtmltopdf used to generate assembled documents, download and install instructions https://wkhtmltopdf.org/downloads.html
- NOTE: refer to https://support.apple.com/guide/mac-help/open-a-mac-app-from-an-unidentified-developer-mh40616/mac for getting around the `unidentified developer` warning if it pops up for you.
- node.js version v12.20.1
- npm 6.14.10
- MAMP 5.7 
    - First kill system apache: `sudo apachectl stop`
    - Open MAMP and go to `preferences`, check the Ports, PHP and Web Server tabs for the below settings to match.
    - PHP v 7.4.2
    - Apache port 80
    - MySQL port 3006
    - "Document Root" directory pointed at `~/Sites`. You may need to create this directory.

## Getting Started

1. Create and CD into an a2j directory: `cd ~/Sites && mkdir a2j && cd a2j`
   
2. Create a file `~/Sites/a2j/config.json` with the settings from [config.json.sample.md](resources/config.json.sample.md) ,
    updating the directory paths as needed for your username.

3.  Unzip the guide files:
    - Unzip `~/Sites/a2j/author/wiki/resources/userfiles.zip`to `~/Sites/a2j/`
    - Ensure that the guides are available at `~/Sites/a2j/userfiles/dev/guides/`.
    - 
4. Clone the repos as siblings in the `a2j` directory (dropping the `a2j` from the repo name, see commands below - this is not critical, but makes it easier to read and navigate between repos):
    `cd ~/Sites/a2j`
    `git clone git@github.com:CCALI/a2jauthor author`
    `git clone git@github.com:CCALI/a2jdat dat`
    --- optional: needed for local Viewer and Deps development ---
    `git clone git@github.com:CCALI/a2jviewer viewer`
    `git clone git@github.com:CCALI/a2jdeps deps`

5. Install dependencies for Author:
    - `cd ~/Sites/a2j/author && npm ci`
    - 
6. Seed the database
    - Start and login to mysql: `/Applications/MAMP/Library/bin/mysql -u root -p`
    - `Enter password: root`
    - you should see the MYSQL prompt `mysql>`
    - create the `caja` database using `CREATE DATABASE caja;` <-- the ending semicolon is required.
    - Use that DB `USE caja;`
    - SEED the DB `SOURCE ~/Sites/a2j/author/wiki/resources/caja_default_2021-03-23.sql`
    - Ctrl-c to exit
    - You can also use the free version of [SequelPro](https://www.sequelpro.com/) to create the `caja` DB and import the above .sql file if the command line isn't your thing.

7. Start the DAT for template authoring and document assembly 
    - Ensure MAMP is running both apache and MySQL
    - `cd ~/Sites/a2j/dat`
    -  `npm ci` 
    - `npm run dev`
    - To run DAT in Node debug mode with Google Chrome (more messages, and node breakpoints)
    - `npm run dev:debug`

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
        # Proxy for CALI A2J app
        ProxyPass /api http://localhost:3000/api
        ProxyPassReverse /api http://localhost:3000/api
        ProxyBadHeader Ignore
        ```

2. Restart MAMP

You should now be able to access the development app at [http://localhost/a2j/author](http://localhost/a2j/author). This will serve pre-dist assets and will reflect client-side changes on reload.

You should also be able to access the production copy after executing `npm run build` at [http://localhost/a2j/author/index.production.html](http://localhost/a2j/author/index.production.html).  

Note: if the Templates tab does not work, make sure you have opened a terminal to `~/Sites/a2j/dat/` and run `npm run dev`  
  
  
  
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


