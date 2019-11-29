import React, { Component } from 'react'
import axios from 'axios';
import { Redirect } from 'react-router';
import { hostaddress } from '../../config/settings';
import '../../styles/ManagerHome.css';
import AddProject from '../Projects/AddProject';
import swal from 'sweetalert';

class ManagerHome extends Component {

    constructor() {
        super()
        this.state = {
            projects: null,
            projectTitle: '',
            projectDesc: '',
            project_url: '',
            Skills: '',

            modal: false
        }
        this.showModal = this.showModal.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleDescChange = this.handleDescChange.bind(this);
        this.handleURLChange = this.handleURLChange.bind(this);
        this.handleSkillChange = this.handleSkillChange.bind(this);

    };


    componentDidMount = () => {
        let managerid = localStorage.getItem('userid');
        console.log(managerid);
        let url = 'http://' + hostaddress + ':3001/pm/home';
        let token = localStorage.getItem('jwtToken');
        console.log(token);
        axios({
            method: 'get',
            url: url,
            params: { "id": managerid },
            config: { headers: { 'Content-Type': 'application/json' } },
            headers: { Authorization: `Bearer ${token}` }
        }).then((response) => {
            //update the state with the response data
            this.setState({
                projects: response.data.projects
            });
            console.log(this.state.projects);
        });
    };
    //Handle change in new project Title
    handleTitleChange = (e) => {
        this.setState({
            projectTitle: e.target.value
        });
        console.log(this.state.projectTitle);
    };
    //Handle change in new skillset
    handleSkillChange = (e) => {
        this.setState({
            Skills: e.target.value
        });
        console.log(this.state.Skills);
    };

    //Handle change in new project Description
    handleDescChange = (e) => {
        this.setState({
            projectDesc: e.target.value
        });
        console.log(this.state.projectDesc);
    };

    //Handle change in URL
    handleURLChange = (e) => {
        this.setState({
            project_url: e.target.value
        });
        console.log(this.state.project_url);
    };

    //Arrow function to create new project
    AddNewProject = (e) => {
        // e.preventDefault()
        // debugger
        const data = {
            projectname: this.state.projectTitle,
            description: this.state.projectDesc,
            project_url: this.state.project_url,
            Skills: this.state.Skills,

        };
        let url = 'http://' + hostaddress + ':3001/pm/addpmproject';
        let token = localStorage.getItem('jwtToken');
        let managerid = localStorage.getItem('userid');

        console.log(data);

        axios({
            method: 'post',
            url: url,
            data: data,
            params: { id: managerid },
            config: { headers: { 'Content-Type': 'application/json' } },
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => {

                if (response.data.success) {
                    console.log('add project successful');
                    swal({
                        title: "Success",
                        text: "Project added successfully!",
                        icon: "success",
                        // buttons: true,
                        dangerMode: false,
                    })
                        .then((willDelete) => {
                            if (willDelete) {
                                this.setState({
                                    modal: !this.state.modal
                                });
                            } else {
                                swal("Your project added. Please reload the page!");
                            }
                        });
                } else {
                    console.log('add project 2xx response, but failed');
                }
            })
            .catch((error) => {
                console.log('add project not 2xx response');
            });
    };

    //Show popup to add project
    showModal = () => {
        console.log('hello');
        this.setState({
            modal: !this.state.modal
        });
    };




    render() {
        let projectsDiv
        if (this.state.projects != null) {
            projectsDiv = this.state.projects.map(project => {
                let url = "http://" + hostaddress + ":3000/pm/viewproject/" + project.projectid;

                return (
                    <div className="card card-custom mx-5 mb-5" key={project.projectid} style={{ boxShadow: "2px 2px 2px #888888" }}>
                        <div className="color-div" style={{ padding: "4rem", background: "wheat" }}>
                        </div>
                        <div className="card-body" >

                            <p className="card-text"><a href={url}>{project.projectid}&nbsp;{project.projectname}</a></p>
                            <i className="fa fa-bullhorn fa-list" aria-hidden="true"></i>
                            <i className="fa fa-file-text fa-list" aria-hidden="true"></i>
                            <i className="fa fa-comments-o fa-list" aria-hidden="true"></i>
                            <i className="fa fa-folder-o" aria-hidden="true"></i>
                        </div>
                    </div>
                )
            });
        }
        return (
            <div className="row">

                <div className="col-10">
                    <br />
                    <div className="row">
                        {projectsDiv}
                    </div>
                </div>

                <div className="col-2">
                    <br />
                    <button id="add-project-button" onClick={this.showModal} className="btn btn-success">Add New Project</button>
                    <AddProject
                        handleTitleChange={this.handleTitleChange}
                        handleDescChange={this.handleDescChange}
                        handleURLChange={this.handleURLChange}
                        handleSkillChange={this.handleSkillChange}
                        AddNewProject={this.AddNewProject}
                        toggle={this.showModal}
                        modal={this.state.modal}
                    />
                </div>
            </div>
        )
    }
}

export default ManagerHome
