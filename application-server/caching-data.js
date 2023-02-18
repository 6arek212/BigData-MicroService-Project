const kafkaOrdersConsumer = require('../kafka/kafka-consumer')(process.env.PIZZA_TOPIC)
const kafkaStoresConsumer = require('../kafka/kafka-consumer')(process.env.STORES_TOPIC)
const redis = require('redis')
const keys = require('./redis-keys')

const redisClient = redis.createClient()
redisClient.connect()

redisClient.on('connect', () => console.log('Connected to Redis'))
redisClient.on('error', (err) => {
    console.log('Error occured while connecting or accessing redis server');
});





const updateOrderProcessAvg = async (order) => {
    if (order.status !== 'done')
        return

    const ordersCount = await redisClient.get('ordersCount')
    const ordersInProgressCount = await redisClient.get('inProgressOrders')
    const doneOrdersCoubt = ordersCount - ordersInProgressCount
    const avg = await redisClient.get('processAvg')

    const timeToFinish = order.end_time - order.start_time
    redisClient.set('processAvg', (avg * doneOrdersCoubt + timeToFinish) / (doneOrdersCoubt + 1))
}

const additionsLeadBoard = async (order) => {
    if (order.status !== 'in-progress')
        return

    for (let addition of order.additions) {
        redisClient.zIncrBy(keys.ORDERS_ADDITION_POPULAR, 1, addition)
    }
}


const processLeadBoard = async (order) => {
    if (order.status !== 'done')
        return

    const processTime = order.end_time - order.start_time
    const currentProcessTime = await redisClient.zRevRank('orders:proccestime:lead', order.store_id)

    if (processTime < currentProcessTime)
        await redisClient.zAdd('orders:proccestime:lead', addition, { score: processTime })
}


const ordersByHour = async (order) => {
    if (order.status !== 'in-progress')
        return

    const date = new Date(order.createdAt)
    redisClient.zIncrBy(keys.ORDERS_BY_HOUR, 1, date.getHours() + ':00')
}


kafkaOrdersConsumer.run({
    eachMessage: async ({ topic, partition, message }) => {
        const order = JSON.parse(message.value)
        console.log(order, 'application server');

        //orders count
        await redisClient.incr(keys.ORDERS_COUNT)


        // // update process time lead board
        // await processLeadBoard(order)

        // additions lead board
        await additionsLeadBoard(order)

        // order by hour
        await ordersByHour(order)

        // // update proccess avg
        // await updateOrderProcessAvg(order)

        // in progress orders count
        if (order.status === 'in-progress')
            await redisClient.incr(keys.ORDERS_INPROGRESS_COUNT)
        else
            await redisClient.decr(keys.ORDERS_INPROGRESS_COUNT)

    },
})



kafkaStoresConsumer.run({
    eachMessage: async ({ topic, partition, message }) => {
        try {

            const store = JSON.parse(message.value)
            console.log(store, 'application server');
            const prevStatus = await redisClient.hGet(keys.STORE_STATUS_KEY, String(store._id))

            // check if the stored value[isOpened] equal the current store value[isOpened]
            if (prevStatus === String(store.isOpened)) {
                return
            }

            if (store.isOpened) {
                redisClient.hSet(keys.STORE_STATUS_KEY, store._id, 1)
                redisClient.hIncrBy(keys.STORE_STATUS_KEY, 'sum', 1)
            }
            else {
                redisClient.hSet(keys.STORE_STATUS_KEY, store._id, 0)
                redisClient.hIncrBy(keys.STORE_STATUS_KEY, 'sum', -1)
            }
        }
        catch (e) {
            console.log(e);
        }
    },
})
