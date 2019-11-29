import React, { Component } from 'react';
import UsersPerDayGraph from "./UsersPerDayGraph";
import ProjectsPerDayGraph from "./ProjectsPerDayGraph";
import TestsPerDayGraph from "./TestsPerDayGraph";
import BugsPerDayGraph from "./BugsPerDayGraph";
import ProjectsTopTestCases from "./ProjectsTopTestCases";
import ProjectsMostTesters from "./ProjectsMostTesters";
import UserPieChart from "./UserPieChart";
import Header from "../Header"

class AdminDashboard extends Component {
    constructor(props){
        super(props);
    }
    render() {

        return (
            <div>
                <Header/>
            <h1 style={{fontWeight: "500", "margin-top": "75px", "text-align":"center"}}>Administrator Dashboard</h1>
            <div className='rowC' style={{ display: "flex", flexDirection: "row" }}>
                
                <div className="container">
                    <div className="row mt-4">
                        <div className="card card-custom mx-4 mb-5" style={{ boxShadow: "2px 2px 2px #888888", "height": "18em", "width": "30em" }}>

                            <div className="card-body" >
                                <UserPieChart />
                            </div>
                        </div>

                        <div className="card card-custom mx-4 mb-5" style={{ boxShadow: "2px 2px 2px #888888", "height": "18em", "width": "30em" }}>

                            <div className="card-body" >
                                <UsersPerDayGraph />
                            </div>
                        </div>

                        <div className="card card-custom mx-4 mb-5" style={{ boxShadow: "2px 2px 2px #888888", "height": "18em", "width": "30em" }}>

                            <div className="card-body" >
                                <ProjectsPerDayGraph />
                            </div>
                        </div>

                        <div className="card card-custom mx-4 mb-5" style={{ boxShadow: "2px 2px 2px #888888", "height": "18em", "width": "30em" }}>

                            <div className="card-body" >
                                <TestsPerDayGraph />
                            </div>
                        </div>

                        <div className="card card-custom mx-4 mb-5" style={{ boxShadow: "2px 2px 2px #888888", "height": "18em", "width": "30em" }}>

                            <div className="card-body" >
                                <BugsPerDayGraph />
                            </div>
                        </div>
                        <div className="card card-custom mx-4 mb-5" style={{ boxShadow: "2px 2px 2px #888888", "height": "18em", "width": "30em" }}>

                            <div className="card-body" >
                                <ProjectsTopTestCases/>
                            </div>
                        </div>
                        <div className="card card-custom mx-4 mb-5" style={{ boxShadow: "2px 2px 2px #888888", "height": "18em", "width": "30em" }}>

                            <div className="card-body" >
                                <ProjectsMostTesters/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        )
    }
}

export default AdminDashboard;