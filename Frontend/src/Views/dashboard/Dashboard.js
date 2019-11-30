import React, { Component } from 'react';
import AdminDashboard from "./AdminDashboard"
import TesterDashboard from "./TesterDashboard"
import ManagerDashboard from './ManagerDashboard';

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
            return(<ManagerDashboard/>)
        }
    }
}

export default Dashboard;