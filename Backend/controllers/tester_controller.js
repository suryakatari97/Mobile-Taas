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

module.exports = {
    testlogin,
    getTesterProjects,
    getProjectUrl
};