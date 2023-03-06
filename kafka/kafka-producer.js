const { Kafka, Partitioners, CompressionTypes } = require('kafkajs')
const config = require('./kafka_config')

const kafka = new Kafka(config)


module.exports = (topic) => {
    const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner })

    return {
        connect: producer.connect,
        produce: async ({ key, value }) => {
            await producer.send({
                topic: topic,
                compression: CompressionTypes.GZIP,
                messages: [{ key: key, value: JSON.stringify(value) }],
            })
        },
        disconnect: producer.disconnect
    }
}