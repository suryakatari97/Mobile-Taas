import React, { Component } from 'react';

class UniqueProject extends Component {
	render() {
		let { projectid, projectname, description, project_url } = this.props.project;
		return (
            <div id="past-projects">
				<div className=" border-secondary mb-3">
					<div className="card-header bg-info w-75">
						<h5 id='project-id' >Project Id: {projectid}</h5>
						<button onClick = {() => this.props.deleteProject(projectid)} className='btn btn-danger'>Delete</button>
					</div>
					<div className=" card-body ">
                        <div className='font-weight-bold' id = 'ptoject-title'>TITLE : </div> 
                        <div className = 'font-weight-bold font-italic'>{projectname}</div><br />
                        <div className='font-weight-bold' id='ptoject-title'>DESCRIPTION: </div>  <br/> {description}<br/><br/>
                        <div className='font-weight-bold' id='ptoject-title'>PROJECT URL: </div>  <br/> {project_url}
					</div>
				</div>
			</div>
		);
	}
}

export default UniqueProject;
