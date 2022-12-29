import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';

// Components ====================================
import AdminSideBar from '../../Components/AdminSideBar';

// Styles =======================================
import './Styles/AdminProfile.css'



//======================================== Component ======================================

const AdminProfile = () => {

  // Main Urls
  let localurlf = "http://localhost:3000/";
  let localurlb = "http://localhost:8000/";

  // States ========================================
  const [user, setUser] = useState('');
  const [success, setSuccess] = useState(false);

  // Functions ======================================

  useEffect(()=>{

    const getUser = async() => {

        // Obtain admin_email from the local storage
        const admin_email = localStorage.getItem('admin_email');

        // Check if the local storage variable is empty or not, if not send admin to login page
        if(admin_email == null){
            window.location = localurlf.concat("login/admin");
        }
        
        // Admin email to be sent to the backend to obtain admin information for profile
        const user_send = {
            email: admin_email
        }

        // Calling API for Admin Information
        await axios.post(localurlb.concat("system/profileadmin"), user_send)
          .then(res=>{
            console.log(res.data[0]);
            setUser(res.data[0]);
            setSuccess(true);
            localStorage.setItem('admin_email', admin_email);
            
        }).catch(error=>{
     
          if(error.response.status === 400 || error.response.status === 500 ){
            console.log(`response==${error}`);
            alert("System Error! Please Login Again!");
            localStorage.removeItem('admin_email');
            window.location = localurlf.concat("login/admin");
          }
        })
    }

    getUser();

  }, [])

  
  return (

    <>
    
        {success == true && <><AdminSideBar/>

        <div class="amainp">
        
            <div class="aheading">
                <h3>Profile</h3>
            </div>
            
            <div class="aprofile-data">
                <p>Full Name: <span>{user.first_name + " " + user.last_name}</span></p>
                <p>State ID: <span>{user.state_id}</span></p>
                <p>State: <span>{user.state}</span></p>
                <p>Gender: <span>{user.gender}</span></p>
                <p>Date of Birth: <span>{user.dob}</span></p>
                <p>Email: <span>{user.email}</span></p>
                <p>Wallet Address: <span>{user.wallet_address}</span></p>
                <p>Wallet Private Key: <span>{user.wallet_address_pk}</span></p>
                <p>Voter Registration Transaction Receipt: <span>{user.tx_receipt}</span></p>
            </div>
        
        </div></>}

    </>
  )
}

export default AdminProfile