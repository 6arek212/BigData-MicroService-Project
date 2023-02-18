const { Kafka, Partitioners, CompressionTypes } = require('kafkajs')
const config = require('./kafka_config')

const kafka = new Kafka(config)


module.exports = (topic) => {
    const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner })

    return {
        connect: producer.connect,
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