const mongoose = require('mongoose');


module.exports = async () => {
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
}