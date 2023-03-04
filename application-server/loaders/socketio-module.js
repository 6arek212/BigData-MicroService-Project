const io = require('socket.io')




module.exports = ({ server, onEmit }) => {

    const socket = io(server)

    socket.on('connection', async function (socket) {
        console.log('New client connected with id = ', socket.id);
        const data = await onEmit()
        socket.emit('stats', data)

        socket.on('disconnect', function (reason) {
            console.log('A client disconnected with id = ', socket.id, " reason ==> ", reason);
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