import React, { FunctionComponent } from "react";
import { useState, useEffect } from 'react';
import axios from 'axios';

// Components ====================================
import VoterSideBar from '../../Components/VoterSideBar';
import PropTypes from 'prop-types';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';

// Styles =======================================
import './Styles/VoterPublishedPolls.css'


//======================================== Graph Requirements =======================================

const colors = scaleOrdinal(schemeCategory10).range();

const data = [
  {
    name: 'Page A',
    uv: 4000,
    female: 2400,
    male: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    female: 1398,
    male: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    female: 9800,
    male: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    female: 3908,
    male: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    female: 4800,
    male: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    female: 3800,
    male: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    female: 4300,
    male: 2100,
  },
];

const getPath = (x, y, width, height) => `M${x},${y + height}
          C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3} ${x + width / 2}, ${y}
          C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${x + width}, ${y + height}
          Z`;

const TriangleBar = (props) => {
  const { fill, x, y, width, height } = props;

  return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
};

TriangleBar.propTypes = {
  fill: PropTypes.string,
  x: PropTypes.number,
  y: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
};


//======================================== Component ======================================

const VoterPublishedPolls = () => {

  // Main Urls
  let localurlf = "http://localhost:3000/";
  let localurlb = "http://localhost:8000/";

  // States ========================================
  const [success, setSuccess] = useState(false)
  const [polls, setPolls] = useState();

  const [selectc1, setSelectc1] = useState(1);
  const [selectc2, setSelectc2] = useState(1);
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
  
  return (

    <>
    
        <VoterSideBar/>

        <div className="apmainp">
        
            <div className="apheading">
                <h3>Published Polls</h3>
            </div>
            
            <div className="approfile-data">

                {/* Show all polls*/}
                {success === true && 
                    <>
                    <div className="cards">
                        {polls.map(poll => {
                            
                            const data = [];
                            for(let i=0; i<poll.candidates.length; i++){
                                data.push({name: poll.candidates[i].candidate_first_name + " " + poll.candidates[i].candidate_last_name, uv: poll.candidates[i].candidate_votes,});
                            }
                            return(
                                ((new Date(poll.expire_date).getTime() <= new Date().getTime()) || poll.poll_published) &&
                                <>
                                  <div className="card-m" >
                                    <h5>{poll.poll_name} ({poll.total_votes} {poll.total_votes==1 && "Vote"}{poll.total_votes!=1 && "Votes"})</h5>
                                    <BarChart
                                        width={500}
                                        height={300}
                                        data={data}
                                        margin={{
                                        top: 20,
                                        right: 30,
                                        left: 20,
                                        bottom: 5
                                        }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Bar
                                        dataKey="uv"
                                        fill="#8884d8"
                                        shape={<TriangleBar />}
                                        label={{ position: "top" }}
                                        >
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={colors[index % 20]} />
                                        ))}
                                        </Bar>
                                    </BarChart>
                                  </div>
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

export default VoterPublishedPolls