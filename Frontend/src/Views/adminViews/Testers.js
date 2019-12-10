import React, { Component } from 'react';
import { Redirect,Link } from "react-router-dom";
import './../../App.css';
import Header from "../Header";

class Testers extends Component {
    constructor(props){
        super();
        this.state = {
            testers:[],
            searchString:""
        }
        this.blockHandler = this.blockHandler.bind(this);
        this.getTesters = this.getTesters.bind(this);
        this.searchChangeHandler = this.searchChangeHandler.bind(this);
    }
    searchChangeHandler(e){
        this.setState({searchString:e.target.value})
    }
    async blockHandler(e){
        const blockRes = await fetch('/admin/'+e.target.value.toLowerCase()+'/tester/'+e.target.name,{
            method: 'GET',
            headers:{'Authorization': "bearer " + localStorage.getItem("jwtToken")}
        })
        const blockJson = await blockRes.json();
        if(blockJson.success) {
            this.getTesters();
        }
    }

    async componentDidMount(){
        this.getTesters();
    }

    async getTesters(){
        // get all the testers.
        const testersRes = await fetch('/admin/testers',{
            method: 'GET',
            headers:{'Authorization': "bearer " + localStorage.getItem("jwtToken")}
        })
        const testers = await testersRes.json();
        // console.log(testers.data)
        this.setState({
            testers:JSON.parse(testers.data)
        }, console.log(this.state.testers));
    }

    render(){
        if (localStorage.role !== 'ADMIN') {
            return(<Redirect to="/"/>)
        }
        let header = <h1 className="dash-header-blue">Testers</h1>
        console.log(this.state.testers)
        let testersRows = this.state.testers.map(
            (tester)=>{
                let blockButtonText = (tester.isblocked === 0) ? "Block" : "Unblock";
                let blockButton = <td><button className="btn btn-danger" onClick={this.blockHandler} name={tester.userid} value={blockButtonText}>{blockButtonText}</button></td>
                if(tester.firstname.toUpperCase().includes(this.state.searchString.toUpperCase())
                || tester.lastname.toUpperCase().includes(this.state.searchString.toUpperCase())
                || tester.email.toUpperCase().includes(this.state.searchString.toUpperCase())){
                    return(
                        <tr>
                            <td>{tester.firstname} {tester.lastname}</td>
                            <td>{tester.email}</td>
                            <td>{(tester.isblocked === 0) ? "ACTIVE" : "BLOCKED"}</td>
                            {blockButton}
                        </tr>
                    )
                } else {
                    return null;
                }
            })

        return(
            <div className="main-wrapper">
                <Header/>
                <div className="content-wrapper">
                    <div className="dash-one w-100">
                        {header}
                    </div>
                    <div className="course-main-wrapper">
                        <div className="clearfix"></div>
                        <div className="course-content-wrapper p-4">
                            <input className="search-box w-25 p-2" type="text" onChange={this.searchChangeHandler} value={this.state.searchString} name="searchbox" placeholder="Search Testers"/>
                            <br /> <br />
                            <table className="table table-striped custom-table2">
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                {testersRows}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Testers;