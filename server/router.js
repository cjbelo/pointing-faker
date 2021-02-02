const express = require("express");
const router = express.Router();

const { getUsers, getRooms } = require("./users.js");

router.get("/", (req, res) => {
  res.send("server is up and running...");
});

router.get("/users", (req, res) => {
  res.send(getUsers());
});

router.get("/rooms", (req, res) => {
  res.send(getRooms());
});

module.exports = router;
