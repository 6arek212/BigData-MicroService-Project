const moment = require('moment');



const makeElasticSearchQueries = (client) => {


    const createIndex = async () => {
        await client.indices.create({ index: 'orders' })
    }


    const searchOrdersByDate = async ({ startDate, endDate, storeName }) => {
        const filter = []
        const must = []

        if (storeName) {
            must.push({
                match: {
                    store_name: storeName
                }
            })
        }



        if (startDate && endDate) {
            filter.push({
                range: {
                    createdAt: { gte: startDate, lte: endDate }
                }
            })
        }



        const data = await client.search({
            index: 'orders',
            query: {
                bool: {
                    must: must,
                    filter: filter
                }
            }
        })

        return data.hits.hits
    }


    const createTestOrders = async () => {
        await client.index({
            index: 'orders',
            document: {
                id: '1',
                store_id: '1',
                store_name: 'KFC',
                createdAt: new Date()
            }
        })


        await client.index({
            index: 'orders',
            document: {
                id: '2',
                store_id: '2',
                store_name: 'BBB',
                createdAt: new Date()
            }
        })
    }



    return {
        createIndex,
        createTestOrders,
        searchOrdersByDate
    }
}



module.exports = {
    makeElasticSearchQueries
}