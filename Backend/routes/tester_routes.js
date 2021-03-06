"use strict";
var express = require("express");
var router = express.Router();

// user defined modules
var { testlogin, tester_getProfile, tester_getskills, gettesterprojectdetails, TesterNotifications, getTesterProjects, getProjectUrl, getNewProjects, postJoinRequest,get_allSkills,get_profileImage, post_profileImage, tester_updateProfile, get_artifacts} = require("../controllers/tester_controller");
var {postTests} = require("../controllers/test_runner_controller");
var {projectsPerdayForTester, testsPerdayForTester, bugsPerdayForTester, projectsWorkedOnPerCategoryTester, bugsCategoryTester} = require("../controllers/tester_stats_controller");
var {resumeUploadToS3,getResume,  upload_file} = require("../controllers/tester_resume_controller");


// test login
router.post('/testlogin', testlogin);

// for general tester APIs
router.get('/home', getTesterProjects);
router.get('/project/url', getProjectUrl);
router.get('/newProjects', getNewProjects);
router.post('/joinRequest', postJoinRequest);
router.get('/skills/all', get_allSkills);
router.post('/upload/:userid', upload_file);
router.get('/artifacts', get_artifacts);
router.get('/gettesterprojectdetails', gettesterprojectdetails);

//for testrunner
router.post('/testRunner', postTests);

//for tester dashboard
router.get('/stats/projectsPerDayForTester', projectsPerdayForTester);
router.get('/stats/testsPerdayForTester', testsPerdayForTester);
router.get('/stats/bugsPerdayForTester', bugsPerdayForTester);
router.get('/stats/projectCategoriesTester', projectsWorkedOnPerCategoryTester);
router.get('/stats/bugsCategoryTester', bugsCategoryTester);

router.get('/TesterNotifications', TesterNotifications);


//tester profile
router.get('/profile/:userid', tester_getProfile);
router.post('/profile/:userid', tester_updateProfile);

//tester skills
router.get('/profile/:userid/skills', tester_getskills);

router.get('/profileimage/:userid', get_profileImage);
router.post('/profileimage/:userid', post_profileImage);

router.post('/resume/:userid', resumeUploadToS3);

module.exports = router;