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


    return {
        searchOrdersByDate
    }
}



module.exports = {
    makeElasticSearchQueries
}