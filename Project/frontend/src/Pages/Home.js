import React from 'react';

// Components ====================================
import MainNavBar from '../Components/MainNavBar'
import Footer from '../Components/Footer';

// Styles =======================================

import './StylesPages/Home.css'

// Images ========================================
import logo from '../images/online-voting.png';



const Home = () => {
    
    const landingURL = "http://localhost:3000/";
    
    return (
        <>  
            <MainNavBar/>
            <div className="main">  
                <div className="left">
                    <h1>CHOICE</h1>
                    <h3>Vote Online And Earn Rewards!</h3>
                </div>
                <div className='right'>
                    <img src={logo} alt="voting in computer" />
                </div>
            </div>
            <Footer/>
            
            
        </>
    )

}

export default Home;