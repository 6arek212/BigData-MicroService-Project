const rediesModule = require('./redis');
const kafkaModule = require('./kafka');
const expressLoader = require('./express')
const socketIo = require('./socketio-module')

module.exports = async ({ expressApp, server }) => {

    const db = await rediesModule({ clearOnStart: true })
    console.log('Redis module loaded');

    const { emit: emitter } = socketIo({ server: server, onEmit: db.fetchStats })


    await kafkaModule({ db: db, emitter: emitter })
    console.log('Kafka module loaded');


    await expressLoader({ app: expressApp });
    console.log('Express module loaded');

}