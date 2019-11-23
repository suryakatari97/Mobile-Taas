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
import UpdateProfile from "./Profile/UpdateProfile";
import profile from "./Profile/Profile";
import testers from "./adminViews/Testers";
import projects from "./adminViews/Projects";
import ManagerHome from "./home/ManagerHome";
import Viewproject from "./Projects/ViewManagerProject";
import AddProject from "./Projects/AddProject";
import ManagerDashboard from "./dashboard/ManagerDashboard";
import ProjectsCreatedPerDay from "./dashboard/ManagerGraphs/ProjectsCreatedPerDay"


class Main extends Component {
    render() {
        if (localStorage.getItem("jwtToken") !== null) {
            return (
                <div>
                    <Route exact path="/" component={Sidebar} />
                    <Route path="/dashboard" component={Dashboard} />
                    <Route exact path="/tester/home" component={TesterHome} />
                    <Route exact path="/manager/home" component={ManagerHome} />
                    <Route exact path="/pm/viewproject/:projectID" component={Viewproject} />
                    <Route exact path="/pm/addproject" component={AddProject} />
                    <Route exact path="/tester/newProjects" component={NewProjects} />
                    <Route exact path="/tester/project/:projectID/testRunner" component={TestRunner} />
                    <Route exact path="/pm/requests" component={JoinRequests} />
                    <Route exact path="/tester/dashboard" component={TesterDashboard} />
                    <Route exact path="/manager/dashboard" component={ManagerDashboard} />

                    {/* Below routes are for testing purpose only. To be removed later */}
                    <Route exact path="/tester/graph1" component={ProjectsPerDayTesterGraph} />
                    <Route exact path="/tester/graph2" component={TestsPerDayTesterGraph} />
                    <Route exact path="/tester/graph3" component={BugsPerDayTesterGraph} />
                    <Route exact path="/tester/graph4" component={ProjectsWorkedOnPerCategoryTesterGraph} />
                    <Route exact path="/tester/graph5" component={BugsDiscoveredCategoryTesterGraph} />
                    <Route path="/tester/home" component={TesterHome} />

                    <Route exact path="/updateprofile" component={UpdateProfile} />
                    <Route exact path="/profile" component={profile} />

                    <Route exact path="/administration/testers" component={testers} />
                    <Route exact path="/administration/projects" component={projects} />

                </div>
            )
        } else {
            return (
                <div>
                    <Route path="/" component={Signin} />
                </div>
            )
        }
    }
}

export default Main;