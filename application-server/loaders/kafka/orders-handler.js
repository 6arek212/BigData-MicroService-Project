const kafkaOrdersConsumer = require('../../../kafka/kafka-consumer')(process.env.PIZZA_TOPIC, 0)


module.exports = async (db, eventEmitter) => {
    await kafkaOrdersConsumer.connect()


    const oderUseCase = async ({ topic, partition, message }) => {

        try {

            const order = JSON.parse(message.value)

            //orders count1
            if (order.status === 'in-progress')
                db.updateOrdersCount()
            else
                db.decreaseInProgressOrdersCount()

            // update orders region count
            await db.ordersByRegion(order)

            await db.processLeadBoard(order)

            // additions lead board
            await db.additionsLeadBoard(order)

            // order by hour
            await db.ordersByHour(order)

            // update proccess avg
            await db.updateOrderProcessTime(order)

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

