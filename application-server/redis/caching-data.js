const kafkaOrdersConsumer = require('../../kafka/kafka-consumer')(process.env.PIZZA_TOPIC, 0)
const kafkaStoresConsumer = require('../../kafka/kafka-consumer')(process.env.STORES_TOPIC, 1)
const redis = require('redis')
const cron = require('node-cron');
const fs = require('fs')
const { makePairsFromArray, objectToArray } = require('../utils/helper-functions')
const keys = require('./redis-keys')
const moment = require('moment')
const redisClient = redis.createClient()
const io = require('../socketio-module')



const lua = {
    script: fs.readFileSync('./update_process_time.lua', 'utf8'),
    sha: null
};


redisClient.connect()
redisClient.on('connect', async () => {
    console.log('Connected to Redis')
})
redisClient.on('error', (err) => {
    console.log('Error occured while connecting or accessing redis server');
});


// clear redis every day at 00:00
cron.schedule('0 0 * * *', async () => {
    console.log('running a task every minute');
    await redisClient.flushAll()
});


io.onInit(() => {
    io.getInstance().on('connection', function (socket) {
        console.log('New client connected with id = ', socket.id);
        emitStats(socket)
        socket.on('disconnect', function (reason) {
            console.log('A client disconnected with id = ', socket.id, " reason ==> ", reason);
        });
    });
})


const emitStats = async (socket) => {
    const opendStoresCount = await redisClient.zCount(keys.STORE_STATUS_KEY, 1, 1) || 0
    const ordersCount = await redisClient.get(keys.ORDERS_COUNT) || 0
    const ordersInProgressCount = await redisClient.get(keys.ORDERS_INPROGRESS_COUNT) || 0
    const processAvg = (await redisClient.get(keys.ORDERS_PROCESS_AVG) / (ordersCount - ordersInProgressCount)) || 0
    const distribution = await redisClient.hGetAll(keys.ORDERS_BY_REGION)
    const topAdditions = makePairsFromArray(await redisClient.sendCommand(['ZREVRANGE', keys.ORDERS_ADDITION_POPULAR, '0', '5', 'withscores']))
    const orderByHour = makePairsFromArray(await redisClient.sendCommand(['ZREVRANGE', keys.ORDERS_BY_HOUR, '0', '5', 'withscores']))
    const topProcessTimes = makePairsFromArray(await redisClient.sendCommand(['ZRANGE', keys.ORDERS_PROCESS_TIME_LEADBOARD, '0', '5', 'withscores']))

    console.log('emitting');
    let sio = null

    if (socket != null) {
        sio = socket
    }
    else {
        sio = io.getInstance()
    }

    sio.emit('stats', {
        opendStoresCount,
        ordersCount,
        ordersInProgressCount,
        processAvg,
        orderByHour,
        topAdditions,
        topProcessTimes,
        distribution: objectToArray(distribution)
    })
}



const updateOrderProcessTime = async (order) => {
    if (order.status !== 'done')
        return

    // in seconds
    const diff = new Date(order.finishedAt) - new Date(order.createdAt)
    const finishTime = diff / 1000
    redisClient.incrByFloat(keys.ORDERS_PROCESS_AVG, finishTime)
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

    // in sec
    const diff = new Date(order.finishedAt) - new Date(order.createdAt)
    const finishTime = diff / (1000)
    console.log(order.store_id, finishTime, '...............')

    await redisClient.eval(lua.script,
        {
            keys: [keys.ORDERS_PROCESS_TIME_LEADBOARD, order.region],
            arguments: [finishTime + '']
        }
    )
}


// handle counters by regions
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
                        await redisClient.multi()
                            .incr(keys.ORDERS_COUNT)
                            .incr(keys.ORDERS_INPROGRESS_COUNT)
                            .exec()
                    else
                        await redisClient.decr(keys.ORDERS_INPROGRESS_COUNT)

                    // update orders region count
                    await ordersByRegion(order)

                    await processLeadBoard(order)

                    // additions lead board
                    await additionsLeadBoard(order)

                    // order by hour
                    await ordersByHour(order)

                    // update proccess avg
                    await updateOrderProcessTime(order)

                    await emitStats()
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
                redisClient.zAdd(keys.STORE_STATUS_KEY, { value: store._id + '', score: store.isOpened })
            }
            catch (e) {
                console.log(e);
            }
        },
    })
})
