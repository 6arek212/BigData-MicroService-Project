const io = require('socket.io')




module.exports = ({ server, onEmit }) => {

    const socket = io(server)

    socket.on('connection', async function (clientSocket) {
        console.log('New client connected with id = ', clientSocket.id);
        const data = await onEmit()
        clientSocket.emit('stats', data)

        clientSocket.on('disconnect', function (reason) {
            console.log('A client disconnected with id = ', clientSocket.id, " reason ==> ", reason);
        });
    });




    return {
        emit: async () => {
            const data = await onEmit()
            console.log(data);
            socket.emit('stats', data)
        }
    }
}