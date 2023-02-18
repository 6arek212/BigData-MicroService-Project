const kafkaOrdersConsumer = require('../kafka/kafka-consumer')(process.env.PIZZA_TOPIC, 0)
const kafkaStoresConsumer = require('../kafka/kafka-consumer')(process.env.STORES_TOPIC, 1)
const redis = require('redis')
const keys = require('./redis-keys')
const moment = require('moment')
const kafkaConsumer = require('../kafka/kafka-consumer')
const redisClient = redis.createClient()
redisClient.connect()

redisClient.on('connect', () => console.log('Connected to Redis'))
redisClient.on('error', (err) => {
    console.log('Error occured while connecting or accessing redis server');
});





const updateOrderProcessAvg = async (order) => {
    if (order.status !== 'done')
        return

    const ordersCount = await redisClient.get(keys.ORDERS_COUNT)
    const ordersInProgressCount = await redisClient.get(keys.ORDERS_INPROGRESS_COUNT)
    const doneOrdersCount = ordersCount - ordersInProgressCount
    const avg = await redisClient.get(keys.ORDERS_PROCESS_AVG) | 0

    // in seconds
    const diff = new Date(order.finishedAt) - new Date(order.createdAt)
    const finishTime = diff / 1000

    console.log(ordersCount, ordersInProgressCount, doneOrdersCount, finishTime, avg, (avg * doneOrdersCount + finishTime) / (doneOrdersCount + 1));

    redisClient.set(keys.ORDERS_PROCESS_AVG, (avg * doneOrdersCount + finishTime) / (doneOrdersCount + 1))
}


const additionsLeadBoard = async (order) => {
    if (order.status !== 'in-progress')
        return

    for (let addition of order.additions) {
        redisClient.zIncrBy(keys.ORDERS_ADDITION_POPULAR, 1, addition)
    }
}


const ordersByHour = async (order) => {
    if (order.status !== 'in-progress')
        return
    const date = new Date(order.createdAt)
    date.setMinutes(0)
    date.setMilliseconds(0)
    const formatedDate = moment(date).format('yyyy/MM/DD HH:mm')
    console.log(formatedDate);
    await redisClient.zIncrBy(keys.ORDERS_BY_HOUR, 1, formatedDate)
}



const processLeadBoard = async (order) => {
    if (order.status !== 'done')
        return

    // in seconds
    const diff = new Date(order.finishedAt) - new Date(order.createdAt)
    const finishTime = diff / 1000
    console.log(order.store_id, finishTime, '...............');
    const currentProcessTime = await redisClient.zScore(keys.ORDERS_PROCESS_TIME_LEADBOARD, String(order.store_id))
    console.log('processLeadBoard', currentProcessTime, finishTime);

    if (!currentProcessTime || finishTime < currentProcessTime)
        await redisClient.zAdd(keys.ORDERS_PROCESS_TIME_LEADBOARD, { score: finishTime, value: String(order.store_id) })

}



const ordersByRegion = async (order) => {
    if (order.status !== 'in-progress')
        return
    await redisClient.hIncrBy(keys.ORDERS_BY_REGION, order.region, 1)
}


kafkaOrdersConsumer.connect()
    .then(res => {
        kafkaOrdersConsumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {

                    const order = JSON.parse(message.value)
                    console.log(order);

                    //orders count1
                    if (order.status === 'in-progress')
                        await redisClient.incr(keys.ORDERS_COUNT)

                    // update orders region count
                    await ordersByRegion(order)

                    // update process time lead board
                    await processLeadBoard(order)

                    // additions lead board
                    await additionsLeadBoard(order)

                    // order by hour
                    await ordersByHour(order)

                    // update proccess avg
                    await updateOrderProcessAvg(order)

                    // in progress orders count
                    if (order.status === 'in-progress')
                        await redisClient.incr(keys.ORDERS_INPROGRESS_COUNT)
                    else
                        await redisClient.decr(keys.ORDERS_INPROGRESS_COUNT)
                }
                catch (e) {
                    console.log(e);
                }
            },
        })
    })


// open stores count 
kafkaStoresConsumer.connect().then(res => {
    kafkaStoresConsumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            try {

                const store = JSON.parse(message.value)
                console.log(store, 'application server');
                const prevStatus = await redisClient.hGet(keys.STORE_STATUS_KEY, String(store._id))

                // check if the stored value[isOpened] equal the current store value[isOpened]
                if (prevStatus && prevStatus === String(store.isOpened)) {
                    return
                }

                if (store.isOpened) {
                    redisClient.hSet(keys.STORE_STATUS_KEY, store._id, 1)
                    redisClient.hIncrBy(keys.STORE_STATUS_KEY, keys.STORE_STATUS_V_SUM, 1)
                }
                else {
                    redisClient.hSet(keys.STORE_STATUS_KEY, store._id, 0)
                    redisClient.hIncrBy(keys.STORE_STATUS_KEY, keys.STORE_STATUS_V_SUM, -1)
                }
            }
            catch (e) {
                console.log(e);
            }
        },
    })
})
