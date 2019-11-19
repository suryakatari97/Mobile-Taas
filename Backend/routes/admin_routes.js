"use strict";
var express = require("express");
var router = express.Router();

// user defined modules
var {testlogin, addAdmin, usersPerday, projectsPerday, testsPerday, bugsPerday,
    topProjectsTestCases, topProjectsTesters, getTesters, blockTester, unblockTester,
    getProjects, blockProject, unblockProject} = require("../controllers/admin_controller");

// test login
router.post('/testlogin', testlogin)

// add admin user
router.post('/adduser', addAdmin);

// get stats
router.get('/stats/perday/users', usersPerday);
router.get('/stats/perday/projects', projectsPerday);
router.get('/stats/perday/tests', testsPerday);
router.get('/stats/perday/bugs', bugsPerday);
router.get('/stats/topprojects/testcases', topProjectsTestCases);
router.get('/stats/topprojects/testers', topProjectsTesters);

//get all testers
router.get('/testers', getTesters);

//block tester
router.get('/block/tester/:id', blockTester);
router.get('/unblock/tester/:id', unblockTester);


//get all projects
router.get('/projects', getProjects);

//block project
router.get('/block/project/:id', blockProject);
router.get('/unblock/project/:id', unblockProject);

module.exports = router;