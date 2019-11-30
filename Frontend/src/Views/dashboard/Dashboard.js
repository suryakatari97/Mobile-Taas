import React, { Component } from 'react';
import AdminDashboard from "./AdminDashboard"
import TesterDashboard from "./TesterDashboard"

class Dashboard extends Component {
    constructor(props){
        super(props);
    }
    render() {
        var role = localStorage.getItem("role");
        if(role === "ADMIN") {
            return(<AdminDashboard/>);
        } else if(role === "TESTER") {
            return(<TesterDashboard/>);
        } else {
            // to be implemented
            return(<div><h1 style={{fontWeight: "700", margin: "0.5em"}}>Project Manager Dashboard</h1></div>)
        }
    }
}

export default Dashboard;