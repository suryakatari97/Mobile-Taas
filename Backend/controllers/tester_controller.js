const testlogin = (req, res, next)=>{
    res.send({userid: req.user.userid, role: req.user.role});
};

const getTesterProjects = (req,res,next) =>{
    console.log(req.query);
    var testerid = req.query.id;
    const mysqlconnection = req.db;
    mysqlconnection.query('SELECT m.projectid, p.projectname FROM cmpe_project_members as m LEFT JOIN cmpe_project as p ON m.projectid = p.projectid WHERE userid=?',
        [testerid], (err, rowsOfTable, fieldsOfTable)=>{
            if(err){
                console.log(err);
                res.status(500).json({ responseMessage: 'Database not responding' });
            } else {
                  console.log(rowsOfTable);
                  res.status(200).json({ projects: rowsOfTable });
                }
    });
};

const getProjectUrl = (req,res,next) =>{
    console.log(req.query);
    var projectid = req.query.id;
    const mysqlconnection = req.db;
    mysqlconnection.query('SELECT project_url FROM cmpe_project WHERE projectid=?',
        [projectid], (err, rowsOfTable, fieldsOfTable)=>{
            if(err){
                console.log(err);
                res.status(500).json({ responseMessage: 'Database not responding' });
            } else {
                  console.log(rowsOfTable);
                  res.status(200).json({ url: rowsOfTable[0].project_url });
                }
    });
};


const getNewProjects = (req,res,next) =>{
    console.log(req.query);
    var testerid = req.query.id;
    const mysqlconnection = req.db;
    mysqlconnection.query('SELECT p.projectid,p.projectname,p.description,p.timestamp FROM cmpe_project as p LEFT JOIN cmpe_project_members as m ON m.projectid = p.projectid LEFT JOIN cmpe_join_request as j ON p.projectid = j.projectid WHERE p.status="new" AND (m.userid IS NULL OR m.userid!=?) AND (j.userid IS NULL OR j.userid!=?)',
    [testerid,testerid] , (err, rowsOfTable, fieldsOfTable)=>{
            if(err){
                console.log(err);
                res.status(500).json({ responseMessage: 'Database not responding' });
            } else {
                  console.log(rowsOfTable);
                  res.status(200).json({ projects: rowsOfTable });
                }
    });
};

const postJoinRequest = (req,res,next) => {
    console.log("In post join request:");
    console.log(req.body);
    let testerid = req.body.testerid;
    let projectid = req.body.projectid;
    const mysqlconnection = req.db;
    mysqlconnection.query('INSERT INTO cmpe_join_request (userid, projectid) VALUES(?,?)',
    [testerid,projectid], (err, result) => {
        if(err){
            console.log(err);
            res.status(500).json({ success: false, responseMessage: 'Unable to send request. Please try again!' });
        } else {
              console.log(result);
              res.status(200).json({ success: true, responseMessage: 'Successfully sent request to project manager.' });
        }
    });
};

const tester_getProfile = (req, res) => {
    console.log("In get method of tester profile");
    const query = 'select * FROM cmpe_users WHERE userid = ?;';
    var currentuserid = decodeURI(req.params.userid);
    const mysqlconnection = req.db;
    mysqlconnection.query(query, [currentuserid], (err, rowsOfTable)=>{
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

const tester_getskills = (req, res) => {

    console.log("In get method of tester profile");
    const query = 'select * FROM cmpe_skills s join cmpe_users_skill us on  s.skillid = us.skillid AND us.userid = ?;';
    var currentuserid = decodeURI(req.params.userid);
    const mysqlconnection = req.db;
    mysqlconnection.query(query, [currentuserid], (err, rowsOfTable)=>{
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

module.exports = {
    testlogin,
    getTesterProjects,
    getProjectUrl,
    getNewProjects,
    postJoinRequest,
    tester_getProfile,
    tester_getskills
};