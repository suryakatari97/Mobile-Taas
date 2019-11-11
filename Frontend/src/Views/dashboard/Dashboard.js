import React, { Component } from 'react';
import { Link, Redirect } from "react-router-dom";
import AdminDashboard from "./AdminDashboard"

class Dashboard extends Component {
    constructor(props){
        super(props);
    }
    render(){
        var role = localStorage.getItem("role");
        if(role === "ADMIN") {
            return(<AdminDashboard/>);
        } else {
            // to be implemented
            return(<div><p>TO be implemented</p></div>)
        }
    }
}

export default Dashboard;