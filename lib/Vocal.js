const path = require('path')

const codesAvailable = [
    {
        code: '100',
        service: {
            name: 'service 1',
            file: 'service1.js'
        }
    },
    {
        code: '102',
        service: {
            name: 'service 2',
            file: 'service2.js'
        }
    }
]

const reset_cache = (file_path) => {
    var p = path.resolve(file_path);
    const EXTENTION = '.js';
    delete require.cache[p.endsWith(EXTENTION) ? p : p + EXTENTION];
}

class Vocal {
    constructor(agiHandler, servicePath) {
        this.agiHandler = agiHandler
        this.servicePath = servicePath
    }

    checkExtension() {
        return new Promise((resolve, reject) => {
            console.log('[VS-checkExtention()] - Begin')
            let itemCount = 0
            codesAvailable.forEach(code => {
                itemCount++
                if(code.code == this.exten) {
                    console.log('code available - ', code)
                    resolve(code.service)
                    return
                } else if (itemCount === codesAvailable.length) {
                    reject('No match found with extension : ' + this.exten)
                    return
                }
            })
        })
    }

    async command(cmd) {
        return new Promise((resolve, reject) => {
            if (!this.agiHandler) reject()
            else {
                this.agiHandler.command(cmd, (code, result, data) => {
                    if(isNaN(code)){
                        reject();
                    }

                    if(code != 200){
                        reject(code);
                    }
                    resolve({code, result, data})
                })
            }
        })
    }

    run() {
        this.exten = this.agiHandler.agi_extension
        this.checkExtension().then((result) => {
            this.command('Answer').then(() => this.command('Wait for digit 750')).then(() => {
                reset_cache(this.servicePath + '/' + result.file)
                let service = require(this.servicePath + '/' + result.file).exec
                service(this)
            }).catch(err => {
                console.log('error : ', err)
            })
        }).catch(err => {
            console.log(err)
            this.command('Hangup')
        })
    }
}

module.exports = Vocal