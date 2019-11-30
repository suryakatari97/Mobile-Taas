import React, { Component } from 'react'
import axios from 'axios'
import { hostaddress } from '../../config/settings';
import swal from 'sweetalert';
import { Redirect } from 'react-router-dom'
import '../../styles/ManagerHome.css'


let redirectvar = null;
class ViewTesterProject extends Component {

    constructor() {
        super()
        this.state = {
            projectdata: null,    
        }
    };

    componentDidMount = () => {
        const projectid = this.props.match.params.projectID;
        console.log(projectid);
        let url = 'http://' + hostaddress + ':3001/tester/gettesterprojectdetails';
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
    }

    render() {
        let title = null
        let description = null
        let skills = null
        let project_url = null
        let projectid = null

        if (this.state.projectdata) {
            title = this.state.projectdata.projectname
            console.log(title);
            description = this.state.projectdata.description
            skills = this.state.projectdata.Skills
            project_url = this.state.projectdata.project_url
            projectid = this.state.projectdata.projectid

        }




        return (
            <div className="container-fluid" id="managerbg">
                <div className='row'>
                    {redirectvar}
                    <div className='col-1'></div>
                    
                    <div className="col-5">
                        <br />
                        <div class="card shadow" >
                            <img src="https://www.fingent.com/blog/assets/uploads/2015/09/Devlopers-Vs-Testers-01.png" class="card-img-top" alt="..."></img>
                            <div class="card-body">
                                <div className='row'>
                                    <div className='col-6'>
                                        <h5 class="card-title">Project Title: {title}</h5>
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
        )
    }
}

export default ViewTesterProject
