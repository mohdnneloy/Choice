import React from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PollIcon from '@mui/icons-material/Poll';
import CampaignIcon from '@mui/icons-material/Campaign';
import FeedIcon from '@mui/icons-material/Feed';
import InsightsIcon from '@mui/icons-material/Insights';


// Styles =======================================
import './StylesComponents/VoterSideBar.css';

const VoterSideBar = () => {

  // Main Urls
  let localurlf = "http://localhost:3000/";

  // Functions
  const handleLogOut = () => {
    localStorage.removeItem('voter_email');
    window.location = localurlf.concat("login/voter");
  }

  // Return Function
    return (
      <>
          <div className="sidenav">
                  <a href="/">Choice</a>
                  <br />
                  <a href={localurlf.concat("voter/profile")}><AccountCircleIcon/> Profile</a>
                  <a href={localurlf.concat("voter/polls")}><PollIcon/> Polls</a>
                  <a href={localurlf.concat("voter/feeds")}><FeedIcon/> Feeds</a>
                  <a href={localurlf.concat("voter/publishedpolls")}><InsightsIcon/> Published Polls</a>
                  <div className="bottom">
                      <button className="btn-act" onClick = {handleLogOut}>Logout</button>
                  </div>
          </div>
      </>
    );
}

export default VoterSideBar