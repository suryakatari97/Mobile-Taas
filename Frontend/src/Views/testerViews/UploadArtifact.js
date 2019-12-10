import React, { Component } from 'react';
import axios from 'axios';
import { hostaddress } from '../../config/settings';
import '../../styles/testRunner.css';
import swal from 'sweetalert';
import Header from "../Header";

class UploadArtifact extends Component {

    constructor() {
        super();
        this.state = {
            file: null
        }
    }

    //get the projects from backend  
    componentDidMount() {
    }

    handleUpload = (event) => {
        //console.log(event.target.files);
        this.setState({file: event.target.files});
    }

    uploadFile = async (event) => {
        event.preventDefault();
        let token = localStorage.getItem('jwtToken');
        let currentUserId = localStorage.getItem("userid");
        if(this.state.file !== null) {
            const formData = new FormData();
            formData.append('file', this.state.file[0]);
            await axios("/tester/upload/"+ currentUserId,{
                method: 'post',
                //url: 'http://' + hostaddress + ':3001/tester/upload/'+ currentUserId ,     
                data: formData,
                config: { headers: { 'Content-Type': 'multipart/form-data' } },
                headers: { "Authorization": `Bearer ${token}` }
            })
            .then((response) => {
                console.log(response.data);
                swal("Done!","Sucessfully Uploaded!","success");
            });
        }
    }


    render() {
        console.log(this.state.file);
        return (
            <div className="main-wrapper">
            <Header/>
            <div className="content-wrapper">
                <div className="container">
                    <div className="row justify-content-center align-items-center">
                        <div className="col-12">
                        <div className="dash-one">
                    <p className="dash-header">Upload Artifact</p>
                </div>
                            <form onSubmit={this.uploadFile} method="post" style={{marginLeft:"2em"}}>
                                <div className="form-group row">
                                    <label htmlFor="url" className="col-sm-2 col-form-label">Upload File:</label>
                                    <div className="col-sm-5">
                                        <input label='upload file' type='file' required onChange={this.handleUpload} />
                                    </div>
                                </div>
                                <div className="form-group row text-center">
                                <div className="col-sm-5">
                                    <button type="submit" class="btn btn-primary align-center" style={{marginTop: "2em"}}>Upload</button>
                                </div>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
            </div>
        )
    }
}

export default UploadArtifact;