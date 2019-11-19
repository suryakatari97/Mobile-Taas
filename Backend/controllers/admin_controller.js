"use strict";
const bcrypt = require('bcrypt');
const axios = require('axios');
const saltRounds = 2;

const {bugzillaToken, bugzillaBaseURL} = require("../config/constants");

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
                        bugzilla_projectid: rowsOfTable[i].bugzilla_projectid,
                        status: rowsOfTable[i].status,
                        count: rowsOfTable[i].count});
                }
                res.send({success:true, data:dataArr});
            }
    });
}

const topProjectsTestCases = (req, res) => {
    const query = "select COUNT(artifactid) as count, cp.projectid as projectid, projectname, bugzilla_projectid, `status` FROM cmpe_project cp, cmpe_tester_artifact as cta WHERE cp.projectid=cta.projectid GROUP BY cp.projectid  ORDER BY count DESC LIMIT ?;";
    const limit = parseInt(req.query.limit);
    topProjects(req, res, query, limit);
}

const topProjectsTesters = (req, res) => {
    const query = "select COUNT(cpm.userid) as count, cpm.projectid as projectid, projectname, bugzilla_projectid, `status` FROM cmpe_project cp, cmpe_project_members as cpm, cmpe_users cu WHERE cp.projectid=cpm.projectid AND cpm.userid = cu.userid AND cu.isblocked=0 AND cu.role='TESTER' GROUP BY cp.projectid  ORDER BY count DESC LIMIT ?;";
    const limit = parseInt(req.query.limit);
    topProjects(req, res, query, limit);
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

const getTesters = (req,res) => {
    console.log("In get method of all testers by admin");
    const query = 'SELECT userid, email, firstname, lastname, role, isblocked FROM cmpe_users WHERE role=?;';
    const mysqlconnection = req.db;
    mysqlconnection.query(query, ['TESTER'], (err, rowsOfTable)=>{
        const dataArr = [];
        if(err) {
            console.log(err);
            res.status(500);
            res.send({success:false, data: dataArr});
        } else {

            console.log(JSON.stringify(rowsOfTable));

            res.send({success:true, data:JSON.stringify(rowsOfTable)});
        }
    });
}

const blockTester = (req,res) => {
    console.log("In get method block tester by admin");
    changeTesterBlockedStatus(1, req, res)
}

const unblockTester = (req,res) => {
    console.log("In get method unblock tester by admin");
    changeTesterBlockedStatus(0, req, res)
}

const changeTesterBlockedStatus = (status, req, res) => {
    const query = 'UPDATE cmpe_users SET isblocked=? WHERE userid=?;';
    const mysqlconnection = req.db;
    mysqlconnection.query(query, [status, req.params.id], (err, rowsOfTable)=>{
        if(err) {
            console.log(err);
            res.status(500);
            res.send({success:false});
        } else {
            console.log("Changed Tester isBlocked to: " + status);
            res.send({success:true});
        }
    });
}

const getProjects = (req,res) => {
    console.log("In get method of all projects by admin");
    const query = 'select projectid, projectname, firstname, lastname, email, p.isblocked from cmpe_users u join cmpe_project p on u.userid = p.ownerid;';
    const mysqlconnection = req.db;
    mysqlconnection.query(query, [], (err, rowsOfTable)=>{
        const dataArr = [];
        if(err) {
            console.log(err);
            res.status(500);
            res.send({success:false, data: dataArr});
        } else {

            console.log(JSON.stringify(rowsOfTable));

            res.send({success:true, data:JSON.stringify(rowsOfTable)});
        }
    });
}

const blockProject = (req,res) => {
    console.log("In get method block project by admin");
    changeProjectBlockedStatus(1, req, res)
}

const unblockProject = (req,res) => {
    console.log("In get method unblock project by admin");
    changeProjectBlockedStatus(0, req, res)
}

const changeProjectBlockedStatus = (status, req, res) => {
    const query = 'UPDATE cmpe_project SET isblocked=? WHERE projectid=?;';
    const mysqlconnection = req.db;
    mysqlconnection.query(query, [status, req.params.id], (err, rowsOfTable)=>{
        if(err) {
            console.log(err);
            res.status(500);
            res.send({success:false});
        } else {
            console.log("Changed isBlocked to: " + status);
            res.send({success:true});
        }
    });
}



module.exports = {
    testlogin,
    addAdmin,
    usersPerday, projectsPerday, testsPerday, bugsPerday,
    topProjectsTestCases, topProjectsTesters,
    getTesters,
    blockTester, unblockTester,
    getProjects,
    blockProject, unblockProject
};