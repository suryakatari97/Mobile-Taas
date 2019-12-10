const jwtSecret = 'BRahujBqkZDAHMtYKoPP';
const bugzillaToken = "1-G54RtNO8R8";
const bugzillaHost = "http://ec2-34-209-73-50.us-west-2.compute.amazonaws.com";
const bugzillaBaseURL = bugzillaHost + "/bugzilla/rest";
const bugzillaProductPrefix = "MobileTaas";

const chatHost = "http://ec2-52-52-38-159.us-west-1.compute.amazonaws.com:3000";
const chatBaseURL = chatHost + "/api/v1";
const chatAdminUser = "3YqzDxekvgAcCauor";
const chatAdminPassword = "O8jxYI01_o_Pb_AuzFsuhjaWcXMyozYn8G1n3O-zAos";

const S3_BUCKET = "cmpe-281-mobile-taas-resumes";
const AWS_ACCESS_KEY_ID = "AKIA42KYJYLTMWQNT6HF";
const AWS_SECRET_ACCESS_KEY = "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";

module.exports = {jwtSecret, bugzillaToken, bugzillaBaseURL, bugzillaProductPrefix, bugzillaHost, chatHost, chatBaseURL, chatAdminUser, chatAdminPassword, S3_BUCKET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY};