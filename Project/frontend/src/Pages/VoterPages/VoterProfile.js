import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import Moment from 'moment';

// Components ====================================
import VoterSideBar from '../../Components/VoterSideBar';

// Styles =======================================
import './Styles/VoterProfile.css'



//======================================== Component ======================================

const VoterProfile = () => {

  // Main Urls
  let localurlf = "http://localhost:3000/";
  let localurlb = "http://localhost:8000/";

  // States ========================================
  const [user, setUser] = useState('');
  const [success, setSuccess] = useState(false);

  // Functions ======================================

  useEffect(()=>{

    const getUser = async() => {

        // Obtain voter_email from the local storage
        const voter_email = localStorage.getItem('voter_email');

        // Check if the local storage variable is empty or not, if not send voter to login page
        if(voter_email == null){
            window.location = localurlf.concat("login/voter");
        }
        
        // Voter email to be sent to the backend to obtain voter information for profile
        const user_send = {
            email: voter_email
        }

        // Calling API for Voter Information
        await axios.post(localurlb.concat("system/profilevoter"), user_send)
          .then(res=>{
            console.log(res.data[0]);
            setUser(res.data[0]);
            setSuccess(true);
            localStorage.setItem('voter_email', voter_email);
            
        }).catch(error=>{
     
          if(error.response.status === 400 || error.response.status === 500 ){
            console.log(`response==${error}`);
            alert("System Error! Please Login Again!");
            localStorage.removeItem('voter_email');
            window.location = localurlf.concat("login/voter");
          }
        })
    }

    getUser();

  }, [])

  
  return (

    <>
    
        {success == true && <><VoterSideBar/>

        <div class="mainp">
        
            <div class="heading">
                <h3>Profile</h3>
            </div>
            
            <div class="profile-data">
                <p>Full Name: <span>{user.first_name + " " + user.last_name}</span></p>
                <p>State ID: <span>{user.state_id}</span></p>
                <p>State: <span>{user.state}</span></p>
                <p>Gender: <span>{user.gender}</span></p>
                <p>Date of Birth: <span>{user.dob}</span></p>
                <p>Email: <span>{user.email}</span></p>
                <p>Wallet Address: <span>{user.wallet_address}</span></p>
                <p>Voter Registration Transaction Receipt: <span>{user.tx_receipt}</span></p>
            </div>
        
        </div></>}

    </>
  )
}

export default VoterProfile