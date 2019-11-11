import React, { Component } from 'react';
import { Link, Redirect } from "react-router-dom";
import '../../App.css';

class Navigation extends Component {
  constructor(props){
    super(props);
    this.state = {
      isLoggedIn: true
    }
    this.logoutHandler = this.logoutHandler.bind(this);
  }
  async logoutHandler(){
    const logout = await fetch('/logout',{
      method: 'GET'
    })
    const willLogout = await logout.json();
    if (willLogout.isLoggedIn == false){
      this.setState({
        isLoggedIn: false
      })
    }

  }
  render(){
    if(this.state.isLoggedIn === false){
      return(
        <Redirect to='/signin' />
      )
    }
    return(
      <div className="sidebar-wrapper">
        <nav id="nav-sidebar">
          <div className="header-image">
              <img className="sjsu-header" src = "https://28dvez1wnqjyd37ed3lq71f6-wpengine.netdna-ssl.com/wp-content/themes/twenty-seventeen-child/assets/images/sjsu-logo-gold.png" alt="" />
          </div>
          <ul className="sidebar-components">
            <li>
              <Link to='/profile'>
                <div className="icon-container">
                  <i className="far fa-user fa-lg"></i>
                  <div className="icon-text">Account</div>
                </div>
              </Link>
            </li>
            <li>
              <Link to='/dashboard'>
                <div className="icon-container">
                  <i className="fas fa-tachometer-alt fa-lg"></i>
                  <div className="icon-text">Dashboard</div>
                </div>
              </Link>
            </li>
            <li>
              <Link to='/courses'>
              <div className="icon-container">
                <i className="fas fa-book fa-lg"></i>
                <div className="icon-text">Courses</div>
              </div>
              </Link>
            </li>
            <li>
              <Link to='/addcourse'>
                <div className="icon-container">
                <i className="fas fa-plus-square fa-lg"></i>
                  <div className="icon-text">Add Course</div>
                </div>
              </Link>
            </li>
            <li>
              <div className="icon-container">
                <i className="fas fa-users fa-lg"></i>
                <div className="icon-text">Groups</div>
              </div>
            </li>
            <li>
              <div className="icon-container">
              <i className="fas fa-envelope-square fa-lg"></i>
                <div className="icon-text">Inbox</div>
              </div>
            </li>
            <li>
              <Link to='/signin'>
                <div onClick = {this.logoutHandler} className="icon-container">
                <i className="fas fa-sign-out-alt fa-lg"></i>
                  <div className="icon-text">Log Out</div>
                </div>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    )
  }
}

export default Navigation;