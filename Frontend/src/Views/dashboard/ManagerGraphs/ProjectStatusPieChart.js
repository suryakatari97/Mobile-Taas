import React, { Component } from 'react'
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import { hostaddress } from '../../../config/settings';

export class ProjectStatusPieChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: []
        }
    }

    componentDidMount() {
        var managerid = localStorage.getItem("userid");
        //console.log(testerid);
        let url = 'http://' + hostaddress + ':3001/pm/stats/ProjectStatusPieChart';
        let token = localStorage.getItem('jwtToken');
        //console.log(token);
        axios("/pm/stats/ProjectStatusPieChart",{
            method: 'get',
            //url: url,
            params: { "id": managerid },
            config: { headers: { 'Content-Type': 'application/json' } },
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then((response) => {
                if (response.data.success) {
                    console.log(response.data);
                    let countArr = [];
                    countArr.push(response.data.data[0].countnew);
                    countArr.push(response.data.data[1].countongoing);
                    countArr.push(response.data.data[2].countcompleted);
                    this.setState({ count: countArr });
                }
            })
    }



    render() {
        const data = {
            labels: ["NEW", "ongoing", "completed"],
            datasets: [
                {
                    label: 'Project status',
                    data: this.state.count,
                    backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f"]
                }
            ]
        };
        const options = {
            title: {
                display: true,
                text: 'Project Status'
            }
        };
        return (
            <div style={{ background: "#fafafa" }}>
                <Doughnut ref="chart" data={data} options={options} />
            </div>
        )
    }
}

export default ProjectStatusPieChart
