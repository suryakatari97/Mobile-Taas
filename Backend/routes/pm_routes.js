"use strict";
var express = require("express");
var router = express.Router();

// user defined modules
var {testlogin, createProject} = require("../controllers/pm_controller");

// test login
router.post('/testlogin', testlogin);

router.post("/createproject", createProject);

module.exports = router;