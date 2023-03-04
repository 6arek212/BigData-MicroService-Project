const kafkaConsumer = require('../kafka/kafka-consumer')('kivalmel-pizza-order', 3)
const { Client } = require('@elastic/elasticsearch')
const elasticUrl = "http://localhost:9200";
const client = new Client({ node: elasticUrl });



const run = async () => {
    await kafkaConsumer.connect()
    console.log('kafka connected')




    kafkaConsumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            try {
                const data = JSON.parse(message.value)
                console.log(data._id);

                const _id = data._id
                delete data._id


                if (data.status === 'in-progress') {
                    await client.index({
                        index: 'orders',
                        _id: _id,
                        document: data
                    })
                } else {
                    client.update('orders', {
                        _id: _id,
                        body: {
                            status: data.status
                        }
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