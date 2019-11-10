import React, { Component } from 'react';
import { Route } from "react-router-dom";
import Sidebar from './navigation/Sidebar';
import Signin from "./auth/Signin";
import Dashboard from "./dashboard/Dashboard";

class Main extends Component {
    render(){
        if (localStorage.getItem("jwtToken")!== null) {
            return(
                <div>
                    <Route path = "/" component = {Sidebar} />
                    <Route path = "/dashboard" component = {Dashboard} />
                </div>
            )
        } else {
            return(
                <div>
                    <Route path = "/" component = {Signin} />
                </div>
            )
        }
    }
}

export default Main;