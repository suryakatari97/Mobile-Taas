import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { hostaddress } from '../../config/settings';
import Failed from '../../images/times-circle-regular.svg';
import Passed from '../../images/check-circle-regular.svg';
import TestCase from '../../images/file-alt-regular.svg';
import TestSuite from '../../images/copy-solid.svg';
import '../../styles/testRunner.css';
import Header from "../Header";

class TestRunner extends Component {

    constructor() {
        super();
        this.state = {
            url: "",
            results:[],
            showResults:false
        }
    }

    //get the projects from backend  
    componentDidMount() {
        const projectid = this.props.match.params.projectID;
        console.log(projectid);
        let url = 'http://' + hostaddress + ':3001/tester/project/url';
        let token = localStorage.getItem('jwtToken');
        console.log(token);
        axios("/tester/project/url",{
            method: 'get',
            //url: url,
            params: { "id": projectid },
            config: { headers: { 'Content-Type': 'application/json' } },
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then((response) => {
                //update the state with the response data
                this.setState({
                    url: response.data.url
                });
                console.log(this.state.url);
            });
    }

    runTestRunner = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        let scripts = formData.get("testScripts");
        let browser = formData.get("browser");
        let token = localStorage.getItem('jwtToken');
        await axios("/tester/testRunner",{
            method: 'post',
            //url: 'http://' + hostaddress + ':3001/tester/testRunner',     
            data: {"url":this.state.url,"browser": "firefox","scripts":JSON.parse(scripts)},
            config: { headers: { 'Content-Type': 'multipart/form-data' } },
            headers: { "Authorization": `Bearer ${token}` }
        })
        .then((response) => {
            console.log(response.data);
            if(response.data.results!=null && response.data.results!=undefined){
                this.setState({
                    results: response.data,
                    showResults: true
                });
            }
        });
    }


    render() {
        let testSuitesDiv = null;
        if(this.state.showResults){
           testSuitesDiv = this.state.results.results.map((record, index) => {
                let hrefLink = "#href" + index;
                let id = "href" + index;
                let imgDiv = null;
                if(record.status=="Passed"){
                 imgDiv  =  <img style={{height:"20px"}} src={Passed} alt="Pass"/>;
                }
                else{
                    imgDiv  =  <img style={{height:"20px"}} src={Failed} alt="Fail"/>;
                }
                return (
                    <div class="card">
                        <div class="card-header">
                            <a class="card-link" data-toggle="collapse" href={hrefLink}>
                                <div className="row">
                                    <div className="col">
                                        Test Case: {record.name}
                                    </div>
                                    <div className="col-2 float-right">
                                       {imgDiv} {record.status}
                                    </div>
                                </div>
                            </a>
                        </div>
                        {record.testCaseType==1 &&
                            <div id={id} class="collapse" data-parent="#accordion">
                            <div class="card-body">
                            <table class="table">
                            <tbody>
                                <tr>
                                    <td>Expected Value:</td>
                                    <td>{record.expected}</td>
                                </tr>
                                <tr>
                                    <td>Actual Value:</td>
                                    <td>{record.actual}</td>
                                </tr>
                                </tbody>
                                </table>
                            </div>
                            </div>
                        }
                        {record.testCaseType==2 &&
                            <div id={id} class="collapse" data-parent="#accordion">
                            <div class="card-body">
                            <table class="table">
                            <tbody>
                                <tr>
                                    <td>Exists:</td>
                                    <td>{record.status=="Passed"?"Yes":"No"}</td>
                                    
                                </tr>
                                {record.status=="Failed" &&
                                <tr>
                                <td>Error:</td>
                                    <td>{record.status=="Passed"?"":record.error}</td>
                                </tr>
                                }
                                </tbody>
                                </table>
                            </div>
                            </div>
                        }   
                        {record.testCaseType==3 &&
                            <div id={id} class="collapse" data-parent="#accordion">
                            <div class="card-body">
                            <table class="table">
                            <tbody>
                                <tr>
                                    <td>Exists:</td>
                                    <td>{record.status=="Passed"?"Yes":"No"}</td>
                                    
                                </tr>
                                {record.status=="Failed" &&
                                <tr>
                                <td>Error:</td>
                                    <td>{record.status=="Passed"?"":record.error}</td>
                                </tr>
                                }
                                </tbody>
                                </table>
                            </div>
                            </div>
                        }   
                        </div>
                        
                )
            });
        }

        return (
            <div className="main-wrapper">
            <Header/>
            <div className="content-wrapper">
                <div className="container">
                {this.state.showResults==false ?
                    <div className="row justify-content-center align-items-center" >
                        <div className="col-12">
                        <div className="dash-one">
                    <p className="dash-header">Test Runner</p>
                </div>
                            <form onSubmit={this.runTestRunner} method="post" style={{marginLeft:"2em"}}>
                                <div className="form-group row">
                                    <label htmlFor="url" className="col-sm-2 col-form-label">Project URL:</label>
                                    <div className="col-sm-5">
                                        <input type="text" className="form-control" name="url" readOnly value={this.state.url} />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="browser" className="col-sm-2 col-form-label">To Test in Browser:</label>
                                    <div className="col-sm-5">
                                        <select className="form-control" name="browser" style={{ padding: "0em", width: "50%" }}>
                                            <option value="chrome">Chrome</option>
                                            <option value="firefox">Firefox</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="testScripts" className="col-sm-2 col-form-label">Test Scripts:</label>
                                    <div className="col-sm-5">
                                        <textarea class="form-control" name="testScripts" rows="8"></textarea>
                                    </div>
                                </div>
                                <div className="form-group row text-center">
                                    <button type="submit" class="btn btn-primary align-center" style={{marginLeft: "40em", marginTop: "2em"}}>Run Tests</button>
                                </div>

                            </form>

                        </div>
                    </div>
                    :
                    <div className="row justify-content-center align-items-center">
                    <div className="dash-one">
                    <p className="dash-header">Test Results</p>
                </div>
                        <div className="col-10">
                        
                            <div className="row">
                            <img className="imageResult" style={{marginLeft:"1em"}} src={TestSuite} alt="testsuite"/>&nbsp;<label className="labelResult">Test Suites: 1</label>
                            <img className="imageResult" src={TestCase} alt="testcases"/>&nbsp;<label className="labelResult">Test Cases: {this.state.results.total}</label>
                            <img className="imageResult" src={Passed} alt="passedtestcases"/>&nbsp;<label className="labelResult">Passed: {this.state.results.passed}</label>
                            <img className="imageResult" src={Failed} alt="failedtestcases"/>&nbsp;<label className="labelResult">Failed: {this.state.results.failed}</label>
                            </div>
                            <div id="accordion">
                                    {testSuitesDiv}
                                </div>
                    </div>
                    </div>
                }
                </div>
            </div>
            </div>

        )
    }
}

export default TestRunner;