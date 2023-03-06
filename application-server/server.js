require("dotenv").config()
const express = require("express");
const http = require("http");
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
const { setupMaster } = require("@socket.io/sticky");
const { setupPrimary } = require("@socket.io/cluster-adapter");
const loaders = require('./loaders')


let port = process.env.PORT || "4000"

// master cluster 
const setUpMaster = async () => {
  if (!cluster.isMaster)
    return
  const app = express()
  const server = http.createServer(app);

  setupMaster(server, {
    loadBalancingMethod: "least-connection",
  });

  setupPrimary();

  server.on("error", err => console.log(err));
  server.on("listening", () => { console.log('server started', `http://localhost:${port}/api/`) });
  server.listen(port);

  cluster.setupPrimary({
    serialization: "advanced",
  });

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
}


const run = async () => {
  if (cluster.isMaster) {
    setUpMaster()
  }
  else {
    console.log(`Worker ${process.pid} started`);
    const app = express()
    const server = http.createServer(app);
    await loaders({ expressApp: app, server: server })
  }

}


// just run me :)
run()