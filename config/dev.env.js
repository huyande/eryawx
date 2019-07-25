var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

// http://localhost:83/ http://132.232.7.250:82/ https://www.qiqibl.com:83/
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_ROOT_URL:'"https://www.qiqibl.com:83/"'
})
