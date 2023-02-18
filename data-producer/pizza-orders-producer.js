const uuid = require("uuid");
require("dotenv").config({ path: '../.env' })
const pizzaProducer = require('../kafka/kafka-producer')(process.env.PIZZA_TOPIC)


const additions = ['o', 'b', 'd', 'e']
const stores = ['1', '2', '3', '4']
const storesNames = ['Macdonalds', 'BBB', 'KFC', 'Pizza Hut']
const distrects = ['south', 'haifa', 'center', 'north', 'dan']

const getRandomPizzaAdditions = () => {
    const additionsOb = {};
    const r = Math.floor(Math.random() * additions.length);


    for (let index = 0; index < r; index++) {
        const d = Math.floor(Math.random() * additions.length)
        additionsOb[additions[d]] = additions[d]
    }

    const arr = []

    for (x in additionsOb) {
        arr.push(x)
    }

    return arr
}



const makeOrder = (storeId, storeName) => {
    return {
        _id: uuid.v4(),
        store_id: storeId,
        store_name: storeName,
        distrect: distrects[Math.floor(Math.random() * distrects.length)],
        status: Math.ceil(Math.random() * 2) == 1 ? 'in-progress' : 'done',
        additions: getRandomPizzaAdditions(),
        createdAt: '',
        proccessedAt: '',

    }
}



const makeOrders = () => {
    let i = 0;
    let order

    setInterval(async () => {
        order = makeOrder(stores[i % stores.length], storesNames[i % stores.length])
        await pizzaProducer.produce(order)
        i++;
    }, 1000)

}

makeOrders()