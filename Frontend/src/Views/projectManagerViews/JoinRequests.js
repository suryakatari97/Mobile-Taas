import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import swal from 'sweetalert';
import {hostaddress} from '../../config/settings';


class JoinRequests extends Component {

    constructor(){
        super();
        this.state = {  
            requests : []
        }
    }  

    //get the projects from backend  
    componentDidMount(){
        var pmid = localStorage.getItem("userid");
        console.log(pmid);
        let url = 'http://'+hostaddress+':3001/pm/requests';
        let token = localStorage.getItem('jwtToken');
        console.log(token);
        axios({
            method: 'get',
            url: url,
            params: { "id": pmid },     
            config: { headers: { 'Content-Type': 'application/json' } },
            headers: {"Authorization" : `Bearer ${token}`}
        })
                .then((response) => {
                //update the state with the response data
                this.setState({
                    requests : this.state.requests.concat(response.data.requests) 
                });
                console.log(this.state.requests);
            });
    }

   

    render() {
        
        //iterate over courses to create a table row
        let requestsDiv = this.state.requests.map(record => {
            let profileURL = 'http://'+hostaddress+':3000/tester/'+record.userid+'/profile';
            let projectURL = 'http://'+hostaddress+':3000/pm/project'+record.projectid;
            return(
                <tr key={record.requestid}>
                    <td><a href={profileURL}>{record.userid}</a></td>
                    <td><a href={profileURL}>{record.projectid}</a></td>
                    <td>{record.projectname}</td>
                    <td><input type="button" className="btn btn-success btn-sm" onClick={(e)=>this.acceptRequest(e,record.requestid,record.projectid,record.testerid)} value="Accept"/></td>
                    <td><input type="button" className="btn btn-danger btn-sm" onClick={(e)=>this.declineRequest(e,record.requestid)} value="Decline"/></td>
                </tr>
            )
        });
        return (
            <div>
                <div className="container">
                <div className="row justify-content-center align-items-center" style={{ height: '75vh' }}>
                <div className="col-12">
                            <div className="border-bottom row" style={{ marginBottom: "3%" }}>
                                <h3>Project Join Requests from Testers</h3>
                            </div>
                    {this.state.requests.length > 0 ?
                        <div className="col-10">
                                    <div>
                                    <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Tester ID</th>
                                            <th>Request for Project</th>
                                            <th>Project Name</th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {requestsDiv}
                                    </tbody>
                                </table>
                                        </div>
                                        </div>
                            :
                            <div>
                                <h4 style={{margin: "3em"}}>No new requests to display!</h4>
                            </div>
                        }
                    </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default JoinRequests;