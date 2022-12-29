import React from 'react'
import { useState } from 'react';
import axios from 'axios';

// Components ====================================
import MainNavBar from '../../Components/MainNavBar';
import Footer from '../../Components/Footer';

// Styles =======================================
import './Styles/VoterLogin.css'

// Images ========================================
import voter from '../../images/voter.jpg';

//======================================== Component ======================================
const VoterLogin = () => {

  // Main Urls
  let localurlf = "http://localhost:3000/";
  let localurlb = "http://localhost:8000/";

  // States ========================================
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Functions ======================================

  // -- Test Function
  const check = () => {
    console.log('Email:' + email);
    console.log('Password:' + password);
  }

  // -- Login Function
  const login = async (event) => {

    event.preventDefault();
        // User Data
        const user = {
          email: email,
          password: password,
        }

        console.log(user);

        await axios.post(localurlb.concat("system/loginvoter"), user)
          .then(res=>{
            console.log(`response==${res}`)
            localStorage.setItem('voter_email', email);
            window.location = localurlf.concat("voter/profile");
            
        }).catch(error=>{
          if(error.response.status === 406){
            console.log(`response==${error}`);
            alert("Email or Password is Invalid");
            return false;
          }

          else if(error.response.status === 400){
            console.log(`response==${error}`);
            alert("Voter not Registered");
            return false;
          }
        })
    
  }


  
  return (

    <>
    
        <MainNavBar/>
        <div className="main-aregister">
            
            <div className="main-aimage">
                <img src={voter} alt="voter login"/>
            </div>

            <div className="register-form">
              {<form class="form-aregister" onSubmit = {login}>
                        <div class="form-group">
                                <h3>Voter Login</h3>
                        </div>
      
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" class="form-control" id="email" placeholder="Email" value={email} name="email" required onChange = {(e) => setEmail(e.target.value)}/>
                        </div>

                        <div class="form-group">
                            <label for="password">Password</label>
                            <input type="password" class="form-control" id="password" placeholder="Password" value={password} name="password" required onChange = {(e) => setPassword(e.target.value)}/>
                        </div>
      
                        <button type="submit" class="btn btn-success submit-btn">Login</button>
                        
              </form>}
            </div>
        
        </div>
        <Footer/>
    </>
  )
}

export default VoterLogin