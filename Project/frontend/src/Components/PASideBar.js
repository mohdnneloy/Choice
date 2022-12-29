import React from 'react'
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import CampaignIcon from '@mui/icons-material/Campaign';


// Styles =======================================
import './StylesComponents/PASideBar.css';

const PASideBar = () => {

  // Main Urls
  let localurlf = "http://localhost:3000/";

  // Functions
  const handleLogOut = () => {
    localStorage.removeItem('party_ambassador_email');
    window.location = localurlf.concat("login/partyambassador");
  }

// Return Function
  return (
    <>
        <div className="sidenavp">
                <a href="/">Choice</a>
                <br />
                <a href={localurlf.concat("partyambassador/profile")}><AccountCircleIcon/> Profile</a>
                <a  href={localurlf.concat("partyambassador/campaigns")}><CampaignIcon/> Campaigns</a>
                <div className="bottomp">
                    <button className="btn-act" onClick = {handleLogOut}>Logout</button>
                </div>
        </div>
    </>
  );
}

export default PASideBar