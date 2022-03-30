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

    async getTones(soundFile, maxDigits = 1, validDigits = '0123456789#*', timeout = 5000, timeBetween = 1500, bip = true) {
        console.log('GetTones begin')
        let count = 0
        let executeTime = 0
        let startTime = performance.now()
        let result = ''
        if(soundFile) {
            try {
                await this.command(`STREAM FILE ${soundFile}`)
            } catch(err) {
                console.log(`soundFile '${soundFile}' not found `, err)
            }
        }
        if(bip) {
            try {
                await this.command(`STREAM FILE beep ''`)
            } catch(err) {
                console.log(`BEEP STREAM FAILED`, err)
            }
        }
        while (count < maxDigits) {
            if (executeTime = performance.now() - startTime >= timeout && count === 0) {
                break
            }
            try {
                let res = await this.command(`WAIT FOR DIGIT ${timeBetween}`)
                if (res.code == 200 && validDigits.match(String.fromCharCode(res.result))) {
                    result += String.fromCharCode(res.result)
                    count++
                }
            } catch(err) {
                console.log('WAIT FOR DIGIT FAILED', err)
            }

        }
        return result
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