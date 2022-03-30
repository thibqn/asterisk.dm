const VocalServer = require('../')
const path = require('path')

const vs = new VocalServer(path.resolve('./conf/ami.conf'), path.resolve('./conf/agi.conf'), path.resolve('./services/'))

vs.init().then(() => {
    console.log('init completed')
    console.log('waiting call...')
    vs.load()
})