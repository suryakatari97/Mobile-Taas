"use strict";
const bcrypt = require('bcrypt');
const axios = require('axios');
const saltRounds = 2;

const {bugzillaToken, bugzillaBaseURL, bugzillaProductPrefix} = require("../config/constants");

const testlogin = (req, res, next)=>{
    res.send({userid: req.user.userid, role: req.user.role});
};

// const usersPerday, projectsPerday, testsPerday, bugsPerday,
// topProjectsTestCases, topProjectsTesters
const perdayQuery = (req, res, query) => {
    const mysqlconnection = req.db;
    mysqlconnection.query(query, [], (err, rowsOfTable)=>{
            const dataArr = [];
            if(err) {
                console.log(err);
                res.status(500);
                res.send({success:false, data: dataArr});
            } else {
                let i=0;
                for(i=0; i < rowsOfTable.length; i++) {
                    dataArr.push({date: rowsOfTable[i].created_day, count: rowsOfTable[i].count});
                }
                res.send({success:true, data:dataArr});
            }
    });
}

const usersPerday = (req, res) => {
    const query = 'select count(userid) as count, DATE_FORMAT(`timestamp`,"%Y-%m-%d") as created_day FROM cmpe_users GROUP BY created_day;';
    perdayQuery(req, res, query);
};

const projectsPerday = (req, res) => {
    const query = 'select COUNT(projectid) as count, DATE_FORMAT(`timestamp`,"%Y-%m-%d") as created_day FROM cmpe_project GROUP BY created_day';
    perdayQuery(req, res, query);
};

const testsPerday = (req, res) => {
    const query = 'select COUNT(artifactid) as count, DATE_FORMAT(`timestamp`,"%Y-%m-%d") as created_day FROM cmpe_tester_artifact GROUP BY created_day;';
    perdayQuery(req, res, query);
};

const bugsPerday = (req, res) => {
    const query = 'select COUNT(bug_id) as count, DATE_FORMAT(creation_ts,"%Y-%m-%d") as created_day FROM bugs GROUP BY created_day;';
    perdayQuery(req, res, query);
};

const topProjects = (req, res, query, limit) => {
    const mysqlconnection = req.db;
    mysqlconnection.query(query, [limit], (err, rowsOfTable)=>{
            const dataArr = [];
            if(err) {
                console.log(err);
                res.status(500);
                res.send({success:false, data: dataArr});
            } else {
                let i=0;
                for(i=0; i < rowsOfTable.length; i++) {
                    dataArr.push({projectid: rowsOfTable[i].projectid,
                        projectname: rowsOfTable[i].projectname,
                        bugzilla_projectid: bugzillaProductPrefix + rowsOfTable[i].projectid,
                        status: rowsOfTable[i].status,
                        count: rowsOfTable[i].count});
                }
                res.send({success:true, data:dataArr});
            }
    });
}

const topProjectsTestCases = (req, res) => {
    const query = "select COUNT(artifactid) as count, cp.projectid as projectid, projectname, `status` FROM cmpe_project cp, cmpe_tester_artifact as cta WHERE cp.projectid=cta.projectid GROUP BY cp.projectid  ORDER BY count DESC LIMIT ?;";
    const limit = parseInt(req.query.limit);
    topProjects(req, res, query, limit);
}

const topProjectsTesters = (req, res) => {
    const query = "select COUNT(cpm.userid) as count, cpm.projectid as projectid, projectname, `status` FROM cmpe_project cp, cmpe_project_members as cpm, cmpe_users cu WHERE cp.projectid=cpm.projectid AND cpm.userid = cu.userid AND cu.isblocked=0 AND cu.role='TESTER' GROUP BY cp.projectid  ORDER BY count DESC LIMIT ?;";
    const limit = parseInt(req.query.limit);
    topProjects(req, res, query, limit);
}

const roleShare = (req, res, next) => {
    const query = "select role, COUNT(userid) as count from cmpe_users GROUP BY role;";
    const mysqlconnection = req.db;
    mysqlconnection.query(query, (err, rowsOfTable)=>{
        if(err) {
            console.log(err);
            res.status(500);
            res.send({success:false, data: {}});
        } else {
            const data = {}
            for(let i=0; i < rowsOfTable.length; i++) {
                data[rowsOfTable[i].role] = rowsOfTable[i].count;
            }
            res.send({success:true, data: data});
        }
    });
}

const addAdmin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const role = "ADMIN";

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
    testlogin,
    addAdmin,
    usersPerday, projectsPerday, testsPerday, bugsPerday,
    topProjectsTestCases, topProjectsTesters, roleShare
};