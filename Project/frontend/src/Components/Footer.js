import React from 'react'

// Styles ===========================
import './StylesComponents/Footer.css'

const Footer = () => {
    const landingURL = "http://localhost:3000/";
  return (
    <div className="footer">
        <div className='text-center p-4 content' style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
            <p>© 2020 Copyright 
                <a className='text-white' href={landingURL}>
                     Choice
                </a>
            </p> 
       </div>
    </div>
  )
}

export default Footer