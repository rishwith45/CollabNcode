import React, { useEffect, useRef } from "react";
import Client from "../components/Client";
import { useState } from "react";
import Editor from "../components/Editor";
import { initSocket } from "../socket";
import { Navigate, useLocation ,useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const Editorpage = () => {
    const socketRef = useRef(null);
    const effectRan=useRef(false);
    const location = useLocation();
    const reactnavigate = useNavigate();
    const codeRef = useRef(null);

    const [clients,setClients]=useState([]);

    useEffect( () => {
        if(effectRan.current===false){

           const init = async () =>{
              
              socketRef.current = await initSocket();

              socketRef.current.on('connect_error', (err) => handleErrors(err));
              socketRef.current.on('connect_failed', (err) => handleErrors(err));
               
              function handleErrors(e){
                 console.log("socket error", e);
                 reactnavigate('/');
              }
              
              socketRef.current.emit("join",{
                 roomId:location.state.roomId,
                 userId:location.state.userId,
              });


              // Listening for joined event
              socketRef.current.on(
               "joined",
                ({ clients, username, socketId }) => {
                    if (username !== location.state?.username) {
                        toast.success(`${username} joined the room.`);
                        console.log(`${username} joined`);
                    }
                    setClients(clients);
                    socketRef.current.emit("sync-code", {
                        code: codeRef.current,
                        socketId,
                    });
                }
               );

               // Listening for disconnected
              socketRef.current.on(
                "disconnected",
                ({ socketId, username }) => {
                    toast.success(`${username} left the room.`);
                    setClients((prev) => {
                        return prev.filter(
                            (client) => client.socketId !== socketId
                        );
                    });
                }
               );
            };
            init();
            effectRan.current=true;
        
        }
    
       
    },[]);

    async function copyRoomId() {
        try {
            await navigator.clipboard.writeText(location.state.roomId);
            toast.success('Room ID has been copied to your clipboard');
        } catch (err) {
            toast.error('Could not copy the Room ID');
            console.error(err);
        }
    }

    function leaveRoom() {
        reactnavigate('/');
        console.log("ksjddjsdk");
        socketRef.current.disconnect();
        socketRef.current.off("joined");
        socketRef.current.off("disconnected");

    }

   
    
    if(!location.state){
        return <Navigate to="/" />;
    }

    return(
        <div className="mainWrap">

            <div className="sideWrap">

                <div className="sideInner">

                    <h3 className="hc">Connected</h3>

                    <div className="clientList">

                        {clients.map((client)=>(
                            <Client 
                               key={client.socketId}
                               username={client.username}
                            />
                        ))}
                    </div>

                   
                </div>
                
                <button className="btn copybtn" onClick={copyRoomId}>Copy RoomId</button>

                <button className="btn leavebtn" onClick={leaveRoom}> Leave</button>
               

            </div>

            <div className="editorWrap"> 
               <Editor
                   socketRef={socketRef}
                   roomId={location.state.roomId}
                   onCodeChange={(code) => {
                       codeRef.current = code;
                   }}
               />
            </div>
        </div>
    );

}
export default Editorpage;
