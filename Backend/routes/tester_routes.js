"use strict";
var express = require("express");
var router = express.Router();

// user defined modules
var {testlogin, getTesterProjects} = require("../controllers/tester_controller");

// test login
router.post('/testlogin', testlogin);

// get tester projects
router.get('/home', getTesterProjects);

module.exports = router;