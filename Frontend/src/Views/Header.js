
import React, { Component } from 'react';
import '../styles/Canvas.css';
import { Link, Redirect } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import { bugzillaHost } from "../config/settings"


class Header extends Component {
  constructor(props) {
    super(props);
    this.logoutHandler = this.logoutHandler.bind(this);
  }

  logoutHandler = () => {
    console.log("Inside frontend logout")
    localStorage.clear();
  }

  render() {
    const bugzillaURL = bugzillaHost + "/bugzilla";
    const role = localStorage.getItem("role");
    let homepage = null;
    let isProfile = true;
    let sidebarLinks = null
    if (role === "ADMIN") {
      isProfile = false;
      sidebarLinks = <div>
        <li>
          <Link to='/addcourse'>
            <div className="icon-container">
              <i className="fas fa-project-diagram fa-lg"></i>
              <span className="icon-text">Projects</span>
            </div>
          </Link>
        </li>
        <li>
          <Link to='/addcourse'>
            <div className="icon-container">
              <i className="fas fa-user-shield fa-lg"></i>
              <span className="icon-text">Testers</span>
            </div>
          </Link>
        </li>
      </div>

    } else if (role === "TESTER") {
      homepage = <li>
        <Link to='/home'>
          <div className="icon-container">
            <i className="fas fa-home fa-lg"></i>
            <span className="icon-text">Home</span>
          </div></Link>
      </li>;

      sidebarLinks = <div>
        <li>
          <Link to='/addcourse'>
            <div className="icon-container">
              <i className="fas fa-plus-square fa-lg"></i>
              <span className="icon-text">Join Project</span>
            </div>
          </Link>
        </li>
        <li>
          <Link to='/addcourse'>
            <div className="icon-container">
              <i className="fas fa-file-archive fa-lg"></i>
              <span className="icon-text">Artifacts</span>
            </div>
          </Link>
        </li>
        <li>
          <Link to='/addcourse'>
            <div className="icon-container">
              <i className="fas fa-users fa-lg"></i>
              <span className="icon-text">Community</span>
            </div>
          </Link>
        </li>
      </div>
    } else {
      homepage = <li>
        <Link to='/manager/home'>
          <div className="icon-container">
            <i className="fas fa-home fa-lg"></i>
            <span className="icon-text">Home</span>
          </div></Link>
      </li>;

      sidebarLinks = <div>
        <li>
          <Link to='/pm/requests'>
            <div className="icon-container">
              <i className="fas fa-plus-square fa-lg"></i>
              <span className="icon-text">View Requests</span>
            </div>
          </Link>
        </li>
        <li>
          <Link to='/manager/viewartifact'>
            <div className="icon-container">
              <i className="fas fa-file-archive fa-lg"></i>
              <span className="icon-text">Artifacts</span>
            </div>
          </Link>
        </li>
        <li>
          <Link to='/addcourse'>
            <div className="icon-container">
              <i className="fas fa-users fa-lg"></i>
              <span className="icon-text">Community</span>
            </div>
          </Link>
        </li>
      </div>

    }
    let profile = null;
    if (isProfile) {
      profile = <li>
        <Link to='/profile'>
          <div className="icon-container">
            <i className="far fa-user fa-lg"></i>
            <span className="icon-text">Profile</span>
          </div>
        </Link>
      </li>;
    }

    // Manager: Dashboard, profile, Projects, Testers, logout
    // Testers: Home, Dashboard, profile, Community, Join Project, Artifacts, logout
    // PM: Home, Dashboard, profile, Community, Requests, Artifacts, logout
    return (

      <div className="sidebar-wrapper">
        <nav id="nav-sidebar">
          <div className="header-image">
            <h2>MobileTaas</h2>
          </div>
          <ul className="sidebar-components">
            {homepage}
            {profile}
            <li>
              <Link to='/dashboard'>
                <div className="icon-container">
                  <i className="fas fa-tachometer-alt fa-lg"></i>
                  <span className="icon-text">Dashboard</span>
                </div>
              </Link>
            </li>
            {sidebarLinks}
            <li>
              <a href={bugzillaURL} target="_blank">
                <div className="icon-container">
                  <i className="fas fa-bug fa-lg"></i>
                  <span className="icon-text">Bugzilla</span>
                </div>
              </a>
            </li>
            <li>
              <Link to='/signin'>
                <div onClick={this.logoutHandler} className="icon-container">
                  <i className="fas fa-sign-out-alt fa-lg"></i>
                  <span className="icon-text">Log Out</span>
                </div>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}
export default Header;
