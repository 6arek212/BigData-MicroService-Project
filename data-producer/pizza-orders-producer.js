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
        region: distrects[Math.floor(Math.random() * distrects.length)],
        status: 'in-progress',
        additions: getRandomPizzaAdditions(),
        createdAt: new Date(),
    }
}



const sendDone = (order) => {
    const processTime = Math.floor((Math.random() + 1) * 5) * 1000
    setTimeout(async () => {
        console.log('order is done', order._id);
        await pizzaProducer.produce({ ...order, finishedAt: new Date(), status: 'done' })
    }, processTime)
}

async function delay(ms) {
    // return await for better async stack trace support in case of errors.
    return await new Promise(resolve => setTimeout(resolve, ms));
}


const makeOrders = async () => {
    let i = 0;
    let order
    await pizzaProducer.connect()

    while (true) {
        await delay(1000)
        order = makeOrder(stores[i % stores.length], storesNames[i % stores.length])
        console.log('sending order', order._id, i);
        await pizzaProducer.produce({ ...order, i })
        sendDone(order)
        i++;
    }
    // setInterval(() => {
    //     try {

    //     } catch (e) {
    //         console.log(e)
    //     }
    // }, 1000)

}

makeOrders()