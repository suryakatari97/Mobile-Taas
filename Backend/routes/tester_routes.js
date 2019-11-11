"use strict";
var express = require("express");
var router = express.Router();

// user defined modules
var {testlogin} = require("../controllers/tester_controller");

// test login
router.post('/testlogin', testlogin)

module.exports = router;