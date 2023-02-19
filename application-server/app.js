const express = require('express')
require("dotenv").config({ path: '../.env' })
const path = require("path")
require('./caching-data')
const cors = require('cors')
const redis = require('redis')
const keys = require('./redis-keys')
const { makePairsFromArray , objectToArray} = require('./utils/helper-functions')
const redisClient = redis.createClient()
redisClient.connect()
redisClient.on('connect', () => console.log('Connected to Redis'))
redisClient.on('error', (err) => { console.log('Error occured while connecting or accessing redis server'); });


const app = express()
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "views")));

app.use(cors())



app.get('/', async (req, res, next) => {
    // const opendStoresCount = await redisClient.hGet(keys.STORE_STATUS_KEY, keys.STORE_STATUS_V_SUM)

    const opendStoresCount = await redisClient.zCount(keys.STORE_STATUS_KEY, 1, 1) || 0


    const ordersCount = await redisClient.get(keys.ORDERS_COUNT) || 0
    const ordersInProgressCount = await redisClient.get(keys.ORDERS_INPROGRESS_COUNT) || 0
    const processAvg = (await redisClient.get(keys.ORDERS_PROCESS_AVG) / (ordersCount - ordersInProgressCount)) || 0
    const distribution = await redisClient.hGetAll(keys.ORDERS_BY_REGION)

    const topAdditions = makePairsFromArray(await redisClient.sendCommand(['ZREVRANGE', keys.ORDERS_ADDITION_POPULAR, '0', '5', 'withscores']))
    const orderByHour = makePairsFromArray(await redisClient.sendCommand(['ZREVRANGE', keys.ORDERS_BY_HOUR, '0', '5', 'withscores']))
    const topProcessTimes = makePairsFromArray(await redisClient.sendCommand(['ZRANGE', keys.ORDERS_PROCESS_TIME_LEADBOARD, '0', '5', 'withscores']))

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