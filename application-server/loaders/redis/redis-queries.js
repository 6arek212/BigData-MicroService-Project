const { objectToArray, makePairsFromArray } = require("../../utils/helper-functions")
const fs = require('fs')
const keys = require('./redis-keys')
const moment = require('moment')
const path = require('path')




const lua = {
    script: fs.readFileSync(path.join(__dirname, 'update_process_time.lua'), 'utf8'),
    sha: null
};






module.exports = async (redisClient) => {

    const inProgressFun = async (order) => {
        for (let addition of order.additions) {
            await redisClient.zIncrBy(keys.ORDERS_ADDITION_POPULAR, 1, addition)
        }

        const date = new Date(order.createdAt)
        date.setMinutes(0)
        date.setMilliseconds(0)
        const formatedDate = moment(date).format('yyyy/MM/DD HH:mm')


        await redisClient.multi()
            .incr(keys.ORDERS_COUNT)
            .incr(keys.ORDERS_INPROGRESS_COUNT)
            .hIncrBy(keys.ORDERS_BY_REGION, order.region, 1)
            .zIncrBy(keys.ORDERS_BY_HOUR, 1, formatedDate)
            .exec()
    }


    const doneFun = async (order) => {
        const diff = new Date(order.finishedAt) - new Date(order.createdAt)
        const finishTime = diff / 1000


        await redisClient
            .multi()
            .eval(lua.script,
                {   // changed region to store_name
                    keys: [keys.ORDERS_PROCESS_TIME_LEADBOARD, order.store_name, keys.BRANCH_ORDERS_COUNT_DONE],
                    arguments: [finishTime + '']
                }
            )
            .incrByFloat(keys.ORDERS_PROCESS_AVG, finishTime)
            .decr(keys.ORDERS_INPROGRESS_COUNT)
            .exec()
    }


    const updateOrderProcessTime = async (order) => {
        if (order.status !== 'done')
            return

        // in seconds
        const diff = new Date(order.finishedAt) - new Date(order.createdAt)
        const finishTime = diff / 1000
        await redisClient.incrByFloat(keys.ORDERS_PROCESS_AVG, finishTime)
    }


    const additionsLeadBoard = async (order) => {
        if (order.status !== 'in-progress')
            return

        for (let addition of order.additions) {
            await redisClient.zIncrBy(keys.ORDERS_ADDITION_POPULAR, 1, addition)
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



    const updateOrdersCount = async () => {
        await redisClient.multi()
            .incr(keys.ORDERS_COUNT)
            .incr(keys.ORDERS_INPROGRESS_COUNT)
            .exec()
    }


    const decreaseInProgressOrdersCount = async () => {
        await redisClient.decr(keys.ORDERS_INPROGRESS_COUNT)
    }




    const updateStoreStatus = async ({ _id, isOpened }) => {
        await redisClient.zAdd(keys.STORE_STATUS_KEY, { value: _id + '', score: isOpened })
    }


    const fetchStats = async () => {
        const opendStoresCount = await redisClient.zCount(keys.STORE_STATUS_KEY, 1, 1) || 0
        const ordersCount = await redisClient.get(keys.ORDERS_COUNT) || 0
        const ordersInProgressCount = await redisClient.get(keys.ORDERS_INPROGRESS_COUNT) || 0
        const processAvg = (await redisClient.get(keys.ORDERS_PROCESS_AVG) / (ordersCount - ordersInProgressCount)) || 0
        const distribution = await redisClient.hGetAll(keys.ORDERS_BY_REGION)
        const topAdditions = makePairsFromArray(await redisClient.sendCommand(['ZREVRANGE', keys.ORDERS_ADDITION_POPULAR, '0', '5', 'withscores']))
        const orderByHour = makePairsFromArray(await redisClient.sendCommand(['ZREVRANGE', keys.ORDERS_BY_HOUR, '0', '5', 'withscores']))
        const topProcessTimes = makePairsFromArray(await redisClient.sendCommand(['ZRANGE', keys.ORDERS_PROCESS_TIME_LEADBOARD, '0', '5', 'withscores']))

        orderByHour.sort((a, b) => a.key.localeCompare(b.key))

        return {
            opendStoresCount,
            ordersCount,
            ordersInProgressCount,
            processAvg,
            orderByHour,
            topAdditions,
            topProcessTimes,
            distribution: objectToArray(distribution)
        }
    }



    const clear = async () => {
        await redisClient.flushAll()
    }


    return {
        updateOrderProcessTime,
        additionsLeadBoard,
        ordersByHour,
        processLeadBoard,
        ordersByRegion,
        updateStoreStatus,
        updateOrdersCount,
        decreaseInProgressOrdersCount,
        fetchStats,
        clear,
        inProgressFun,
        doneFun
    }
}
