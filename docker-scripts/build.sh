#!/bin/sh

cd CAJA
npm install
cd js
npm install
cd ..
npm run build
npm run build:server
