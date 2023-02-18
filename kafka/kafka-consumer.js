const { Kafka } = require('kafkajs')
const config = require('./kafka_config')

const kafka = new Kafka(config)



module.exports = (topic, gid = 0) => {
    const consumer = kafka.consumer({ groupId: `kivalmel-${gid}` })

    return {
        connect: consumer.connect,
        run: async (obj) => {
            await consumer.subscribe({ topic, fromBeginning: true })
            await consumer.run(obj)
        }
    }
}