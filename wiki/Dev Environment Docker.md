
# Table of Contents

1.  [Dev environment setup](#org8fa38c8)
    1.  [Docker setup](#orgd32b2a5)
        1.  [Install Docker](#org7b9c9fa)
        2.  [Project setup](#orgf8babe9)
        3.  [Building](#org1cc29ff)
        4.  [Running](#org6b55212)

# Dev environment setup

There are two ways we've used to set this app up:

-   [Using MAMP](https://github.com/CCALI/CAJA/wiki/Development-Environment-Production-Clone)
-   Using docker

This file describes the docker setup. See the linked wiki page ([here](https://github.com/CCALI/CAJA/wiki/Development-Environment-Production-Clone)) for the
MAMP setup.

## Docker setup

### Install Docker

Run `brew cask install docker` if you're on a Mac and you have [Homebrew](https://brew.sh/) installed.
This is the preferred method because it's quick, hands off, and doesn't require
a docker account.

See [the official docker installation guide](https://www.docker.com/get-started) if the above step fails for some
reason.

### Project setup

To set the project up, run the following commands in the directory where you
keep your projects:

    mkdir CALI
    cd CALI
    git clone https://github.com/CCALI/CAJA
    cd CAJA
    ./docker-scripts/setup.sh

### Building

To build the app, run `./CAJA/docker-scripts/build.sh` from the `CALI/` directory. You'll
(possibly infrequently) need to re-run it (or at least `npm run build:server` from
the `CAJA/` directory) when you change the node app, as the frontend should not
need to be rebuilt during development.

### Running

To run the project(use 2 terminals):
    Terminal 1, from the `CALI/` directory,
    docker-compose down && docker-compose up --build

    seed the db in the 2nd terminal (See below) on first run

To run the NodeJS server for templates in Terminal 2:
    cd CAJA
    DEBUG=A2J:* npm run start

note: you may need to update `config.json` in the `CALI/` directory with an explicit `GUIDES_DIR` path.
Ex: `  "GUIDES_DIR": "/Users/mitchel/Sites/CALI/userfiles/",` rather than the default `/tmp/userfiles/`.

To quit either, you can type `Ctrl-c`

### Seed the mysql database (first run)
    docker ps
    copy CONTAINER ID for mysql
        example:
            CONTAINER ID        IMAGE
            ecb7236e5bbe        cali_web
    ---->   86fc202fff14        mysql:5.7
    docker exec -it <pastedContainerID> /bin/bash
    mysql -u root -p caja < tmp/repo-resources/caja_default_2018-10-09.sql

Navigate to:
`http://localhost/CAJA/js/author/`

to load the A2J Author app.
