"use strict";
var express = require("express");
var router = express.Router();
const multer = require('multer');
const FormData = multer({ dest: './uploads/' });

// user defined modules
var {login, signup, logout} = require("../controllers/user_controller");

// login controller
router.post('/login', FormData.none(), login)

// signup
router.post("/signup", FormData.none(), signup)

//logout
router.post('/logout', FormData.none(), logout)

module.exports = router;