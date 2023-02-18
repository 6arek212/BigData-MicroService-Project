const { Kafka, Partitioners, CompressionTypes } = require('kafkajs')
const config = require('./kafka_config')

const kafka = new Kafka(config)


const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner })
producer.connect().then(res => { }).catch(e => {})

module.exports = (topic) => {
    return {
        produce: async (data) => {
            await producer.send({
                topic: topic,
                compression: CompressionTypes.GZIP,
                messages: [{ value: JSON.stringify(data) }],
            })
        },
        disconnect: producer.disconnect
    }
}