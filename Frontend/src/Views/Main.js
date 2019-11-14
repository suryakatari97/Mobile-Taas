import React, { Component } from 'react';
import { Route } from "react-router-dom";
import Sidebar from './navigation/Sidebar';
import TesterHome from './home/TesterHome';
import Signin from "./auth/Signin";
import Dashboard from "./dashboard/Dashboard";
import TestRunner from './testerViews/TestRunner';
import NewProjects from './testerViews/NewProjects';
import JoinRequests from './projectManagerViews/JoinRequests';

class Main extends Component {
    render(){
        if (localStorage.getItem("jwtToken")!== null) {
            return(
                <div>
                    <Route exact path = "/" component = {Sidebar} />
                    <Route path = "/dashboard" component = {Dashboard} />
                    <Route exact path="/tester/home" component={TesterHome} />
                    <Route exact path="/tester/newProjects" component={NewProjects} />
                    <Route exact path="/tester/project/:projectID/testRunner" component={TestRunner} />
                    <Route exact path="/pm/requests" component={JoinRequests}/>
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