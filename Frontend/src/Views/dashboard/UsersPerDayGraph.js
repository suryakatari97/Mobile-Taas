import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
const axios = require('axios');

class UsersPerDayGraph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultImg: false,
            days:[],
            count: []
        }
    }

    componentDidMount() {
      axios.get("/admin/stats/perday/users", {headers: 
        {"Authorization": "Bearer "+localStorage.getItem("jwtToken")}})
      .then((response) => {
          if(response.data.success) {
              let daysArr = [];
              let valArr = [];
              response.data.data.forEach((item)=>{
                  daysArr.push(item.date);
                  valArr.push(item.count);
              });
              this.setState({days: daysArr, count: valArr})
          }
      })
    }

    render() {
        const data = {
            labels: this.state.days,
            datasets: [
              {
                label: 'No. of users signing up per day this month.',
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
            <div style={{ background: "#fafafa"}}>
                   <Bar ref="chart" data={data} />
            </div>
        )
    }
}

export default UsersPerDayGraph;