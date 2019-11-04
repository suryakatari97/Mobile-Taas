const testlogin = (req, res, next)=>{
    res.send({userid: req.user.userid, role: req.user.role});
};
module.exports = {
    testlogin
};