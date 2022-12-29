import React from 'react'
import {Link} from 'react-router-dom'

// Components ====================================
import MainNavBar from '../Components/MainNavBar'
import Footer from '../Components/Footer';

// Styles =======================================
import './StylesPages/Login.css'

// Images ========================================
import voter from '../images/voter.jpg';
import pambassador from '../images/party-ambassador.jpg';
import admin from '../images/admin.jpg';


const Login = () => {
  
    // const localURL = 'http://localhost:3000/';
    return (

        <>
            <MainNavBar/>

            <div class="main-heading">
                <h2>Select Your Login Panel</h2>
            </div>

            <div class="main-login">

                <div class="login-card">
                    {/* <Link className="nav-link" to = "/login/voter"><img src={voter} alt="voter"/></Link> */}
                    <Link className="nav-link" to = "/login/voter"><img src={voter} alt="voter"/></Link>
                    <h3>Voter Login</h3>
                </div>

                <div class="login-card">
                    <Link className="nav-link" to = "/login/partyambassador"><img src={pambassador} alt="partyambassador"/></Link>
                    <h3>Party Ambassador Login</h3>
                </div>

                <div class="login-card">
                    <Link className="nav-link" to = "/login/admin"><img src={admin} alt="admin"/></Link>
                    <h3>Admin Login</h3>
                </div>
            </div>
        
        </>
        

    )
}

export default Login