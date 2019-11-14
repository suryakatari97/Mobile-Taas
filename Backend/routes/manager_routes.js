'use strict';
var express = require('express');
var router = express.Router();

// user defined modules
var { managerlogin, getManagerProjects } = require('../controllers/manager_controller');

// test login
router.post('/managerlogin', managerlogin);

// get tester projects
router.get('/home', getManagerProjects);

module.exports = router;
