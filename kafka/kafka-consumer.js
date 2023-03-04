const { Kafka } = require('kafkajs')
const config = require('./kafka_config')

const kafka = new Kafka(config)



module.exports = (topic, gid) => {
    const consumer = kafka.consumer({ groupId: `kivalmel-${gid}` })

    return {
        connect: async () => {
            await consumer.connect()
            await consumer.subscribe({ topic, fromBeginning: true })
        },
        run: consumer.run
    }
}