"use strict";
var express = require("express");
var router = express.Router();

// user defined modules
var {testlogin, addAdmin, usersPerday, projectsPerday, testsPerday, bugsPerday,
    topProjectsTestCases, topProjectsTesters} = require("../controllers/admin_controller");

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

module.exports = router;