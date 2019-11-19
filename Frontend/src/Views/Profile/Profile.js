import React, { Component } from 'react';
import {Redirect,Link} from 'react-router-dom'
import ManagerProfile from './Manager_Profile';
import TesterProfile from './Tester_Profile';


export default class Courses extends Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            role: localStorage.getItem("role"),
            userid: localStorage.getItem("userid")
        };
    }


    render() {
        let redirectVar = null;
        if (this.state.role === 'TESTER') {
            //Return Tester Profile Page
            return (
               <TesterProfile />
            );
        } else if (this.state.role === 'PM') {
            //Return project manager page
            return (
            <ManagerProfile />
            )
        } else {
            return (<div><Redirect to="/" /></div>);
        }
    }
}