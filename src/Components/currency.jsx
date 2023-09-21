import React,{useEffect,useRef,useState} from 'react';
import "../Home.css";
import { useMyContext } from '../Context';

const Currency = (props) => {
    const [currencyStream,setCurrencyStream]=useState(null);
    const {
        apiResponse,
        setApiResponse,
        stream,
        setStream,
        currVidRef,
        isRecording,
        stopVidRecording,
      } = useMyContext();
    // const currVidRef=useRef(null);
const startRecording = async () => {
  try {
    const currencyStream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    setCurrencyStream(currencyStream);

    // Wait for 2 seconds before starting to capture
    setTimeout(() => {
      console.log("currency", currVidRef);
      const checkVidLoad = setInterval(() => {
        console.log("Checking...");
        if (currVidRef && currVidRef.current) {
          clearInterval(checkVidLoad); // Stop the loop once video is loaded

          // Set the video stream and start playing
          currVidRef.current.srcObject = currencyStream;
          const playPromise = currVidRef.current.play();

          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                isRecording.current = true;
                console.log("Fetching API..");
                // Capture a frame from the video
                setTimeout(() => {
                  captureAndSendFrame();
                }, 1000);
              })
              .catch((err) => {
                console.log("Play error:", err);
              });
          }
        } else{
          console.log("Api not fetchd");
        }
      }, 100); // Check every 100 milliseconds
    }, 2000); // Wait for 2 seconds
  } catch (error) {
    console.log("Error accessing camera:", error);
    isRecording.current = false;
  }
};

    
      const captureAndSendFrame = async () => {
        try {
          if (!currVidRef.current || !isRecording.current) return;
    
          const canvas = document.createElement("canvas");
          canvas.width = currVidRef.current.videoWidth;
          canvas.height = currVidRef.current.videoHeight;
          canvas
            .getContext("2d")
            .drawImage(currVidRef.current, 0, 0, canvas.width, canvas.height);
          const frameDataURL = canvas.toDataURL("image/jpeg");
    
          const base64Frame = frameDataURL.split(",")[1];
    
    
          const response = await fetch("http://127.0.0.1:8000/currency", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ imagedata: base64Frame }),
          });

    
          const data = await response.json();
          setApiResponse(JSON.stringify(data));
          console.log("API Response:", data);
          if (data) {
            // stopRecording(currVidRef);
            stopVidRecording(currVidRef);
          }
        } catch (error) {
          console.error("Error:", error);
        }
      };
    
      // const stopRecording = (videoRef) => {
      //     console.log("Stop recording",currencyStream);
      //   if (currencyStream) {
      //     const tracks = currencyStream.getTracks();
      //     tracks.forEach((track) => track.stop());
      //     setCurrencyStream(null);
      //     videoRef.current.srcObject = null;
      //     isRecording.current=false;
      //   }
    
      // };
    
      const sendData = () => {
        // if(currencyStream){
        //   // stopRecording(currVidRef);
        //   stopVidRecording(currVidRef);
        // }
          props.onDataReceived(apiResponse);
      };
    
      useEffect(() => {
        startRecording();
        return () => {
          // console.log("Clean up");
          // if (currVidRef.current) {
          //   currVidRef.current.srcObject = null;
          // }
          // stopRecording(currVidRef);
          if(apiResponse){
            setApiResponse('');
          }
          stopVidRecording(currVidRef);
        };
      }, []);

      // useEffect(()=>{
      //   console.log("stream: ",currencyStream);
      // },[currencyStream])
    
      useEffect(() => {
        // if (!isRecording.current) {
        //   startRecording();
        // }
        if(apiResponse){
          sendData();
        }
      }, [apiResponse]);

      // useEffect(()=>{
      //   startRecording();
      // },[currVidRef])

      return (
        <video
          className="video"
          ref={currVidRef}
          style={{ display: "block", marginBottom: "10px" }}
        ></video>
      );
};

export default Currency;