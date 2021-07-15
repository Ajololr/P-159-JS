const express = require("express");
const path = require("path");
const app = express();
const fs = require("fs");
const https = require("https");
const options = {
  key: fs.readFileSync("localhost.key"),
  cert: fs.readFileSync("localhost.crt"),
};
const server = https.createServer(options, app);
const io = require("socket.io")(server);

const port = 2000;

app.use(express.static(path.join(__dirname, "../build")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build/index.html"));
});

io.on("connection", (socket) => {
  console.log("connection");
  socket.on("stream", async (audio) => {
    socket.broadcast.emit("stream", audio);
  });
});

console.log(`Сервер запущен на порте: ${port}`);
server.listen(port);
