import React, { Component } from 'react'
import ProjectsCreatedPerDay from "./ManagerGraphs/ProjectsCreatedPerDay";

 class ManagerDashboard extends Component {
    render() {
        return (
            <div>
                <h1 style={{ fontWeight: "700", margin: "0.5em" }}>Tester Dashboard</h1>
                <div className='rowC' style={{ display: "flex", flexDirection: "row" }}>

                    <div className="container">
                        <div className="row mt-4">
                            <div className="card card-custom mx-4 mb-5" style={{ boxShadow: "2px 2px 2px #888888", "height": "18em", "width": "30em" }}>

                                <div className="card-body" >
                                    <ProjectsCreatedPerDay />
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
