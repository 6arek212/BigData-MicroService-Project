const uuid = require("uuid");
require("dotenv").config({ path: '../.env' })
const pizzaProducer = require('../kafka/kafka-producer')(process.env.PIZZA_TOPIC)
const storeProducer = require('../kafka/kafka-producer')(process.env.STORES_TOPIC)


const additions = ['Onions', 'Olives', 'Mozzarella Cheese', 'Peppers', 'Tuna', 'Sausage', 'Pesto', 'Tomato', 'Black Olives']
const storesNames = ['Macdonalds', 'BBB', 'KFC', 'Pizza Hut']
const storesIds = ['1', '2', '3', '4']
const distrects = ['South', 'Haifa', 'Center', 'North', 'Dan']


// get a random array of pizza additions
const getRandomPizzaAdditions = () => {
    const additionsOb = {};
    const r = Math.floor(Math.random() * additions.length);

    for (let index = 0; index < r; index++) {
        const d = Math.floor(Math.random() * additions.length)
        additionsOb[additions[d]] = additions[d]
    }

    const arr = []
    for (let x in additionsOb) {
        arr.push(x)
    }

    return arr
}


// make a pizza order
const makeOrder = (storeId, storeName) => {
    return {
        _id: uuid.v4(),
        store_id: storeId,
        store_name: storeName,
        region: distrects[Math.floor(Math.random() * distrects.length)],
        status: 'in-progress',
        additions: getRandomPizzaAdditions(),
        createdAt: new Date(),
    }
}


// complete the order after a random amount of time
const completeOrder = (order) => {
    const processTime = Math.floor((Math.random() + 1) * 5) * 1000
    setTimeout(async () => {
        console.log('order is done', order._id);
        await pizzaProducer.produce({ ...order, finishedAt: new Date(), status: 'done' })
    }, processTime)
}


// delay for ms
async function delay(ms) {
    return await new Promise(resolve => setTimeout(resolve, ms));
}


const makeOrderForStore = async (index) => {
    await storeProducer.produce({ _id: storesIds[index], isOpened: 1 })

    let i = 0
    while (i < Math.floor((Math.random() + 1) * 20)) {
        await delay(100)
        order = makeOrder(storesIds[index], storesNames[index])
        console.log('sending order', order._id, i);
        await pizzaProducer.produce({ ...order, i })
        completeOrder(order)
        i++;
    }

    await storeProducer.produce({ _id: storesIds[index], isOpened: 0 })
}



// 
const run = async () => {
    await pizzaProducer.connect()
    await storeProducer.connect()

    for (let storeIndex in storesIds) {
        makeOrderForStore(storeIndex)
    }
}



run()