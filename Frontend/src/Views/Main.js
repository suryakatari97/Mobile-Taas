import React, { Component } from 'react';
import { Route } from "react-router-dom";
import Sidebar from './navigation/Sidebar';
import TesterHome from './home/TesterHome';
import Signin from "./auth/Signin";
import Dashboard from "./dashboard/Dashboard";

class Main extends Component {
    render(){
        if (localStorage.getItem("jwtToken")!== null) {
            return(
                <div>
                    <Route exact path = "/" component = {Sidebar} />
                    <Route path = "/dashboard" component = {Dashboard} />
                    <Route path="/tester/home" component={TesterHome} />
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