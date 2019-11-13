import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import {hostaddress} from '../../config/settings';


class NewProjects extends Component {

    constructor(){
        super();
        this.state = {  
            projects : []
        }
    }  

    //get the projects from backend  
    componentDidMount(){
        var testerid = localStorage.getItem("userid");
        console.log(testerid);
        let url = 'http://'+hostaddress+':3001/tester/newProjects';
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
                    projects : this.state.projects.concat(response.data.projects) 
                });
                console.log(this.state.projects);
            });
    }


    render() {
        
        //iterate over courses to create a table row
        let projectsDiv = this.state.projects.map(project => {
            let str = project.timestamp;
            console.log(str);
            let date = str.substring(0, str.indexOf('T'));
            str = project.timestamp;
            let time = str.substring(str.indexOf('T')+1, str.indexOf('.'));
            return(
                <tr key={project.projectid}>
                    <td>{project.projectid}</td>
                    <td>{project.projectname}</td>
                    <td>{project.description}</td>
                    <td>{date} &nbsp; {time}</td>
                    <td><input type="button" className="btn btn-primary btn-small" value="Send Request"/></td>
                </tr>
            )
        });
        let redirectVar = '';
        /*if (!cookie.load('cookie1')) {
            redirectVar = <Redirect to="/login" />
        }*/
        return (
            <div>
                {redirectVar}  
                <div className="container">
                <div className="row justify-content-center align-items-center" style={{ height: '75vh' }}>
                <div className="col-12">
                            <div className="border-bottom row" style={{ marginBottom: "3%" }}>
                                <h3>New Projects Open to Join</h3>
                            </div>
                    
                    {this.state.projects.length > 0 ?
                        <div className="col-10">
                                    <div>
                                    <table className="table table-striped table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Project ID</th>
                                            <th>Name</th>
                                            <th>Project Description</th>
                                            <th>Created On</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {projectsDiv}
                                    </tbody>
                                </table>
                                        </div>
                                        </div>
                            :
                            <div>
                                <h4 style={{margin: "3em"}}>No new projects to display!</h4>
                            </div>
                        }
                    </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default NewProjects;