const configs = require('../../configs')

const kafkaOrdersConsumer = require('../../../kafka/kafka-consumer')(configs.pizzaTopic, 'ORDERS_1')


module.exports = async (db, eventEmitter) => {
    await kafkaOrdersConsumer.connect()


    const oderUseCase = async ({ topic, partition, message }) => {

        try {
            const order = JSON.parse(message.value)

            if (order.status === 'in-progress')
                await db.inProgressFun(order)
            else
                await db.doneFun(order)

            eventEmitter({ type: 'orders-update', payload: order })
        }
        catch (e) {
            console.log(e);
        }
    }




    kafkaOrdersConsumer.run({
        eachMessage: oderUseCase,
    })

}

