"use strict";
var express = require("express");
var router = express.Router();

// user defined modules
var {login, signup} = require("../controllers/user_controller");

// login controller
router.post('/login', login)

// signup
router.post("/signup", signup)

module.exports = router;