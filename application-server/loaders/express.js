const path = require("path")
const cors = require('cors')
const express = require('express')





module.exports = async ({ app, dbSearch, trainModel }) => {
    const routes = require('../api/routes')(dbSearch, trainModel)

    app.use(express.static(path.join(__dirname, '..', "public")));

    app.use(cors())
    app.use('/api', routes)
    app.use('/', (req, res, next) => {
        res.sendFile(path.join(__dirname, '..', "public", "index.html"))
    })

}