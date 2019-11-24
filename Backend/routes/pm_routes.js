"use strict";
var express = require("express");
var router = express.Router();

// user defined modules
var { testlogin, createProject, getPmProjectDetails, getProjectJoinRequests, deletepmProject, updateProjectStatus, 
    addpmproject, postAcceptJoinRequest, postDeclineJoinRequest, getManagerProjects, getManagerProfile, postManagerProfile, 
    postManagerProfileImage, getpmprojectParticipants } = require("../controllers/pm_controller");
    
var { ProjectsCreatedPerDay, NumberofTestersPerProject, ProjectStatusPieChart } = require("../controllers/pm_stats_controller");
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
router.get('/getpmprojectParticipants', getpmprojectParticipants)

//for manager dashboard
router.get('/stats/ProjectsCreatedPerDay', ProjectsCreatedPerDay);
router.get('/stats/NumberofTestersPerProject', NumberofTestersPerProject);
router.get('/stats/ProjectStatusPieChart', ProjectStatusPieChart);

module.exports = router;