import React, { Component } from 'react';
import axios from 'axios'
import { hostaddress } from '../../config/settings';
import swal from 'sweetalert';


class ViewManagerProject extends Component {
    constructor() {
        super()
        this.state = {
            projectdata: null,
            status: null
        }
    };

    componentDidMount = () => {
        const projectid = this.props.match.params.projectID;
        console.log(projectid);
        let url = 'http://' + hostaddress + ':3001/pm/getpmprojectdetails';
        let token = localStorage.getItem('jwtToken');
        console.log(token);
        axios({
            method: 'post',
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
    render() {
        let title = null
        let description = null
        let skills = null
        let project_url = null
        let status = null
        let projectid = null
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

        return (
            <div className='row'>
                <div className='col-1'></div>
                <div className='col-3 text-center'>Participants</div>
                <div class="card col-6" >
                    <div class="card-body">
                        <div className='row'>
                            <div className='col-6'>
                                <h5 class="card-title">Project Title: {title}</h5>
                                <p class="card-text">Description: {description}</p>
                                <p class="card-text">Skills required: {skills}</p>
                                <p class="card-text">Project Url: {project_url}</p>
                            </div>
                            <div className='col-6'>
                                <button class="btn btn-success dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    {status}</button>
                                <button class="dropdown-item" ></button>

                                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                    <button onClick={() => this.handleStatusChange("ongoing", projectid)} class="dropdown-item" >ongoing</button>
                                    <button onClick={() => this.handleStatusChange("Completed", projectid)} class="dropdown-item" >Completed</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-1'></div>

            </div>

        );
    }
}

export default ViewManagerProject;