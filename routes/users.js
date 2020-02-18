const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// User Login Route
router.get("/login", (req, res) => {
  res.send("login");
});

router.get("/register", (req, res) => {
  res.send("register");
});

module.exports = router;
