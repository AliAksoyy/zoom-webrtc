const express = require("express");
const http = require("http");
const app = express();
const socket = require("socket.io");
const { v4: uuidv4 } = require("uuid");

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

const PORT = 3000;

const server = http.createServer(app);

const io = socket(server);

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);
  });

  socket.on("disconnect", () => {
    socket.to(roomId).broadcast.emit("user-disconnected", userId);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
