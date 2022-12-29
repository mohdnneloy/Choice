import React from 'react'
import { useState } from 'react';
import axios from 'axios';

// Components ====================================
import MainNavBar from '../../Components/MainNavBar';
import Footer from '../../Components/Footer';

// Styles =======================================
import './Styles/PARegister.css'

// Images ========================================
import pambassador from '../../images/party-ambassadorr.jpg';

const PARegister = () => {

  // Main Urls
  let localurlf = "http://localhost:3000/";
  let localurlb = "http://localhost:8000/";

  // States ========================================
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [wid, setWid] = useState('');
  const [partyname, setPartyname] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState('AZ');
  const [astateid, setAstateid] = useState('');
  const [cstateid, setCstateid] = useState('');
  const [gender, setGender] = useState('Male');
  const [dob, setDob] = useState('');
  const [password, setPassword] = useState('');

  // Non form States ======================================
  const [regstep, setRegStep] = useState(1);

  // Functions ======================================

  // -- Test Function
  const check = () => {
    console.log('Fname:' + fname);
    console.log('Lname:' + lname);
    console.log('Wid:' + wid);
    console.log('Party Name:' + partyname);
    console.log('Email:' + email);
    console.log('Password:' + password);
    console.log('State:' + state);
    console.log('Gender:' + gender);
    console.log('DOB:' + dob);
    console.log('Arizona State ID:' + astateid);
    console.log('California State ID:' + cstateid);
  }

  // -- Form Validator
  const validate1 = () => {
  
    // First Name Checks
    if(fname.match(/^([a-zA-Z ]{2,30})$/) == null || fname.match(/[^a-zA-Z ]/) != null){
        alert("First Name should be within 2-30 characters and cannot have numbers or special characters in it!");
        return false;
    }
  
    // Last Name Checks
    if(lname.match(/^([a-zA-Z]{2,15})/) == null || lname.match(/[^a-zA-Z]/) != null){
        alert("Last Name should be within 2-15 characters and cannot have numbers or special characters in it!");
        return false;
    }

    // Email Checks
    if(email.match(/^([a-zA-Z0-9\._]+)@([a-z]+).([a-z]{2,3})$/) == null){
      alert("Email not recognized!");
      return false;
    }

    // Wallet ID Check
    if(wid.match(/^([a-zA-Z0-9]{42})$/) == null){
      alert("Invalid Wallet ID");
      return false;
    }

    if(astateid === "" && cstateid === ""){
      alert("Please Enter Your Valid State ID");
      return false;
    }

    if(state === "Arizona" && astateid !== "" && astateid.match(/^([a-zA-Z]{1})([0-9]{8})$/) === null){
      alert("Invalid Arizona State ID");
      return false;
    }

    if(state === "California" && cstateid !== "" && cstateid.match(/^([a-zA-Z]{1})([0-9]{7})$/) === null){
      alert("Invalid California State ID");
      return false;
    }

    if(gender == ""){
      alert("Please enter your gender!");
      return false;
    }

    if(dob == ""){
      alert("Please enter your date of birth");
      return false;
    }

  }

  const verifyAdmin = (user)=>{

        console.log(user);

        axios.post(localurlb.concat("system/addpartyambassador"), user)
          .then(res=>{
            console.log(`response==${res}`)
            window.location = localurlf.concat("login/partyambassador");
            
        }).catch(error=>{

          if(error.response.status === 406){
            console.log(`response==${error}`);
            alert("Party Ambassador Already Registered!");
            return false;
          }
          
          else if(error.response.status === 403){
            console.log(`response==${error}`);
            alert("Wallet Address is already registered!");
            return false;
          }
        })
    }
  ;

  // Register ==================================

  const register = (event) => {
        
        if(validate1()=== false){
            return false;
        }

        let gid = "";

        if(astateid !== ""){
          gid = astateid;
        }

        else{
          gid = cstateid;
        }

        event.preventDefault();
        // User Data
        const user = {
          state_id: gid,
          first_name: fname,
          last_name: lname,
          state: state,
          dob: dob,
          gender: gender,
          email: email,
          password: password,
          wallet_address: wid,
          party_name: partyname
        }

        verifyAdmin(user);
  }

  return (

    <>
    
        <MainNavBar/>
        <div className="main-aregister">
            
            <div className="main-aimage">
                <img src={pambassador} alt="pambassador register"/>
            </div>

            <div className="register-form">

                {/*Registration Step 1*/}
                {regstep ===1 && <form class="form-aregister">
                    <div class="form-group">
                                    <h3>Party Ambassador Registration</h3>
                            </div>
        
                            <div class="form-group">
                                <label for="first_name">First Name</label>
                                <input type="text" class="form-control" id="first_name" placeholder="First Name" value={fname} name="first_name" required onChange = {(e) => setFname(e.target.value)}/>
                            </div>
        
                            <div class="form-group">
                                <label for="last_name">Last Name</label>
                                <input type="text" class="form-control" id="last_name" placeholder="Last Name" value={lname} name="last_name" required onChange = {(e) => setLname(e.target.value)}/>
                            </div>
        
                            <div class="form-group">
                                <label for="wallet_id">Wallet ID</label>
                                <input type="text" class="form-control" id="wallet_id" placeholder="Wallet ID" value={wid} name="wallet_id" required onChange = {(e) => setWid(e.target.value)}/>
                            </div>

                            <div class="form-group">
                                <label for="party_name">Party Name</label>
                                <input type="text" class="form-control" id="party_name" placeholder="Party Name" value={partyname} name="party_name" required onChange = {(e) => setPartyname(e.target.value)}/>
                            </div>
        
                            <div class="form-group">
                                <label for="email">Email</label>
                                <input type="email" class="form-control" id="email" placeholder="Email" value={email} name="email" required onChange = {(e) => setEmail(e.target.value)}/>
                            </div>

                            <div class="form-group">
                                <label for="password">Password</label>
                                <input type="password" class="form-control" id="password" placeholder="Password" value={password} name="password" required onChange = {(e) => setPassword(e.target.value)}/>
                            </div>

                            <div class="form-group gender">

                            <label for="gender">Gender:</label>
                        
                            <div class="form-check form-check-inline male">
                                <input class="form-check-input" type="radio" name="gender" id="male" value="Male" checked="checked" onClick = {() => setGender("Male")}/>
                                <label class="form-check-label" for="male">Male</label>
                            </div>

                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" name="gender" id="female" value="Female" onClick = {() => setGender("Female")}/>
                                <label class="form-check-label" for="female">Female</label>
                            </div>
                        
                            </div>

                            <div class="form-group">
                            <label for="date_of_birth">Date Of Birth</label>
                            <input type="date" class="form-control" id="date_of_birth" name="date_of_birth" onChange = {(e) => setDob(e.target.value)}/>
                            </div>
        
                            { state === "AZ" && <div class="form-group select">
                            <label for="wallet_id">Select your State</label>
                            <select class="form-select" aria-label="Default select example" required onChange = {(e) => setState(e.target.value)}>
                                <option selected value="AZ">Arizona</option>
                            </select>
                            </div>}

                            { state === "CA" && <div class="form-group select">
                            <label for="wallet_id">Select your State</label>
                            <select class="form-select" aria-label="Default select example" required onChange = {(e) => setState(e.target.value)}>
                                <option value="Arizona">Arizona</option>
                                <option selected value="CA">California</option>
                            </select>
                            </div>}
        
                            {state==='AZ' &&
                            <div class="form-group">
                                <label for="asid">Arizona State ID</label>
                                <input type="text" class="form-control" id="asid" placeholder="Arizona State ID" name="asid" onChange = {(e) => setAstateid(e.target.value)} required/>
                            </div>
                            }
        
        
                            {state==='California' &&
                            <div class="form-group">
                                <label for="csid">California State ID</label>
                                <input type="text" class="form-control" id="csid" placeholder="California State ID" name="csid" required onChange = {(e) => setCstateid(e.target.value)}/>
                            </div>
                            }
        
                            <button type="button" class="btn btn-success submit-btn" onClick = {register}>Register</button>
                            
                </form>}
            </div>
        
        </div>
        <Footer/>
    </>
  )
}

export default PARegister