const mongoose = require("mongoose")


const PizzaSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    store_id: { type: String },
    store_name: { type: String },
    region: { type: String },
    distrect: { type: String },
    status: { type: String },
    additions: { type: [] },
    createdAt: { type: Date },
    finishedAt: { type: Date }
},
    { _id: false })



const Pizza = mongoose.model('pizza', PizzaSchema)
module.exports = Pizza

