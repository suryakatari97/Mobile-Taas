import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { hostaddress } from '../../config/settings';
import AddProject from './AddProject';
import UniqueProjects from './UniqueProject';
import swal from 'sweetalert';
import '../../styles/managerHome.css';

export class ManagerHome extends Component {
	constructor() {
		super();
		this.state = {
			projects: null,
			projectTitle: '',
			projectDesc: '',
			project_url: '',
			modal: false
		};
		this.showModal = this.showModal.bind(this);
		this.handleTitleChange = this.handleTitleChange.bind(this);
		this.handleDescChange = this.handleDescChange.bind(this);
		this.handleURLChange = this.handleURLChange.bind(this);
		// this.deleteProject = this.deleteProject.bind(this);
	}

	componentDidMount = () => {
		let managerid = localStorage.getItem('userid');
		console.log(managerid);
		let url = 'http://' + hostaddress + ':3001/manager/home';
		let token = localStorage.getItem('jwtToken');
		console.log(token);
		axios({
			method: 'get',
			url: url,
			params: { id: managerid },
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
		const data = {
			projectname: this.state.projectTitle,
			description: this.state.projectDesc,
			project_url: this.state.project_url
		};
		let url = 'http://' + hostaddress + ':3001/pm/createproject';
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
					swal('Added', 'Successfully added new project', 'success');
					setTimeout(() => {
						this.setState({
							modal: !this.state.modal
						});	
					}, 1000);
					
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

	//Arrow function for deleting the project
	deleteProject = (projectid) => {
		let managerid = localStorage.getItem('userid');
		console.log('In delete Project');
		const data = {
			projectid: projectid,
			userid: managerid
		};
		console.log(data);
		let url = 'http://' + hostaddress + ':3001/pm/deleteproject';
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

					setTimeout(() => {
						let url = 'http://' + hostaddress + ':3001/manager/home';
						let token = localStorage.getItem('jwtToken');
						console.log(token);
						axios({
							method: 'get',
							url: url,
							params: { id: managerid },
							config: { headers: { 'Content-Type': 'application/json' } },
							headers: { Authorization: `Bearer ${token}` }
						}).then((response) => {
							//update the state with the response data
							this.setState({
								projects: response.data.projects
							});
							console.log(this.state.projects);
							swal('Deleted', 'Successfully deleted project', 'success');

						});
					}, 1000);
				} else {
					console.log('delete project 2xx response, but failed');
				}
			})
			.catch((error) => {
				console.log('delete project not 2xx response');
			});
	};
	render() {
		let OwnerProjects = null;
		if (this.state.projects) {
			OwnerProjects = this.state.projects.map((Project, index) => {
				if (Project.projectid) {
					return (
						<UniqueProjects key={index} project={Project} deleteProject={this.deleteProject.bind(this)} />
					);
					return;
				}
			});
		}
		return (
			<div>
				<button id="add-project-button" onClick={this.showModal} className="btn btn-success">
					Add New Project
				</button>
				<AddProject
					handleTitleChange={this.handleTitleChange}
					handleDescChange={this.handleDescChange}
					handleURLChange={this.handleURLChange}
					AddNewProject={this.AddNewProject}
					toggle={this.showModal}
					modal={this.state.modal}
				/>
				{OwnerProjects}
			</div>
		);
	}
}

export default ManagerHome;
