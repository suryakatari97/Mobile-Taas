import React, { Component } from 'react';
import { Redirect,Link } from "react-router-dom";
import './../../App.css';

class Projects extends Component {
    constructor(props){
        super();
        this.state = {
            projects:[],
            searchString:""
        }
        this.blockHandler = this.blockHandler.bind(this);
        this.getProjects = this.getProjects.bind(this);
        this.searchChangeHandler = this.searchChangeHandler.bind(this);
    }
    searchChangeHandler(e){
        this.setState({searchString:e.target.value})
    }
    async blockHandler(e){
        const blockRes = await fetch('/admin/'+e.target.value.toLowerCase()+'/project/'+e.target.name,{
            method: 'GET',
            headers:{'Authorization': "bearer " + localStorage.getItem("jwtToken")}
        })
        const blockJson = await blockRes.json();
        if(blockJson.success) {
            this.getProjects();
        }
    }

    async componentDidMount(){
        this.getProjects();
    }

    async getProjects(){
        // get all the projects.
        const projectsRes = await fetch('/admin/projects',{
            method: 'GET',
            headers:{'Authorization': "bearer " + localStorage.getItem("jwtToken")}
        })
        const projects = await projectsRes.json();
        // console.log(projects.data)
        this.setState({
            projects:JSON.parse(projects.data)
        }, console.log(this.state.projects));
    }

    render(){
        if (localStorage.role !== 'ADMIN') {
            return(<Redirect to="/"/>)
        }
        let header = <h1 className="dash-header-blue">Projects</h1>
        console.log(this.state.projects)
        let projectsRows = this.state.projects.map(
            (project)=>{
                let blockButtonText = (project.isblocked === 0) ? "Block" : "Unblock";
                let blockButton = <td><button className="btn btn-danger" onClick={this.blockHandler} name={project.projectid} value={blockButtonText}>{blockButtonText}</button></td>
                if(project.firstname.toUpperCase().includes(this.state.searchString.toUpperCase())
                || project.lastname.toUpperCase().includes(this.state.searchString.toUpperCase())
                || project.projectname.toUpperCase().includes(this.state.searchString.toUpperCase())){
                    return(
                        <tr>
                            <td>{project.projectname}</td>
                            <td>{project.firstname} {project.lastname}</td>
                            <td>{project.email}</td>
                            <td>{(project.isblocked === 0) ? "ACTIVE" : "BLOCKED"}</td>
                            {blockButton}
                        </tr>
                    )
                } else {
                    return null;
                }
            })

        return(
            <div className="main-wrapper">
                <div className="content-wrapper">
                    <div className="dash-one w-100">
                        {header}
                    </div>
                    <div className="course-main-wrapper">
                        <div className="clearfix"></div>
                        <div className="course-content-wrapper p-4">
                            <input className="search-box w-25 p-2" type="text" onChange={this.searchChangeHandler} value={this.state.searchString} name="searchbox" placeholder="Search Projects"/>
                            <br /> <br />
                            <table className="table table-striped custom-table2">
                                <thead>
                                <tr>
                                    <th>Project</th>
                                    <th>Owner</th>
                                    <th>Owner Email</th>
                                    <th>Status</th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                {projectsRows}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Projects;