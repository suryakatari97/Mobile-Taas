const AWS = require('aws-sdk');
const fs = require('fs');
const fileType = require('file-type');
const bluebird = require('bluebird');
const multiparty = require('multiparty');

const {S3_BUCKET,AWS_ACCESS_KEY_ID,AWS_SECRET_ACCESS_KEY} = require("../config/constants");

// configure the keys for accessing AWS
AWS.config.update({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
});

// configure AWS to work with promises
AWS.config.setPromisesDependency(bluebird);

// create S3 instance
const s3 = new AWS.S3();

// abstracts function to upload a file returning a promise
const uploadFile = (buffer, name, type) => {
    const params = {
        ACL: 'public-read',
        Body: buffer,
        Bucket: S3_BUCKET,
        ContentType: type.mime,
        Key: `${name}.${type.ext}`
    };
    return s3.upload(params).promise();
};

const resumeUploadToS3 = (request, response) => {
    console.log("Uploading file to S3")
    const form = new multiparty.Form();
    form.parse(request, async (error, fields, files) => {
        if (error) throw new Error(error);
        try {
            const userid = request.params.userid;
            console.log(files.file[0])
            const path = files.file[0].path;
            const buffer = fs.readFileSync(path);
            const type = fileType(buffer);
            const fileName = userid + '/Resume' ;
            const data = await uploadFile(buffer, fileName, type);

            console.log("Updating link to database");

            console.log(data.Location);
            const query = 'UPDATE cmpe_users SET resume_filename = ? where userid=?';
            const mysqlconnection = request.db;
            mysqlconnection.query(query,[data.Location, userid],(err,res)=>{
                if(err){
                    console.log(err);
                    response.send({success:false})
                }else{
                    response.send({success:true})
                }
            });
            //return response.status(200).send(JSON.stringify({success:true,data:data}));;
        } catch (error) {
            console.log(error)
            return response.status(400).send(error);
        }
    });
};



module.exports = {
    resumeUploadToS3,
};