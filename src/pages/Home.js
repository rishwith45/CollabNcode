import React from "react";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import  toast  from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const Home = () => {
    const navigate = useNavigate();

    const [roomId,setRoomid]=useState("");
    const [userId,setUserId]=useState("");

    const createNewRoom = (e) =>{
       e.preventDefault();
       const id=uuidv4();
       setRoomid(id);
       toast.success("created Room");
    }

    const joinRoom = () =>{
       if(!roomId || !userId){
          toast.error("Room id & user id required");
          return
       }
       navigate(`./editor/${roomId}`,{
          state :{
            userId,
            roomId,
          },
       })
       toast.success("Joined Room");
    }

    return (
        <div className="homePageWrapper">
            <div className="formWrapper">
                <h4 className="mainLabel">Enter Room ID</h4>
                <div className="inputElements">
                    <input 
                      type="text" 
                      placeholder="Room ID"
                      className="inputBox"
                      value={roomId}
                      onChange={(e)=>{
                          setRoomid(e.target.value);
                      }}
                    />
                    <input 
                      type="text" 
                      placeholder="Guestname"
                      className="inputBox"
                      value={userId}
                      onChange={(e)=>{
                          setUserId(e.target.value);
                      }}
                    />
                    <button className="join btn" onClick={joinRoom}>Join</button>
                    <a onClick={createNewRoom} href=" " className="createButton" >Create Room</a>
                </div>
            </div>
        </div>
    );

}
export default Home;