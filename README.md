CAJA
====

This is the private repo for the browser-based versions of CALI Author and A2J Author.


# Setup on OSX Yosemite.

## Set up apache.


Create a `Sites` folder in your home directory.

```
$ mkdir ~/Sites
```

Add a dummy html page to make sure apaches serves correctly whatever is in the `~/Sites` folder.

```
$ echo "<html><body><h1>My site works</h1></body></html>" > ~/Sites/index.html.en
```
PHP is not enabled by default in latest OS X releases, to enable it we need to change a few things in `/etc/apache2/httpd.conf`:

```
$ sudo vi /etc/apache2/httpd.conf
```

And uncomment the following lines (remove the `#` at the beginning of the line.):

```
#LoadModule userdir_module libexec/apache2/mod_userdir.so
...
#LoadModule userdir_module libexec/apache2/mod_userdir.so
...
#Include /private/etc/apache2/extra/httpd-userdir.conf
```

Save and exit.

Then you also need to edit `/etc/apache2/extra/httpd-userdir.conf`, run:

```
$ sudo vim /etc/apache2/extra/httpd-userdir.conf
```

and uncomment the following line:

```
#Include /private/etc/apache2/users/*.conf
```

save and exit.

You need to add an user config file in `/etc/apache2/users/<your short user name>.conf` (e.g if you home folder is `foobar` you need to create a `foobar.conf` file in `/etc/apache2/users/`). Run

```
$ sudo vim /etc/apache2/users/<your short user name>.conf
```

and use this content:

```
<Directory "/Users/<your short user name>/Sites/">
    AddLanguage en .en
    LanguagePriority en fr de
    ForceLanguagePriority Fallback
    Options Indexes MultiViews
    AllowOverride None
    Order allow,deny
    Allow from localhost
     Require all granted
</Directory>
```

Remember to edit the path in the `Directory` tag to include your actual user name; save and quit.

Finally, run this to start the apache daemon:

```
$ sudo launchctl load -w /System/Library/LaunchDaemons/org.apache.httpd.plist
```

Go to `http:localhost/~<your short user name>` (if your user name is `foobar`, you need to open `http:localhost/~foobar`); you should see an `My site works` message in your browser.

## Set up MySQL

1. Download the latest DMG archive from the []MySQL page](http://dev.mysql.com/downloads/mysql/).
2. Open the preferences pane and start the MySQL Server.
3. Update the path by editing ~/.bash_profile and add:

	```
	$ export PATH=~/bin:/usr/local/bin:/usr/local/mysql/bin:$PATH
	```
4. Set up MySQL root password:

	```
	/usr/local/mysql/bin/mysqladmin -u root password 'yourpasswordhere'
	```
5. Finally ensure that the `mysql.sock` file can be found by PHP:

	```
	sudo mkdir /var/mysql
	sudo ln -s /tmp/mysql.sock /var/mysql/mysql.sock
	```

## Clone the repo.

Before cloning this repo in your `~/Sites` folder, change the permissions running:

`$ sudo chmod -R 755 ~/Sites`.

## Load the mysql dump included in the repo.

```
mysql --u [username] --password=[password] [database name] < [dump file]
```
## Edit the connection params in CONFIG.php

You need to make sure the params passed to [`mysqli`](https://github.com/CCALI/CAJA/blob/master/js/CONFIG.php#L21-L22) are correct based on your settings. E.g, for the `root` user, with an empty password, and default port `3306`, you should change [this line](https://github.com/CCALI/CAJA/blob/817496b45cb1d021b0f61f1a45e1647ef4272f47/js/CONFIG.php#L21) to:

```
$mysqli = new mysqli("localhost", "root", "", "caja", 3306)
```

At this point you should be able to visit `http://localhost/~<short user name>/CAJA/js/` and see the A2J author welcome page.
