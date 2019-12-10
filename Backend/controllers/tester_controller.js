const testlogin = (req, res, next) => {
    res.send({ userid: req.user.userid, role: req.user.role });
};

const TesterNotifications =(req,res,next) => {
console.log(req.query);
    var testerid = req.query.id;
    const mysqlconnection = req.db;
    mysqlconnection.query('SELECT * FROM MobileTaas.cmpe_join_request where status != "pending" and userid=?',
        [testerid], (err, rowsOfTable, fieldsOfTable) => {
            if (err) {
                console.log(err);
                res.status(500).json({ responseMessage: 'Database not responding' });
            } else {
                console.log(rowsOfTable);
                res.status(200).json({ Notifications: rowsOfTable });
            }
        });
};

const getTesterProjects = (req, res, next) => {
    console.log(req.query);
    var testerid = req.query.id;
    const mysqlconnection = req.db;
    mysqlconnection.query('SELECT m.projectid, p.projectname FROM cmpe_project_members as m LEFT JOIN cmpe_project as p ON m.projectid = p.projectid WHERE userid=?',
        [testerid], (err, rowsOfTable, fieldsOfTable) => {
            if (err) {
                console.log(err);
                res.status(500).json({ responseMessage: 'Database not responding' });
            } else {
                console.log(rowsOfTable);
                res.status(200).json({ projects: rowsOfTable });
            }
        });
};

const getProjectUrl = (req, res, next) => {
    console.log(req.query);
    var projectid = req.query.id;
    const mysqlconnection = req.db;
    mysqlconnection.query('SELECT project_url FROM cmpe_project WHERE projectid=?',
        [projectid], (err, rowsOfTable, fieldsOfTable) => {
            if (err) {
                console.log(err);
                res.status(500).json({ responseMessage: 'Database not responding' });
            } else {
                console.log(rowsOfTable);
                res.status(200).json({ url: rowsOfTable[0].project_url });
            }
        });
};


const getNewProjects = (req, res, next) => {
    console.log(req.query);
    var testerid = req.query.id;
    const mysqlconnection = req.db;
    mysqlconnection.query('SELECT p.projectid,p.projectname,p.description,p.timestamp,p.Skills,p.project_url FROM cmpe_project as p LEFT JOIN cmpe_project_members as m ON m.projectid = p.projectid LEFT JOIN cmpe_join_request as j ON p.projectid = j.projectid WHERE p.status="new" AND (m.userid IS NULL OR m.userid!=?) AND (j.userid IS NULL OR j.userid!=?)',
        [testerid, testerid], (err, rowsOfTable, fieldsOfTable) => {
            if (err) {
                console.log(err);
                res.status(500).json({ responseMessage: 'Database not responding' });
            } else {
                console.log(rowsOfTable);
                res.status(200).json({ projects: rowsOfTable });
            }
        });
};

const postJoinRequest = (req, res, next) => {
    console.log("In post join request:");
    console.log(req.body);
    let testerid = req.body.testerid;
    let projectid = req.body.projectid;
    let status = "pending"
    const mysqlconnection = req.db;
    mysqlconnection.query('INSERT INTO cmpe_join_request (userid, projectid,status) VALUES(?,?,?)',
        [testerid, projectid, status], (err, result) => {
            if (err) {
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
    mysqlconnection.query(query, [currentuserid], (err, rowsOfTable) => {
        const dataArr = [];
        if (err) {
            console.log(err);
            res.status(500);
            res.send({ success: false, data: dataArr });
        } else {

            console.log(JSON.stringify(rowsOfTable));

            res.send({ success: true, data: JSON.stringify(rowsOfTable) });
        }
    });
}

const tester_getskills = (req, res) => {

    console.log("In get method of tester profile");
    const query = 'select * FROM cmpe_skills s join cmpe_users_skill us on  s.skillid = us.skillid AND us.userid = ?;';
    var currentuserid = decodeURI(req.params.userid);
    const mysqlconnection = req.db;
    mysqlconnection.query(query, [currentuserid], (err, rowsOfTable) => {
        const dataArr = [];
        if (err) {
            console.log(err);
            res.status(500);
            res.send({ success: false, data: dataArr });
        } else {

            console.log(JSON.stringify(rowsOfTable));

            res.send({ success: true, data: JSON.stringify(rowsOfTable) });
        }
    });

}

const tester_updateProfile = (req, res) => {
    console.log("In update method of profile");
    const query = 'UPDATE cmpe_users SET firstname = ?, lastname = ?, contactno = ? WHERE userid = ?;';
    var currentuserid = decodeURI(req.params.userid);
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var contactno = req.body.contactno;
    console.log(query);
    const mysqlconnection = req.db;
    mysqlconnection.query(query, [firstname, lastname, contactno, currentuserid], (err, rowsOfTable) => {
        const dataArr = [];
        if (err) {
            console.log(err);
            res.status(500);
            res.send({ success: false, data: dataArr });
        } else {
            //res.send({success:true, data:"Profile updated successfully"});
            tester_updateSkills(req, res);
        }
    });
}

const tester_updateSkills = (req, res) => {
    console.log("In update method of skills");
    const query = 'DELETE FROM cmpe_users_skill where userid = ?;';
    var currentuserid = decodeURI(req.params.userid);

    var query2 = 'SELECT 1;';
    console.log(req.body)
    if (req.body.skills !== undefined && req.body.skills !== null) {
        req.body.skills.map((skill) => {
            query2 += 'INSERT INTO cmpe_users_skill(userid,skillid) VALUES(' + currentuserid + ',' + skill.skillid + ');';
        })
    }
    console.log(query2);
    const mysqlconnection = req.db;
    mysqlconnection.query(query, [currentuserid], (err, rowsOfTable) => {
        const dataArr = [];
        if (err) {
            console.log(err);
            res.status(500);
            res.send({ success: false, data: dataArr });
        } else {

            mysqlconnection.query(query2, [], (err, rowsOfTable) => {
                const dataArr = [];
                if (err) {
                    console.log(err);
                    res.status(500);
                    res.send({ success: false, data: dataArr });
                } else {
                    res.send({ success: true, data: "Skills updated successfully" });
                }
            });
        }
    });
}

const get_allSkills = (req, res) => {
    console.log("In get method of all types of skills");
    const query = 'select * FROM cmpe_skills;';
    const mysqlconnection = req.db;
    mysqlconnection.query(query, [], (err, rowsOfTable) => {
        const dataArr = [];
        if (err) {
            console.log(err);
            res.status(500);
            res.send({ success: false, data: dataArr });
        } else {

            console.log(JSON.stringify(rowsOfTable));

            res.send({ success: true, data: JSON.stringify(rowsOfTable) });
        }
    });
}

const get_profileImage = async function (req, res) {
    var currentuserid = req.param.userid;
    const query = 'SELECT profileimg from cmpe_users where userid=?';
    const mysqlconnection = req.db;
    mysqlconnection.query(query, [currentuserid], (err, rowsOfTable) => {
        if (err) {
            console.log(err);
            res.send({ success: false })
        } else if (rowsOfTable.length == 1) {
            res.send({ success: true, image: rowsOfTable[0].profileimg })
        } else {
            res.send({ success: false })
        }
    });
}

const post_profileImage = async function (req, res) {
    const imageData = req.body.image;
    console.log("In update profile image method in controller");
    console.log(req.body);
    const userid = req.params.userid;
    const query = 'UPDATE cmpe_users SET profileimg = ? where userid=?';
    const mysqlconnection = req.db;
    mysqlconnection.query(query, [imageData, userid], (err, response) => {
        if (err) {
            console.log(err);
            res.send({ success: false })
        } else {
            res.send({ success: true })
        }
    });
}


const gettesterprojectdetails = (req, res) => {
    console.log(req.query);
    let projectid = req.query.id;
    const mysqlconnection = req.db;
    mysqlconnection.query('SELECT * FROM cmpe_project as p WHERE p.projectid =?',
        [projectid], (err, rowsOfTable, fieldsOfTable) => {
            if (err) {
                console.log(err);
                res.status(500).json({ responseMessage: 'Database not responding' });
            } else {
                console.log(rowsOfTable);
                res.status(200).json({ projectdata: rowsOfTable });
            }
        });
};

const get_artifacts = (req, res, next) => {
    console.log(req.query);
    var testerid = req.query.id;
    const mysqlconnection = req.db;
    mysqlconnection.query('SELECT * FROM cmpe_tester_artifact WHERE testerid=?',
        [testerid], (err, rowsOfTable, fieldsOfTable) => {
            if (err) {
                console.log(err);
                res.status(500).json({ responseMessage: 'Database not responding' });
            } else {
                console.log(rowsOfTable);
                res.status(200).json({ results: rowsOfTable });
            }
        });
};

module.exports = {
    testlogin,
    getTesterProjects,
    getProjectUrl,
    getNewProjects,
    postJoinRequest,
    tester_getProfile,
    tester_getskills,
    tester_updateProfile,
    get_allSkills,
    get_profileImage,
    post_profileImage,
    TesterNotifications,
    get_artifacts,
    gettesterprojectdetails
};