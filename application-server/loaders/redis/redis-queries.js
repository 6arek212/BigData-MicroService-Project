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
        const date = new Date(order.createdAt)
        date.setMinutes(0)
        date.setMilliseconds(0)
        const formatedDate = moment(date).format('yyyy/MM/DD HH:mm')
        date.setHours(0)
        const dateOnly = moment(date).format('YYYY-MM-DD')
        const todayEnd = new Date(date).setHours(23, 59, 59, 999) / 1000


        for (let addition of order.additions) {
            await redisClient.zIncrBy(keys.ORDERS_ADDITION_POPULAR + `:${dateOnly}`, 1, addition)
        }



        await redisClient.multi()
            .incr(keys.ORDERS_COUNT + `:${dateOnly}`)
            .incr(keys.ORDERS_INPROGRESS_COUNT + `:${dateOnly}`)
            .hIncrBy(keys.ORDERS_BY_REGION + `:${dateOnly}`, order.region, 1)
            .zIncrBy(keys.ORDERS_BY_HOUR + `:${dateOnly}`, 1, formatedDate)
            //expire keys at end of day
            .expireAt(keys.ORDERS_COUNT + `:${dateOnly}`, todayEnd, 'NX')
            .expireAt(keys.ORDERS_INPROGRESS_COUNT + `:${dateOnly}`, todayEnd, 'NX')
            .expireAt(keys.ORDERS_BY_REGION + `:${dateOnly}`, todayEnd, 'NX')
            .expireAt(keys.ORDERS_BY_HOUR + `:${dateOnly}`, todayEnd, 'NX')
            .exec()
    }


    const doneFun = async (order) => {
        const date = new Date(order.createdAt)
        date.setMinutes(0)
        date.setMilliseconds(0)
        date.setHours(0)
        const dateOnly = moment(date).format('YYYY-MM-DD')
        const todayEnd = new Date(date).setHours(23, 59, 59, 999)

        const diff = new Date(order.finishedAt) - new Date(order.createdAt)
        const finishTime = diff / 1000


        await redisClient
            .multi()
            .eval(lua.script,
                {   // changed region to store_name
                    keys: [keys.ORDERS_PROCESS_TIME_LEADBOARD + `:${dateOnly}`, order.store_name, keys.BRANCH_ORDERS_COUNT_DONE + `:${dateOnly}`],
                    arguments: [finishTime + '']
                }
            )
            .incrByFloat(keys.ORDERS_PROCESS_AVG + `:${dateOnly}`, finishTime)
            .decr(keys.ORDERS_INPROGRESS_COUNT + `:${dateOnly}`)

            .expireAt(keys.ORDERS_PROCESS_AVG + `:${dateOnly}`, parseInt(todayEnd / 1000), 'NX')
            .expireAt(keys.ORDERS_PROCESS_TIME_LEADBOARD + `:${dateOnly}`, parseInt(todayEnd / 1000), 'NX')
            .expireAt(keys.BRANCH_ORDERS_COUNT_DONE + `:${dateOnly}`, parseInt(todayEnd / 1000), 'NX')
            .exec()
    }




    const updateStoreStatus = async ({ _id, isOpened, createdAt }) => {
        const date = new Date(createdAt)
        date.setMinutes(0)
        date.setMilliseconds(0)
        date.setHours(0)
        const dateOnly = moment(date).format('YYYY-MM-DD')
        const todayEnd = new Date(date).setHours(23, 59, 59, 999)

        // console.log('updateStoreStatus', _id, isOpened);
        await redisClient.multi()
            .zAdd(keys.STORE_STATUS_KEY + `:${dateOnly}`, { value: _id, score: isOpened })
            .incrBy(keys.STORES_COUNTER + `:${dateOnly}`, isOpened ? 1 : -1)

            .expireAt(keys.STORES_COUNTER + `:${dateOnly}`, parseInt(todayEnd / 1000), 'NX')
            .expireAt(keys.STORE_STATUS_KEY + `:${dateOnly}`, parseInt(todayEnd / 1000), 'NX')
            .exec()
    }


    const fetchStats = async () => {
        const date = new Date()
        date.setMinutes(0)
        date.setMilliseconds(0)
        date.setHours(0)
        const dateOnly = moment(date).format('YYYY-MM-DD')

        const storesStatus = makePairsFromArray(await redisClient.sendCommand(['ZREVRANGE', keys.STORE_STATUS_KEY + `:${dateOnly}`, '0', '-1', 'withscores']))
        const opendStoresCount = await redisClient.get(keys.STORES_COUNTER + `:${dateOnly}`) || 0
        const ordersCount = await redisClient.get(keys.ORDERS_COUNT + `:${dateOnly}`) || 0
        const ordersInProgressCount = await redisClient.get(keys.ORDERS_INPROGRESS_COUNT + `:${dateOnly}`) || 0
        const processAvg = (await redisClient.get(keys.ORDERS_PROCESS_AVG + `:${dateOnly}`) / (ordersCount - ordersInProgressCount)) || 0
        const distribution = await redisClient.hGetAll(keys.ORDERS_BY_REGION + `:${dateOnly}`)
        const topAdditions = makePairsFromArray(await redisClient.sendCommand(['ZREVRANGE', keys.ORDERS_ADDITION_POPULAR + `:${dateOnly}`, '0', '5', 'withscores']))
        const orderByHour = makePairsFromArray(await redisClient.sendCommand(['ZREVRANGE', keys.ORDERS_BY_HOUR + `:${dateOnly}`, '0', '5', 'withscores']))
        const topProcessTimes = makePairsFromArray(await redisClient.sendCommand(['ZRANGE', keys.ORDERS_PROCESS_TIME_LEADBOARD + `:${dateOnly}`, '0', '5', 'withscores']))

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
