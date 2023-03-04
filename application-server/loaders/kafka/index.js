

const myEmitter = (data) => {
    console.log(data);
}


module.exports = async ({ db, emitter = myEmitter }) => {

    await require('./orders-handler')(db, emitter)
    console.log('orders consumer connected');

    await require('./store-handler')(db, emitter)
    console.log('store consumer connected');

}