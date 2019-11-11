"use strict";
var express = require("express");
var router = express.Router();

// user defined modules
var {testlogin, createbugurl, bugsForProject, 
    bugsForCurrentUser, bugsForUser} = require("../controllers/any_controller");

// test login
router.post('/testlogin', testlogin)

//get bugzilla report bug url
router.get("/createbugurl", createbugurl);

router.get("/bugs/user", bugsForCurrentUser);
router.get("/bugs/user/:userid", bugsForUser);
router.get("/bugs/project/:projectid", bugsForProject);

module.exports = router;