import React, { Component } from 'react';
import { Link, Redirect } from "react-router-dom";
import '../../App.css';
import '../../styles/Account.css';
import Logo from '../../images/quora.svg';
const axios = require('axios');


class SignIn extends Component {
    constructor(props){
        super(props);
        this.state = {
            signupSuccess: null,
            signupMessage: null,
            signinSuccess: null,
            signinMessage: null
        }
        this.submitSignUp = this.submitSignUp.bind(this);
        this.submitSignIn = this.submitSignIn.bind(this);
    }
    
    submitSignUp(e) {
        e.preventDefault();
        const data = new FormData(e.target);
        axios.post("/user/signup", data)
        .then((response) => {
            if(response.data.success) {
                console.log("signup successful");
                this.setState({"signupSuccess": true, "signupMessage":"Sign up success!"});
            } else {
                console.log("signup 2xx response, but failed");
                this.setState({"signupSuccess": false, "signupMessage": "Sign up Failed"});
            }
        })
        .catch((error)=>{
            console.log("signup not 2xx response");
            this.setState({"signupSuccess": false, "signupMessage": "Sign up Failed"});
        })
    }
    
    submitSignIn(e) {
        e.preventDefault();
        const data = new FormData(e.target);
        axios.post("/user/login", data)
        .then((response) => {
            if(response.data.success) {
                console.log("signin successful");

                localStorage.setItem("jwtToken", response.data.token);
                localStorage.setItem("userid", response.data.userid);
                localStorage.setItem("role", response.data.role);
                localStorage.setItem("chatUserId", response.data.chatUserId);
                localStorage.setItem("chatUserToken", response.data.chatUserToken);

                this.setState({"signinSuccess": true, "signinMessage":"Sign in success!"});
            } else {
                console.log("signin 2xx response, but failed");
                this.setState({"signinSuccess": false, "signinMessage": "Sign up Failed"});
            }
        })
        .catch((error)=>{
            console.log("signin not 2xx response");
            this.setState({"signinSuccess": false, "signinMessage": "Sign in Failed"});
        })
    }

    render(){
        if(localStorage.getItem("jwtToken")!== null) {
            return(<Redirect to="/"/>)
        }
        let message = null;
        if(this.state.signupSuccess != null && this.state.signupSuccess){
            message = <div className="success-signup"><span>{this.state.signupMessage}</span></div>
        }
        if(this.state.signupSuccess != null && !this.state.signupSuccess){
            message = <div className="unsuccess-signup"><span>{this.state.signupMessage}</span></div>
        }
        if(this.state.signinSuccess != null && !this.state.signinSuccess){
            message = <div className="unsuccess-signup"><span>{this.state.signinMessage}</span></div>
        }
        const spanStyle = {
            "font-size": "36pt"
        }
        return (
            <div className="account-parent-container">
                <div className="account-container">
                    <div className="account-logo-container">
                        <span style={spanStyle}>MobileTaas</span>
                    </div>          
                    <p className="account-tag">Mobile testing as a service platform.</p>
                    <div className="account-sub-container">
                        {message}
                        <div className="signup">
                            <p className="signup-text">Sign Up</p>
                            <form className="form" onSubmit={this.submitSignUp}>
                                <div className="row">
                                    <div className="first-half">
                                        <label className="account-labels first-name-label">FIRST NAME</label>
                                        <div className="input-firstName">
                                            <input className="first-name account-input" type="text" name="firstname" required></input>
                                        </div>
                                    </div>
                                    <div className="second-half">
                                        <label className="account-labels last-name-label">LAST NAME</label>
                                        <div className="input-lastName">
                                            <input className="last-name account-input" type="text" name="lastname" required></input>
                                        </div>
                                    </div>
                                </div>
                                <div className="email-div">
                                    <label className="account-labels email-label">EMAIL</label>
                                    <div className="input-email">
                                        <input className="email account-input" type="input" name="email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" title="abc@example.com" required></input>
                                    </div>
                                </div>
                                <div className="pw">
                                    <label className="account-labels email-label">PASSWORD</label>
                                    <div className="input-email">
                                        <input className="email account-input" type="password" name="password" minlength="8" required></input>
                                    </div>
                                </div>
                                <div className="pw">
                                    <label className="account-labels email-label">ROLE</label>
                                    <div className="input-email">
                                        <input type="radio" name="role" value="PM"/> <label className="account-labels email-label">Project Manager</label>  
                                        <input type="radio" name="role" value="TESTER"/>  <label className="account-labels email-label">Tester</label> 
                                    </div>
                                </div>
                                <div className="row">
                                    <button type="submit" className="account-btn">Sign Up</button>
                                </div>
                            </form>
                        </div>
                        <div className="login">
                            <p className="signup-text">Login</p>
                            <form className="form" onSubmit={this.submitSignIn}>
                                <div className="input-email">
                                    <input className="email account-input" type="email" name="email" required></input>
                                </div>
                                <div className="input-email">
                                    <input className="email account-input email-top" type="password" name="password" minlength="8" required></input>
                                </div>
                                <div className="row">
                                    <button type="submit" className="account-btn-login">Login</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
             </div>
        );
    }
}
export default SignIn;