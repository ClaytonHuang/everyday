var redis = require('redis')
const client = redis.createClient()

client.on('ready', res => {
  console.log('redis is ready')
})

module.exports = client