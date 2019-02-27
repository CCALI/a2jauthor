#!/bin/sh

git checkout e937772d8bab4ad659df7f894354b29d3efee8be # we had example userfiles on a branch for awhile
cp wiki/resources/userfiles.zip ../
git checkout -
cd ..
unzip userfiles.zip
cat > config.php <<CONFIGPHP
<?php
define("SERVER_URL","");
define("DRUPAL_ROOT_DIR", "");
define("GUIDES_DIR","/tmp/userfiles/");
define("GUIDES_URL", "/CALI/userfiles/");

define('DB_NAME', "");
define('DB_USER', "");
define('DB_PASSWORD', '');
define('DB_HOST', '');

define('D7_DB_NAME', "");
define('D7_DB_USER', "");
define('D7_DB_PASSWORD', '');
define('D7_DB_HOST', '');

$mysqli = new mysqli('db', 'root', 'root', 'caja', 3306);
define('LOCAL_USER', 45);  // sets to dev user number 45

$isProductionServer = FALSE; //or FALSE
?>
CONFIGPHP

cat > docker-compose.yml <<DOCKERCOMPOSE
version: '2'

services:
  web:
    build: ./docker/webserver
    image: cali_web
    ports:
      - '80:80'
    volumes:
      - $PWD:/var/www/html
      - $PWD/userfiles:/tmp/userfiles
    links:
      - db
  db:
    image: mysql:5.7
    ports:
      - '3306:3306'
    volumes:
      - ./db:/var/lib/mysql
      - ./caja/wiki/resources:/tmp/repo-resources
    environment:
      - MYSQL_ROOT_PASSWORD=root
      - MYSQL_ROOT_USER=root
      - MYSQL_DATABASE=caja
DOCKERCOMPOSE

mkdir -p docker/webserver

cat > docker/webserver/000-default.conf <<APACHECONFIG
<VirtualHost *:80>
  ServerAdmin webmaster@localhost
  DocumentRoot /var/www/html

  ErrorLog ${APACHE_LOG_DIR}/error.log
  CustomLog ${APACHE_LOG_DIR}/access.log combined

  ProxyPass /api http://docker.for.mac.host.internal:3000/api
  ProxyPassReverse /api http://docker.for.mac.host.internal:3000/api
  ProxyBadHeader Ignore
</VirtualHost>
APACHECONFIG

cat > docker/webserver/Dockerfile <<DOCKERFILE
FROM php:7-apache

RUN apt-get update && apt-get install -y zlib1g-dev \
    && docker-php-ext-install zip
RUN docker-php-ext-install mysqli && docker-php-ext-enable mysqli
RUN a2enmod proxy proxy_http

COPY ./000-default.conf /etc/apache2/sites-enabled/

RUN service apache2 restart
DOCKERFILE