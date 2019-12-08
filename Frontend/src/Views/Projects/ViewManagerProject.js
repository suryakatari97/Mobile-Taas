import React, { Component } from 'react';
import axios from 'axios'
import { hostaddress } from '../../config/settings';
import swal from 'sweetalert';
import { Redirect } from 'react-router-dom'
import '../../styles/ManagerHome.css';
import Header from "../Header";

let redirectvar = null;
class ViewManagerProject extends Component {
    constructor() {
        super()
        this.state = {
            projectdata: null,
            status: null,
            participants: null
        }
    };

    componentDidMount = () => {
        const projectid = this.props.match.params.projectID;
        console.log(projectid);
        let url = 'http://' + hostaddress + ':3001/pm/getpmprojectdetails';
        let url1 = 'http://' + hostaddress + ':3001/pm/getpmprojectParticipants';
        let token = localStorage.getItem('jwtToken');
        console.log(token);


        axios({
            method: 'get',
            url: url,
            params: { "id": projectid },
            config: { headers: { 'Content-Type': 'application/json' } },
            headers: { Authorization: `Bearer ${token}` }
        }).then((response) => {
            //update the state with the response data
            this.setState({
                projectdata: response.data.projectdata[0]
            });

            console.log(this.state.projectdata);
        });
        axios({
            method: 'get',
            url: url1,
            params: { "id": projectid },
            config: { headers: { 'Content-Type': 'application/json' } },
            headers: { Authorization: `Bearer ${token}` }
        }).then((response) => {
            this.setState({
                participants: response.data.participants
            });

            console.log(this.state.participants);
        });
    }
    handleStatusChange = (status, projectid) => {
        const data = {
            status: status,
            projectid: projectid
        }
        this.setState({
            status: status,
            projectid: projectid
        }
        )
        const url = 'http://' + hostaddress + ':3001/pm/updateProjectStatus';
        let token = localStorage.getItem('jwtToken');
        axios({
            method: 'post',
            url: url,
            data: data,
            //params: { id: managerid },
            config: { headers: { 'Content-Type': 'application/json' } },
            headers: { Authorization: `Bearer ${token}` }
        }).then((response) => {

            if (response.data.success) {
                console.log('updated project status successful');
                swal({
                    title: "Success",
                    text: "Project status updated successfully!",
                    icon: "success",
                    // buttons: true,
                    dangerMode: false,
                })
                    .then((willDelete) => {
                        if (willDelete) {
                            window.location.reload()
                        } else {
                            swal("Your project updated. Please reload the page!");
                        }
                    });
            } else {
                console.log('add project 2xx response, but failed');
            }
        })
            .catch((error) => {
                console.log('add project not 2xx response');
            });
    }
    //Arrow function for deleting the project
    deleteProject = (projectid) => {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this project!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    let managerid = localStorage.getItem('userid');
                    console.log('In delete Project');
                    const data = {
                        projectid: projectid,
                        userid: managerid
                    };
                    console.log(data);
                    let url = 'http://' + hostaddress + ':3001/pm/deletepmProject';
                    let token = localStorage.getItem('jwtToken');
                    axios({
                        method: 'post',
                        url: url,
                        data: data,
                        params: { id: managerid },
                        config: { headers: { 'Content-Type': 'application/json' } },
                        headers: { Authorization: `Bearer ${token}` }
                    })
                        .then((response) => {
                            console.log(response);

                            if (response.status == 200) {
                                console.log('delete project successful');

                                //getting updated data and setting the state
                                window.location.replace("http://" + hostaddress + ":3000/manager/home");


                            } else {
                                console.log('delete project 2xx response, but failed');
                            }
                        })
                        .catch((error) => {
                            console.log('delete project not 2xx response');
                        });
                } else {
                    swal("Your project is safe!");
                }
            });

    };
    render() {
        let title = null
        let description = null
        let skills = null
        let project_url = null
        let status = null
        let projectid = null
        let projectparticipant = null
        if (this.state.participants) {
            projectparticipant = this.state.participants.map(member => {

                return (
                    <div className="card" key={member.firstname} >
                        <div className="card-body" >

                            <p className="card-text">{member.firstname}&nbsp;{member.lastname}</p>

                        </div>
                    </div>
                )
            });
        }
        if (this.state.projectdata) {
            title = this.state.projectdata.projectname
            console.log(title);
            description = this.state.projectdata.description
            skills = this.state.projectdata.Skills
            project_url = this.state.projectdata.project_url
            status = this.state.projectdata.status
            projectid = this.state.projectdata.projectid

        }
        if (this.state.status) {
            status = this.state.status
        }
        console.log(redirectvar);

        return (
            <div className="main-wrapper" >
                <Header />
                <div className="content-wrapper">
                    <div className="container-fluid" id="managerbg">
                        <div className='row'>
                            {redirectvar}
                            <div className='col-1'></div>
                            <div className='col-3 text-center'>
                                <br />
                                <div><h4><mark>TESTERS</mark></h4></div>
                                <div>{projectparticipant}</div>
                            </div>
                            <div className="col-5">
                                <br />
                                <div class="card shadow" >
                                    <img src="https://www.fingent.com/blog/assets/uploads/2015/09/Devlopers-Vs-Testers-01.png" class="card-img-top" alt="..."></img>
                                    <div class="card-body">
                                        <div className='row'>
                                            <div className='col-6'>
                                                <h5 class="card-title">Project Title: {title}</h5>
                                            </div>
                                            <div className='col-6'>
                                                <button class="btn btn-success dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                    {status}</button>
                                                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                    <button onClick={() => this.handleStatusChange("ongoing", projectid)} class="dropdown-item" >ongoing</button>
                                                    <button onClick={() => this.handleStatusChange("Completed", projectid)} class="dropdown-item" >Completed</button>
                                                </div>
                                                <div id='deletebutton'>
                                                    <button onClick={() => this.deleteProject(projectid)} className='btn btn-danger'>Delete</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row col-12' id='indproject'>
                                            <p class="card-text">Description: {description}</p>
                                        </div>
                                        <div className='row col-12' id='indproject'>
                                            <p class="card-text">Skills required: {skills}</p>
                                        </div>
                                        <div className='row col-12' id='indproject'>
                                            <p class="card-text">Project Url: {project_url}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='col-1'></div>

                        </div >
                    </div>
                </div>
            </div>
        );
    }
}

export default ViewManagerProject;