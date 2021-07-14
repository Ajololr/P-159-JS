const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);

const port = 2000;
const propertys = process.argv;

let flagRecording = false;
if (propertys.length > 2 && propertys[2].toLowerCase() === "recording") {
  flagRecording = true;
  console.log("Сервер ведет аудиозапись");
}

app.use(express.static(__dirname.slice().replace(/\\[^\\]*$/, "")));

app.use("/", (req, res) => {
  res.redirect("/html/index.html");
});

io.on("connection", (socket) => {
  console.log("connection");
  socket.on("stream", async (audio) => {
    socket.broadcast.emit("stream", audio);
  });

  if (flagRecording)
    socket.on("record", async (audio) => {
      if (!audio.beep && audio.audioChunks !== 0)
        socket.broadcast.emit("recording", {
          audioChunks: audio.audioChunks,
          frequency: audio.frequency,
          modulation: audio.modulation,
        });
    });
});

console.log(`Сервер запущен на порте: ${port}`);
server.listen(port);
