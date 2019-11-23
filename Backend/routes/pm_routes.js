"use strict";
var express = require("express");
var router = express.Router();

// user defined modules
var { testlogin, createProject, getPmProjectDetails, getProjectJoinRequests, deletepmProject, updateProjectStatus, 
    addpmproject, postAcceptJoinRequest, postDeclineJoinRequest, getManagerProjects, getManagerProfile, postManagerProfile, 
    postManagerProfileImage } = require("../controllers/pm_controller");
var { ProjectsCreatedPerDay, NumberofTestersPerProject } = require("../controllers/pm_stats_controller");
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
router.post('/updateprojectstatus', updateProjectStatus);
router.post('/deletepmproject', deletepmProject);

//for manager dashboard
router.get('/stats/ProjectsCreatedPerDay', ProjectsCreatedPerDay);
router.get('/stats/NumberofTestersPerProject', NumberofTestersPerProject);

module.exports = router;