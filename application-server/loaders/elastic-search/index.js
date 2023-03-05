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
    await client.indices.create({ index: 'orders' })

    return queries
}