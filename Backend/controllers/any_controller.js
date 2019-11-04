const axios = require('axios');
const {bugzillaHost, bugzillaProductPrefix, 
    bugzillaToken, bugzillaBaseURL} = require("../config/constants");

const testlogin = (req, res, next)=>{
    res.send({userid: req.user.userid, role: req.user.role});
};

const createbugurl = (req, res) => {
    const projectid = req.query.projectid;
    res.send({"bugurl": bugzillaHost + "/bugzilla/enter_bug.cgi?product="+bugzillaProductPrefix+projectid})
};

const bugsForParams = (req, res, params) => {
    axios.get(bugzillaBaseURL+"/bug",{params:params})
    .then((response)=>{
        console.log(response);
        const bugsArray = [];
        let productRegex = /\w+([0-9]+)/
        response.data.bugs.forEach(bug => {
            // console.log(bug.product)
            // console.log(bug.product.match(productRegex))
            // console.log(bug.product.match(productRegex)[1])
            bugsArray.push({
                status: bug.status,
                summary: bug.summary,
                bugid: bug.id,
                creation_time: bug.creation_time,
                creator_email: bug.creator,
                bug_url:bugzillaHost+"/bugzilla/show_bug.cgi?id="+bug.id,
                creator_name: bug.creator_detail.real_name,
                product_id: parseInt(bug.product.match(productRegex)[1])
            })
        });
        res.send({success:true, bugs: bugsArray});
    })
    .catch((error)=>{
        console.log(error);
        res.send({success:false, bugs:[]});
    })
}

const bugsForProject = (req, res) => {
    const projectid = req.params.projectid;
    const bugzillaProject = bugzillaProductPrefix+projectid;
    bugsForParams(req, res, {token: bugzillaToken, product: bugzillaProject});
};

const bugsForUserHelper = (req, res, userid) => {
    const mysqlconnection = req.db;
    const int_userid = parseInt(userid);
    mysqlconnection.query("SELECT email from cmpe_users WHERE userid=?",[int_userid], 
        (err, rowsOfTable)=>{
            if(err || rowsOfTable == 0) {
                console.log(err);
                res.send({success:false, bugs:[]});
            } else {
                bugsForParams(req, res, {token: bugzillaToken, creator: rowsOfTable[0].email});
            }
    })
}

const bugsForCurrentUser = (req, res) => {
    bugsForUserHelper(req, res, req.user.userid);
};

const bugsForUser = (req, res) => {
    bugsForUserHelper(req, res, req.params.userid);
};

module.exports = {
    testlogin,
    createbugurl,
    bugsForProject,
    bugsForCurrentUser,
    bugsForUser
};