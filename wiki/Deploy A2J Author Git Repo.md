# new deploy setup, or wipe out old
su - a2jprod
cd /vol/data/sites/drupal7.a2j/
rm -rf app
git clone https://github.com/CCALI/CAJA.git app

cd app

# install globals
npm install -g grunt-cli
npm install -g babel-cli
npm install -g steal-tools@1
npm install -g node-pre-gyp

# install app dependencies
npm install
cd js
npm install
cd ..

#build app
npm run build
npm run build:server
npm run build:client

#rename html files
cd js/author
mv index.html index.dev.html
mv index.production.html index.html

cd ../viewer
mv index.html index.dev.html
mv index.production.html index.html

# setup and start pm2/node
cd ../../
pm2 list

# delete old pm2 process
pm2 delete 0 or pm2 delete staging-api

# start node with pm2, change name in quotes as needed
pm2 start npm --name "dev-3000" -- run start

# QA test deploy
