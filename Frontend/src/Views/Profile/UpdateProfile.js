import React, { Component } from 'react';
import {Redirect,Link} from 'react-router-dom'
import UpdateManagerProfile from './Update_Manager_Profile';
import UpdateTesterProfile from './Update_Tester_Profile';


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
               <UpdateTesterProfile />
            );
        } else if (this.state.role === 'PM') {
            //Return project manager page
            return (
            <UpdateManagerProfile />
            )
        } else {
            return (<div><Redirect to="/" /></div>);
        }
    }
}