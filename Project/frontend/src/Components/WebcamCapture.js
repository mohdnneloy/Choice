import React,{useState} from 'react';
import Webcam from 'react-webcam';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CameraswitchIcon from '@mui/icons-material/Cameraswitch';

// Styles ===============================
import './StylesComponents/WebcamCapture.css'

const WebcamCapture=({imagestatus})=>{

    // Global States 
    const [iscaptured,setIsCaptured]=useState(0)
    
    // Initialization
    const webcamRef=React.useRef(null);
    const videoConstraints={
        width:175,
        height:175,
        facingMode:"user"
    }
    
    // Photo Capture Function
    const [name,setName]=useState("")
    const [pic,setPic]=useState("")
    let pics = "";
    const capture = () => {
        const image = webcamRef.current.getScreenshot();
        pics = image;
        setPic(pics);
        console.log("Image Details:" + pics);
        setIsCaptured(1);
        imagestatus(1, pics, webcamRef);
    }

    // Retake Photo Function
    const retakepic = () =>{
        setIsCaptured(0);
        imagestatus(0);
        pic = "";
    }

    return (
        <>
            {iscaptured === 0 && <div>
                <Webcam className="webcam" style={{height: 175, width: 175, borderRadius: 175 }}
                audio={false}
                ref={webcamRef}
                screenshotFormat='image/jpeg'
                videoConstraints={videoConstraints}/>
                <br/>
                <button className="btn btn-primary button" onClick={capture}><CameraAltIcon /> Capture</button> 
            </div>}

            {iscaptured == 1 && <div>
                <img className="image" src={pic}/>
            <br/>
            <button className="btn btn-primary button" onClick={retakepic}><CameraswitchIcon /> Retake</button> 
            </div>}
        </>

        
    );
}

export default WebcamCapture