require("dotenv").config()
const express = require("express");
const http = require("http");
const sio = require('socket.io')
const loaders = require('./loaders')

const port = process.env.PORT || "4000"




const run = async () => {
  const app = express()


  const server = http.createServer(app);
  await loaders({ expressApp: app, server: server })

  server.on("error", err => console.log(err));
  server.on("listening", () => { console.log('server started', `http://localhost:${port}/api/`) });
  server.listen(port);
}


run()