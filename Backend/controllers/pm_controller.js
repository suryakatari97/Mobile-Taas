const axios = require('axios');
const {bugzillaToken, bugzillaBaseURL, 
    bugzillaProductPrefix} = require("../config/constants");

const testlogin = (req, res, next)=>{
    res.send({userid: req.user.userid, role: req.user.role});
};

// Sample implementation for project
// If changing the implementation, please keep the bugzilla code as is.
// Otherwise bugzilla will break;
const createProject = (req, res, next) => {
    const userid = req.user.userid;
    const projectname = req.body.projectname;
    const description = req.body.description;
    const project_url = req.body.project_url;

    // insert into mysqlDB
    const mysqlconnection = req.db;
    // mysql transaction
    mysqlconnection.connect(function(err) {
        if (err) {
          console.error('error connecting: ' + err.stack);
          res.send({success:false, message: "Failed to create a project"});
        }
        console.log('connected as id ' + mysqlconnection.threadId);
      });
    mysqlconnection.beginTransaction((err) => {
        if(!err) {
            // get the email fo current user, needed for bugzilla
            mysqlconnection.query("SELECT email from cmpe_users WHERE userid=?", [userid], (err, rowsOfTable)=>{
                if(err || rowsOfTable == 0) {
                    console.log(err);
                    mysqlconnection.rollback();
                    res.send({success:false, message: "Failed to create a project"});
                } else {
                    const useremail = rowsOfTable[0].email;
                    // insert into projects table
                    mysqlconnection.query('INSERT INTO cmpe_project (ownerid, projectname, description, project_url) VALUES(?,?,?,?)',
                    [userid, projectname, description, project_url], (err, result) => {
                        if(err){
                            console.log(err);
                            mysqlconnection.rollback();
                            res.send({success:false, message: "Failed to create a project"});
                        } else {
                            console.log(result.insertId);
                            const projectId = result.insertId;
                            const bugzillaName = bugzillaProductPrefix + projectId;
                            // create product in bugzilla
                            axios.post(bugzillaBaseURL+"/product?token="+bugzillaToken, {"name": bugzillaName, 
                                    "description": projectname + " : " + project_url + " : "  + description, 
                                    "version": "1.0"})
                            .then((response)=>{
                                    // create component in bugzilla
                                axios.post(bugzillaBaseURL+"/component?token="+bugzillaToken, 
                                    {"product": bugzillaName, "name": bugzillaName, 
                                    "description": "component for " + projectname , 
                                    "default_assignee": useremail})
                                .then((response)=>{
                                        mysqlconnection.commit();
                                        res.send({success:true, projectid: projectId});
                                })
                                .catch((error)=>{
                                        console.log(error);
                                        mysqlconnection.rollback();
                                        res.send({success:false, message: "Failed to create a project"});
                                })
                            })
                            .catch((error)=>{
                                    console.log(error);
                                    mysqlconnection.rollback();
                                    res.send({success:false, message: "Failed to create a project"});
                            })
                        }
                    });
                }
            })

        }
    })
    
}


const getProjectJoinRequests = (req,res,next) =>{
    console.log(req.query);
    var pmid = req.query.id;
    const mysqlconnection = req.db;
    mysqlconnection.query('SELECT j.requestid,j.userid,j.projectid,p.projectname FROM cmpe_join_request as j LEFT JOIN cmpe_project as p ON j.projectid = p.projectid WHERE p.ownerid=?',
      [pmid] , (err, rowsOfTable, fieldsOfTable)=>{
            if(err){
                console.log(err);
                res.status(500).json({ responseMessage: 'Database not responding' });
            } else {
                  console.log(rowsOfTable);
                  res.status(200).json({ requests: rowsOfTable });
                }
    });
};

const postAcceptJoinRequest = (req, res, next) => {
    console.log("In post accept join request:");
    console.log(req.body);
    let testerid = req.body.testerid;
    let projectid = req.body.projectid;
    let requestid = req.body.requestid;
    const mysqlconnection = req.db;
    // mysql transaction
    mysqlconnection.beginTransaction((err) => {
        if (!err) {

            mysqlconnection.query('DELETE FROM cmpe_join_request WHERE requestid=?', [requestid], (err, result) => {
                if (err) {
                    console.log(err);
                    mysqlconnection.rollback();
                    res.status(500).json({ success: false, responseMessage: 'Unable to accept request. Please try again!' });
                } else {
                    console.log(result);
                    console.log("Sucessfully deleted request id:"+requestid);
                    mysqlconnection.query('INSERT INTO cmpe_project_members (userid, projectid) VALUES(?,?)', [testerid, projectid], (err, result) => {
                        if (err) {
                            console.log(err);
                            mysqlconnection.rollback();
                            res.status(500).json({ success: false, responseMessage: 'Unable to accept request. Please try again!' });
                        } else {
                            mysqlconnection.commit();
                            console.log(result);
                            res.status(200).json({ success: true, responseMessage: 'Successfully accepted Join Request.' });
                        }
                    });
                }
            });
        }
    });
}


const postDeclineJoinRequest = (req, res, next) => {
    console.log("In post accept join request:");
    console.log(req.body);
    let requestid = req.body.requestid;
    const mysqlconnection = req.db;
    mysqlconnection.query('DELETE FROM cmpe_join_request WHERE requestid=?', [requestid], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ success: false, responseMessage: 'Unable to decline request. Please try again!' });
        } else {
            console.log(result);
            res.status(200).json({ success: true, responseMessage: 'Successfully declined Join Request.' });
        }
    });
}

const getManagerProfile = (req, res) => {
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

const postManagerProfile = (req,res) =>{
    console.log("In update method of pm profile");
    const query = 'UPDATE cmpe_users SET firstname = ?, lastname = ?, contactno = ? WHERE userid = ?;';
    var currentuserid = decodeURI(req.params.userid);
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var contactno = req.body.contactno;
    console.log(currentuserid);
    console.log(query);
    console.log(req.body);
    const mysqlconnection = req.db;
    mysqlconnection.query(query, [firstname,lastname,contactno,currentuserid], (err, rowsOfTable)=>{
        const dataArr = [];
        if(err) {
            console.log(err);
            res.status(500);
            res.send({success:false, data: dataArr});
        } else {
            console.log(JSON.stringify(rowsOfTable));
            res.send({success:true, data:"Profile updated successfully"});
        }
    });
}

const postManagerProfileImage = async function(req, res) {
    const imageData = req.body.image;
    console.log("In update profile image method in controller");
    console.log(req.body);
    const userid = req.params.userid;
    const query = 'UPDATE cmpe_users SET profileimg = ? where userid=?';
    const mysqlconnection = req.db;
    mysqlconnection.query(query,[imageData, userid],(err,response)=>{
        if(err){
            console.log(err);
            res.send({success:false})
        }else{
            res.send({success:true})
        }
    });
}


module.exports = {
    testlogin,
    createProject,
    getProjectJoinRequests,
    postAcceptJoinRequest,
    postDeclineJoinRequest,
    getManagerProfile,
    postManagerProfile,
    postManagerProfileImage
};
