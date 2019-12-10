"use strict";
const bcrypt = require('bcrypt');
const axios = require('axios');
const saltRounds = 2;
var jwt = require('jsonwebtoken');

const {bugzillaToken, bugzillaBaseURL, chatBaseURL, chatAdminUser, chatAdminPassword} = require("../config/constants");

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

                        //----------------------Chat begin-------------------------
                        var chatLoginData = {
                            "email": email, 
                            "password": password,
                        };

                        axios.post(chatBaseURL+"/login", chatLoginData)
                        .then((response)=>{
                            // any 2xx is fine
                            if(response.status >= 200 && response.status <300 ) {
                                const chatUserId = response.data.data.userId;
                                const chatUserToken = response.data.data.authToken;

                                console.log("logged in to chat account. UserId: "+chatUserId+" Token: "+chatUserToken); 
                                res.send({success:true, token: signed_token, 
                                    userid: rowsOfTable[0].userid, role: rowsOfTable[0].role,
                                    chatUserId: chatUserId, chatUserToken: chatUserToken });
                                } else {
                                console.log(response);
                                res.status(500);
                                res.send({success:false, message:"failed to login to chat account"});
                            }
                        }).catch((error)=>{
                            console.log(error);
                            res.status(500);
                            res.send({success:false, message:"failed to login to chat account, chat error"});
                        })
                        //----------------------Chat end-------------------------
                       
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
    //----------------------Bugzilla begin-------------------------
    axios.post(bugzillaBaseURL+"/user?token="+bugzillaToken, {"email": email, 
        "full_name": firstname + " " + lastname, "password": password})
        .then((response)=>{
            // any 2xx is fine from bugzilla
            if(response.status >= 200 && response.status <300 ) {
                const bugzillaid = response.data.id;
                // attempt to create chat account
                console.log("created bugzilla account with id: "+bugzillaid
                    +", now trying to create chat account");
                //----------------------Chat begin-------------------------
                var usernameBreakIndex = email.lastIndexOf("@")
                var chatUsername = email.substring(0, usernameBreakIndex) + '-'
                + email.substring(usernameBreakIndex +1, email.indexOf(".", usernameBreakIndex))
                var chatData = {
                    "email": email, 
                    "name": firstname + " " + lastname, 
                    "password": password,
                    "username": chatUsername,
                    "roles": [
                        (role == "TESTER") ? "user" : "livechat-manager"
                    ],
                    "joinDefaultChannels": (role == "TESTER")
                };

                var chatHeader = {
                    headers: {
                        'X-User-Id': chatAdminUser,
                        'X-Auth-Token': chatAdminPassword
                    }
                };

                axios.post(chatBaseURL+"/users.create", chatData, chatHeader )
                .then((response)=>{
                    // any 2xx is fine
                    if(response.status >= 200 && response.status <300 ) {
                        const chatUserId = response.data.user._id;
                        //----------------------MySQL begin-------------------------
                        // attempt to insert into mysql
                        console.log("created chat account with id: "+ chatUserId
                            +", now inserting to cmpe_users table"); 
                            mysqlconnection.query('INSERT INTO cmpe_users (bugzilla_userid, email , password, role, firstname, lastname) VALUES(?,?,?,?,?,?)',
                            [bugzillaid, email, hashpw, role, firstname, lastname], (err, result) => {
                                if(err){
                                    console.log(err);
                                    res.send({success:false, message: "Sign Up Failed"});
                                } else {
                                    console.log("Successfully created user " + email);
                                    res.send({success: true});
                                }
                                });
                                //----------------------MySQL end-------------------------
                        } else {
                        console.log(response);
                        res.status(500);
                        res.send({success:false, message:"failed to create chat account"});
                    }
                }).catch((error)=>{
                    console.log(error);
                    res.status(500);
                    res.send({success:false, message:"failed to create chat account, chat error"});
                })
                //----------------------Chat end-------------------------
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
        //----------------------Bugzilla end-------------------------
}

const logout = (req, res, next)=> {

    const userIdHeader = req.body.chatUserId
    const userTokenHeader = req.body.chatUserToken
    var chatHeader = {
        headers: {
            'X-User-Id': userIdHeader,
            'X-Auth-Token': userTokenHeader
        }
    };

    axios.post(chatBaseURL+"/logout", {}, chatHeader )
        .then((response)=>{
            console.log("Logout response status: " + response.status)
        })

}

    module.exports = {
    login,
    signup,
    logout
};