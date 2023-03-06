const uuid = require("uuid");
require("dotenv").config()
const pizzaProducer = require('../kafka/kafka-producer')(process.env.PIZZA_TOPIC)
const storeProducer = require('../kafka/kafka-producer')(process.env.STORES_TOPIC)


const additions = ['Onions', 'Olives', 'Mozzarella Cheese', 'Peppers', 'Tuna', 'Sausage', 'Pesto', 'Tomato', 'Black Olives']
const storesNames = ['Macdonalds', 'BBB', 'KFC', 'Pizza Hut']
const regions = ['South', 'Haifa', 'Center', 'North', 'Dan']
const persons = [
    {
        name: 'John Doe',
        address: '123 Main St',
        phone: '555-555-5555'
    },
    {
        name: 'Wissam Kabaha',
        address: 'Bartaa',
        phone: '555-555-5555'
    },
    {
        name: 'Tarik Husin',
        address: 'Baqa',
        phone: '0525145565'
    }
]




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
const makeOrder = (storeId, storeName, region) => {
    const person = persons[Math.floor(Math.random() * persons.length)]
    return {
        _id: uuid.v4(),
        store_id: storeId,
        store_name: storeName,
        region: region,
        status: 'in-progress',
        additions: getRandomPizzaAdditions(),
        createdAt: new Date(),
        ...person
    }
}


// complete the order after a random amount of time
const completeOrder = async (order) => {
    const processTime = Math.floor((Math.random() + 1) * 5) * 1000
    await delay(processTime)
    await pizzaProducer.produce({ key: order._id, value: { ...order, finishedAt: new Date(), status: 'done' } })
    console.log('order is done', order._id);
}


// delay for ms
async function delay(ms) {
    return await new Promise(resolve => setTimeout(resolve, ms));
}


const makeOrderForStore = async ({ _id, store_name, region }) => {
    console.log('opened store', _id, store_name, region);
    await storeProducer.produce({ key: _id, value: { _id: _id, isOpened: 1 } })

    let end = Math.floor((Math.random() + 1) * 20)
    let i = 0

    while (i < end) {
        await delay(1000)
        const order = makeOrder(_id, store_name, region)
        console.log('sending order', order._id, i);

        await pizzaProducer.produce({ key: order._id, value: order })
        console.log(order);
        completeOrder(order)
        i++;
    }

    await storeProducer.produce({ key: _id, value: { _id: _id, isOpened: 0 } })
    console.log('close store', _id, store_name, region);
}



const makeStores = (storeName) => {
    // open a store in each district
    const stores = []
    let k = 0
    for (let rg of regions) {
        stores.push({
            _id: storeName + `-${rg}`,
            store_name: storeName,
            region: rg
        })
        k++
    }
    return stores
}



// 
const run = async () => {
    await pizzaProducer.connect()
    await storeProducer.connect()

    let stores
    for (let name of storesNames) {
        // make stores for the company 
        stores = makeStores(name)

        for (let st of stores) {
            makeOrderForStore(st)
        }
    }
}



run()