import React, { useState, useRef, useEffect } from 'react';
import { useMyContext } from '../Context';
import "../Home.css";

const CameraRecorder = (props) => {
  // const [stream, setStream] = useState(null);
  // const [recording, setRecording] = useState(false);
  // const [apiResponse, setApiResponse] = useState('');
  // const roadVidRef = useRef(null);
  // const isRecording = useRef(false);
  // const roadVidRef=useRef(null);
  const {stream,voicePrompt,roadVidRef,setStream,apiResponse,setApiResponse,isRecording,stopVidRecording}=useMyContext();

  const synth = useRef(window.speechSynthesis);

  const startRecording = async () => {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(newStream);
      setTimeout(() => {
        if(roadVidRef && roadVidRef.current){
        roadVidRef.current.srcObject = newStream;
        const roadPlay=roadVidRef.current.play();
        if(roadPlay!=undefined){
          roadPlay.then(()=>{
            isRecording.current=true;
            // setRecording(true);
            // Capture a frame from the video
            setTimeout(()=>{captureAndSendFrame();},1000);
          })
          .catch((err)=>{
              console.log("Play error:",err);
          })
        }
        }
      }, 2000);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const speakApiResponse = (text, voiceName) => {
    return new Promise((resolve) => {
      const synth = window.speechSynthesis;
  
      // Get the list of available voices
      const voices = synth.getVoices();
  
      // Find the desired voice by its name
      const desiredVoice = voices.find((voice) => voice.name === voiceName);
  
      // If the desired voice is found, set it for the utterance
      if (desiredVoice) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = desiredVoice;
        utterance.onend = resolve;
        synth.speak(utterance);
      } else {
        console.error('Voice not found:', voiceName);
        resolve();  // Resolve the promise even if voice is not found
      }
    });
  };



  const captureAndSendFrame = async () => {
    try {
      if (!roadVidRef.current || !isRecording.current) return;

      const canvas = document.createElement('canvas');
      canvas.width = roadVidRef.current.videoWidth;
      canvas.height = roadVidRef.current.videoHeight;
      canvas.getContext('2d').drawImage(roadVidRef.current, 0, 0, canvas.width, canvas.height);
      const frameDataURL = canvas.toDataURL('image/jpeg');

      const base64Frame = frameDataURL.split(',')[1];

      const response = await fetch('http://127.0.0.1:8000/roadassist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imagedata: base64Frame }),
      });

      const data = await response.json();
      setApiResponse(JSON.stringify(data));
      const text = JSON.stringify(data);

      console.log(text.length);
      if(text.length>4){
        await speakApiResponse(text,"Microsoft Mark - English (United States)");
        voicePrompt.current=null;
      }
      if (isRecording.current) {
        captureAndSendFrame();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const sendData=()=>{
    if(apiResponse){
      props.onDataReceived(apiResponse);
    }
  }

  useEffect(() => {
    startRecording();
    return () => {
      console.log("roadassist",roadVidRef);
      stopVidRecording(roadVidRef);
    };
  }, []);

  useEffect(()=>{
    // if(!isRecording.current){
    //   startRecording();
    // }
    sendData();
  },[apiResponse]);

  return (
      <div id="videoContainer">
        <video className="video" ref={roadVidRef} style={{ display: 'block', marginBottom: '10px' }} />
      </div>
  );
};

export default CameraRecorder;