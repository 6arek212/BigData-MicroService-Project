const express = require('express')
require("dotenv").config({ path: '../.env' })
require('./caching-data')
const redis = require('redis')
const keys = require('./redis-keys')

const redisClient = redis.createClient()
redisClient.connect()
redisClient.on('connect', () => console.log('Connected to Redis'))
redisClient.on('error', (err) => { console.log('Error occured while connecting or accessing redis server'); });


const app = express()


app.get('/', async (req, res, next) => {
    const opendStoresCount = await redisClient.hGet(keys.STORE_STATUS_KEY, keys.STORE_STATUS_V_SUM)

    const ordersCount = await redisClient.get(keys.ORDERS_COUNT)
    const ordersInProgressCount = await redisClient.get(keys.ORDERS_INPROGRESS_COUNT)


    res.status(200).json({
        message: 'fetch success',
        opendStoresCount,
        ordersCount,
        ordersInProgressCount
    })
})







module.exports = app