import React, { Component } from 'react';
import BugsPerDayTesterGraph from "./TesterGraphs/BugsPerdayForTesterGraph";
import ProjectPerDayTesterGraph from "./TesterGraphs/ProjectPerDayTesterGraph";
import TestsPerdayForTesterGraph from "./TesterGraphs/TestsPerdayForTesterGraph";
import ProjectsWorkedOnPerCategoryTesterGraph from "./TesterGraphs/ProjectsWorkedOnPerCategoryTesterGraph";
import BugsDiscoveredCategoryTesterGraph from "./TesterGraphs/BugsDiscoveredCategoryTesterGraph";

class TesterDashboard extends Component {
    constructor(props){
        super(props);
    }
    render() {

        return (
            <div>
            <h1 style={{fontWeight: "700", margin: "0.5em"}}>Tester Dashboard</h1>
            <div className='rowC' style={{ display: "flex", flexDirection: "row" }}>
                
                <div className="container">
                    <div className="row mt-4">
                        <div className="card card-custom mx-4 mb-5" style={{ boxShadow: "2px 2px 2px #888888", "height": "18em", "width": "30em" }}>

                            <div className="card-body" >
                                <ProjectPerDayTesterGraph />
                            </div>
                        </div>

                        <div className="card card-custom mx-4 mb-5" style={{ boxShadow: "2px 2px 2px #888888", "height": "18em", "width": "30em" }}>

                            <div className="card-body" >
                                <ProjectsWorkedOnPerCategoryTesterGraph />
                            </div>
                        </div>

                        <div className="card card-custom mx-4 mb-5" style={{ boxShadow: "2px 2px 2px #888888", "height": "18em", "width": "30em" }}>

                            <div className="card-body" >
                                <BugsPerDayTesterGraph />
                            </div>
                        </div>

                        <div className="card card-custom mx-4 mb-5" style={{ boxShadow: "2px 2px 2px #888888", "height": "18em", "width": "30em" }}>

                            <div className="card-body" >
                                <BugsDiscoveredCategoryTesterGraph />
                            </div>
                        </div>

                        <div className="card card-custom mx-4 mb-5" style={{ boxShadow: "2px 2px 2px #888888", "height": "18em", "width": "30em" }}>

                            <div className="card-body" >
                                <TestsPerdayForTesterGraph />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        )
    }
}

export default TesterDashboard;