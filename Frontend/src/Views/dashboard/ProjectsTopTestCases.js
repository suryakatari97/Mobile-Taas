import React, { Component } from 'react';
const axios = require('axios');
class ProjectsTopTestCases extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:[]
        }
    }
    componentDidMount() {
        axios.get("/admin/stats/topprojects/testcases?limit=5", {headers: 
          {"Authorization": "Bearer "+localStorage.getItem("jwtToken")}})
        .then((response) => {
            if(response.data.success) {
                this.setState({data: response.data.data});
            }
        })
    }

    render() {
        let tableContents = this.state.data.map((project) => {
            return(
                <tr>
                    <td>project.projectname</td>
                    <td>project.status</td>
                    <td>project.count</td>
                </tr>
            )
        })
        return(
            <table class="table">
             <caption>Projects with most number of test cases</caption>
                 <thead>
                    <tr>
                        <th scope="col">Project Name</th>
                        <th scope="col">Project Status</th>
                        <th scope="col">No. of testcases</th>
                    </tr>
                </thead>
                <tbody>
                    {tableContents}                    
                </tbody>
            </table>
        )
    }
}

export default ProjectsTopTestCases;