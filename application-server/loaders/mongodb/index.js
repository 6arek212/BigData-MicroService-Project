const { makeMonogDbActions } = require("./db")
const mongoose = require("./mongoose")



module.exports = async () => {
    await mongoose()
    console.log('mongodb connected successfully');
    return await makeMonogDbActions()
}