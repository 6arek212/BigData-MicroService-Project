const { Kafka } = require('kafkajs')
const config = require('./kafka_config')

const kafka = new Kafka(config)

const consumer = kafka.consumer({ groupId: 'kivalmel-' })

module.exports = (topic) => {
    return {
        run: async (obj) => {
            await consumer.connect()
            await consumer.subscribe({ topic, fromBeginning: true })
            await consumer.run(obj)
        }
    }
}