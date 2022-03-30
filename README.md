# asterisk.dm

node.js asterisk pbx

This is based on "asterisk.io", developped by Zugravu Eugen Marius.
That provide you to manage easily calls on your asterisk serveur

[1. Install](#1-install)

[2. How to use](#2-how-to-use)

[2.1 AMI](#21-ami)

[2.1.1 Actions](#211-actions)

[2.1.2 Events](#212-events)

[2.2 AGI](#22-agi)

[3. TODO](#3-todo)

## 1. Install

```
npm install asterisk.dm
```

## 2. How to use

```javascript
const VocalServer = require('asterisk.dm')
const path = require('path')

const vs = new VocalServer(path.resolve('./conf/ami.conf'), path.resolve('./conf/agi.conf'), path.resolve('./services/'))

vs.init().then(() => {
    vs.load()
})
```
ami.conf
```json
{
    "domain": "127.0.0.1",
    "port": 5038,
    "login": "username",
    "pwd": "password"
}
```
agi.conf
```json
{
    "domain": "127.0.0.1",
    "port": 4573,
}
```
You must defined a folder that will contains your services. A service can be written like :

```javascript
module.exports = {
    exec: async function(vs) {
        try {
            const now = Date.now()/1000 + 3600*2
            await vs.command('Say Date "' + now + '" ""')
            await vs.command('Hangup')
        } catch(err) {
            console.log(err)
        }
    }
}
```

### 2.1 AMI

Read more at [asterisk wiki](https://wiki.asterisk.org/wiki/display/AST/Asterisk+13+Documentation) for: [actions](https://wiki.asterisk.org/wiki/display/AST/Asterisk+13+AMI+Actions), [events](https://wiki.asterisk.org/wiki/display/AST/Asterisk+13+AMI+Events).

This part is not tested yet. Probably work but... who know !


### 2.2 AGI

Documetation for [agi commands](https://wiki.asterisk.org/wiki/display/AST/Asterisk+13+AGI+Commands) on [asterisk wiki](https://wiki.asterisk.org/wiki/display/AST/Asterisk+13+Documentation) page.

You can use all AGI commands that asterisk provides

## 3. TODO

- UI: real time user interface
- helpers : add fonctionnality to Vocal and VocalServer like getTones (catching multiple digits), conBridge (fusion 2 channels easily)