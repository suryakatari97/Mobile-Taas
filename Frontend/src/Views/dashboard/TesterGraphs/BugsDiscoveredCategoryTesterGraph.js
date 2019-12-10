import React, { Component } from 'react';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import {hostaddress} from '../../../config/settings';

class BugsDiscoveredCategoryTesterGraph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: []
        }
    }

    componentDidMount() {
      var testerid = localStorage.getItem("userid");
      //console.log(testerid);
      let url = 'http://'+hostaddress+':3001/tester/stats/bugsCategoryTester';
      let token = localStorage.getItem('jwtToken');
      //console.log(token);
      axios("/tester/stats/bugsCategoryTester",{
          method: 'get',
          //url: url,
          params: { "id": testerid },     
          config: { headers: { 'Content-Type': 'application/json' } },
          headers: {"Authorization" : `Bearer ${token}`}
      })
        .then((response) => {
            if(response.data.success) {
              console.log(response.data);
                let countArr = [];
                countArr.push(response.data.data[0].countEnhancement);
                countArr.push(response.data.data[1].countBlocker);
                countArr.push(response.data.data[2].countCritical);
                countArr.push(response.data.data[3].countMajor);
                countArr.push(response.data.data[4].countNormal);
                countArr.push(response.data.data[5].countMinor);
                countArr.push(response.data.data[6].countTrivial);
                this.setState({count: countArr});
            }
        })
    }

    render() {
        const data = {
            labels: ["Enhancement","Blocker", "Critical", "Major", "Normal", "Minor", "Trivial"],
            datasets: [
              {
                label: 'Total Bugs Discovered Per Category',
                data: this.state.count,
                backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f"]
              }
            ]
          };
        const options = {
            title: {
              display: true,
              text: 'Total Bugs Discovered Per Category'
            }
          };
        return (
            <div style={{ background: "#fafafa"}}>
                   <Doughnut ref="chart" data={data} options={options}/>
            </div>
        )
    }
}

export default BugsDiscoveredCategoryTesterGraph;