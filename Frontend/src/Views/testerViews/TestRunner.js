import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import {hostaddress} from '../../config/settings';
import '../../styles/testerHome.css';


class TestRunner extends Component {

    constructor(){
        super();
        this.state = {  
            url:""
        }
    }  

    //get the projects from backend  
    componentDidMount(){
       const projectid = this.props.match.params.projectID;
       console.log(projectid);
       let url = 'http://'+hostaddress+':3001/tester/project/url';
       let token = localStorage.getItem('jwtToken');
       console.log(token);
       axios({
           method: 'get',
           url: url,     
           params: { "id": projectid },
           config: { headers: { 'Content-Type': 'application/json' } },
           headers: {"Authorization" : `Bearer ${token}`}
       })
               .then((response) => {
               //update the state with the response data
               this.setState({
                   url : response.data.url 
               });
               console.log(this.state.url);
           });
    }


    render() {
        
        return (
            <div>
                <div className="container">
                        <div className="row justify-content-center align-items-center" style={{ height: '75vh' }}>
                                <div className="col-12">
                                    <div className="border-bottom row" style={{ marginBottom: "3%" }}>
                                        <h3 >Test Runner</h3>
                                    </div>
                                    <form method="post">
                                    <div className="form-group row">
                                            <label htmlFor="url" className="col-sm-2 col-form-label">Project URL:</label>
                                            <div className="col-sm-5">
                                                <input type="text" className="form-control" name="url" readOnly value={this.state.url}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                                <label htmlFor="browser" className="col-sm-2 col-form-label">To Test in Browser:</label>
                                        <div className="col-sm-5">
                                                    <select className="form-control" name="browser" style={{padding:"0em",width:"50%"}}>
                                                        <option value="chrome">Chrome</option>
                                                        <option value="firefox">Firebox</option>
                                                    </select>
                                                    </div>
                                                </div>
                                        <div className="form-group row">
                                                <label htmlFor="testScripts" className="col-sm-2 col-form-label">Test Scripts:</label>
                                                <div className="col-sm-5">
                                                <textarea class="form-control" id="testScripts" rows="8"></textarea>
                                                </div>
                                        </div>
                                        <div className="form-group row text-center">
                                         <button type="submit" class="btn btn-primary align-center">Run Tests</button>
                                        </div>

                                    </form>

                                </div>
                            </div>
                        </div>
            </div>
               
        )
    }
}

export default TestRunner;