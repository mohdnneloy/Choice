import React from 'react'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState } from 'react';
import axios from 'axios';
import CameraswitchIcon from '@mui/icons-material/Cameraswitch';

// Components ====================================
import MainNavBar from '../../Components/MainNavBar';
import Footer from '../../Components/Footer';
import WebcamCapture from '../../Components/WebcamCapture';

// Styles =======================================
import './Styles/VoterRegister.css'

// Images ========================================
import voter from '../../images/voterr.jpg';
import fp from '../../images/fp.webp'


//======================================== Component ======================================
const VoterRegister = () => {
  
  // Main Urls
  let localurlf = "http://localhost:3000/";
  let localurlb = "http://localhost:8000/";

  // States ========================================
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [wid, setWid] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState('AZ');
  const [astateid, setAstateid] = useState('');
  const [cstateid, setCstateid] = useState('');
  const [gender, setGender] = useState('Male');
  const [dob, setDob] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [pics, setPics] = useState('');
  const [fimage, setFimage] = useState('');

  // Required golbal variables
  let pic = "";
  let webcamRef = "";
  let fpic = "";

  // Non form States ======================================
  const [regstep, setRegStep] = useState(1);
  const [isimageready, setIsimageready] = useState(0);
  const [isfimageready, setIsfimageready] = useState(0);

  const imagestatus = (status, picb64, webcamRefr) => {
    setIsimageready(status);
    setPics(picb64);
    webcamRef = webcamRefr;
  }

  pic = pics;
  fpic = fimage;
  // Functions ======================================

  // -- Test Function
  const check = () => {
    console.log('Fname:' + fname);
    console.log('Lname:' + lname);
    console.log('Wid:' + wid);
    console.log('Email:' + email);
    console.log('Password:' + password);
    console.log('State:' + state);
    console.log('Gender:' + gender);
    console.log('DOB:' + dob);
    console.log('Arizona State ID:' + astateid);
    console.log('California State ID:' + cstateid);
  }

  // -- Form Validator
  const validate1 = () => {
  
    // First Name Checks
    if(fname.match(/^([a-zA-Z ]{2,30})$/) == null || fname.match(/[^a-zA-Z ]/) != null){
        alert("First Name should be within 2-30 characters and cannot have numbers or special characters in it!");
        return false;
    }
  
    // Last Name Checks
    if(lname.match(/^([a-zA-Z]{2,15})/) == null || lname.match(/[^a-zA-Z]/) != null){
        alert("Last Name should be within 2-15 characters and cannot have numbers or special characters in it!");
        return false;
    }

    // Email Checks
    if(email.match(/^([a-zA-Z0-9\._]+)@([a-z]+).([a-z]{2,3})$/) == null){
      alert("Email not recognized!");
      return false;
    }

    // Wallet ID Check
    if(wid.match(/^([a-zA-Z0-9]{42})$/) == null){
      alert("Invalid Wallet ID");
      return false;
    }

    if(astateid === "" && cstateid === ""){
      alert("Please Enter Your Valid State ID");
      return false;
    }

    if(state === "AZ" && astateid !== "" && astateid.match(/^([a-zA-Z]{1})([0-9]{8})$/) === null){
      alert("Invalid Arizona State ID");
      return false;
    }

    if(state === "CA" && cstateid !== "" && cstateid.match(/^([a-zA-Z]{1})([0-9]{7})$/) === null){
      alert("Invalid California State ID");
      return false;
    }

    if(gender == ""){
      alert("Please enter your gender!");
      return false;
    }

    if(dob == ""){
      alert("Please enter your date of birth");
      return false;
    }
  }

  // -- Registration Step Up function
  const regup = () => {
    
    if (validate1() == false){
      return false;
    }
    setRegStep(regstep + 1) ;
    console.log(regstep);

  }

  // -- Registration Step Down function
  const regdown = () => {
    setRegStep(regstep - 1) ;
    console.log(regstep);

    // if(regstep === 2){
    //   // setAstateid('');
    //   // setCstateid('');
    //   setIsfimageready(0);
    //   setIsimageready(0);
    // }

    // if(regstep === 3){
    //   // setAstateid('');
    //   // setCstateid('');
    //   setIsimageready(0);
    // }

  }

  // Voter verification ========================

  const verifyVoter = React.useCallback(
    (user)=>{

        console.log(user);

        axios.post(localurlb.concat("system/addvoter"), user)
          .then(res=>{
            console.log(`response==${res}`)
            window.location = localurlf.concat("login/voter");
            
        }).catch(error=>{

          if(error.response.status === 406){
            console.log(`response==${error}`);
            alert("Voter Already Exists");
            return false;
          }
          
          else if(error.response.status === 403){
            console.log(`response==${error}`);
            alert("Wallet Address is already registered!");
            return false;
          }

          else if(error.response.status === 405){
            console.log(`response==${error}`);
            alert("Election Administrator of the State is not Registered!");
            return false;
          }

          else if(error.response.status === 404){
            console.log(`response==${error}`);
            alert("Entered Address is Invalid!");
            return false;
          }

          else if(error.response.status === 409){
            console.log(`response==${error}`);
            alert("State ID has not been issued by the government!");
            return false;
          }

          else if(error.response.status === 402){
            console.log(`response==${error}`);
            alert("Fingerprint does not Match! Please try again!");
            return false;
          }

          else if(error.response.status === 412){
            console.log(`response==${error}`);
            alert("Face does not Match! Please try again!");
            return false;
          }
        })
    },
    [webcamRef]
  );

  // Register ==================================

  const register = (event) => {

        let gid = "";

        if(astateid !== ""){
          gid = astateid;
        }

        else{
          gid = cstateid;
        }

        event.preventDefault();
        // User Data
        const user = {
          state_id: gid,
          first_name: fname,
          last_name: lname,
          state: state,
          dob: dob,
          gender: gender,
          email: email,
          password: password,
          wallet_address: wid,
          image_b64: pic,
          fimage_b64: fpic 
        }

        if (verifyVoter(user) == false){
          return false;
        }
  }

  // Get fingerprint ============================
  
  const getFingerPrint = () => {

      var secugen_lic = "";
      CallSGIFPGetData(SuccessFunc, ErrorFunc);
    
    /* 
        This functions is called if the service sucessfully returns some data in JSON object
    */
    function SuccessFunc(result) {
        if (result.ErrorCode == 0) {
            /* 	Display BMP data in image tag
                BMP data is in base 64 format 
            */
            if (result != null && result.BMPBase64.length > 0) {
                fpic = "data:image/bmp;base64," + result.BMPBase64;
                setFimage(fpic);
                setIsfimageready(1);
            }
        }
        else {
            alert("Fingerprint Sensor Not Connected!");
        }
    }
    
    function ErrorFunc(status) {
    
        /* 	
            If you reach here, user is probabaly not running the 
            service. Redirect the user to a page where he can download the
            executable and install it. 
        */
        alert("Check if SGIBIOSRV is running; Status = " + status + ":");
    
    }
    
    
    function CallSGIFPGetData(successCall, failCall) {
        // 8.16.2017 - At this time, only SSL client will be supported.
        var uri = "https://localhost:8443/SGIFPCapture";
    
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                let fpobject = JSON.parse(xmlhttp.responseText);
                successCall(fpobject);
            }
            else if (xmlhttp.status == 404) {
                failCall(xmlhttp.status)
            }
        }
        var params = "Timeout=" + "10000";
        params += "&Quality=" + "50";
        params += "&licstr=" + encodeURIComponent(secugen_lic);
        params += "&templateFormat=" + "ISO";
        params += "&imageWSQRate=" + "0.75";
        xmlhttp.open("POST", uri, true);
        xmlhttp.send(params);
    
        xmlhttp.onerror = function () {
            failCall(xmlhttp.statusText);
        }
    }
  
  }

  // Return =====================================
  return (
  
    <>
      <MainNavBar/>
      <div className="main-aregister">
                
        <div className="main-aimage">
          <img src={voter} alt="voter register"/>
        </div>
  
        <div className="register-form">

          {/*Registration Step 1*/}
          {regstep === 1 && <form class="form-aregister">
            <div class="form-group">
                            <h3>Voter Registration</h3>
                    </div>
  
                    <div class="form-group">
                        <label for="first_name">First Name</label>
                        <input type="text" class="form-control" id="first_name" placeholder="First Name" value={fname} name="first_name" required onChange = {(e) => setFname(e.target.value)}/>
                    </div>
  
                    <div class="form-group">
                        <label for="last_name">Last Name</label>
                        <input type="text" class="form-control" id="last_name" placeholder="Last Name" value={lname} name="last_name" required onChange = {(e) => setLname(e.target.value)}/>
                    </div>
  
                    <div class="form-group">
                        <label for="wallet_id">Wallet ID</label>
                        <input type="text" class="form-control" id="wallet_id" placeholder="Wallet ID" value={wid} name="wallet_id" required onChange = {(e) => setWid(e.target.value)}/>
                    </div>
  
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" class="form-control" id="email" placeholder="Email" value={email} name="email" required onChange = {(e) => setEmail(e.target.value)}/>
                    </div>

                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" class="form-control" id="password" placeholder="Password" value={password} name="password" required onChange = {(e) => setPassword(e.target.value)}/>
                    </div>

                    <div class="form-group gender">

                      <label for="gender">Gender:</label>
                  
                      <div class="form-check form-check-inline male">
                          <input class="form-check-input" type="radio" name="gender" id="male" value="Male" checked="checked" onClick = {() => setGender("Male")}/>
                          <label class="form-check-label" for="male">Male</label>
                      </div>

                      <div class="form-check form-check-inline">
                          <input class="form-check-input" type="radio" name="gender" id="female" value="Female" onClick = {() => setGender("Female")}/>
                          <label class="form-check-label" for="female">Female</label>
                      </div>
                
                    </div>

                    <div class="form-group">
                      <label for="date_of_birth">Date Of Birth</label>
                      <input type="date" class="form-control" id="date_of_birth" name="date_of_birth" onChange = {(e) => setDob(e.target.value)}/>
                    </div>
  
                    { state === "AZ" && <div class="form-group select">
                      <label for="wallet_id">Select your State</label>
                      <select class="form-select" aria-label="Default select example" required onChange = {(e) => setState(e.target.value)}>
                        <option selected value="AZ">Arizona</option>
                      </select>
                    </div>}

                    { state === "CA" && <div class="form-group select">
                      <label for="wallet_id">Select your State</label>
                      <select class="form-select" aria-label="Default select example" required onChange = {(e) => setState(e.target.value)}>
                        <option value="Arizona">Arizona</option>
                        <option selected value="CA">California</option>
                      </select>
                    </div>}
  
                    {state==='AZ' &&
                      <div class="form-group">
                        <label for="asid">Arizona State ID</label>
                        <input type="text" class="form-control" id="asid" placeholder="Arizona State ID" value={astateid} name="asid" onChange = {(e) => setAstateid(e.target.value)} required/>
                      </div>
                    }
  
  
                    {state==='California' &&
                      <div class="form-group">
                        <label for="csid">California State ID</label>
                        <input type="text" class="form-control" id="csid" placeholder="California State ID" name="csid" required onChange = {(e) => setCstateid(e.target.value)}/>
                      </div>
                    }
  
                    <button type="button" class="btn btn-success submit-btn" onClick = {regup}>Next <ArrowForwardIcon /></button>
                    
          </form>}

          {/*Registration Step 2*/}
          {regstep === 2 && <form class="form-aregister">
  
            <div class="form-group">
                    <h3>2. Fingerprint</h3>
            </div>

            
            
            {isfimageready===0 && <><img src={fp} width="160px" height="160px" className='fimagef' alt="fingerprint_fake"  /></>}
            <br />
            {/*If fingerprint not ready*/}
            {isfimageready===0 && <><button type="button" class="btn btn-success submit-btn movec" onClick = {getFingerPrint}> Capture Fingerprint </button> </>}
            {/*If fingerprint is not ready*/}
            {isfimageready===0 && <> <br /><button type="button" class="btn btn-danger submit-btn movec"  onClick = {regdown}><ArrowBackIcon /> Back</button></>}

            {isfimageready===1 && <><img src={fpic} width="160px" height="200px" className='fimage' alt="fingerprint" /> <br /></>}
            {/*If fingerprint ready*/}
            {isfimageready===1 &&<><button type="button" class="btn btn-success submit-btn movec" onClick = {getFingerPrint}>Re-capture Fingerprint</button> <br /></>}

            {/*If image is ready*/}
            {isfimageready===1 && <><button type="button" class="btn btn-danger submit-btn movec"  onClick = {regdown}><ArrowBackIcon /> Back</button>
            <button type="button" class="btn btn-success submit-btn moves" onClick = {regup}>Next <ArrowForwardIcon /></button></>}

          </form>}

          {/*Registration Step 3*/}
          {regstep === 3 && <form class="form-aregister">
  
            <div class="form-group">
                    <h3>3. Take a Photo</h3>
            </div>

            {/*If image is not ready*/}
            {isimageready===0 && <>

            <div class="form-group">
                <WebcamCapture imagestatus={imagestatus}/>
            </div>

             <button type="button" class="btn btn-danger submit-btn"  onClick = {regdown}><ArrowBackIcon /> Back</button></>}
            
            {/*If image is ready*/}
            
            {isimageready===1 && <> 
            <img className="image" src={pic}/>
            <br/>
            <button className="btn btn-primary submit-btn movecp" onClick={e => setIsimageready(0)}><CameraswitchIcon /> Retake</button></>}
            {isimageready===1 && <><button type="button" class="btn btn-danger submit-btn movec"  onClick = {regdown}><ArrowBackIcon /> Back</button>
            <button type="button" class="btn btn-success submit-btn moves" onClick = {register}>Register</button> </>}

          </form>}

        </div>
            
      </div>
      <Footer/>

    </>
  )
    
  
}

export default VoterRegister