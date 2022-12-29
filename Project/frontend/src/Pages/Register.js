import React from 'react'
import {Link} from 'react-router-dom'

// Components ====================================
import MainNavBar from '../Components/MainNavBar'
import Footer from '../Components/Footer';

// Styles =======================================
import './StylesPages/Register.css'

// Images ========================================
import voter from '../images/voterr.jpg';
import pambassador from '../images/party-ambassadorr.jpg';
import admin from '../images/adminr.jpg';


const Register = () => {
  
    return (

        <>
            <MainNavBar/>

            <div class="main-heading">
                <h2>Select Your Registration Panel</h2>
            </div>

            <div class="main-login">

                <div class="login-card">
                    <Link className="nav-link" to = "/register/voter"><img src={voter} alt="voter"/></Link>
                    <h3>Voter Registration</h3>
                </div>

                <div class="login-card">
                    <Link className="nav-link" to = "/register/partyambassador"><img src={pambassador} alt="party-ambassador"/></Link>
                    <h3>Party Ambassador Registration</h3>
                </div>

                <div class="login-card">
                    <Link className="nav-link" to = "/register/admin"><img src={admin} alt="admin"/></Link>
                    <h3>Admin Registration</h3>
                </div>
            </div>
        
        </>
        

    )
}

export default Register