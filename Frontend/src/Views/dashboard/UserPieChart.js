import React, { Component } from 'react';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
const axios = require('axios');

class UserPieChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: []
        }
    }

    componentDidMount() {
        axios.get("/admin/stats/share/roles", {headers: 
          {"Authorization": "Bearer "+localStorage.getItem("jwtToken")}})
        .then((response) => {
            if(response.data.success) {
                let countArr = [];
                countArr.push(response.data.data.TESTER);
                countArr.push(response.data.data.PM);
                countArr.push(response.data.data.ADMIN);
                this.setState({count: countArr});
            }
        })
    }

    render() {
        const data = {
            labels: ["Testers", "Project Managers", "Admins"],
            datasets: [
              {
                label: 'Share of user roles in the system',
                data: this.state.count,
                backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f"]
              }
            ]
          };
        const options = {
            title: {
              display: true,
              text: 'Share of users with different roles'
            }
          };
        return (
            <div style={{ background: "#fafafa"}}>
                   <Doughnut ref="chart" data={data} options={options}/>
            </div>
        )
    }
}

export default UserPieChart;