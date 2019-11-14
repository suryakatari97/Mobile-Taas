'use strict';
var express = require('express');
var router = express.Router();

// user defined modules
var { testlogin, createProject, deleteProject, getManagerProjects } = require('../controllers/pm_controller');

// test login
router.post('/testlogin', testlogin);

router.post('/createproject', createProject);

router.post('/deleteproject', deleteProject);

router.post('/getprojects', getManagerProjects);


module.exports = router;
