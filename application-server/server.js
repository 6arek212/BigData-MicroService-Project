require("dotenv").config()
const app = require("./app");
const http = require("http");

const onListening = () => {
  const addr = server.address();
  const bind = typeof port === "string" ? "pipe " + addr : "port " + port;
  console.log('server started', `http://localhost:${port}/api/`)
}
const port = process.env.PORT || "4000"
app.set("port", port);
const server = http.createServer(app);
server.on("error", err => console.log(err));
server.on("listening", onListening);
server.listen(port);
require('./socketio-module').initialize(server);
