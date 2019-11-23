const perdayQuery = (req, res, query, managerid) => {
    console.log(managerid);
    const mysqlconnection = req.db;
    mysqlconnection.query(query, [managerid], (err, rowsOfTable) => {
        const dataArr = [];
        if (err) {
            console.log(err);
            res.status(500);
            res.send({ success: false, data: dataArr });
        } else {
            console.log(rowsOfTable);
            let i = 0;
            for (i = 0; i < rowsOfTable.length; i++) {
                dataArr.push({ date: rowsOfTable[i].created_day, count: rowsOfTable[i].count });
            }
            res.send({ success: true, data: dataArr });
        }
    });
}

const Testersperproject = (req, res, query, managerid) => {
    console.log(managerid);
    const mysqlconnection = req.db;
    mysqlconnection.query(query, [managerid], (err, rowsOfTable) => {
        const dataArr = [];
        if (err) {
            console.log(err);
            res.status(500);
            res.send({ success: false, data: dataArr });
        } else {
            console.log(rowsOfTable);
            let i = 0;
            for (i = 0; i < rowsOfTable.length; i++) {
                dataArr.push({ project: rowsOfTable[i].projectid, count: rowsOfTable[i].NoOfTesters });
            }
            res.send({ success: true, data: dataArr });
        }
    });
}

const ProjectsCreatedPerDay = (req, res) => {
    console.log(req.query);
    var managerid = req.query.id;
    const query = 'select COUNT(ownerid) as count, DATE_FORMAT(`timestamp`,"%Y-%m-%d") as created_day FROM cmpe_project where ownerid=? GROUP BY created_day;';
    perdayQuery(req, res, query, managerid);
};

const NumberofTestersPerProject =(req, res) => {
    console.log(req.query);
    var managerid = req.query.id;
    const query = 'SELECT COUNT(cpm.userid) as NoOfTesters, cpm.projectid FROM cmpe_project_members as cpm JOIN cmpe_project as cp where cpm.projectid = cp.projectid and cp.ownerid =? Group By projectid;'
    Testersperproject(req, res, query, managerid);  
};

module.exports = {
    ProjectsCreatedPerDay, NumberofTestersPerProject
};