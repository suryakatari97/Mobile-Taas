const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');
const requireTester = passport.authenticate('tester', {session: false});
const requirePM = passport.authenticate('pm', {session: false});
const requireAdmin = passport.authenticate('admin', {session: false});
const requireAny = passport.authenticate('any', {session: false});
const mysql = require('mysql');

// User defined modules
const userRouter = require("./routes/user_routes");
const adminRouter = require("./routes/admin_routes");
const pmRouter = require("./routes/pm_routes");
const testerRouter = require("./routes/tester_routes");
const anyRouter = require("./routes/any_routes");

const mysqlconnection = mysql.createConnection({
    host: 'project.cm9my3uvtoam.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'CMPE281PROJECT',
    database: 'MobileTaas'
});

// add database to req object.
app.use((req, res, next) =>{req.db = mysqlconnection; next()});

app.use(bodyParser.json());
app.use(passport.initialize());
require('./config/passport')(passport);

// userRouter has only unauthenticated endpoints
app.use("/user", userRouter);

// adminRouter has all endpoints ONLY admins can access
app.use("/admin", requireAdmin, adminRouter);

// pmRouter has all endpoints ONLY PM can access
app.use("/pm", requirePM, pmRouter);

// testerRouter has all endpoints ONLY tester can access
app.use("/tester", requireTester, testerRouter);

// anyRouter has all endpoints any user can access
app.use("/any", requireAny, anyRouter);


app.listen(3001, () => {
    console.log('MobileTaaS running on Port:',3001);
});