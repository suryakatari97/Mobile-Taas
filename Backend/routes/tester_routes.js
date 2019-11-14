"use strict";
var express = require("express");
var router = express.Router();

// user defined modules
var {testlogin, getTesterProjects, getProjectUrl, getNewProjects, postJoinRequest} = require("../controllers/tester_controller");
var {postTests} = require("../controllers/test_runner_controller");

// test login
router.post('/testlogin', testlogin);

// get tester projects
router.get('/home', getTesterProjects);
router.get('/project/url', getProjectUrl);
router.post('/testRunner', postTests);
router.get('/newProjects', getNewProjects);
router.post('/joinRequest', postJoinRequest);

module.exports = router;