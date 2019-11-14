import React, { Component } from 'react';
import { Route } from "react-router-dom";
import Sidebar from './navigation/Sidebar';
import TesterHome from './home/TesterHome';
import Signin from "./auth/Signin";
import Dashboard from "./dashboard/Dashboard";
import TestRunner from './testerViews/TestRunner';
import NewProjects from './testerViews/NewProjects';
import JoinRequests from './projectManagerViews/JoinRequests';
import ProjectsPerDayTesterGraph from './dashboard/TesterGraphs/ProjectPerDayTesterGraph';
import TestsPerDayTesterGraph from './dashboard/TesterGraphs/TestsPerdayForTesterGraph';
import BugsPerDayTesterGraph from './dashboard/TesterGraphs/BugsPerdayForTesterGraph';
import ProjectsWorkedOnPerCategoryTesterGraph from './dashboard/TesterGraphs/ProjectsWorkedOnPerCategoryTesterGraph';
import BugsDiscoveredCategoryTesterGraph from './dashboard/TesterGraphs/BugsDiscoveredCategoryTesterGraph';
import TesterDashboard from './dashboard/TesterDashboard';
import TesterProfile from "./Profile/Tester_Profile";

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
                    <Route exact path="/tester/dashboard" component={TesterDashboard}/>
                    
                    {/* Below routes are for testing purpose only. To be removed later */}
                    <Route exact path="/tester/graph1" component={ProjectsPerDayTesterGraph}/>
                    <Route exact path="/tester/graph2" component={TestsPerDayTesterGraph}/>
                    <Route exact path="/tester/graph3" component={BugsPerDayTesterGraph}/>
                    <Route exact path="/tester/graph4" component={ProjectsWorkedOnPerCategoryTesterGraph}/>
                    <Route exact path="/tester/graph5" component={BugsDiscoveredCategoryTesterGraph}/>
                    <Route path="/tester/home" component={TesterHome} />
                    <Route path="/tester/profile" component={TesterProfile} />
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