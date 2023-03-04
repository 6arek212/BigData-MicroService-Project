const moment = require('moment');



const makeElasticSearchQueries = (client) => {


    const searchOrdersByDate = async ({ startDate, endDate, storeName, page, pageSize }) => {
        const filter = []
        const must = []
        const q = {
            index: 'orders',
            query: {
                bool: {
                    must: must,
                    filter: filter
                },
            },
            size: 30,
            from: 0,
        }


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

        if (page && pageSize) {
            q.size = pageSize
            q.from = (page - 1) * pageSize
        }


        const data = await client.search(q)

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
        searchOrdersByDate
    }
}



module.exports = {
    makeElasticSearchQueries
}