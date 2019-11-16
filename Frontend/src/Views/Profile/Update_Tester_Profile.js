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
            allSkills:[],
            skills:[{
                skillid: null,
                skillname:null,
                userid:null
            }],
            profileUpdated:false
        }
        this.onCrop = this.onCrop.bind(this)
        this.changeFirstNameHandler = this.changeFirstNameHandler.bind(this)
        this.changeLastNameHandler = this.changeLastNameHandler.bind(this)
        this.changeEmailHandler = this.changeEmailHandler.bind(this)
        this.changePhoneNumberHandler = this.changePhoneNumberHandler.bind(this)
        this.changeSkillsHandler = this.changeSkillsHandler.bind(this)
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
            const updateImageRes = await fetch("/tester/profileimage/"+currentuserid,{
                body: JSON.stringify(imageData),
                method: 'POST',
                headers:{'Authorization': "bearer " + localStorage.getItem("jwtToken"),
                    'Content-Type': 'application/json'}
            })
            updateImage = await updateImageRes.json()
        }
        // upload rest of form data.
        // const data = new FormData();
        // data.append('firstname', this.state.firstname);
        // data.append('lastname', this.state.lastname);
        // data.append('contactno', this.state.phonenumber);
        // data.append('skills', this.state.skills);
        const data = {
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            contactno: this.state.phonenumber,
            skills: this.state.skills
        }
        console.log(data)
        const updateProfileRes = await fetch('/tester/profile/'+currentuserid,{
            method: 'POST',
            headers:{'Authorization': "bearer " + localStorage.getItem("jwtToken"),
                'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        })
        const updateProfile = await updateProfileRes.json();

        const success = updateProfile.success;
        //&& updateImage.success;
        this.setState({profileUpdated:success});
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
    changeEmailHandler(e){
        this.setState({
            email:e.target.value
        })
    }
    changeSkillsHandler(e){
        //this is current user skills
        let skills = this.state.skills;
        //If skill is checked, push into user skills
        if(e.target.checked) {
            skills.push({
                skillid: parseInt(e.target.name),
                skillname: e.target.value
            })
        } else {
            //If skill is unchecked, remove from user skills
            var skillIndex = -1;
            skills.forEach((skill, index) => {
                if (skill.skillid === parseInt(e.target.name))
                    skillIndex = index;
            })
            if (skillIndex !== -1) skills.splice(skillIndex, 1);
        }

        //update user skills
        this.setState({skills: skills}, console.log(this.state.skills));

    }

    async resetForm(){
        this.setState({
            preview:null,
            firstname:null,
            lastname:null,
            email:null,
            phonenumber:null,
            skills:[],
        })
    }
    async resetState(){
        let currentUserId = localStorage.getItem("userid");
        // get the image from backend
        const imageRes = await fetch("/tester/profileimage/"+currentUserId,{
            method:"GET",
            headers:{'Authorization': "bearer " + localStorage.getItem("jwtToken")}
        })
        const imageJson = await imageRes.json();
        if(imageJson.success) {
            this.setState({
                preview:imageJson.image
            })
        }
        // get full profile data from backend

        const profileRes = await fetch("/tester/profile/"+currentUserId,{
            method:"GET",
            headers:{'Authorization': "bearer " + localStorage.getItem("jwtToken")}
        })
        const profileJson = await profileRes.json();
        console.log(JSON.parse(profileJson.data)[0].userid);
        var data = JSON.parse(profileJson.data)[0];
        console.log(data.userid);
        if(profileJson.success) {
            this.setState({
                userid:data.userid,
                firstname:data.firstname,
                lastname:data.lastname,
                email:data.email,
                phonenumber:data.contactno,
                preview:data.profileimg
            })
        }
        const skillRes = await fetch("/tester/profile/"+currentUserId+"/skills",{
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
        const allSkillRes = await fetch("/tester/skills/all",{
            method:"GET",
            headers:{'Authorization': "bearer " + localStorage.getItem("jwtToken")}
        })
        const allSkillJson = await allSkillRes.json();
        console.log(JSON.parse(allSkillJson.data));
        var allSkills = JSON.parse(allSkillJson.data);
        if(allSkillJson.success) {
            this.setState({
                allSkills:allSkills,
            })
        }
    }
    async componentDidMount(){
        // const signInUser = await fetch('/isLoggedIn',{
        //     method: 'GET'
        // })
        // const responseSignIn = await signInUser.json();
        // this.setState({
        //     isLoggedIn: responseSignIn.isLoggedIn
        // })
         this.resetState();
    }

    renderSkillSet() {
        console.log(this.state.skills)
        //const skillSet = ['Android Testing','Security testing','Java'];
        //-----------For all skills begin---------------
        return this.state.allSkills.map((skill) =>{
            // console.log(skill.skillid);
            // console.log(skill.skillname);
            if(skill !== null){
            var isChecked = false;
            //-----------For user skills begin---------------
            this.state.skills.map((userSkill) => {
                if (userSkill.skillid != null && userSkill.skillid === skill.skillid) {
                    isChecked = true;
                }
            })

            //-----------For user skills end---------------
                return(
                    <div className="skillset_input">
                        <label>
                        <input type="checkbox" name={skill.skillid} onChange={this.changeSkillsHandler} value={skill.skillname} checked={isChecked}/> {skill.skillname}
                    </label>
                    </div>
                )
        }
    })
        //-----------For all skills end---------------
    }
    render(){
        // const istyle = {height: '100%', width: '100%', 'object-fit': 'contain'}
        // if (!this.state.isLoggedIn) {
        //     return(<Redirect to="/signin"/>)
        // } else
        if(this.state.profileUpdated){
            return(<Redirect to="/tester/profile"/>)
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
                        <p className="dash-header-blue"><Link to={"/profile"}>
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
                                <input className="input-profile" type="email" required name="email" value={this.state.email} onChange={this.changeEmailHandler} readOnly></input>
                            </div>
                            <div className="row">
                                <p className="profile-headers">Phone Number</p>
                                <input className="input-profile" type="phone" name="phonenumber" value={this.state.phonenumber} onChange={this.changePhoneNumberHandler}></input>
                            </div>
                            <div className="row skillset-input">
                                <p className="profile-headers">Skillset</p>
                                {this.renderSkillSet()}
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