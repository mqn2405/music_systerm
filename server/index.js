const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const app = express();
const cors = require("cors");
const authRouter = require("./routers/auth");
const adminRouter = require("./routers/admin");
const userRouter = require("./routers/user");
const categoryRouter = require("./routers/category");
const albumRouter = require("./routers/album");
const singerRouter = require("./routers/singer");
const countryRouter = require("./routers/country");
const songRouter = require("./routers/song");
const reviewRouter = require("./routers/review");
const searchRouter = require("./routers/search");
const playlistRouter = require("./routers/playlist");
const songReportRouter = require("./routers/songReport");
const userFollowRouter = require("./routers/userFollow");
const userReportRouter = require("./routers/userReport");
const chatRouter = require("./routers/chat");
const userSongRouter = require("./routers/userSong");
const http = require("http");
const { getUserChatMessage, getAllUserHaveChat } = require("./models/chat");
const server = http.createServer(app);
const socketIo = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

app.use(
  cookieSession({
    name: "session",
    keys: [process.env.COOKIE_KEY || "DOAN"],
    maxAge: 4 * 7 * 24 * 60 * 60 * 1000,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

// ! ================== connect socket ... ================== //
socketIo.on("connection", (socket) => {
  console.log("New client connected" + socket.id);
  socket.on("sendDataClient", async function (data) {
    const { userId, ownerId } = data;
    const chatData = await getUserChatMessage(userId, ownerId);
    chatData.sort(function (x, y) {
      return x.created_day - y.created_day;
    });
    const userChat = await getAllUserHaveChat(userId);
    socketIo.emit("sendDataServer", {
      data: { chat: chatData, listUser: { user: userChat, owner: userId } },
    });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

app.use(cors());

require("dotenv").config();

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/album", albumRouter);
app.use("/api/singer", singerRouter);
app.use("/api/country", countryRouter);
app.use("/api/song", songRouter);
app.use("/api/song/review", reviewRouter);
app.use("/api/search", searchRouter);
app.use("/api/playlist", playlistRouter);
app.use("/api/song-report", songReportRouter);
app.use("/api/user-follow", userFollowRouter);
app.use("/api/user-report", userReportRouter);
app.use("/api/chat", chatRouter);
app.use("/api/user-song", userSongRouter);

let PORT = process.env.PORT || 5005;
server.listen(PORT, () => console.log(`App running on port: ${PORT}`));
