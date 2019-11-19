import React, { Component } from 'react';
import {Redirect,Link} from 'react-router-dom'
import Avatar from 'react-avatar-edit'
import '../../styles/profile.css';


class UpdateProfile extends Component {
    constructor(props){
        super(props);
        this.state = {
            isLoggedIn: true,
            imageChanged:false,
            preview:null,
            userid: null,
            firstname:null,
            lastname:null,
            email:null,
            phonenumber:null,
            profileUpdated:false,
        }
        this.onCrop = this.onCrop.bind(this)
        this.changeFirstNameHandler = this.changeFirstNameHandler.bind(this)
        this.changeLastNameHandler = this.changeLastNameHandler.bind(this)
        this.changePhoneNumberHandler = this.changePhoneNumberHandler.bind(this)
        this.resetState = this.resetState.bind(this)
        this.resetForm = this.resetForm.bind(this)

        this.submitHandler = this.submitHandler.bind(this)
    }
    async submitHandler(e){
        e.preventDefault();
        let currentuserid = this.state.userid;

        //if image changed upload image.
        let updateImage = {success:true};
        if(this.state.imageChanged){
            let imageData = {'image': this.state.preview};
            const updateImageRes = await fetch("/pm/profileimage/"+currentuserid,{
                body: JSON.stringify(imageData),
                method: 'POST',
                headers:{'Authorization': "bearer " + localStorage.getItem("jwtToken"),
                    'Content-Type': 'application/json'}
            })
            updateImage = await updateImageRes.json();
            const imageUpdate = updateImage.success;
        }

        const data = {
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            contactno: this.state.phonenumber,
        }
        console.log(data)
        const updateProfileRes = await fetch('/pm/profile/'+currentuserid,{
            method: 'POST',
            headers:{'Authorization': "bearer " + localStorage.getItem("jwtToken"),
                'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        })
        const updateProfile = await updateProfileRes.json();

        const success = updateProfile.success;
        //&& updateImage.success;


            //&& updateImage.success;
            if (success) {
                this.setState({profileUpdated:success});
            }

    }
    onCrop(preview) {
        this.setState({preview:preview, imageChanged:true})
    }

    changeFirstNameHandler(e){
        this.setState({
            firstname:e.target.value
        })
    }
    changeLastNameHandler(e){
        this.setState({
            lastname:e.target.value
        })
    }
    changePhoneNumberHandler(e){
        this.setState({
            phonenumber:e.target.value
        })
    }



    async resetForm(){
        this.setState({
            preview:null,
            firstname:null,
            lastname:null,
            email:null,
            phonenumber:null,
        })
    }
    async resetState(){
        let currentUserId = localStorage.getItem("userid");
        this.setState({
            userid: currentUserId
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
    async componentDidMount(){

        this.resetState();
    }


    render(){
        // const istyle = {height: '100%', width: '100%', 'object-fit': 'contain'}
        // if (!this.state.isLoggedIn) {
        //     return(<Redirect to="/signin"/>)
        // } else
        let updateLink = "/updateprofile";
        let profileLink = "/profile";
        if(this.state.profileUpdated){
            return(<Redirect to={profileLink} />)
        } else {
            const istyle = {height: '100%', width: '100%', 'object-fit': 'contain'}
            let profilePreview = <img src={this.state.preview} style={istyle} alt="profile pic"/>
            if(this.state.preview == null) {
                profilePreview =<i class="fa fa-user fa-7x profile-opacity" aria-hidden="true"></i>
            }
            return(
                <div className="main-wrapper">
                    <div className="content-wrapper">
                        <div className="dash-one">
                            <p className="dash-header-blue"><Link to={profileLink}>
                                <p>{this.state.firstname}'s Profile</p></Link></p>
                        </div>

                        <div className="course-card-container profile-contain">
                            <div className="row">
                                <div className="profile-container right-style">
                                    <div className="profile">
                                        {profilePreview}
                                    </div>
                                </div>
                                <Avatar width={200} height={150} onCrop={this.onCrop}/>
                            </div>
                            <form className="updateProfile-form" onSubmit={this.submitHandler}>
                                <div className="row">
                                    <p className="profile-headers">First Name</p>
                                    <input className="input-profile" type="text" required name="name" value={this.state.firstname} onChange={this.changeFirstNameHandler}></input>
                                </div>
                                <div className="row">
                                    <p className="profile-headers">Last Name</p>
                                    <input className="input-profile" type="text" required name="name" value={this.state.lastname} onChange={this.changeLastNameHandler}></input>
                                </div>
                                <div className="row">
                                    <p className="profile-headers">Email</p>
                                    <input className="input-profile" type="email" required name="email" value={this.state.email} readOnly></input>
                                </div>
                                <div className="row">
                                    <p className="profile-headers">Phone Number</p>
                                    <input className="input-profile" type="phone" name="phonenumber" value={this.state.phonenumber} onChange={this.changePhoneNumberHandler}></input>
                                </div>
                                <div className="row">
                                    <button className="profile-button" type="submit">Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )
        }
    }
}


export default UpdateProfile;