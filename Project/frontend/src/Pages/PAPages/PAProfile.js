import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';

// Components ====================================
import PASideBar from '../../Components/PASideBar';

// Styles =======================================
import './Styles/PAProfile.css'

//======================================== Component ======================================

const PAProfile = () => {

  // Main Urls
  let localurlf = "http://localhost:3000/";
  let localurlb = "http://localhost:8000/";

  // States ========================================
  const [user, setUser] = useState('');
  const [success, setSuccess] = useState(false);

  // Functions ======================================

  useEffect(()=>{

    const getUser = async() => {

        // Obtain party_ambassador_email from the local storage
        const party_ambassador_email = localStorage.getItem('party_ambassador_email');

        // Check if the local storage variable is empty or not, if not send voter to login page
        if(party_ambassador_email == null){
            window.location = localurlf.concat("login/partyambassador");
        }
        
        // Voter email to be sent to the backend to obtain voter information for profile
        const user_send = {
            email: party_ambassador_email
        }

        // Calling API for Voter Information
        await axios.post(localurlb.concat("system/profilepartyambassador"), user_send)
          .then(res=>{
            console.log(res.data[0]);
            setUser(res.data[0]);
            setSuccess(true);
            localStorage.setItem('party_ambassador_email', party_ambassador_email);
            
        }).catch(error=>{
     
          if(error.response.status === 400 || error.response.status === 500 ){
            console.log(`response==${error}`);
            alert("System Error! Please Login Again!");
            localStorage.removeItem('party_ambassador_email');
            window.location = localurlf.concat("login/partyambassador");
          }
        })
    }

    getUser();

  }, [])

  
  return (

    <>
    
        {success == true && <><PASideBar/>

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
                <p>Party Name: <span>{user.party_name}</span></p>
            </div>
        
        </div></>}

    </>
  )
}

export default PAProfile