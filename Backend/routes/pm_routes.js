"use strict";
var express = require("express");
var router = express.Router();

// user defined modules
var { testlogin, createProject, getPmProjectDetails, getProjectJoinRequests, deletepmProject, updateProjectStatus,
    addpmproject, postAcceptJoinRequest, postDeclineJoinRequest, getManagerProjects, getManagerProfile, postManagerProfile,
    postManagerProfileImage, getpmprojectParticipants, getManagerArtifacts, pm_tester_getProfile, pm_tester_getskills  } = require("../controllers/pm_controller");

var { ProjectsCreatedPerDay, NumberofTestersPerProject, ProjectStatusPieChart, TotalBugsPerProject }
    = require("../controllers/pm_stats_controller");

var { manager_upload_file } = require("../controllers/tester_resume_controller");
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
router.get('/getpmprojectdetails', getPmProjectDetails);
router.post('/addpmproject', addpmproject);
router.post('/updateprojectstatus', updateProjectStatus);
router.post('/deletepmproject', deletepmProject);
router.get('/getpmprojectParticipants', getpmprojectParticipants);
router.post('/upload/:userid', manager_upload_file);
router.get('/viewartifacts', getManagerArtifacts)
router.get('/tester/profile/:userid', pm_tester_getProfile);
router.get('/tester/profile/:userid/skills', pm_tester_getskills);

//for manager dashboard
router.get('/stats/ProjectsCreatedPerDay', ProjectsCreatedPerDay);
router.get('/stats/NumberofTestersPerProject', NumberofTestersPerProject);
router.get('/stats/ProjectStatusPieChart', ProjectStatusPieChart);
router.get('/stats/TotalBugsPerProject', TotalBugsPerProject);

module.exports = router;