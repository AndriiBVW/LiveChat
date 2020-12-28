const express = require("express");
const app = express();
const path = require("path");
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "client", "public")));

server.listen(PORT, () => {
  console.log("Server has been started...");
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"));
});

let count = 0;
users = [];
connections = [];

io.sockets.on("connection", (socket) => {
  console.log("Successful connection");
  connections.push(socket);
  online(1);

  socket.on("disconnect", (data) => {
    connections.splice(connections.indexOf(socket), 1);
    console.log("Disconnected");
    online(-1);
  });

  socket.on("send mess", (data) => {
    io.sockets.emit("add mess", data);
  });
});

function online(num) {
  count = count + num;
  io.sockets.emit("online users", count);
}
