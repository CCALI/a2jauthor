#!/bin/sh

git checkout e937772d8bab4ad659df7f894354b29d3efee8be # we had example userfiles on a branch for awhile
cp wiki/resources/userfiles.zip ../
git checkout -
cd ..
echo "unzipping userfiles to $PWD"
unzip userfiles.zip

echo "generating CONFIG.php to $PWD"
cat > CONFIG.php <<CONFIGPHP
<?php
  define("SERVER_URL","");
  define("DRUPAL_ROOT_DIR", "");
  define("GUIDES_DIR","/tmp/userfiles/");
  define("GUIDES_URL", "/userfiles/");

  define('DB_NAME', "");
  define('DB_USER', "");
  define('DB_PASSWORD', '');
  define('DB_HOST', '');

  define('D7_DB_NAME', "");
  define('D7_DB_USER', "");
  define('D7_DB_PASSWORD', '');
  define('D7_DB_HOST', '');

  \$mysqli = new mysqli('db', 'root', 'root', 'caja', 3306);
  define('LOCAL_USER', 45);  // sets to dev user number 45

  \$isProductionServer = FALSE; //or FALSE
?>
CONFIGPHP

echo "generating config.json to $PWD"
cat > config.json <<CONFIGJSON
{
  "SERVER_URL": "http://localhost/CAJA",
  "GUIDES_DIR": "/tmp/userfiles/",
  "GUIDES_URL": "/userfiles/",
  "WKHTMLTOPDF_PATH": "/usr/local/bin/wkhtmltopdf",
  "WKHTMLTOPDF_ZOOM": 1.0,
  "WKHTMLTOPDF_DPI": 300,
  "VIEWER_PATH": ""
}
CONFIGJSON

echo "generating docker-compose.yml to $PWD"
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
      - ./logs/mysql.log:/var/log/mysql/general-log.log
    environment:
      - MYSQL_ROOT_PASSWORD=root
      - MYSQL_ROOT_USER=root
      - MYSQL_DATABASE=caja
    command: mysqld --general-log=1 --general-log-file=/var/log/mysql/general-log.log

DOCKERCOMPOSE

mkdir -p docker/webserver

echo "generating 000-default.conf to $PWD/docker/webserver/"
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

echo "generating Dockerfile to $PWD/docker/webserver/"
cat > docker/webserver/Dockerfile <<DOCKERFILE
FROM php:7-apache

RUN apt-get update \
    && apt-get install -y \
    libzip-dev \
    vim \
    && docker-php-ext-install zip
RUN docker-php-ext-install mysqli && docker-php-ext-enable mysqli
RUN a2enmod proxy proxy_http

COPY ./000-default.conf /etc/apache2/sites-enabled/

RUN service apache2 restart
DOCKERFILE
