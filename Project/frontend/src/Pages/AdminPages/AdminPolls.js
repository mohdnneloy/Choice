import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';

// Components ====================================
import AdminSideBar from '../../Components/AdminSideBar';

// Styles =======================================
import './Styles/AdminPolls.css'



//======================================== Component ======================================

const AdminPolls = () => {

  // Main Urls
  let localurlf = "http://localhost:3000/";
  let localurlb = "http://localhost:8000/";

  // States ========================================
  const [steps, setSteps] = useState(1);
  const [success, setSuccess] = useState(false)
  const [createpoll, setCreatePoll] = useState(false);
  
  const [pollname, setPollname] = useState('');
  const [pollexd, setPollexd] = useState('');

  const [polls, setPolls] = useState();

  const [candidates, setCandidates] = useState([{first_name: "", last_name: "", gender: "Male", state_id: "", party_name: ""}]);

  // Extra Variables
  var date = new Date();
  var nextday = new Date();
  nextday.setDate(nextday.getDate() + 1);

  // Functions ======================================

  useEffect(()=>{

    const getPolls = async() => {

        // Obtain admin_email from the local storage
        const admin_email = localStorage.getItem('admin_email');

        // Check if the local storage variable is empty or not, if not send admin to login page
        if(admin_email === null){
            window.location = localurlf.concat("login/admin");
        }
        
        // Admin email to be sent to the backend to obtain admin information for profile
        const user_send = {
            email: admin_email 
        }

        // Calling API for Admin Information
        await axios.post(localurlb.concat("system/pollsadmin"), user_send)
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

  // -- Poll creation Step Up function
  const regup = (event) => {
    event.preventDefault();
    if(steps <= 1){
        setSteps(steps + 1) ;
        console.log(steps);
    }
    
  }

  // -- Poll creation Step Down function
  const regdown = (event) => {
    event.preventDefault();
    if(steps>1){
        setSteps(steps - 1) ;
        console.log(steps);
    }
    
  }

  // -- Poll creation reset
  const reset = (event) =>{
    event.preventDefault();
    setSteps(1);
    setCreatePoll(false);
    setPollname("");
    setCandidates([{first_name: "", last_name: "", gender: "Male", state_id: "", party_name: ""}]);
    setPollexd("");
  }

  // -- Form Validator
  const validate1 = () => {
    
    // Poll Name Check
    if(pollname.match(/^([a-zA-Z0-9 ]{5,50})$/) === null || pollname.match(/[^a-zA-Z0-9 ]/) !== null){
        alert("Poll Name should be within 5-50 characters and cannot have special characters in it!");
        return false;
    }

    // Poll Expiry Date Check
    if(pollexd === ""){
        alert("Enter Poll Expiry Date!");
        return false;
    }

    // Candidate Details Check
    for (var i = 0; i < candidates.length; i++){

        // First Name Checks
        if(candidates[i].first_name.match(/^([a-zA-Z ]{2,30})$/) === null || candidates[i].first_name.match(/[^a-zA-Z ]/) !== null){
            alert("Candidate " + (i+1) + "'s First Name should be within 2-30 characters and cannot have numbers or special characters in it!");
            return false;
            break;
        }
    
        // Last Name Checks
        if(candidates[i].last_name.match(/^([a-zA-Z]{2,15})/) === null || candidates[i].last_name.match(/[^a-zA-Z]/) !== null){
            alert("Candidate " + (i+1) + "'s Last Name should be within 2-15 characters and cannot have numbers or special characters in it!");
            return false;
            break;
        }

        // Gender Checks
        if(candidates[i].gender === ""){
            alert("Candidate " + (i+1) + "'s Gender not Selected!");
            return false;
            break;
        }

        // State ID Check
        if(candidates[i].state_id !== "" && candidates[i].state_id.match(/^([a-zA-Z]{1})([0-9]{8})$/) === null){
          alert("Candidate " + (i+1) + "'s Invalid Arizona State ID!");
          return false;
          break;
        }

        // Party Name Checks
        if(candidates[i].party_name === ""){
            alert("Please enter Candidate " + (i+1) + "'s Party Name!");
            return false;
            break;
        }
    }

    if(candidates.length < 2){
        alert("A poll should have atleast 2 candidates! Add another Candidate!");
        return false;
    }
  }

  // Register Poll
  const registerPoll = (event) => {

    event.preventDefault();
    let check = validate1();

    if(check === false){
        return false;
    }

    let no_days = new Date(pollexd).getTime() - date.getTime()
    no_days = Math.ceil(no_days / (1000 * 3600 * 24));
    
    const data = {
        poll_name: pollname,
        pollexd: pollexd,
        polleno_days: no_days,
        email: localStorage.getItem('admin_email'),
        candidates: candidates 
    }

    axios.post(localurlb.concat("system/createpoll"), data)
          .then(res=>{
            console.log(`response==${res}`)
            window.location = localurlf.concat("admin/polls");
            
        }).catch(error=>{

          if(error.response.status === 406){
            console.log(`response==${error}`);
            alert("Couldn't register Poll! Server Problem!");
            return false;
          }
          
          else if(error.response.status === 403){
            console.log(`response==${error}`);
            alert("Poll already exists!");
            return false;
          }

          else if(error.response.status === 400){
            console.log(`response==${error}`);
            alert("Couldn't register Candidate! Server Problem!");
            return false;
          }
        })

    console.log(data);
  }

  const pollPublish = (poll_name_send) => {
    
    const data = {
        poll_name: poll_name_send,
        email: localStorage.getItem('admin_email')
    }

    axios.post(localurlb.concat("system/pollpublish"), data)
          .then(res=>{
            console.log(`response==${res}`)
            window.location = localurlf.concat("admin/polls");
            
        }).catch(error=>{

          if(error.response.status === 406){
            console.log(`response==${error}`);
            alert("Couldn't register Poll! Server Problem!");
            return false;
          }
          
        })

    console.log(data);
  }

  // Dynamic Candidates Functions =============================

  // handle input change
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...candidates];
    list[index][name] = value;
    setCandidates(list);
  };

  // handle input change for radio button
  const handleRadioInputChange = (e, index, nameg) => {
    const { name, value } = e.target;
    const list = [...candidates];
    list[index][nameg] = value;
    setCandidates(list);
  };
   
  // handle click event of the Remove button
  const handleRemoveClick = index => {
    const list = [...candidates];
    list.splice(index, 1);
    setCandidates(list);
  };
   
  // handle click event of the Add button
  const handleAddClick = () => {
    setCandidates([...candidates, {first_name: "", last_name: "", gender: "Male", state_id: "", party_name: ""}]);
  };


  return (

    <>
    
        <AdminSideBar/>

        <div className="apmainp">
        
            <div className="apheading">
                <h3>Polls</h3>
            </div>
            
            <div className="approfile-data">

                {/* Show create button on loading of the page*/}
                {createpoll === false && 
                    
                    <>
                    <button className="btn btn-success" onClick={() => setCreatePoll(true)}>Create New Poll</button>
                    <div className="cards-p">
                        {success === true && polls.map(poll => {
                            return(
                                <div className="card" >
                                    <div className="card-body">
                                        <h5 className="card-title">{poll.poll_name}</h5><br/>   
                                        <p><b>State : </b>{poll.state}</p>
                                        <p><b>Total Votes : </b>{poll.total_votes}</p>
                                        <p><b>Created Date : </b>{poll.created_date}</p>
                                        <p><b>Expire Date : </b>{poll.expire_date}</p>
                                        <p><b className="red">{(new Date(poll.expire_date).getTime() <= new Date().getTime()) && "Poll has expired!"} </b></p>
                                        <p><b className="green">{poll.poll_published &&  "Poll has been Published!"} </b></p>
                                        {!poll.poll_published && (new Date(poll.expire_date).getTime() >= new Date().getTime()) && <input type="button" value="Publish Results" className="btn btn-success" onClick={() => pollPublish(poll.poll_name)}/>}
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
                                                    <p><b>State ID : </b>{x.candidate_state_id}</p>
                                                    <p><b>Registration Tx Receipt: </b>{x.candidate_tx_receipt}</p>
                                                    <p><b>Votes: </b>{x.candidate_votes}</p>
                                                </li>
                                            );
                                        })}
                                        
                                    </ul>
                                    
                                </div>
                            );
                        })}
                    </div>

                    </>
                }
                
                {createpoll == true && <form>
                    {/* Show when creating a new poll Step 1*/}
                    {createpoll == true && steps == 1 &&
                    
                    <>
                    <div className="form-aregister">
                        <div className="form-group">
                            <h3>New Poll</h3>
                        </div>

                        <div className="form-group">
                            <label for="poll_name">Poll Name</label>
                            <input type="text" className="form-control" id="poll_name" placeholder="Poll Name" value={pollname} name="poll_name" required onChange = {(e) => setPollname(e.target.value)}/>
                        </div>

                        <div class="form-group">
                        <label for="pollexd">Poll Expiry Date</label>
                        <input type="date" class="form-control" id="pollexd" value= {pollexd} name="pollexd" min={nextday.toISOString().split('T')[0]} onChange = {(e) => setPollexd(e.target.value)}/>
                        </div>
                        
                        <button className="btn btn-danger move" onClick={reset}>Cancel</button>
                        <button className="btn btn-success move mover" onClick={regup}>Next</button>
                    </div>
                    </>
                    
                    }

                    {/* Show when creating a new candidate 1*/}
                    {createpoll == true && steps == 2 &&

                    <>
                    <div className="form-aregister">
                        <div className="form-group">
                            <h3>Candidates</h3>
                        </div>
                        {candidates.map((x, i) => {
                            return (
                            <>
                            <div className="box">
                                <h5>Candidate {i+1}</h5>
                                <div className="form-group">
                                    <label for="first_name">First Name</label>
                                    <input type="text" className="form-control" id="first_name" placeholder="First Name" value={x.first_name} name="first_name" onChange={e => handleInputChange(e, i)} required />
                                </div>

                                <div className="form-group">
                                    <label for="last_name">Last Name</label>
                                    <input type="text" className="form-control" id="last_name" placeholder="Last Name" value={x.last_name} name="last_name" onChange={e => handleInputChange(e, i)} required/>
                                </div>

                                <div className="form-group gender">

                                    <label for="gender">Gender:</label>
                                    
                                    <div className="form-check form-check-inline male">
                                        <input className="form-check-input" type="radio" name={`${"candidategender"}-${i+1}`} id="male" value="Male" checked={x.gender == "Male"} onChange={e => handleRadioInputChange(e, i, "gender")}/>
                                        <label className="form-check-label" for="male">Male</label>
                                    </div>

                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name={`${"candidategender"}-${i+1}`} id="female" value="Female" checked={x.gender == "Female"} onChange={e => handleRadioInputChange(e, i, "gender")}/>
                                        <label className="form-check-label" for="female">Female</label>
                                    </div>
                                    
                                </div>

                                <div className="form-group">
                                    <label for="asid">Arizona State ID</label>
                                    <input type="text" className="form-control" id="asid" placeholder="Arizona State ID" value={x.state_id} name="state_id" onChange={e => handleInputChange(e, i)} required/>
                                </div>

                                <div className="form-group">
                                    <label for="paname">Party Name</label>
                                    <input type="text" className="form-control" id="paname" placeholder="Party Name" value={x.party_name} name="party_name" onChange={e => handleInputChange(e, i)} required/>
                                </div>
                                {candidates.length !== 1 && <button className="btn btn-danger move" onClick={() => handleRemoveClick(i)}>Remove Candidate</button>}
                                
                            </div>
                            <div>
                                {candidates.length - 1 === i && <button className="btn btn-danger move " onClick={regdown}>Back</button>}
                                {candidates.length - 1 === i && <button className="btn btn-dark move mover" onClick={reset}>Cancel</button>}
                                {candidates.length - 1 === i && <button className="btn btn-success move mover" onClick={registerPoll}>Register</button>}
                                {candidates.length - 1 === i && <button className="btn btn-success move mover" onClick={handleAddClick}>Add Candidate</button>}
                            </div>
                            </>
                            );
                        })}
                    </div>
                    </>
                    }
                </form>}
            </div>
        
        </div>

    </>
  )
}

export default AdminPolls