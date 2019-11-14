const managerlogin = (req, res, next) => {
	res.send({
		userid: req.user.userid,
		role: req.user.role
	});
};

const getManagerProjects = (req, res, next) => {
	console.log(req.query);
	var managerid = req.query.id;
	const mysqlconnection = req.db;
	console.log('manager id:', managerid);

	mysqlconnection.query(
		'SELECT p.projectid, p.projectname, p.description,p.project_url FROM cmpe_users as m LEFT JOIN cmpe_project as p ON m.userid = p.ownerid WHERE userid=?',
		[ managerid ],
		(err, rowsOfTable, fieldsOfTable) => {
			if (err) {
				console.log(err);
				res.status(500).json({
					responseMessage: 'Database not responding'
				});
			} else {
				console.log('pm projects', rowsOfTable);
				res.status(200).json({
					projects: rowsOfTable
				});
			}
		}
	);
};

module.exports = {
	managerlogin,
	getManagerProjects
};
