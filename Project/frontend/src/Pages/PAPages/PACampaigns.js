import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';

// Components ====================================
import PASideBar from '../../Components/PASideBar';

// Styles =======================================
import './Styles/PACampaigns.css'



//======================================== Component ======================================

const PACampaigns = () => {

  // Main Urls
  let localurlf = "http://localhost:3000/";
  let localurlb = "http://localhost:8000/";

  // States ========================================
  const [success, setSuccess] = useState(false)
  const [createcampaign, setCreatecampaign] = useState(false);
  
  const [campaigns, setCampaigns] = useState('');
  const [campaignexd, setCampaignexd] = useState('');
  const [heading, setHeading] = useState('');
  const [description, setDescription] = useState('');
  const [widpk, setWidpk] = useState('');
  const [pic, setPic] = useState('');

  // Required Global Variables
  let pic_convert = ""
  var date = new Date();
  var nextday = new Date();
  nextday.setDate(nextday.getDate() + 1);

  let no_days = new Date(campaignexd).getTime() - date.getTime()
  no_days = Math.ceil(no_days / (1000 * 3600 * 24));
  

  // Functions ======================================

  useEffect(()=>{

    const getCampaigns = async() => {

        // Obtain party_ambassador_email from the local storage
        const party_ambassador_email = localStorage.getItem('party_ambassador_email');

        // Check if the local storage variable is empty or not, if not send party_ambassador to login page
        if(party_ambassador_email === null){
            window.location = localurlf.concat("login/admin");
        }
        
        // Party_ambassador email to be sent to the backend to obtain admin information for profile
        const user_send = {
            email: party_ambassador_email 
        }

        // Calling API for party_ambassador Information
        await axios.post(localurlb.concat("system/campaignspa"), user_send)
          .then(res=>{
            console.log(res.data);
            setCampaigns(res.data);
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

  // Check data 
  const check = (event) => {
    event.preventDefault()
    if(validate1() === false){
        return false;
    }
    console.log(heading);
    console.log(description);
    console.log(pic);
    console.log(pic_convert);
  }

  // -- Campaign creation reset
  const reset = (event) =>{
    
    setHeading("");
    setDescription("");
    setCreatecampaign(false);
    return false;
    
  }

  // -- Form Validator
  const validate1 = () => {
    
    // Campaign Heading Check
    if(heading.match(/^([^]{10,50})$/) === null){
        alert("Campaign heading should be within 10-50 characters!");
        return false;
    }
  
    // Campaign Heading Check
    if(description.match(/^([^]{10,500})$/) === null){
        alert("Campaign Description should be within 20-500 characters and cannot have special characters in it!");
        return false;
    }

    // Pic
    if(pic_convert === ""){
        alert("Wait until upload is complete! Or Reupload File!");
        return false;
    }

    // Expire Date Checks
    if(campaignexd === ""){
      alert("Enter Poll Expiry Date!");
      return false;
  }

  }

  // Register Poll
  const createCampaign = (event) => {

    event.preventDefault();
    
    pic.then(value => {

      pic_convert = value;

      console.log(pic_convert);
      const data = {
        campaign_heading: heading,
        campaign_description: description,
        campaignexd: campaignexd,
        campaigneno_days: no_days,
        wallet_address_pk: widpk,
        image: pic_convert,
        email: localStorage.getItem('party_ambassador_email')    
      }

      if(validate1() === false){
        return false;
      }

      if(pic_convert === ""){
        alert("Wait until upload is complete! Or Reupload File!");
        return false;
      }

      console.log(data);

      axios.post(localurlb.concat("system/createcampaign"), data)
          .then(res=>{
            console.log(`response==${res}`)
            window.location = localurlf.concat("partyambassador/campaigns");
            
        }).catch(error=>{

          if(error.response.status === 406){
            console.log(`response==${error}`);
            alert("Couldn't create campaign! Server Problem!");
            return false;
          }

          else if(error.response.status === 403){
            console.log(`response==${error}`);
            alert("Entered Private Key is Invalid! Please enter the Private Key of your Wallet ID");
            return false;
          }
          
        })

    })

  }

  // File to base64 format convertor
  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  
  return (

    <>
    
        <PASideBar/>

        <div className="apmainp">
        
            <div className="apheading">
                <h3>Campaigns</h3>
            </div>
            
            <div className="approfile-data">

                {/* Show create button on loading of the page*/}
                {createcampaign === false && 
                    
                    <>
                    <button className="btn btn-success" onClick={() => setCreatecampaign(true)}>Create Campaign</button>
                    <div className="cards">
                        {success === true && campaigns.map(campaign => {
                            return(
                                <div className="card" >
                                    <div className="card-body">
                                        <h5 className="card-title">{campaign.heading}</h5><br/>   
                                        <p><b>Create Date : </b>{campaign.create_date}</p>
                                        <p><b>Expire Date : </b>{campaign.expire_date}</p>
                                        <p><b>State : </b>{campaign.state}</p>
                                        <p><b>Transaction ID : </b>{campaign.tx_receipt}</p>
                                        <p><b className="red">{(new Date(campaign.expire_date).getTime() <= new Date().getTime())  && "Your Campaign has Expired!"} </b></p>
                                    </div>
                                    <ul class="list-group list-group-flush">
                                        <li class="list-group-item">
                                        {campaign.image !== "" && <img class="card-img-top" src={"data:image/jpeg;base64, " + campaign.image} alt="Card image cap"></img>}
                                                <h5>{campaign.heading}</h5>
                                                <p>{campaign.description}</p>  
                                        </li>
                                    </ul>
                                    
                                </div>
                            );
                        })}
                    </div>

                    </>
                }
                
                {createcampaign == true && <form className="form-aregister">
                    {createcampaign == true &&
                    
                    <>
                        <div className="form-group">
                            <h3>New Campaign</h3>
                            
                        </div>

                        <div className="form-group">
                            <label for="campaign_heading">Campaign_heading Heading</label>
                            <input type="text" className="form-control" id="campaign_heading" placeholder="Campaign Heading" value={heading} name="campaign_heading" required onChange = {(e) => setHeading(e.target.value)}/>
                        </div>
                        
                        <div className="form-group">
                            <label for="campaign_description">Campaign Description</label>
                            <input type="text" className="form-control" id="campaign_description" placeholder="Campaign Description" value={description} name="campaign_description" required onChange = {(e) => setDescription(e.target.value)}/>
                        </div>

                        <div class="form-group">
                            <label for="wallet_id_pk">Wallet Private Key</label>
                            <input type="text" class="form-control" id="wallet_id_pk" placeholder="Wallet Private Key" value={widpk} name="wallet_id_pk" required onChange = {(e) => setWidpk(e.target.value)}/>
                        </div>

                        <label class="form-label" for="customFile">Upload Image</label>
                        <input type="file" accept="image/jpeg" class="form-control" id="customFile" onChange = {(e) => setPic(getBase64(e.target.files[0]))}/>

                        <div class="form-group">
                          <label for="campaignexd">Campaign Expiry Date</label>
                          <input type="date" class="form-control" id="campaignexd" value= {campaignexd} name="campaignexd" min={nextday.toISOString().split('T')[0]} onChange = {(e) => setCampaignexd(e.target.value)}/>
                        </div>

                        {campaignexd == "" && <><p className='move'></p></>}

                        {campaignexd != "" && <><p className='move'>Note: Your Campaign will run for {no_days} days only! Total cost {no_days * 0.025} Ether!</p></>}

                        <button className="btn btn-success" onClick={createCampaign}>Create Campaign</button>
                        <button className="btn btn-danger mover" onClick={reset}>Cancel</button>
                    </>}
                </form>}
            </div>
        
        </div>

    </>
  )
}

export default PACampaigns