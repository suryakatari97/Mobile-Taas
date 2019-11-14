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
            requests : [],
            displayAckAccept : false,
            successAccept: false,
            displayAckDecline: false,
            successDecline: false
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

    acceptRequest = async (event,requestid,projectid,testerid) => {
        event.preventDefault();
        let token = localStorage.getItem('jwtToken');
        await axios({
            method: 'post',
            url: 'http://'+hostaddress+':3001/pm/request/accept',     
            data: {requestid: requestid, projectid: projectid, testerid:testerid},
            config: { headers: { 'Content-Type': 'application/json' } },
            headers: {"Authorization" : `Bearer ${token}`}
        })
            .then((response) => {
                if(response.status != 200){
                    this.setState({
                        displayAckAccept: true,
                        successAccept: false
                    });
                }
                if (response.status >= 500) {
                    throw new Error("Bad response from server");
                }
                console.log(response);
                return response.data;
            })
            .then((responseData) => {
                //swal(responseData.responseMessage);
                this.setState({
                    displayAckAccept: true,
                    successAccept: true
                });
                //window.location.reload();
            }).catch(function (err) {
                console.log(err)
            }); 
    }
    
    
    declineRequest = async (event,requestid) => {
        event.preventDefault();
        let token = localStorage.getItem('jwtToken');
        await axios({
            method: 'post',
            url: 'http://'+hostaddress+':3001/pm/request/decline',     
            data: {requestid: requestid},
            config: { headers: { 'Content-Type': 'application/json' } },
            headers: {"Authorization" : `Bearer ${token}`}
        })
            .then((response) => {
                if(response.status != 200){
                    this.setState({
                        displayAckDecline: true,
                        successDecline: false
                    });
                }
                if (response.status >= 500) {
                    throw new Error("Bad response from server");
                }
                console.log(response);
                return response.data;
            })
            .then((responseData) => {
                //swal(responseData.responseMessage);
                this.setState({
                    displayAckDecline: true,
                    successDecline: true
                });
                //window.location.reload();
            }).catch(function (err) {
                console.log(err)
            }); 
    }
   

    render() {
        
        let ackDiv = null;
        if(this.state.displayAckAccept && this.state.successAccept){
            console.log("**********");
            ackDiv = <div class="alert alert-success">
            <strong>Success!</strong> Successfully accepted the request.
          </div>;
        }
        if(this.state.displayAckAccept && !this.state.successAccept){
            console.log("0000000000000");
            ackDiv = <div class="alert alert-warning">
                Unable to accept request. Please try again later.
            </div>;
        }
        if(this.state.displayAckDecline && this.state.successDecline){
            console.log("-------------------");
            ackDiv = <div class="alert alert-info">
            Successfully declined the request!
          </div>;
        }
        if(this.state.displayAckDecline && !this.state.successDecline){
            console.log("++++++++++++++++++++++");
            ackDiv = <div class="alert alert-warning">
                Unable to decline request. Please try again later.
            </div>;
        }

        //iterate over requests to create a table rows
        let requestsDiv = this.state.requests.map(record => {
            let profileURL = 'http://'+hostaddress+':3000/tester/'+record.userid+'/profile';
            let projectURL = 'http://'+hostaddress+':3000/pm/project/'+record.projectid;
            return(
                <tr key={record.requestid}>
                    <td><a href={profileURL}>{record.userid}</a></td>
                    <td><a href={projectURL}>{record.projectid}</a></td>
                    <td>{record.projectname}</td>
                    <td><input type="button" className="btn btn-success btn-sm" onClick={(e)=>this.acceptRequest(e,record.requestid,record.projectid,record.userid)} value="Accept"/></td>
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
                    {ackDiv}
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