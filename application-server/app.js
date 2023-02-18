const express = require('express')
require("dotenv").config({ path: '../.env' })
const path = require("path")
require('./caching-data')
const redis = require('redis')
const keys = require('./redis-keys')

const redisClient = redis.createClient()
redisClient.connect()
redisClient.on('connect', () => console.log('Connected to Redis'))
redisClient.on('error', (err) => { console.log('Error occured while connecting or accessing redis server'); });


const app = express()
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "views")));


const makePairs = (array) => {
    newArray = []
    for (let i = 0; i < array.length - 1; i += 2) {
        newArray.push({ key: array[i], value: array[i + 1] })
    }
    return newArray
}


const objectToArray = (obj) => {
    arr = []
    for (k in obj) {
        arr.push({ key: k, value: obj[k] })
    }
    return arr
}

app.get('/', async (req, res, next) => {
    const opendStoresCount = await redisClient.hGet(keys.STORE_STATUS_KEY, keys.STORE_STATUS_V_SUM)

    const ordersCount = await redisClient.get(keys.ORDERS_COUNT)
    const ordersInProgressCount = await redisClient.get(keys.ORDERS_INPROGRESS_COUNT)
    const processAvg = await redisClient.get(keys.ORDERS_PROCESS_AVG)
    // const topAdditions = await redisClient.zRange(keys.ORDERS_ADDITION_POPULAR, -2, -1 , 'WITHSCORES')
    // const orderByHour = await redisClient.zRange(keys.ORDERS_BY_HOUR, -3, -1, 'WITHSCORES')
    // const topProcessTimes = await redisClient.zRange(keys.ORDERS_PROCESS_TIME_LEADBOARD, 0, 5, 'WITHSCORES')
    const distribution = await redisClient.hGetAll(keys.ORDERS_BY_REGION)

    const topAdditions = makePairs(await redisClient.sendCommand(['ZREVRANGE', keys.ORDERS_ADDITION_POPULAR, '0', '5', 'withscores']))
    const orderByHour = makePairs(await redisClient.sendCommand(['ZREVRANGE', keys.ORDERS_BY_HOUR, '0', '5', 'withscores']))
    const topProcessTimes = makePairs(await redisClient.sendCommand(['ZRANGE', keys.ORDERS_PROCESS_TIME_LEADBOARD, '0', '5', 'withscores']))


    res.render("index", {
        opendStoresCount,
        ordersCount,
        ordersInProgressCount,
        processAvg,
        orderByHour,
        topAdditions,
        topProcessTimes,
        distribution: objectToArray(distribution)
    });
    // res.status(200).json({
    //     message: 'fetch success',
    //     opendStoresCount,
    //     ordersCount,
    //     ordersInProgressCount,
    //     processAvg,
    //     orderByHour,
    //     topAdditions,
    //     topProcessTimes,
    //     distribution
    // })
})







module.exports = app