const axios = require('axios');
const {bugzillaToken, bugzillaBaseURL, bugzillaProductPrefix} = require("../config/constants");

// const projectJoinedPerDayForTester, testsPerdayForTester, bugsPerdayForTester
const perdayQuery = (req, res, query, testerid) => {
    console.log(testerid);
    const mysqlconnection = req.db;
    mysqlconnection.query(query, [testerid], (err, rowsOfTable)=>{
            const dataArr = [];
            if(err) {
                console.log(err);
                res.status(500);
                res.send({success:false, data: dataArr});
            } else {
                console.log(rowsOfTable);
                let i=0;
                for(i=0; i < rowsOfTable.length; i++) {
                    dataArr.push({date: rowsOfTable[i].created_day, count: rowsOfTable[i].count});
                }
                res.send({success:true, data:dataArr});
            }
    });
}

const projectsPerdayForTester = (req, res) => {
    console.log(req.query);
    var testerid = req.query.id;
    const query = 'select COUNT(projectid) as count, DATE_FORMAT(`membersince`,"%Y-%m-%d") as created_day FROM cmpe_project_members where userid=? GROUP BY created_day;';
    perdayQuery(req, res, query, testerid);
};

const testsPerdayForTester = (req, res) => {
    console.log(req.query);
    var testerid = req.query.id;
    const query = 'select COUNT(artifactid) as count, DATE_FORMAT(`timestamp`,"%Y-%m-%d") as created_day FROM cmpe_tester_artifact where testerid=? GROUP BY created_day;';
    perdayQuery(req, res, query, testerid);
};

const bugsPerdayForTester = (req, res) => {
    console.log(req.query);
    var testeremail = req.query.id;
    let dataArr = [];
    axios.get(bugzillaBaseURL+"/bug?token="+bugzillaToken+"&creator="+testeremail)
                .then((response)=>{
                    // any 2xx is fine from bugzilla
                    console.log(response);
                    if(response.status >= 200 && response.status <300 ) {
                       console.log(response.data);
                       console.log(response.data.bugs.length);
                       countBugs = response.data.bugs.length;
                       success = true;
                       //2019-12-10
                       console.log(dataArr);
                       dataArr.push({date: "2019-12-10", count: countBugs});
                        res.send({success:true, data:dataArr});
                       
                    } else {
                        success = false;
                        console.log(response);
                        res.status(500);
                        res.send({success:false, message:"failed to get from bugzilla account"});
                    }
                }).catch((error)=>{
                    success = false;
                    console.log(error);
                    res.status(500);
                    res.send({success:false, message:"failed to get from bugzilla account, bugzilla error"});
                });
};


const projectsWorkedOnPerCategoryTester = (req,res) => {
    const mysqlconnection = req.db;
    console.log(req.query);
    var testerid = req.query.id;
    var result = [];
    mysqlconnection.query('select COUNT(m.projectid) as countNew FROM cmpe_project_members as m LEFT JOIN cmpe_project as p ON m.projectid = p.projectid WHERE userid=? and p.status="new";', [testerid], (err, rowsOfTable)=>{
        if(err) {
            console.log(err);
            res.status(500);
            res.send({success:false, data: res});
        } else {
            result.push(rowsOfTable[0]);
            mysqlconnection.query('select COUNT(m.projectid) as countInProgress FROM cmpe_project_members as m LEFT JOIN cmpe_project as p ON m.projectid = p.projectid WHERE userid=? and p.status="in progress";', [testerid], (err, rowsOfTable)=>{
                if(err) {
                    console.log(err);
                    res.status(500);
                    res.send({success:false, data: res});
                } else {
                    result.push(rowsOfTable[0]);
                    mysqlconnection.query('select COUNT(m.projectid) as countCompleted FROM cmpe_project_members as m LEFT JOIN cmpe_project as p ON m.projectid = p.projectid WHERE userid=? and p.status="completed";', [testerid], (err, rowsOfTable)=>{
                        if(err) {
                            console.log(err);
                            res.status(500);
                            res.send({success:false, data: dataArr});
                        } else {
                            result.push(rowsOfTable[0]);
                            console.log(result);
                            res.send({success:true, data: result});
                        }
                    });   
                }
            });   
        }
    });   
}

const bugsCategoryTester = (req,res) => {
    const mysqlconnection = req.db;
    console.log(req.query);
    var testerid = req.query.id;
    var result = [];
    mysqlconnection.query('select COUNT(bug_id) as countEnhancement FROM bugs where bug_severity="enhancement";', (err, rowsOfTable)=>{
        if(err) {
            console.log(err);
            res.status(500);
            res.send({success:false});
        } else {
            result.push(rowsOfTable[0]);
            mysqlconnection.query('select COUNT(bug_id) as countBlocker FROM bugs where bug_severity="blocker";', (err, rowsOfTable)=>{
                if(err) {
                    console.log(err);
                    res.status(500);
                    res.send({success:false});
                } else {
                    result.push(rowsOfTable[0]);
                    mysqlconnection.query('select COUNT(bug_id) as countCritical FROM bugs where bug_severity="critical";', (err, rowsOfTable)=>{
                        if(err) {
                            console.log(err);
                            res.status(500);
                            res.send({success:false});
                        } else {
                            result.push(rowsOfTable[0]);
                            mysqlconnection.query('select COUNT(bug_id) as countMajor FROM bugs where bug_severity="major";', (err, rowsOfTable)=>{
                                if(err) {
                                    console.log(err);
                                    res.status(500);
                                    res.send({success:false});
                                } else {
                                    result.push(rowsOfTable[0]);
                                    mysqlconnection.query('select COUNT(bug_id) as countNormal FROM bugs where bug_severity="normal";', (err, rowsOfTable)=>{
                                        if(err) {
                                            console.log(err);
                                            res.status(500);
                                            res.send({success:false});
                                        } else {
                                            result.push(rowsOfTable[0]);
                                            mysqlconnection.query('select COUNT(bug_id) as countMinor FROM bugs where bug_severity="minor";', (err, rowsOfTable)=>{
                                                if(err) {
                                                    console.log(err);
                                                    res.status(500);
                                                    res.send({success:false});
                                                } else {
                                                    result.push(rowsOfTable[0]);
                                                    mysqlconnection.query('select COUNT(bug_id) as countTrivial FROM bugs where bug_severity="trivial";', (err, rowsOfTable)=>{
                                                        if(err) {
                                                            console.log(err);
                                                            res.status(500);
                                                            res.send({success:false});
                                                        } else {
                                                            result.push(rowsOfTable[0]);
                                                            console.log(result);
                                                            res.send({success:true, data: result});
                                                        }
                                                    });   
                                                }
                                            });   
                                        }
                                    });   
                                }
                            });   
                        }
                    });   
                }
            });   
        }
    });   
}

module.exports = {
    projectsPerdayForTester, testsPerdayForTester, bugsPerdayForTester, projectsWorkedOnPerCategoryTester, bugsCategoryTester
};