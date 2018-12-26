#!/bin/sh

cd CAJA
npm install
cd js
npm install
cd ..
npm run build:server
npm run build:client
