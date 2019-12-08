import React, { Component } from 'react';
import axios from 'axios';
import { hostaddress } from '../../config/settings';
import '../../styles/testRunner.css';
import Header from "../Header";

class ViewArtifact extends Component {

    constructor() {
        super();
        this.state = {
            results: []
        }
    }

    //get the projects from backend  
    componentDidMount() {
        var testerid = localStorage.getItem("userid");
        console.log(testerid);
        let url = 'http://'+hostaddress+':3001/tester/artifacts';
        let token = localStorage.getItem('jwtToken');
        console.log(token);
        axios({
            method: 'get',
            url: url,
            params: { "id": testerid },     
            config: { headers: { 'Content-Type': 'application/json' } },
            headers: {"Authorization" : `Bearer ${token}`}
        })
                .then((response) => {
                //update the state with the response data
                this.setState({
                    results : this.state.results.concat(response.data.results) 
                });
                console.log(this.state.results);
            });
    }


    render() {
        let resultsDiv = this.state.results.map(record => {
            let str = record.timestamp;
            console.log(str);
            let date = str.substring(0, str.indexOf('T'));
            str = record.timestamp;
            let time = str.substring(str.indexOf('T')+1, str.indexOf('.'));
            return(
                <tr key={record.artifactid}>
                    <td><a href={record.uploadurl}>{record.filename}</a></td>
                    <td>{date} &nbsp; {time}</td>
                    </tr>
            )
        });

        return (
            <div className="main-wrapper">
            <Header/>
            <div className="content-wrapper">
                <div className="container">
                    <div className="row justify-content-center align-items-center" style={{ height: '75vh' }}>
                        <div className="col-12">
                        <div className="dash-one">
                    <p className="dash-header">Artifacts</p>
                </div>
                            {this.state.results.length > 0 ?
                        <div className="col-10">
                                    <div>
                                    <table className="table table-striped table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Artifact</th>
                                            <th>Uploaded On</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {resultsDiv}
                                    </tbody>
                                </table>
                                        </div>
                                        </div>
                            :
                            <div>
                                <h4 style={{margin: "3em"}}>No uploads yet. Click upload to add new files!</h4>
                            </div>
                        }
                        <form action="/tester/upload">
                        <input type="submit" value="Upload Artifact" className="btn btn-primary" style={{float:"right", margin:"3em"}} />
                        </form>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        )
    }
}

export default ViewArtifact;