    
import React, { Component } from 'react';
import '../styles/Navigation.css';
import {Link, Redirect} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import {bugzillaHost} from "../config/settings"


class Header extends Component {
  constructor(props){
        super(props);
        this.logout = this.logout.bind(this); 
    }

    logout = () => {
        console.log("Inside frontend logout")
        localStorage.clear();
    }

    render() {
      return (
        <div>
            <div className="header" >
                <div>
                    <Link to="/" >
                        <div className="header-logo-text home-elem">MobileTaas</div>
                    </Link>
                </div>
                <div className="header-elem home">
                    <Link to="/" >
                        <div className="header-logo-text home-elem">Home</div>
                    </Link>
                </div>
                <div className="header-elem answer">
                    <div className="header-logo-text answer-elem">Messages</div>
                </div>
                <div className="header-elem answer">
                    <a href={bugzillaHost+"/bugzilla" } target="_blank">
                        <div className="header-logo-text answer-elem">Bugzilla</div>
                    </a>
                </div>
                <div className="header-elem spaces">
                    <Link to="/dashboard" >
                        <div className="header-logo-text spaces-elem">Dashboard</div>
                    </Link>
                </div>
                <div className="header-elem spaces">
                <Link to="/" >
                <div className="header-logo-text spaces-elem" onClick={this.logout}>Logout</div>
                </Link>
                </div>
                <div>
            
                    
                </div>
            </div>
        </div>
    );
  }
}
export default Header;
