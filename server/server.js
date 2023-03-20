const express = require("express");
const dotenv = require("dotenv");
const connetDB = require("./config/db");
const userRoutes = require("./routes/useRoute");
const chatRoutes = require("./routes/chatRoute");
const messageRoutes = require("./routes/messageRoute");
const path = require("path");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
var cors = require("cors");
const { use } = require("./routes/useRoute");

dotenv.config();

connetDB();
const app = express();
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
app.use(express.json());
const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/client/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "client", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.get("/", (req, res) => {
  res.send("get success");
});

app.use(notFound);
app.use(errorHandler);
const PORT = process.env.PORT;
console.log(process.env.PORT);

const server = app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`)
);

const io = require("socket.io")(server, {
  pingTimeOut: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("success");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });
  socket.on("join chat", (room) => {
    socket.join(room);
  });
  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    console.log("yyyyy", newMessageRecieved);

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      console.log(user);
      if (user._id == newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
