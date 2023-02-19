const sio = require('socket.io')
let io = null;
let subscribers = [];


module.exports = {
    //Initialize the socket server
    initialize: (httpServer) => {
        io = sio(httpServer);
        for (let sub of subscribers)
            sub()
    },
    //return the io instance
    getInstance: () => {
        return io;
    },
    // subscribe to get notified when the io is initialize
    onInit: (callback) => {
        if (io == null)
            return subscribers.push(callback)
        callback()
    }
}