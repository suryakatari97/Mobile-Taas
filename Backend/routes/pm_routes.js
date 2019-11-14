"use strict";
var express = require("express");
var router = express.Router();

// user defined modules
var {testlogin, createProject, getProjectJoinRequests, postAcceptJoinRequest, postDeclineJoinRequest} = require("../controllers/pm_controller");

// test login
router.post('/testlogin', testlogin);

router.post("/createproject", createProject);
router.get('/requests', getProjectJoinRequests);
router.post('/request/accept', postAcceptJoinRequest);
router.post('/request/decline', postDeclineJoinRequest);

module.exports = router;