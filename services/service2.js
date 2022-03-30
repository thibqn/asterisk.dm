// const Service = require('./service')

// class ServiceTwo extends Service {
//     constructor() {
//         super()
//         console.log('Child ServiceTwo constructor')
//     }

//     async exec(vs) {
//         console.log('Child ServiceTwo execution')
//         try {
//             const now = Date.now()/1000 - 3600*24
//             await vs.command('Say Date "' + now + '" ""')
//             console.log('saying finished')
//             await vs.command('Hangup')
//             console.log('hangup OK')
//         } catch(err) {
//             console.log(err)
//         }
//     }
// }

module.exports = {
    exec: async function(vs) {
        try {
            const now = Date.now()/1000 - 3600*24
            let result = await vs.getTones('', 6)
            console.log(`getTones result : ${result}`)
            await vs.command('Say Date "' + now + '" ""')
            console.log('saying finished')
            await vs.command('Hangup')
            console.log('hangup OK')
        } catch(err) {
            console.log(err)
        }
    }
}