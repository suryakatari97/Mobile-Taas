import React, { Component } from 'react';
import { Link,Redirect } from "react-router-dom";
import '../../styles/profile.css';
import {chatHost} from "../../config/settings";

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
            profileUpdated:false,
        }
    }

    async componentDidMount(){
        let currentUserId = localStorage.getItem("userid");
        this.setState({
            userid:this.state.userid
        })

        // get full profile data from backend
        const profileRes = await fetch("/pm/profile/"+currentUserId,{
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
            })
        }
    }
    render(){
        let updateLink = '/updateprofile';
        let profileLink = '/profile';
        const chatUrl = chatHost+"?userId=" + chatUserId + "&resumeToken=" + chatUserToken

        let updateProfile = <div className="update-profile-btn">
                <Link to={updateLink} className="link"><i class="fas fa-user-edit"></i> Update Profile</Link>
            </div>
        let launchChat = <div className="update-profile-btn ml-2">
            <a className="link" style={{textDecoration: "none"}} target="_blank" href={chatUrl}><i class="fas fa-user-edit"></i> Community Chat </a>
        </div>
        const istyle = {height: '100%', width: '100%', 'object-fit': 'contain'}
        if (!this.state.isLoggedIn) {
            return(<Redirect to="/"/>)
        } else if(this.state.profileUpdated){
            return(<Redirect to={profileLink} />)
        } else {
            let profilePreview = <img src={this.state.preview} style={istyle} alt="profile pic"/>
            if(this.state.preview == null) {
                profilePreview =<i class="fa fa-user fa-7x profile-opacity" aria-hidden="true"></i>
            }

            return(
                <div className="main-wrapper">
                    <div className="content-wrapper">
                        <div className="dash-one">
                            <p className="dash-header-blue">
                                <Link to={profileLink}><p>{this.state.firstname}'s Profile</p></Link>
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
                                            {updateProfile}                                             {launchChat}
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