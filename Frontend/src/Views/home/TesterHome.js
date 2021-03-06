import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { hostaddress } from '../../config/settings';
import '../../styles/testerHome.css';
import { Link } from 'react-router-dom';
import Header from "../Header";



class TesterHome extends Component {

    constructor() {
        super();
        this.state = {
            projects: []
        }
    }

    //get the projects from backend  
    componentDidMount() {
        var testerid = localStorage.getItem("userid");
        console.log(testerid);
        let url = 'http://' + hostaddress + ':3001/tester/home';
        let token = localStorage.getItem('jwtToken');
        console.log(token);
        axios("/tester/home",{
            method: 'get',
            //url: url,
            params: { "id": testerid },
            config: { headers: { 'Content-Type': 'application/json' } },
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then((response) => {
                //update the state with the response data
                this.setState({
                    projects: this.state.projects.concat(response.data.projects)
                });
                console.log(this.state.projects);
            });
    }


    render() {

        //iterate over courses to create a table row
        let projectsDiv = this.state.projects.map(project => {
            console.log(project.projectid);
            
            let url = "http://" + hostaddress + ":3000/tester/ViewTesterProject/" + project.projectid;
            return (
                <div className="card card-custom mx-5 mb-5" key={project.projectid} style={{ boxShadow: "2px 2px 2px #888888" }}>
                    <div className="color-div" style={{ padding: "4rem", background: "#5D6D7E" }}>
                    </div>
                    <div className="card-body" >
                        <p className="card-text" style={{height:"30px"}}><a href={url}>{project.projectid}&nbsp;{project.projectname}</a></p>
                        <i className="fa fa-bell icons" aria-hidden="true"></i>
                        <i className="fas fa-folder-plus icons" aria-hidden="true"></i>
                        <i className="fa fa-file-archive icons" aria-hidden="true"></i>
                        <i className="fa fa-bug icons" aria-hidden="true"></i>
                    </div>
                </div>
            )
        });
        return (
            <div className="main-wrapper">
            <Header/>
            <div className="content-wrapper">

                <div className='rowC' style={{ display: "flex", flexDirection: "row" }}>

                    <div className="container">

                        {this.state.projects.length > 0 ?
                            <div className="row mt-5">
                                {projectsDiv}
                            </div>
                            :
                            <div>
                                <h2 style={{ margin: "3em" }}>Welcome to MTAAS Application!</h2>
                            </div>
                        }
                    </div>
                </div>
            </div>
            </div>
        )
    }
}

export default TesterHome;