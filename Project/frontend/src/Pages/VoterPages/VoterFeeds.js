import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';

// Components ====================================
import VoterSideBar from '../../Components/VoterSideBar';

// Styles =======================================
import './Styles/VoterFeeds.css'



//======================================== Component ======================================

const VoterFeeds = () => {

  // Main Urls
  let localurlf = "http://localhost:3000/";
  let localurlb = "http://localhost:8000/";

  // States ========================================
  const [success, setSuccess] = useState(false)
  const [feeds, setFeeds] = useState('');
  const [heading, setHeading] = useState('');
  const [description, setDescription] = useState('');
  const [widpk, setWidpk] = useState('');
  

  // Functions ======================================

  useEffect(()=>{

    const getCampaigns = async() => {

        // Obtain voter_email from the local storage
        const voter_email = localStorage.getItem('voter_email');

        // Check if the local storage variable is empty or not, if not send party_ambassador to login page
        if(voter_email === null){
            window.location = localurlf.concat("login/voter");
        }
        
        // Party_ambassador email to be sent to the backend to obtain admin information for profile
        const user_send = {
            email: voter_email 
        }

        // Calling API for party_ambassador Information
        await axios.post(localurlb.concat("system/campaignsvoter"), user_send)
          .then(res=>{
            console.log(res.data);
            setFeeds(res.data);
            if(Object.keys(res.data).length !== 0){
                setSuccess(true);
            }
            
        }).catch(error=>{
     
          if(error.response.status === 500 ){
            console.log(`response==${error}`);
            alert("System Error!");
          }

          else if(error.response.status === 400){
            console.log(`response==${error}`);
            alert("Serializer Error on Server!");
          }
        })
    }

    getCampaigns();
    

  }, [0])
  
  return (

    <>
    
        <VoterSideBar/>

        <div className="apmainp">
        
            <div className="apheading">
                <h3>Feeds</h3>
            </div>
            
            <div className="approfile-data">

                {/* Show create button on loading of the page*/}
                {success === true && 
                    
                    <>
                    <div className="cards">
                        {success === true && feeds.map(feed => {
                            return(
                                (new Date(feed.expire_date).getTime() >= new Date().getTime()) && <div className="card" >
                                    {feed.image !== "" && <img class="card-img-top" src={"data:image/jpeg;base64, " + feed.image} alt="Card image cap"></img>}
                                    <div className="card-body">
                                        <h5 className="card-title">{feed.heading}</h5><br/>   
                                        <p>{feed.description}</p>
                                        <p><b>Created By: </b>{feed.campaign_creator}</p>
                                    </div>                                    
                                </div>
                            );
                        })}
                    </div>

                    </>
                }
            </div>
        
        </div>

    </>
  )
}

export default VoterFeeds