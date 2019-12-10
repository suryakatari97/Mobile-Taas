import React, { Component } from 'react';
//import Navigation from './Navigation'
import { Link,Redirect } from "react-router-dom";
import '../../styles/profile.css';
import Header from "../Header";

class Profile extends Component {
    constructor(props){
        super(props);
        this.state = {
            isLoggedIn: true,
            imageChanged:false,
            preview:null,
            firstname:null,
            lastname:null,
            email:null,
            phonenumber:null,
            skills:[],
            profileUpdated:false,
            resume: null
        }
    }

    async componentDidMount(){

        // get full profile data from backend
        const profileRes = await fetch("/pm/tester/profile/"+this.props.match.params.testerID,{
            method:"GET",
            headers:{'Authorization': "bearer " + localStorage.getItem("jwtToken")}
        })
        const profileJson = await profileRes.json();
        console.log(JSON.parse(profileJson.data)[0].userid);
        var data = JSON.parse(profileJson.data)[0];
        console.log(data.userid);
        if(profileJson.success) {
            this.setState({
                firstname:data.firstname,
                lastname:data.lastname,
                email:data.email,
                phonenumber:data.contactno,
                preview:data.profileimg,
                resume:data.resume_filename
            })
        }
        const skillRes = await fetch("/pm/tester/profile/"+this.props.match.params.testerID+"/skills",{
            method:"GET",
            headers:{'Authorization': "bearer " + localStorage.getItem("jwtToken")}
        })
        const skillJson = await skillRes.json();
        console.log(JSON.parse(skillJson.data));
        var skills = JSON.parse(skillJson.data);
        if(skillJson.success) {
            this.setState({
                skills:skills,
            })
        }
    }
    render(){


        const istyle = {height: '100%', width: '100%', 'object-fit': 'contain'}
        if (!this.state.isLoggedIn) {
            return(<Redirect to="/"/>)
        } else {
            let profilePreview = <img src={this.state.preview} style={istyle} alt="profile pic"/>
            if(this.state.preview == null) {
                profilePreview =<i class="fa fa-user fa-7x profile-opacity" aria-hidden="true"></i>
            }
            let resumeText = (this.state.resume && this.state.resume !== "") ? "Download" : "Resume not yet uploaded"
            return(
                <div className="main-wrapper">
                    <Header />
                    <div className="content-wrapper">
                        <div className="dash-one">
                            <p className="dash-header-blue">
                                <p>{this.state.firstname}'s Profile</p>
                            </p>
                            <div className="course-card-container">
                                <div className="row">
                                    <div className="profile-container">
                                        <div className="profile">{profilePreview}</div>
                                    </div>
                                    <div className="profile-form">
                                        <div className="row row-style">
                                            <p className="profile-headers">First Name :</p>
                                            <p>{this.state.firstname}</p>
                                        </div>
                                        <div className="row row-style">
                                            <p className="profile-headers">Last Name :</p>
                                            <p>{this.state.lastname}</p>
                                        </div>
                                        <div className="row row-style">
                                            <p className="profile-headers">Email :</p>
                                            <p>{this.state.email}</p>
                                        </div>
                                        <div className="row row-style">
                                            <p className="profile-headers">Contact Number :</p>
                                            <p>{this.state.phonenumber}</p>
                                        </div>
                                        <div className="row row-style">
                                            <p className="profile-headers">Skill Set :</p>
                                            <p>
                                                {
                                                    this.state.skills.map(skill => {
                                                        return (
                                                            <p><li>{skill.skillname}</li></p>
                                                        )
                                                    })
                                                }
                                            </p>
                                        </div>
                                        <div className="row row-style">
                                            <p className="profile-headers">Resume :</p>
                                            <a href={this.state.resume} alt="Resume Not Uploaded">{resumeText}</a>
                                        </div>
                                        <div className="row row-style">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }
}
export default Profile;