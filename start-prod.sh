# !bin/sh

export NODE_ENV=production
cd ./server
pm2 start ./src/index.js -n everyday-server

# cd ../wxapp