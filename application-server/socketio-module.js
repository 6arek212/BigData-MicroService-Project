const sio = require('socket.io')
let io = null;
let subscriber = null;


module.exports = {
    //Initialize the socket server
    initialize: (httpServer) => {
        io = sio(httpServer);
        io.on('connection', function (socket) {
            console.log('New client connected with id = ', socket.id);
            socket.on('disconnect', function (reason) {
                console.log('A client disconnected with id = ', socket.id, " reason ==> ", reason);
            });
        });

        if (subscriber != null) subscriber()
    },
    //return the io instance
    getInstance: () => {
        return io;
    },
    waitForInit: (callback) => {
        if (io == null)
            return subscriber = callback
        callback()
    }
}