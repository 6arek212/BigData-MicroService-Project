const kafkaStoresConsumer = require('../../../kafka/kafka-consumer')(process.env.STORES_TOPIC, 1)



module.exports = async (db, eventEmitter) => {
    await kafkaStoresConsumer.connect()


    const storeUseCase = async ({ topic, partition, message }) => {
        try {
            const update = JSON.parse(message.value)
            db.updateStoreStatus(update)
            eventEmitter({ type: 'store-update', payload: update })
        }
        catch (e) {
            console.log(e);
        }
    }



    kafkaStoresConsumer.run({
        eachMessage: storeUseCase
    })
}

