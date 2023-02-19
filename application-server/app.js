const express = require('express')
require("dotenv").config({ path: '../.env' })
const path = require("path")
require('./redis/caching-data')
const cors = require('cors')

const app = express()
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.use(cors())




module.exports = app