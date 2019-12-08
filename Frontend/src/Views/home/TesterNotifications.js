import React, { Component } from 'react';
import { hostaddress } from '../../config/settings';
import axios from 'axios';
import Header from "../Header";

class TesterNotifications extends Component {


    constructor() {
        super();
        this.state = {
            Notifications: [],
        }
    }


    componentDidMount() {
        var testerid = localStorage.getItem("userid");
        console.log(testerid);
        let url = 'http://' + hostaddress + ':3001/tester/TesterNotifications';
        let token = localStorage.getItem('jwtToken');
        console.log(token);
        axios({
            method: 'get',
            url: url,
            params: { "id": testerid },
            config: { headers: { 'Content-Type': 'application/json' } },
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then((response) => {
                //update the state with the response data
                this.setState({
                    Notifications: this.state.Notifications.concat(response.data.Notifications)
                });
                console.log(this.state.Notifications);
            });
    }




    render() {
        let requestsDiv = this.state.Notifications.map(record => {
            // let profileURL = 'http://' + hostaddress + ':3000/tester/' + record.userid + '/profile';
            let projectURL = 'http://' + hostaddress + ':3000/pm/project/' + record.projectid;
            return (
                <tr key={record.requestid}>
                    {/* <td><a href={profileURL}>{record.userid}</a></td> */}
                    <td><a href={projectURL}>{record.projectid}</a></td>
                    <td>{record.status}</td>
                    <td>{record.timestamp}</td>
                </tr>
            )
        });
        return (
            <div className="main-wrapper">
            <Header/>
            <div className="content-wrapper">
                <div className="container">
                    <div className="row justify-content-center align-items-center">
                        <div className="col-12">
                        <div className="dash-one">
                    <p className="dash-header">Notifications</p>
                </div>
                            {/* {ackDiv} */}
                            {this.state.Notifications.length > 0 ?
                                <div className="col-10">
                                    <div>
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Project ID</th>
                                                    <th>Request for Project</th>
                                                    <th>Time Stamp</th>
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
                                    <h4 style={{ margin: "3em" }}>No new requests to display!</h4>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
            </div>
        )
    }
}
export default TesterNotifications
