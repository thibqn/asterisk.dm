class Service {
    constructor() {
        console.log('Service constructor')
    }

    exec() {
        throw new Error('Abstract method. Implement this in child class')
    }
}

module.exports = new Service()