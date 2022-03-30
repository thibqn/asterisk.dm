const aio = require('asterisk.io');
const fs = require('fs');
const Vocal = require('./Vocal')

class VocalServer {
    constructor(amiConf, agiConf, servicePath) {
        this.amiConf = amiConf || './ami.conf'; // json format
        this.agiConf = agiConf || './agi.conf'; // json format
        this.servicePath = servicePath || './services/'
        this.ami = {}
        this.agi = {}
    }

    _getAmi() {
        return new Promise((resolve, reject) => {
            fs.readFile(this.amiConf, (err, data) => {
                if(err) reject(err)
                const conf = JSON.parse(data)
                const ami = aio.ami(conf.domain, conf.port, conf.login, conf.pwd)
                resolve(ami)
            });
        })
    }

    
    _getAgi() {
        return new Promise((resolve, reject) => {
            fs.readFile(this.agiConf, (err, data) => {
                if(err) reject(err)
                const conf = JSON.parse(data)
                const agi = aio.agi(conf.port, conf.domain)
                resolve(agi)
            });
        })
    }

    

    init() {
        return new Promise((resolve, reject) => {
            try {
                this._getAmi().then(res => {
                    this.ami = res
                    console.log('[VS-run()] - begin')
                    this.ami.on('eventAny', data => {
                        if (data.Event === 'Hangup') {
                            console.log('[VS-run()] - HangUp catched - run hangup functions');
                        }
                    });
                    this._getAgi().then(res => {
                        this.agi = res
                        // this.run()
                        resolve()
                    })
                })
            } catch (err) {
                reject(err)
            }
        })
    }

    

    action(name, data) {
        return new Promise(resolve => {
            this.ami.action(name, data, (data) => {
                resolve(data)
            })
        })
    }

    // run() {
    //     console.log('[VS-run()] - begin')
    //     this.ami.on('eventAny', data => {
    //         if (data.Event === 'Hangup') {
    //             console.log('[VS-run()] - HangUp catched - run hangup functions');
    //         }
    //     });
    // }

    load() {
        this.agi.on('connection', (handler) => {
            let vocal = new Vocal(handler, this.servicePath)
            vocal.run()
            this.agi.on('hangup', () => {
                console.log('[VS-load()] - HangUp catched')
            })
        })
        
    }
}

module.exports = VocalServer