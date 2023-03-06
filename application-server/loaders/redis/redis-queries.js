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




    const updateStoreStatus = async ({ _id, isOpened }) => {
        // console.log('updateStoreStatus', _id, isOpened);
        await redisClient.multi()
            .zAdd(keys.STORE_STATUS_KEY, { value: _id, score: isOpened })
            .incrBy(keys.STORES_COUNTER, isOpened ? 1 : -1)
            .exec()
    }


    const fetchStats = async () => {
        const storesStatus = makePairsFromArray(await redisClient.sendCommand(['ZREVRANGE', keys.STORE_STATUS_KEY, '0', '-1', 'withscores']))
        const opendStoresCount = await redisClient.get(keys.STORES_COUNTER) || 0
        const ordersCount = await redisClient.get(keys.ORDERS_COUNT) || 0
        const ordersInProgressCount = await redisClient.get(keys.ORDERS_INPROGRESS_COUNT) || 0
        const processAvg = (await redisClient.get(keys.ORDERS_PROCESS_AVG) / (ordersCount - ordersInProgressCount)) || 0
        const distribution = await redisClient.hGetAll(keys.ORDERS_BY_REGION)
        const topAdditions = makePairsFromArray(await redisClient.sendCommand(['ZREVRANGE', keys.ORDERS_ADDITION_POPULAR, '0', '5', 'withscores']))
        const orderByHour = makePairsFromArray(await redisClient.sendCommand(['ZREVRANGE', keys.ORDERS_BY_HOUR, '0', '5', 'withscores']))
        const topProcessTimes = makePairsFromArray(await redisClient.sendCommand(['ZRANGE', keys.ORDERS_PROCESS_TIME_LEADBOARD, '0', '5', 'withscores']))

        orderByHour.sort((a, b) => a.key.localeCompare(b.key))

        return {
            storesStatus,
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
        updateStoreStatus,
        fetchStats,
        clear,
        inProgressFun,
        doneFun
    }
}
