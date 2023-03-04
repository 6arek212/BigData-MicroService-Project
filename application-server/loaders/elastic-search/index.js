const { Client } = require('@elastic/elasticsearch')
const { makeElasticSearchQueries } = require('./elastic-queries')

const elasticUrl = "http://localhost:9200";
const client = new Client({ node: elasticUrl });



module.exports = async () => {

    const health = await client.cluster.health({});
    console.log("Successfully connected to ElasticSearch");

    const queries = makeElasticSearchQueries(client)


    // const startDate = moment().startOf('day').format();
    // const endDate = moment().endOf('day').format();
    // console.log(await queries.searchOrdersByDate({ startDate, endDate , storeName: 'KFC'}));
    return queries
}