const kafkaConsumer = require('../kafka/kafka-consumer')('kivalmel-pizza-order', 3)
const { Client } = require('@elastic/elasticsearch')
const elasticUrl = "http://localhost:9200";
const client = new Client({ node: elasticUrl });



const run = async () => {
    await kafkaConsumer.connect()
    console.log('kafka connected')

    // await client.indices.delete({ index: 'orders' })
    // await client.indices.create({ index: 'orders' })


    kafkaConsumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            try {
                const data = JSON.parse(message.value)

                const _id = data._id
                delete data._id

                console.log(_id);

                if (data.status === 'in-progress') {
                    await client.index({
                        index: 'orders',
                        id: _id,
                        document: data,
                    })
                } else {
                    await client.update({
                        index: 'orders',
                        id: _id,
                        doc: data
                    })
                }
            }
            catch (err) {
                console.log(err);
            }
        }
    })

}


run()