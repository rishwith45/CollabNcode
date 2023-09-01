import CodeMirror from 'codemirror';
import React, { useEffect, useRef, useState } from 'react';
import 'codemirror/mode/javascript/javascript'
import 'codemirror/theme/dracula.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';

function Editor({ socketRef, roomId, onCodeChange }) {
   const effectRan=useRef(false);
   const effectRan2=useRef(false);
   const editorRef = useRef(null);
   useEffect(()=>{
      if(effectRan.current===false){
        async function init(){
           editorRef.current = CodeMirror.fromTextArea(document.getElementById('txtedtr'),{
              mode : { name : 'javascript', json: true},
              theme : 'dracula',
              lineNumbers: true,
              autoCloseTags: true,
              autoCloseBrackets: true,
              })

              editorRef.current.on('change', (instance, changes) => {
               const { origin } = changes;
               const code = instance.getValue();
               onCodeChange(code);
               if (origin !== 'setValue') {
                   socketRef.current.emit("code-change", {
                       roomId,
                       code,
                   });
               }
           });
        }
        init();
        effectRan.current=true;
      }
     
   },[]);

   useEffect(() => {
      
         if (socketRef.current) {
           socketRef.current.on("code-change", ({ code }) => {
               console.log('jkds');
               if (code !== null) {
                   editorRef.current.setValue(code);
               }
           });
         } 
   
  }, [socketRef.current]);
   
   return <textarea id='txtedtr'></textarea>
}
  
export default Editor;
  