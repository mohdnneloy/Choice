import React from 'react'
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PollIcon from '@mui/icons-material/Poll';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import InsightsIcon from '@mui/icons-material/Insights';


// Styles =======================================
import './StylesComponents/AdminSideBar.css';

const AdminSideBar = () => {

  // Main Urls
  let localurlf = "http://localhost:3000/";

  // Functions
  const handleLogOut = () => {
    localStorage.removeItem('admin_email');
    window.location = localurlf.concat("login/admin");
  }

  // Return Function
  return (
    <>
        <div className="sidenava">
                <a href="/">Choice</a>
                <br />
                <a href={localurlf.concat("admin/profile")}><AccountCircleIcon/> Profile</a>
                <a href={localurlf.concat("admin/polls")}><PollIcon/> Polls</a>
                <a href={localurlf.concat("admin/publishedpolls")}><InsightsIcon/> Published Polls</a>
                <div className="bottoma">
                    <button className="btn-acta" onClick = {handleLogOut}>Logout</button>
                </div>
        </div>
    </>
  );
}

export default AdminSideBar