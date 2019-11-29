import React, { Component } from 'react'
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { hostaddress } from '../../../config/settings';

 class ProjectsCreatedPerDay extends Component {
     constructor(props) {
         super(props);
         this.state = {
             defaultImg: false,
             days: [],
             count: []
         }
     }

     componentDidMount() {
         var managerid = localStorage.getItem("userid");
         //console.log(managerid);
         let url = 'http://' + hostaddress + ':3001/pm/stats/ProjectsCreatedPerDay';
         let token = localStorage.getItem('jwtToken');
         //console.log(token);
         axios({
             method: 'get',
             url: url,
             params: { "id": managerid },
             config: { headers: { 'Content-Type': 'application/json' } },
             headers: { "Authorization": `Bearer ${token}` }
         })
             .then((response) => {
                 if (response.data.success) {
                     let daysArr = [];
                     let valArr = [];
                     response.data.data.forEach((item) => {
                         daysArr.push(item.date);
                         valArr.push(item.count);
                     });
                     this.setState({ days: daysArr, count: valArr });
                     console.log(this.state.days);
                 }
             })
     }



     render() {
         const data = {
             labels: this.state.days,
             datasets: [
                 {
                     label: 'No. of projects created per day this month.',
                     fill: false,
                     lineTension: 0.1,
                     backgroundColor: 'rgba(75,192,192,0.4)',
                     borderColor: 'rgba(75,192,192,1)',
                     borderCapStyle: 'butt',
                     borderDash: [],
                     borderDashOffset: 0.0,
                     borderJoinStyle: 'miter',
                     pointBorderColor: 'rgba(75,192,192,1)',
                     pointBackgroundColor: '#fff',
                     pointBorderWidth: 1,
                     pointHoverRadius: 5,
                     pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                     pointHoverBorderColor: 'rgba(220,220,220,1)',
                     pointHoverBorderWidth: 2,
                     pointRadius: 1,
                     pointHitRadius: 10,
                     data: this.state.count
                 }
             ]
         }
         return (
             <div style={{ background: "#fafafa" }}>
                 <Bar ref="chart" data={data} />
             </div>
         )
     }
     
}

export default ProjectsCreatedPerDay
