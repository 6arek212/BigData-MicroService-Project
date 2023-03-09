const rediesModule = require("./redis");
const kafkaModule = require("./kafka");
const expressLoader = require("./express");
const elasticsearch = require("./elastic-search");
const bigml = require("./bigml");
const mongoDbModule = require("./mongodb");
const { makeTrainModelUseCase } = require("../use-cases/train-model");
const csv = require("./csv");
const { makeSocketIoModel, SOCKET_IO_TOPICS } = require("./socketio-module");

// dependency Injection
module.exports = async ({ expressApp, server }) => {
  const dbRedis = await rediesModule({ clearOnStart: false });
  console.log("Redis module loaded");

  const dbElastic = await elasticsearch({ clearOnStart: false });
  console.log("Elasticsearch module loaded");

  const bigmlModule = await bigml()
  console.log("Bigml module loaded");


  const { emit: emitter } = makeSocketIoModel({
    server: server,
    emitters: {
      [SOCKET_IO_TOPICS.STATS]: dbRedis.fetchStats,
      [SOCKET_IO_TOPICS.ASSOCIATION_MODEL]: bigmlModule.getAssosiations
    }
  });
  console.log("Socketio module loaded");

  await kafkaModule({ db: dbRedis, emitter: () => { emitter(SOCKET_IO_TOPICS.STATS) } });
  console.log("Kafka module loaded");

  const mongodbModule = await mongoDbModule()
  console.log('mongoDb module loaded');


  // inject into the controller to get the prediction result
  const trainModel = makeTrainModelUseCase(mongodbModule, bigmlModule, csv, () => { emitter(SOCKET_IO_TOPICS.ASSOCIATION_MODEL) })


  await expressLoader({ app: expressApp, dbSearch: dbElastic, trainModel: trainModel });
  console.log("Express module loaded");
};
