"use strict";
const bcrypt = require('bcrypt');
const axios = require('axios');
const saltRounds = 2;
var jwt = require('jsonwebtoken');

const {bugzillaToken, bugzillaBaseURL} = require("../config/constants");

const login = (req, res, next)=>{
    console.log(req.body);
    const email = req.body.email;
    const password = req.body.password;

    const mysqlconnection = req.db;
    mysqlconnection.query('SELECT userid, password, role FROM cmpe_users WHERE email=? AND isblocked=0',
        [email], (err, rowsOfTable, fieldsOfTable)=>{
            if(err){
                res.send({success: false, message: "Sign In Failed"});
            } else {
                if(rowsOfTable.length == 1 && 
                    bcrypt.compareSync(password, rowsOfTable[0].password)){
                        var token = {
                            isLoggedIn : true,
                            role:rowsOfTable[0].role,
                            userid:rowsOfTable[0].userid
                        }
                        var signed_token = jwt.sign(token, "BRahujBqkZDAHMtYKoPP", {
                            expiresIn: 86400 // in seconds
                        });
                        res.send({success:true, token: signed_token, 
                            userid: rowsOfTable[0].userid, role: rowsOfTable[0].role});
                } else {
                    res.send({success: false, message: "Sign In Failed"});
                }
            }
    });

};

const signup = (req, res, next) => {
    console.log(req.body);
    const email = req.body.email;
    const password = req.body.password;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const role = req.body.role.toUpperCase();
    // role should be pm/tester only
    if(role!=="PM" && role!=="TESTER") {
        res.status(400);
        res.send({success:false, message:"invalid role"});
    }

    // insert into mysqlDB
    const mysqlconnection = req.db;
    let hashpw = bcrypt.hashSync(password, saltRounds);
    /*
    error response by bugzilla
    {
    "documentation": "https://bugzilla.readthedocs.org/en/5.0/api/",
    "error": true,
    "message": "There is already an account with the login name bugtest@cmpe280.com.",
    "code": 500
    }

    success response by bugzilla
    {
    "id": 3
    }
    */
    //todo handle when bugzilla account already exists.
    axios.post(bugzillaBaseURL+"/user?token="+bugzillaToken, {"email": email, 
        "full_name": firstname + " " + lastname, "password": password})
        .then((response)=>{
            // any 2xx is fine from bugzilla
            if(response.status >= 200 && response.status <300 ) {
                const bugzillaid = response.data.id;
                // attempt to insert into mysql
                console.log("created bugzilla account with id: "+bugzillaid
                    +", now inserting to cmpe_users table");
                mysqlconnection.query('INSERT INTO cmpe_users (bugzilla_userid, email , password, role, firstname, lastname) VALUES(?,?,?,?,?,?)',
                [bugzillaid, email, hashpw, role, firstname, lastname], (err, result) => {
                    if(err){
                        console.log(err);
                        res.send({success:false, message: "Sign Up Failed"});
                    } else {
                        res.send({success: true});
                    }
                    });
            } else {
                console.log(response);
                res.status(500);
                res.send({success:false, message:"failed to create bugzilla account"});
            }
        }).catch((error)=>{
            console.log(error);
            res.status(500);
            res.send({success:false, message:"failed to create bugzilla account, bugzilla error"});
        })
}


module.exports = {
    login,
    signup
};