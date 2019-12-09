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
    var testerid = req.query.id;
    const query = 'select COUNT(bug_id) as count, DATE_FORMAT(creation_ts,"%Y-%m-%d") as created_day FROM bugs where reporter=? GROUP BY created_day;';
    perdayQuery(req, res, query, testerid);
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
    mysqlconnection.query('select COUNT(bug_id) as countEnhancement FROM bugs where reporter=? and bug_severity="enhancement";', [testerid], (err, rowsOfTable)=>{
        if(err) {
            console.log(err);
            res.status(500);
            res.send({success:false, data: res});
        } else {
            result.push(rowsOfTable[0]);
            mysqlconnection.query('select COUNT(bug_id) as countBlocker FROM bugs where reporter=? and bug_severity="blocker";', [testerid], (err, rowsOfTable)=>{
                if(err) {
                    console.log(err);
                    res.status(500);
                    res.send({success:false, data: res});
                } else {
                    result.push(rowsOfTable[0]);
                    mysqlconnection.query('select COUNT(bug_id) as countCritical FROM bugs where reporter=? and bug_severity="critical";', [testerid], (err, rowsOfTable)=>{
                        if(err) {
                            console.log(err);
                            res.status(500);
                            res.send({success:false, data: dataArr});
                        } else {
                            result.push(rowsOfTable[0]);
                            mysqlconnection.query('select COUNT(bug_id) as countMajor FROM bugs where reporter=? and bug_severity="major";', [testerid], (err, rowsOfTable)=>{
                                if(err) {
                                    console.log(err);
                                    res.status(500);
                                    res.send({success:false, data: dataArr});
                                } else {
                                    result.push(rowsOfTable[0]);
                                    mysqlconnection.query('select COUNT(bug_id) as countNormal FROM bugs where reporter=? and bug_severity="normal";', [testerid], (err, rowsOfTable)=>{
                                        if(err) {
                                            console.log(err);
                                            res.status(500);
                                            res.send({success:false, data: dataArr});
                                        } else {
                                            result.push(rowsOfTable[0]);
                                            mysqlconnection.query('select COUNT(bug_id) as countMinor FROM bugs where reporter=? and bug_severity="minor";', [testerid], (err, rowsOfTable)=>{
                                                if(err) {
                                                    console.log(err);
                                                    res.status(500);
                                                    res.send({success:false, data: dataArr});
                                                } else {
                                                    result.push(rowsOfTable[0]);
                                                    mysqlconnection.query('select COUNT(bug_id) as countTrivial FROM bugs where reporter=? and bug_severity="trivial";', [testerid], (err, rowsOfTable)=>{
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