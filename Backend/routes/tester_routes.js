"use strict";
var express = require("express");
var router = express.Router();

// user defined modules
var {testlogin, getTesterProjects, getProjectUrl, getNewProjects, postJoinRequest} = require("../controllers/tester_controller");
var {postTests} = require("../controllers/test_runner_controller");
var {projectsPerdayForTester, testsPerdayForTester, bugsPerdayForTester, projectsWorkedOnPerCategoryTester, bugsCategoryTester} = require("../controllers/tester_stats_controller");
var {testlogin,tester_getProfile, tester_getskills} = require("../controllers/tester_controller");


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
router.get('/stats/bugsCategoryTester', bugsCategoryTester)

//tester profile
router.get('/testerprofile/:userid', tester_getProfile);

//tester skills
router.get('/testerprofile/:userid/skills', tester_getskills);

module.exports = router;