const axios = require('axios');
const { bugzillaToken, bugzillaBaseURL, bugzillaProductPrefix } = require('../config/constants');

const testlogin = (req, res, next) => {
	res.send({ userid: req.user.userid, role: req.user.role });
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
			res.send({ success: false, message: 'Failed to create a project' });
		}
		console.log('connected as id ' + mysqlconnection.threadId);
	});
	mysqlconnection.beginTransaction((err) => {
		if (!err) {
			// get the email fo current user, needed for bugzilla
			mysqlconnection.query('SELECT email from cmpe_users WHERE userid=?', [ userid ], (err, rowsOfTable) => {
				if (err || rowsOfTable == 0) {
					console.log(err);
					mysqlconnection.rollback();
					res.send({ success: false, message: 'Failed to create a project' });
				} else {
					const useremail = rowsOfTable[0].email;
					// insert into projects table
					mysqlconnection.query(
						'INSERT INTO cmpe_project (ownerid, projectname, description, project_url) VALUES(?,?,?,?)',
						[ userid, projectname, description, project_url ],
						(err, result) => {
							if (err) {
								console.log(err);
								mysqlconnection.rollback();
								res.send({ success: false, message: 'Failed to create a project' });
							} else {
								console.log(result.insertId);
								const projectId = result.insertId;
								const bugzillaName = bugzillaProductPrefix + projectId;
								// create product in bugzilla
								axios
									.post(bugzillaBaseURL + '/product?token=' + bugzillaToken, {
										name: bugzillaName,
										description: projectname + ' : ' + project_url + ' : ' + description,
										version: '1.0'
									})
									.then((response) => {
										// create component in bugzilla
										axios
											.post(bugzillaBaseURL + '/component?token=' + bugzillaToken, {
												product: bugzillaName,
												name: bugzillaName,
												description: 'component for ' + projectname,
												default_assignee: useremail
											})
											.then((response) => {
												mysqlconnection.commit();
												res.send({ success: true, projectid: projectId });
											})
											.catch((error) => {
												console.log(error);
												mysqlconnection.rollback();
												res.send({ success: false, message: 'Failed to create a project' });
											});
									})
									.catch((error) => {
										console.log(error);
										mysqlconnection.rollback();
										res.send({ success: false, message: 'Failed to create a project' });
									});
							}
						}
					);
				}
			});
		}
	});
};

const deleteProject = (req, res, next) => {
	const userid = req.user.userid;
	const projectid = req.body.projectid;

	// delete from mysqlDB
	const mysqlconnection = req.db;
	// mysql transaction
	mysqlconnection.connect(function(err) {
		if (err) {
			// console.error('error connecting: ' + err.stack);
			res.send({ success: false, message: 'Failed to create a project' });
		}
		console.log('connected as id ' + mysqlconnection.threadId);
	});
	mysqlconnection.beginTransaction((err) => {
		if (!err) {
			// get the email fo current user, needed for bugzilla
			mysqlconnection.query('SELECT email from cmpe_users WHERE userid=?', [ userid ], (err, rowsOfTable) => {
				if (err || rowsOfTable == 0) {
					console.log(err);
					mysqlconnection.rollback();
					res.send({ success: false, message: 'Failed to create a project' });
				} else {
					const useremail = rowsOfTable[0].email;
					// insert into projects table
					mysqlconnection.query(
						'DELETE from cmpe_project where projectid =(?)',
						[ projectid ],
						(err, result) => {
							if (err) {
								console.log('err', err);
								mysqlconnection.rollback();
								res.send({ success: false, message: 'Failed to delete a project' });
							} else {
								console.log('result', result);

								mysqlconnection.commit();
								// res.writeHead(200, {
								//     "Content-type": "application/json"
								// });
								// console.log("deleted project");
								res.end({ success: true, message: 'successfully deleted a project' });
							}
						}
					);
				}
			});
		}
	});
};

module.exports = {
	testlogin,
	createProject,
	deleteProject,
	getManagerProjects
};
