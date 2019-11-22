"use strict";
var express = require("express");
var router = express.Router();

// user defined modules
var { testlogin, createProject, getPmProjectDetails, getProjectJoinRequests, addpmproject, postAcceptJoinRequest, postDeclineJoinRequest, getManagerProjects, getManagerProfile, postManagerProfile, postManagerProfileImage } = require("../controllers/pm_controller");

// test login
router.post('/testlogin', testlogin);

router.post("/createproject", createProject);
router.get('/requests', getProjectJoinRequests);
router.post('/request/accept', postAcceptJoinRequest);
router.post('/request/decline', postDeclineJoinRequest);
router.get('/profile/:userid', getManagerProfile);
router.post('/profile/:userid', postManagerProfile);
router.post('/profileimage/:userid', postManagerProfileImage);
router.get('/home', getManagerProjects);
router.post('/getpmprojectdetails', getPmProjectDetails);
router.post('/addpmproject', addpmproject);

module.exports = router;