import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';

// Components ====================================
import VoterSideBar from '../../Components/VoterSideBar';

// Styles =======================================
import './Styles/VoterPolls.css'



//======================================== Component ======================================

const VoterPolls = () => {

  // Main Urls
  let localurlf = "http://localhost:3000/";
  let localurlb = "http://localhost:8000/";

  // States ========================================
  const [success, setSuccess] = useState(false)
  const [polls, setPolls] = useState();

  const [selectc, setSelectc] = useState(-1);
  const [selectpoll, setSelectpolls] = useState("");

  // Variables ===================================== 
  const currentDate = new Date();
  

  // Functions ======================================

  useEffect(()=>{

    const getPolls = async() => {

        // Obtain voter_email from the local storage
        const voter_email = localStorage.getItem('voter_email');

        // Check if the local storage variable is empty or not, if not send admin to login page
        if(voter_email === null){
            window.location = localurlf.concat("login/voter");
        }
        
        // Admin email to be sent to the backend to obtain admin information for profile
        const user_send = {
            email: voter_email 
        }

        // Calling API for Admin Information
        await axios.post(localurlb.concat("system/pollsvoter"), user_send)
          .then(res=>{
            console.log(res.data);
            setPolls(res.data);
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

    getPolls();
    

  }, [0])

  // Cast Vote
  const submitVote = (candidate_state_id, poll_name, state) => {
    
    const data = {
        voter_email: localStorage.getItem('voter_email'),
        candidate_state_id: candidate_state_id,
        poll_name: poll_name,
        state: state
    }

    axios.post(localurlb.concat("system/castvote"), data)
          .then(res=>{
            console.log(`response==${res}`)
            window.location = localurlf.concat("voter/polls");
            
        }).catch(error=>{

          if(error.response.status === 500){
            console.log(`response==${error}`);
            alert("Could Not Submit Vote! Server Error");
            return false;
          }
          
        })
  }
  
  return (

    <>
    
        <VoterSideBar/>

        <div className="apmainp">
        
            <div className="apheading">
                <h3>Polls</h3>
            </div>
            
            <div className="approfile-data">

                {/* Show all polls*/}
                {success === true && 
                    <>
                    <div className="cards">
                        {polls.map(poll => {
                            return(
                                selectpoll === "" && ((new Date(poll.expire_date).getTime() >= new Date().getTime()) || poll.poll_published) &&
                                <div className="card" >
                                    <div className="card-body">
                                        <h5 className="card-title">{poll.poll_name}</h5><br/>   
                                        <p><b>State : </b>{poll.state}</p>
                                        <p><b>Total Votes : </b>{poll.total_votes}</p>
                                        <p><b>Created Date : </b>{poll.created_date}</p>
                                        <p><b>Expire Date : </b>{poll.expire_date}</p>
                                        <p><b className="red">{!poll.poll_published && !poll.voter_can_vote && "You have already voted!"} </b></p>
                                        <p><b className="green">{poll.poll_published &&  "Poll has been Published!"} </b></p>
                                        {!poll.poll_published && poll.voter_can_vote && <input type="button" value="Vote" className="btn btn-success" onClick={() => setSelectpolls(poll.poll_name)}/>}
                                    </div>

                                    <ul class="list-group list-group-flush">

                                        {poll.candidates.map((x, i) => {

                                            return(
                                                <li class="list-group-item">
                                                    <h5>Candidate {i+1}</h5>
                                                    <p></p>
                                                    <p><b>Name : </b>{x.candidate_first_name + " " + x.candidate_last_name}</p>
                                                    <p><b>Gender : </b>{x.candidate_gender}</p>
                                                    <p><b>Party: </b>{x.candidate_party_name}</p>
                                                    {poll.poll_published && <p><b>Votes: </b>{x.candidate_votes}</p>}
                                                </li>
                                            );
                                        })}
                                        
                                    </ul>
                                </div>
                            );
                        })}

                        {polls.map(poll => {
                            return(<>

                                {selectpoll === poll.poll_name &&
                                <div className="card" >
                                    <div className="card-body">
                                        <h5 className="card-title">{poll.poll_name}</h5><br/>   
                                        <p><b>State : </b>{poll.state}</p>
                                        <p><b>Total Votes : </b>{poll.total_votes}</p>
                                        <p><b>Created Date : </b>{poll.created_date}</p>
                                        <p><b>Expire Date : </b>{poll.expire_date}</p>
                                        <p><b className="red">{!poll.voter_can_vote && "You have already voted!"} </b></p>
                                        {poll.voter_can_vote && selectc === -1 &&  <input type="button" value="Cancel" className="btn btn-danger" onClick={() => setSelectpolls("")}/>}
                                    </div>

                                    <ul class="list-group list-group-flush">

                                        {poll.candidates.map((x, i) => {

                                            return(
                                                <li class="list-group-item">
                                                    <h5>Candidate {i+1}</h5>
                                                    <p></p>
                                                    <p><b>Name : </b>{x.candidate_first_name + " " + x.candidate_last_name}</p>
                                                    <p><b>Gender : </b>{x.candidate_gender}</p>
                                                    <p><b>Party: </b>{x.candidate_party_name}</p>
                                                    {poll.voter_can_vote && selectc === -1 && <input type="button" value="Vote" className="btn btn-success" onClick={() => setSelectc(i)}/>}
                                                    {poll.voter_can_vote && selectc === i && 
                                                    <>
                                                    <input type="button" value="Confirm Vote" className="btn btn-success" onClick={() => submitVote(x.candidate_state_id, poll.poll_name, poll.state)}/>
                                                    <input type="button" value="Cancel" className="btn btn-danger mover" onClick={() => setSelectc(-1)}/>
                                                    </>}
                                                </li>
                                            );
                                        })}
                                        
                                    </ul>
                                    
                                </div>
                                }
                            </>
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

export default VoterPolls