"use strict";
var express = require("express");
var router = express.Router();

// user defined modules
var {testlogin, getTesterProjects, getProjectUrl} = require("../controllers/tester_controller");

// test login
router.post('/testlogin', testlogin);

// get tester projects
router.get('/home', getTesterProjects);
router.get('/project/url', getProjectUrl);

module.exports = router;