const { createAdapter } = require("@socket.io/cluster-adapter");
const { Server } = require("socket.io");
const { setupWorker } = require("@socket.io/sticky");


const SOCKET_IO_TOPICS = {
    STATS: 'stats',
    ASSOCIATION_MODEL: 'association_model',
}

const makeSocketIoModel = ({ server, emitters }) => {
    const socket = new Server(server)
    socket.adapter(createAdapter());
    setupWorker(socket);


    socket.on('connection', async function (clientSocket) {
        console.log('New client connected with id = ', clientSocket.id);

        for (const em in emitters) {
            const data = await emitters[em]()
            clientSocket.emit(em, data)
        }


        clientSocket.on('disconnect', function (reason) {
            console.log('A client disconnected with id = ', clientSocket.id, " reason ==> ", reason);
        });
    });




    return {
        emit: async (topic) => {
            if (!emitters[topic]) {
                console.log('emitter not function found');
            }
            const data = await emitters[topic]()
            console.log('emitting data');
            socket.emit(topic, data)
        }
    }
}

module.exports = {
    SOCKET_IO_TOPICS,
    makeSocketIoModel
}