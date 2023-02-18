require("dotenv").config({ path: '../.env' })
const storeProducer = require('../kafka/kafka-producer')(process.env.STORES_TOPIC)



const makeRandomStoreData = async () => {
    await storeProducer.connect()
    await storeProducer.produce({ _id: 1, isOpened: 1 })
    await storeProducer.produce({ _id: 2, isOpened: 1 })
    await storeProducer.produce({ _id: 3, isOpened: 1 })
    await storeProducer.produce({ _id: 4, isOpened: 1 })
    await storeProducer.produce({ _id: 2, isOpened: 0 })

    storeProducer.disconnect()
}


makeRandomStoreData()