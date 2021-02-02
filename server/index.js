const express = require("express");
const cors = require("cors");
const socketio = require("socket.io");
const http = require("http");

const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
  getRooms,
  setVote,
  resetVotes,
  setStoryTitle,
  getStoryTitle
} = require("./users.js");

const PORT = process.env.PORT || 5000;

const router = require("./router");

var app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketio(server);

io.on("connection", socket => {
  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) return callback({ error });

    socket.emit("message", {
      users: getUsersInRoom(user.room),
      message: `Hello ${user.name}, welcome to the board`,
      variant: "info"
    });
    socket.broadcast.to(user.room).emit("message", {
      users: getUsersInRoom(user.room),
      message: `${user.name}, has joined!`,
      variant: "info"
    });

    socket.join(user.room);
    const title = getStoryTitle();

    callback({ title });
  });

  socket.on("getUsersInRoom", (room, callback) => {
    const users = getUsersInRoom(room);
    return callback(users);
  });

  socket.on("getRooms", callback => {
    const rooms = getRooms();
    return callback(rooms);
  });

  socket.on("setVote", (vote, callback) => {
    const user = getUser(socket.id);
    const users = getUsersInRoom(user.room);
    setVote(vote, user.id);
    vote = vote === "C" ? "Coffee" : vote;

    socket.emit("message", {
      users,
      message: `You voted ${vote}`,
      variant: "success"
    });
    socket.broadcast.to(user.room).emit("message", {
      users,
      message: `${user.name}, voted!`,
      variant: "success"
    });

    callback();
  });

  socket.on("resetVotes", () => {
    const user = getUser(socket.id);
    const users = resetVotes(user.room);

    socket.emit("message", {
      reset: true,
      users,
      message: "You reset votes",
      variant: "info"
    });
    socket.broadcast.to(user.room).emit("message", {
      reset: true,
      users,
      message: `${user.name} (host) reset votes`,
      variant: "info"
    });
  });

  socket.on("setStory", (story, callback) => {
    const user = getUser(socket.id);
    setStoryTitle(story);

    socket.broadcast.to(user.room).emit("storyMessage", {
      story,
      message: `${user.name} (host), updated the story`,
      variant: "info"
    });

    callback();
  });

  socket.on("showVotes", callback => {
    const user = getUser(socket.id);
    const users = getUsersInRoom(user.room);

    socket.broadcast.to(user.room).emit("resultMessage", {
      show: true,
      users
    });

    callback();
  });

  socket.on("doneVoting", callback => {
    const user = getUser(socket.id);
    const users = resetVotes(user.room);

    socket.emit("resultMessage", {
      show: false,
      users
    });
    socket.broadcast.to(user.room).emit("resultMessage", {
      show: false,
      users
    });

    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      console.log("disconnect", user);
      io.to(user.room).emit("message", {
        users: getUsersInRoom(user.room),
        message: `${user.name} has left`,
        variant: "error"
      });
    }
  });
});

app.use(router);

server.listen(PORT, () => console.log(`server started on port ${PORT}`));
