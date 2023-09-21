import React, { useState, useRef, useEffect } from "react";
import "./Home.css";
import gif from "/gif/SightX.gif";
import logo from "/images/Logo.png";
import { useMyContext } from "./Context";
import Chat from "./Components/Chat.jsx";
import CameraRecorder from "./Components/roadassist";
import CurrentLocation from "./Components/location";
import FaceRecognition from "./Components/FaceRecognition";
import Currency from "./Components/currency";
import Navbar from "./Components/Navbar";
import NavbarTop from "./Components/NavbarTop";
import SystemInfo from "./Components/SysInfo";

const Home = () => {
  const [date,setDate]=useState(null);
  // const [text, setText] = useState("");
  const [recording, setRecording] = useState(false);
  const [streamAudio, setStreamAudio] = useState(null);
  // const [clicked, setClicked] = useState(false);
  const voicePrompt = useRef(""); 
  // const [active,setActive]=useState(false);
  const active=useRef(null);
  const temp=useRef(null);
  // const [temp,setTemp]=useState(false);
  const [show, setShow] = useState(false);
  const voiceText = useRef("");
  const road=useRef(false);
  const [audio1] = useState(new Audio("./sound/start.mp3"));
  const [audio2] = useState(new Audio("./sound/end.mp3"));
  const [version, setVersion] = useState(null);
  const scrollDiv = useRef(null);
  // const [promptDone, setPromptDone] = useState(false);
  const [start,setStart]=useState("Start");
  const prompt1 = "How can I help you?";
  const intro =
    "Hello, I'm Blind Sight AI, your trusted guide in the world of sightless navigation. I empower you with essential features for independence and confidence.";
  const [messages, setMessages] = useState([{ text: intro, user: "AI" }]);
  const {
    location,
    setLocation,
    stopVidRecording,
    apiResponse,
    setApiResponse,
    coordinates,
    roadVidRef,
    getLocation,
    apiBody,
    isRecording,faceVidRef,currVidRef
  } = useMyContext();

  // Function to animate the voice prompt letter by letter
  const animateVoicePrompt = (textElement) => {
    let currentIndex = 0;
    const intervalId = setInterval(() => {
      setVoicePrompt(textElement.slice(0, currentIndex + 1));

      // if (currentIndex === textElement.length - 1) {
      //   clearInterval(intervalId);
      // }
      currentIndex++;
    }, 70); // Adjust the speed here (e.g., 70ms per letter)
  };

  const showDate=()=>{
      console.log("Finding date");
      const currentDate = new Date();
      const day = currentDate.getDate();
      const monthIndex = currentDate.getMonth();
      const year = currentDate.getFullYear();
    
      const months = [
        "January", "February", "March", "April",
        "May", "June", "July", "August",
        "September", "October", "November", "December"
      ];
    
      // Determine the appropriate suffix for the day (e.g., st, nd, rd, th)
      const getDaySuffix = (day) => {
        if (day >= 11 && day <= 13) {
          return "th";
        }
        switch (day % 10) {
          case 1: return "st";
          case 2: return "nd";
          case 3: return "rd";
          default: return "th";
        }
      };
    
      const formattedDate = `${day}${getDaySuffix(day)} ${months[monthIndex]} ${year}`;
    
      return formattedDate;
    };

  // const showWeather=()=>{
    
  // }

  // const showSysInfo=()=>{
  //   const info=navigator.platform;
  //   console.log(info);
  // }

  // const showBrowserInfo=()=>{
  //   const info=navigator.userAgent;
  //   console.log(info);
  // }

  const smsalert = async () => {
    try {
      await getLocation();

      console.log("sms: ", apiBody.current);

      if (apiBody) {
        const address = apiBody.current.address;
        const latitude = apiBody.current.lat + " ";
        const longitude = apiBody.current.long + " ";
        const response = await fetch("http://127.0.0.1:8000/smsalert", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ longitude, latitude, address }),
        });

        const data = await response.json();
        console.log(JSON.stringify(data));
      } else {
        console.error("Location is null.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const startRecording = async () => {
    console.log("start");
    try {
      const audioStreamAudio = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      setStreamAudio(audioStreamAudio);
      setRecording(true);
      // audio1.play();

      let SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      let recognition = new SpeechRecognition();
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        console.log("recording...");
        const result = event.results[0][0];
        const transcript = result.transcript;
        // const objUser = { text: transcript, user: "User" };
        // setMessages((prevMessages) => [...prevMessages, objUser]);
        // transcript.includes("Hey SightX") && transcript.includes("Hey") && transcript.includes("SightX")
        const speech=transcript.toLowerCase();
        // console.log(speech.includes("hello"));
        if(speech.includes("sight") || speech.includes("sightex") || speech.includes("citex") || speech.includes("sitex") || speech.includes("cytex") || speech.includes("citax") || speech.includes("sight"))
        {
          // voiceText.current = transcript;
          // voiceNav(voiceText.current);
          active.current=true;
          console.log("Inside if");
          stopRecording();
          // setTimeout(()=>{
          //   audio1.play();
          //   temp.current=true;
          //   // setTemp(true);
          //   // startRecording();
          //   setTimeout(()=>{
          //     // temp.current=true;
          //     console.log("temp:",temp.current);
          //     stopRecording();
          //     // temp.current=true;
          //   },3000);
          // },1000);
          audio1.play();
          setTimeout(()=>{
            // audio1.play();
            stopRecording();
          },3000);
          // voiceNav(transcript);
          // console.log(transcript);
        } else if(active.current){
          console.log("Inside else if");
          voiceNav(speech);
          console.log(speech);
          active.current=false;
        } else if(speech.includes("stop")){
          voiceNav("stop");
        }
      };

      recognition.onend = () => {
        setRecording(false);
        // console.log("active:",active.current);
        // console.log("temp:",temp.current);
        // if(!active.current){
        //   console.log("On end,active");
        //   startRecording();
        // } else if(temp.current){
        //   console.log("On end,active,temp");
        //   startRecording();
        // }
        startRecording();
      };

      recognition.start();
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (streamAudio) {
      streamAudio.getTracks().forEach((track) => track.stop());
    }
    setStreamAudio(null);
    setRecording(false);
    audio2.play();
  };

  const voiceNav = async (text) => {
    temp.current=null;
    console.log("voicenav");
    text = text.toLowerCase();
    console.log("voice :", text);
    const roadAssist = [
      "road",
      "walk",
      "assist",
      "outside",
      "street",
      "stroll",
      "outdoors",
    ];
    const location = ["current", "location", "where", "place"];
    const facialRecog = ["who", "recognize", "face", "know", "recognition"];
    const currency = [
      "currency",
      "note",
      "value",
      "identify",
      "rupees",
      "cash",
      "money",
    ];
    const contact = [
      "help",
      "hospital",
      "doctor",
      "accident",
      "call",
      "ambulance",
    ];
    const features = ["features", "available", "what can u do"];
    for (let i = 0; i < roadAssist.length; i++) {
      const item = roadAssist[i];
      if (text.includes(item)) {
        setVersion("roadAssist");
        setStart("Stop")
        road.current=true;
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: "Entering Road Assist Mode. Hold your camera upright. Let's embark on your journey",
            user: "AI",
          },
        ]);
        speakPrompt("Entering Road Assist Mode.","Microsoft Mark - English (United States)");
        speakPrompt("Hold your camera upright","Microsoft Mark - English (United States)");
        speakPrompt("Let's embark on your journey","Microsoft Mark - English (United States)");
        if (apiResponse) {
          setApiResponse(" ");
        }
        temp.current=true;
        break;
      }
    }

    for (let i = 0; i < location.length; i++) {
      const item = location[i];
      if (text.includes(item)) {
        setVersion("location");
        if (location) {
          setLocation(null);
        }
        temp.current=true;
        break;
      }
    }

    for (let i = 0; i < facialRecog.length; i++) {
      const item = facialRecog[i];
      if (text.includes(item)) {
        console.log("facerecog")
        setVersion("faceRecognition");
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Face your camera towards the person.", user: "AI" },
        ]);
        speakPrompt("Face your camera towards the person.","Microsoft Mark - English (United States)");
        if (apiResponse) {
          setApiResponse(" ");
        }
        temp.current=true;
        break;
      }
    }

    for (let i = 0; i < contact.length; i++) {
      const item = contact[i];
      if (text.includes(item)) {
        getLocation();
        while (!location) {
          getLocation();
        }
        smsalert();
        setVersion(null);
        voicePrompt.current="Sending an alert message to your nearest hospital";
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: `Sending an alert message to your nearest hospital`,
            user: "AI",
          },
        ]);
        await speakPrompt(`Sending an alert message to your nearest hospital`,"Microsoft Mark - English (United States)");
        voicePrompt.current=null;
        temp.current=true;
        break;
      }
    }

    for (let i = 0; i < currency.length; i++) {
      const item = currency[i];
      if (text.includes(item)) {
        console.log("Fineeeeee");
        setVersion("currency");
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Face your camera towards the note", user: "AI" },
        ]);
        speakPrompt("Face your camera towards the note","Microsoft Mark - English (United States)");
        if (apiResponse) {
          setApiResponse(" ");
        }
        temp.current=true;
        break;
      }
    }

    for (let i = 0; i < features.length; i++) {
      const item = features[i];
      if (text.includes(item)) {
        setVersion(null);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: "Hello, I'm Blind Sight AI, your reliable companion in the world of sightless navigation. With a simple click of the button, I am here to empower you with a host of life-enhancing features.",
            user: "AI",
          },
        ]);
        await speakPrompt(
          "Hello, I'm Blind Sight AI, your reliable companion in the world of sightless navigation. With a simple click of the button, I am here to empower you with a host of life-enhancing features.","Microsoft Mark - English (United States)"
        );
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: "As you step outside, I become your vigilant guide, alerting you to approaching vehicles, cyclists, and pedestrians. With clear, reassuring voice commands, I ensure your safe passage on the road.",
            user: "AI",
          },
        ]);
        await speakPrompt(
          "As you step outside, I become your vigilant guide, alerting you to approaching vehicles, cyclists, and pedestrians. With clear, reassuring voice commands, I ensure your safe passage on the road.","Microsoft Mark - English (United States)"
        );
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: "Need assistance with currency recognition? Just ask, and I'll swiftly scan and read aloud the values of your banknotes, making financial transactions a breeze.",
            user: "AI",
          },
        ]);
        await speakPrompt(
          "Need assistance with currency recognition? Just ask, and I'll swiftly scan and read aloud the values of your banknotes, making financial transactions a breeze.","Microsoft Mark - English (United States)"
        );
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: "Curious about your current whereabouts? At your command, I can provide you with your precise location, so you always know where you are.",
            user: "AI",
          },
        ]);
        await speakPrompt(
          "Curious about your current whereabouts? At your command, I can provide you with your precise location, so you always know where you are.","Microsoft Mark - English (United States)"
        );
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: "Recognizing familiar faces and names is my specialty. I'll help you identify your loved ones by reading their names aloud, fostering deeper connections.",
            user: "AI",
          },
        ]);
        await speakPrompt(
          "Recognizing familiar faces and names is my specialty. I'll help you identify your loved ones by reading their names aloud, fostering deeper connections.","Microsoft Mark - English (United States)"
        );
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: "In times of distress, a simple 'Help me' is all it takes. I'll immediately dispatch an SMS alert to the nearest hospital, sharing your exact coordinates and address, ensuring help arrives when you need it most.",
            user: "AI",
          },
        ]);
        await speakPrompt(
          "In times of distress, a simple 'Help me' is all it takes. I'll immediately dispatch an SMS alert to the nearest hospital, sharing your exact coordinates and address, ensuring help arrives when you need it most.","Microsoft Mark - English (United States)"
        );
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: "With Blind Sight AI, your independence and confidence are just a voice command away.",
            user: "AI",
          },
        ]);
        await speakPrompt(
          "With Blind Sight AI, your independence and confidence are just a voice command away.","Microsoft Mark - English (United States)"
        );
        temp.current=true;
        break;
      }
    }

    if(text.includes("home")){
      setVersion(null);
      temp.current=true;
      if(isRecording.current){
        if(currVidRef){
        stopVidRecording(currVidRef);
        } 
        if(roadVidRef){
          stopVidRecording(roadVidRef);
        }
        if(faceVidRef){
          stopVidRecording(faceVidRef);
        }
      }
    }

    if (text.includes("stop")) {
      stopVidRecording(roadVidRef);
      setVersion(null);
      setStart("Start");
      road.current=false;
      voicePrompt.current="Road assist mode has ended";
      await speakPrompt("Road assist mode has ended","Microsoft Mark - English (United States)");
      voicePrompt.current=null;
      temp.current=true;
    }

    if(!temp.current){
      voicePrompt.current="I can't understand";
      await speakPrompt("I can't understand","Microsoft Mark - English (United States)");
      voicePrompt.current=null;
    }
  };

  const speakPrompt = (text, voiceName) => {
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

  const handleClick = async () => {
    // setClicked(true);
    // speakPrompt("Hello i am mark","Microsoft Mark - English (United States)");
    if(road.current){
      stopVidRecording();
      setVersion(null);
      setStart("Start");
      road.current=false;
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: `Road assist mode has ended`, user: "AI" },
      ]);
      speakPrompt("Road assist mode has ended","Microsoft Mark - English (United States)");
    } else {
    setShow(true);
    // animateVoicePrompt(prompt1);
    voicePrompt.current=prompt1;
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: prompt1, user: "AI" },
    ]);
    await speakPrompt(prompt1,"Microsoft Mark - English (United States)","Microsoft Mark - English (United States)");
    startRecording();
    voicePrompt.current=null;
    setTimeout(() => {
      // voiceNav(voiceText.current);
      console.log(version);
 
      // animateVoicePrompt(text);
    }, 1000);
  }
  };

  const handleLocationData = async (data) => {
    voicePrompt.current=data;
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: `Your Current location is ${data}`, user: "AI" },
    ]);
    await speakPrompt(`Your Current location is ${data}`,"Microsoft Mark - English (United States)");
    voicePrompt.current=null;
  };

  const handleFaceData = async (data) => {
    const text = JSON.stringify(data);
    console.log(text.length);
    if (text.length > 4) {
      voicePrompt.current=data;
      await speakPrompt(`${data}`,"Microsoft Mark - English (United States)");
      
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: `${data}`, user: "AI" },
      ]);

    } else {
      voicePrompt.current="This person cannot be recognized.";
      await speakPrompt(`This person cannot be recognized.`,"Microsoft Mark - English (United States)");
      voicePrompt.current=null;
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: `This person cannot be recognized.`, user: "AI" },
      ]);
    }
    stopVidRecording();
    setVersion(null);
    setTimeout(
      ()=>voicePrompt.current=null,
    3000);
  };

  const handleYoloData = async (data) => {
    if (data.length > 2) {
      voicePrompt.current=data;
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: `${data}`, user: "AI" },
      ]);
    }
    // if(data.length >2){
    //   await speakPrompt(`${data}`);
    //   setPromptDone(true);
    // }
  };

  const handleCurrencyData = async (data) => {
    setVersion(null);
    if (data.length > 2) {
      voicePrompt.current=data;
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: `${data}`, user: "AI" },
      ]);
      await speakPrompt(`${data}`,"Microsoft Mark - English (United States)");
      voicePrompt.current=null;
    } else {
      voicePrompt.current="Please hold the note properly";
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: `Please hold the note properly`, user: "AI" },
      ]);
      await speakPrompt(`Please hold the note properly`,"Microsoft Mark - English (United States)");
      voicePrompt.current=null;
    }
  };

  useEffect(() => {
    try {
      speakPrompt(intro,"Microsoft Mark - English (United States)");
      console.log(showDate());
      // showBrowserInfo();
      // showSysInfo();
    } catch (err) {
      console.log("Error: ", err);
    }

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (scrollDiv.current) {
      scrollDiv.current.scrollTop = scrollDiv.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <div id="hm-main">
        <NavbarTop />
        {!show? <div className="btn">
          <div className="btn-in"></div>
          <img onClick={handleClick} className="btn-logo" src="/images/logo1.png" />
        </div>:( version==="location"?<div>
        <CurrentLocation onDataReceived={handleLocationData} />
        <div className="gif">
        <video className="gif-vid" autoPlay loop muted>
            <source src="/video/sightx.mp4" type="video/mp4" />
            Your browser does not support the video tag.
        </video>
        </div>
        <div className="res">
          <p>{voicePrompt.current}</p>
        </div>
        </div>
          :(version==="roadAssist"?<div>
          <div className="video-container">
        <CameraRecorder onDataReceived={handleYoloData} />
          </div>
        <div className="res">
          <p>{voicePrompt.current}</p>
        </div>
        </div>:(version==="faceRecognition"?<div>
        <div className="video-container">
        <FaceRecognition onDataReceived={handleFaceData} />
        </div>
        <div className="res">
          <p>{voicePrompt.current}</p>
        </div>
        </div>:version==="currency"?<div>
        <div className="video-container">
          <Currency onDataReceived={handleCurrencyData} />
        </div>
        <div className="res">
          <p>{voicePrompt.current}</p>
        </div>
        </div>:
        <div>
        <SystemInfo />
        <div className="date">
          <span>{date}</span>
        </div>
        <div className="gif">
        <video className="gif-vid" autoPlay loop muted>
            <source src="/video/sightx.mp4" type="video/mp4" />
            Your browser does not support the video tag.
        </video>
        </div>
        <p className="ver-null">{voicePrompt.current}</p>      
        </div>
          )))}
        <div className="bottom-nav">
          <Navbar triggerFn={voiceNav}/>
        </div>
      </div>
      
    </>
  );
};

export default Home;