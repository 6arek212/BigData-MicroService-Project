const configs = require('../../configs')

const kafkaStoresConsumer = require('../../../kafka/kafka-consumer')(configs.storesTopic, 'STORES_1')



module.exports = async (db, eventEmitter) => {
    await kafkaStoresConsumer.connect()


    const storeUseCase = async ({ topic, partition, message }) => {
        try {
            const data = JSON.parse(message.value)
            db.updateStoreStatus(data)
            eventEmitter({ type: 'store-update', payload: data })
        }
        catch (e) {
            console.log(e);
        }
    }



    kafkaStoresConsumer.run({
        eachMessage: storeUseCase
    })
}

