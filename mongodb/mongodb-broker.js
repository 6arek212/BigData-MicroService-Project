const { Kafka } = require('kafkajs')
const mongoose = require('mongoose')
const Pizza = require('./Pizza')

mongoose.set('strictQuery', false)
mongoose.connect(`mongodb+srv://${process.env.MONGODB_UR}:${process.env.MONGODB_PW}@cluster0.jtlop4i.mongodb.net/?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('connected');
    })
    .catch((e) => {
        console.log('error');
    })





const kafka = new Kafka({
    clientId: 'project1',
    brokers: ['dory.srvs.cloudkafka.com:9094'],
    ssl: true,
    sasl: {
        mechanism: 'SCRAM-SHA-512',
        username: 'kivalmel',
        password: 'SolTfOYwpnOnp3nUlEiRfdMzSrj1cxQP',
    },
})


const topic = 'kivalmel-pizza-order'

const consumer = kafka.consumer({ groupId: 'kivalmel-' })

const run = async () => {
    await consumer.connect()
    await consumer.subscribe({ topic, fromBeginning: true })
    await consumer.run({
        // eachBatch: async ({ batch }) => {
        //   console.log(batch)
        // },
        eachMessage: async ({ topic, partition, message }) => {
            await Pizza.create({
                ...JSON.parse(message.value)
            })
        },
    })
}


run()