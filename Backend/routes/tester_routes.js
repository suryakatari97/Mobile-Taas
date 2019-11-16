"use strict";
var express = require("express");
var router = express.Router();

// user defined modules
var {testlogin, getTesterProjects, getProjectUrl, getNewProjects, postJoinRequest} = require("../controllers/tester_controller");
var {postTests} = require("../controllers/test_runner_controller");
var {projectsPerdayForTester, testsPerdayForTester, bugsPerdayForTester, projectsWorkedOnPerCategoryTester} = require("../controllers/tester_stats_controller");
// test login
router.post('/testlogin', testlogin);

// for general tester APIs
router.get('/home', getTesterProjects);
router.get('/project/url', getProjectUrl);
router.get('/newProjects', getNewProjects);
router.post('/joinRequest', postJoinRequest);

//for testrunner
router.post('/testRunner', postTests);

//for tester dashboard
router.get('/stats/projectsPerDayForTester', projectsPerdayForTester);
router.get('/stats/testsPerdayForTester', testsPerdayForTester);
router.get('/stats/bugsPerdayForTester', bugsPerdayForTester);
router.get('/stats/projectCategoriesTester', projectsWorkedOnPerCategoryTester);

module.exports = router;