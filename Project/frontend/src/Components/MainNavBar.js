import React from 'react';
import {Link} from 'react-router-dom'

// Styles ===============================
import './StylesComponents/MainNavBar.css'

const MainNavBar = () => {

const landingURL = "http://localhost:3000/";

  return (

        <nav className="navbar navbar-dark navbar-expand-lg bg-dark">
            <div className="container-fluid container">
                <a className="navbar-brand" href={landingURL}>Choice</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div className="navbar-nav shift-right">
                    <Link className="nav-link" to = "/login">Login</Link>
                    <Link className="nav-link" to = "/register">Register</Link>
                </div>
                </div>
            </div>
        </nav>

  )

}

export default MainNavBar;