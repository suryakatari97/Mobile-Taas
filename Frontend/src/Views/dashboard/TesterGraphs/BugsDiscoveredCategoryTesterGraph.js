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
      axios({
          method: 'get',
          url: url,
          params: { "id": testerid },     
          config: { headers: { 'Content-Type': 'application/json' } },
          headers: {"Authorization" : `Bearer ${token}`}
      })
        .then((response) => {
            if(response.data.success) {
              console.log(response.data);
                let countArr = [];
                countArr.push(response.data.data[0].countEnhancement);
                countArr.push(response.data.data[1].countCat1);
                countArr.push(response.data.data[2].countCat2);
                this.setState({count: countArr});
            }
        })
    }

    render() {
        const data = {
            labels: ["Enhancement", "Cat2", "Cat3"],
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