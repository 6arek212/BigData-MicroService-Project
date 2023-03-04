const rediesModule = require('./redis');
const kafkaModule = require('./kafka');
const expressLoader = require('./express')
const socketIo = require('./socketio-module')
const elasticsearch = require('./elastic-search');



module.exports = async ({ expressApp, server }) => {

    const dbRedis = await rediesModule({ clearOnStart: true })
    console.log('Redis module loaded');

    const dbElastic = await elasticsearch()
    console.log('Elasticsearch module loaded');


    const { emit: emitter } = socketIo({ server: server, onEmit: dbRedis.fetchStats })
    console.log('Socketio module loaded');


    await kafkaModule({ db: dbRedis, emitter: emitter })
    console.log('Kafka module loaded');


    await expressLoader({ app: expressApp, dbSearch: dbElastic });
    console.log('Express module loaded');

}