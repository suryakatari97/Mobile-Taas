var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var {jwtSecret} = require('./constants'); 
// Setup work and export for the JWT passport strategy
module.exports = function (passport) {
    var opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: jwtSecret
    };
    passport.use('tester',new JwtStrategy(opts, function (jwt_payload, done) {
        console.log("in passport tester strategy")
        if(jwt_payload.isLoggedIn && jwt_payload.role==="TESTER") {
            console.log("user is authorized")
            return done(null, jwt_payload);
        } else {
            console.log("UnAuthorized User")
            return done("Not valid token", false)
        }
    }));
    passport.use('pm',new JwtStrategy(opts, function (jwt_payload, done) {
        console.log("in pm faculty strategy")
        if(jwt_payload.isLoggedIn && jwt_payload.role==="PM") {
            console.log("pm is authorized")
            return done(null, jwt_payload);
        } else {
            console.log("UnAuthorized User")
            return done("Not valid token", false)
        }
    }));
    passport.use('admin',new JwtStrategy(opts, function (jwt_payload, done) {
        console.log("in passport jwt strategy")
        if(jwt_payload.isLoggedIn && jwt_payload.role==="ADMIN") {
            console.log("user is authorized")
            return done(null, jwt_payload);
        } else {
            console.log("UnAuthorized User")
            return done("Not valid token", false)
        }
    }));
    passport.use('any',new JwtStrategy(opts, function (jwt_payload, done) {
        console.log("in passport any strategy")
        if(jwt_payload.isLoggedIn) {
            console.log("user is authorized")
            return done(null, jwt_payload);
        } else {
            console.log("UnAuthorized User")
            return done("Not valid token", false)
        }
    }));
};