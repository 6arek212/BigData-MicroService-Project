

module.exports = {
    pizzaTopic: process.env.PIZZA_TOPIC || 'kivalmel-pizza-order',
    storesTopic: process.env.STORES_TOPIC || 'kivalmel-stores-status',
    mongodbPW: process.env.MONGODB_PW,
    mongodbUR: process.env.MONGODB_UR,
    elasticsearchURL: process.env.ELASTICSEARCH_URL || "http://localhost:9200"
}
