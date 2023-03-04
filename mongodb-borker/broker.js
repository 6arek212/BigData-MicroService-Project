require('dotenv').config();
const kafkaConsumer = require('../kafka/kafka-consumer')('kivalmel-pizza-order', 2)
const mongoose = require('mongoose')
const Pizza = require('./Pizza')


const run = async () => {
    await mongoose.connect(`mongodb+srv://${process.env.MONGODB_UR}:${process.env.MONGODB_PW}@cluster0.jtlop4i.mongodb.net/?retryWrites=true&w=majority`,
        { useNewUrlParser: true, useUnifiedTopology: true })
    console.log('broker connected to mongodb');

    await kafkaConsumer.connect()
    console.log('kafka consumer connected to mongodb');

    kafkaConsumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            try {
                const data = JSON.parse(message.value)
                console.log(data._id);
                if (data.status === 'in-progress') {
                    await Pizza.create(data)
                }
                else {
                    await Pizza.updateOne({ _id: data._id }, data)
                }
            }
            catch (err) {
                console.log(err)
            }
        }
    })
}


run()