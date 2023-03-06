const { Client } = require('@elastic/elasticsearch')
const { makeElasticSearchQueries } = require('./elastic-queries');
const configs = require('../../configs');

const client = new Client({ node: configs.elasticsearchURL });



module.exports = async ({ clearOnStart }) => {

    const health = await client.cluster.health({});
    console.log("Successfully connected to ElasticSearch");

    const queries = makeElasticSearchQueries(client)

    if (clearOnStart) {
        try {
            await client.indices.delete({ index: 'orders' })
        } catch (e) { }
    }
    try {
        await client.indices.create({ index: 'orders' })
        await client.indices.putMapping({
            index: 'orders',
            mappings: {
                order: {
                    properties: {
                        _id: { tpye: 'string' },
                        store_id: { tpye: 'string' },
                        store_name: { tpye: 'string' },
                        region: { tpye: 'string' },
                        status: { tpye: 'string' },
                        additions: { tpye: 'string' },
                        createdAt: { tpye: 'date' },
                        finishedAt: { tpye: 'date' },
                        name: { tpye: 'string' },
                        address: { tpye: 'string' },
                        phone: { tpye: 'string' }
                    }
                }
            }
        })
    }
    catch (e) { }


    return queries
}