
const cachingData = require('./caching-data')
const redis = require('redis')
const redisClient = redis.createClient()


module.exports = async ({ clearOnStart = false }) => {
    // connect redis 
    await redisClient.connect()
    console.log('Connected to Redis')

    // load caching data module and return database data access functions
    const dbFunctions = await cachingData(redisClient)

    if (clearOnStart)
        await dbFunctions.clear()


    return dbFunctions
}