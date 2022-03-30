// const Service = require('./service')

// class ServiceOne extends Service {
//     constructor() {
//         super()
//         console.log('Child ServiceOne constructor')
//     }

//     async exec(vs) {
//         console.log('Child ServiceOne execution')
//         try {
//             const now = Date.now()/1000 + 3600*2
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
            const now = Date.now()/1000 + 3600*2
            await vs.command('Say Date "' + now + '" ""')
            console.log('saying finished')
            await vs.command('Hangup')
            console.log('hangup OK')
        } catch(err) {
            console.log(err)
        }
    }
}