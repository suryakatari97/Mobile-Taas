const express = require('express');
const app = express();
var bodyParser = require('body-parser');
var session = require('express-session')

app.listen(3001, () => {
    console.log('MobileTaaS running on Port:',3001);
});