import React, { Component } from 'react'
import ProjectsCreatedPerDay from "./ManagerGraphs/ProjectsCreatedPerDay";
import NumberofTestersPerProject from "./ManagerGraphs/NumberofTestersPerProject";
import ProjectStatusPieChart from "./ManagerGraphs/ProjectStatusPieChart";
import TotalBugsPerProject from "./ManagerGraphs/TotalBugsPerProject";
import Header from "../Header"

 class ManagerDashboard extends Component {
    render() {
        return (
            <div className="main-wrapper">
            <Header/>
            <div className="content-wrapper">
                <div className="dash-one">
                    <p className="dash-header">Project Manager Dashboard</p>
                </div>
                <div className='rowC' style={{ display: "flex", flexDirection: "row" }}>

                    <div className="container">
                        <div className="row mt-4">
                            <div className="card card-custom mx-4 mb-5" style={{ boxShadow: "2px 2px 2px #888888", "height": "18em", "width": "30em" }}>

                                <div className="card-body" >
                                    <ProjectsCreatedPerDay />
                                </div>
                            </div>

                            <div className="card card-custom mx-4 mb-5" style={{ boxShadow: "2px 2px 2px #888888", "height": "18em", "width": "30em" }}>

                                <div className="card-body" >
                                    <NumberofTestersPerProject />
                                </div>
                            </div>
                            <div className="card card-custom mx-4 mb-5" style={{ boxShadow: "2px 2px 2px #888888", "height": "18em", "width": "30em" }}>

                                <div className="card-body" >
                                    <ProjectStatusPieChart />
                                </div>
                            </div>
                            <div className="card card-custom mx-4 mb-5" style={{ boxShadow: "2px 2px 2px #888888", "height": "18em", "width": "30em" }}>

                                <div className="card-body" >
                                    <TotalBugsPerProject />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
                </div>
        )
    }
}

export default ManagerDashboard
