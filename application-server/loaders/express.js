const path = require("path")
const cors = require('cors')
const express = require('express')





module.exports = async ({ app, dbSearch }) => {
    const routes = require('../api/routes')(dbSearch)

    app.set("view engine", "ejs");
    app.use(express.static(path.join(__dirname, "public")));

    app.use(cors())
    app.use('/api', routes)
}