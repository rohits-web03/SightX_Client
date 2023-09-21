import React, { useState, useEffect, useRef } from "react";
import { useMyContext } from "../Context";

const FaceRecognition = (props) => {
  const {
    apiResponse,
    setApiResponse,
    stream,
    setStream,
    faceVidRef,
    isRecording,
    stopVidRecording,
  } = useMyContext();
  // const faceVidRef=useRef(null);
  const startRecording = async () => {
    try {
      const videoStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setStream(videoStream);

      // Wait for 2 seconds before starting to capture
      setTimeout(() => {
        if(faceVidRef && faceVidRef.current){
          faceVidRef.current.srcObject = videoStream;
          const playPromise=faceVidRef.current.play();
          if(playPromise!=undefined){
            playPromise.then(()=>{
              isRecording.current = true;
              // Capture a frame from the video
              setTimeout(() => {
                captureAndSendFrame();
              }, 1000);
            })
            .catch((err)=>{
                console.log("Play error:",err);
            })
          }
        }
      }, 2000); // Wait for 2 seconds
    } catch (error) {
      console.error("Error accessing camera:", error);
      isRecording.current = false;
    }
  };

  const captureAndSendFrame = async () => {
    try {
      if (!faceVidRef.current || !isRecording.current) return;

      const canvas = document.createElement("canvas");
      canvas.width = faceVidRef.current.videoWidth;
      canvas.height = faceVidRef.current.videoHeight;
      canvas
        .getContext("2d")
        .drawImage(faceVidRef.current, 0, 0, canvas.width, canvas.height);
      const frameDataURL = canvas.toDataURL("image/jpeg");

      const base64Frame = frameDataURL.split(",")[1];

      // console.log(base64Frame);

      const response = await fetch("http://127.0.0.1:8000/facerecognize", {
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
        stopVidRecording(faceVidRef);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // const stopRecording = () => {
  //     console.log("Stop recording");
  //   if (stream) {
  //     const tracks = stream.getTracks();
  //     tracks.forEach((track) => track.stop());
  //     setStream(null);
  //     faceVidRef.current.srcObject = null;
  //     isRecording.current=false;
  //   }

  // };

  const sendData = () => {
      props.onDataReceived(apiResponse);
  };

  useEffect(() => {
    startRecording();
    return () => {
      stopVidRecording(faceVidRef);
    };
  }, []);

  useEffect(() => {
    if (!isRecording.current) {
      startRecording();
    }
    if(apiResponse){
      sendData();
    }
  }, [apiResponse]);

  return (
    <video
      className="video"
      ref={faceVidRef}
      style={{ display: "block", marginBottom: "10px" }}
    ></video>
  );
};

export default FaceRecognition;