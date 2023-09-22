import React, { useState, useRef, useEffect } from "react";
import "./Home.css";
import vid from "/video/sightx_logo.mp4";
import logo from "/images/SightX.jpg";
import { useMyContext } from "./Context";
import Chat from "./Component/Chat";
import CameraRecorder from "./Component/roadassist";
import CurrentLocation from "./Component/location";
import FaceRecognition from "./Component/facerecognition";
import Currency from "./Component/currency";
import Weather from "./Component/Weather";

const Home = () => {
  const temp = useRef(null);
  // const [text, setText] = useState("");
  const [recording, setRecording] = useState(false);
  const [streamAudio, setStreamAudio] = useState(null);
  // const [clicked, setClicked] = useState(false);
  // const [voicePrompt, setVoicePrompt] = useState(""); // Voice prompt state
  const [show, setShow] = useState(false);
  const voiceText = useRef("");
  const road=useRef(false);
  const [audio1] = useState(new Audio("./sound/start.mp3"));
  const [audio2] = useState(new Audio("./sound/end.mp3"));
  const [version, setVersion] = useState(null);
  const scrollDiv = useRef(null);
  // const [promptDone, setPromptDone] = useState(false);
  const [start,setStart]=useState("Start");
  const promptArr = [
    "How Can I help You?",
    "What can I assist you with today?",
    "Is there anything specific you'd like me to do?",
    "How may I be of service?",
    "Tell me what you need, and I'll do my best to assist.",
    "In what way can I support you right now?"
  ];
  
  const randomIndex = Math.floor(Math.random() * promptArr.length);
  const prompt1 = promptArr[randomIndex];
  const intro =
    "Hello, I'm SightX, your trusted guide in the world of sightless navigation. I empower you with essential features for independence and confidence.";
  const [messages, setMessages] = useState([{ text: intro, user: "AI" }]);
  const {
    location,
    setLocation,
    stopVidRecording,
    apiResponse,
    setApiResponse,
    coordinates,
    getLocation,
    apiBody,
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

  const showDate = () => {
    console.log("Finding date");
    const currentDate = new Date();
    const day = currentDate.getDate();
    const monthIndex = currentDate.getMonth();
    const year = currentDate.getFullYear();

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Determine the appropriate suffix for the day (e.g., st, nd, rd, th)
    const getDaySuffix = (day) => {
      if (day >= 11 && day <= 13) {
        return "th";
      }
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    const formattedDate = `${day}${getDaySuffix(day)} ${
      months[monthIndex]
    } ${year}`;

    return formattedDate;
  };

  const showTime=()=>{
    const currentDate = new Date();
    const hr=currentDate.getHours();
    const min=currentDate.getMinutes();
    // const sec=currentDate.getSeconds();
    const formatedTime=`${hr}:${min}`;
    return formatedTime;
  };

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
    try {
      const audioStreamAudio = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      setStreamAudio(audioStreamAudio);
      setRecording(true);
      audio1.play();

      let SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      let recognition = new SpeechRecognition();
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        console.log("recording");
        const result = event.results[0][0];
        const transcript = result.transcript;
        const objUser = { text: transcript, user: "User" };
        setMessages((prevMessages) => [...prevMessages, objUser]);
        voiceText.current = transcript;
        console.log(transcript);
      };

      recognition.onend = () => {
        setRecording(false);
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
    temp.current=false;
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
    const weather=["weather","whether","climate","temperature","clymate","temp","humidity","clouds"];
    const time=["time","tyme"];
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
    const date=["date","ate"];
    for (let i = 0; i < weather.length; i++) {
      const item = weather[i];
      if (text.includes(item)) {
        setVersion("weather");
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: "Fetching the current weather",
            user: "AI",
          },
        ]);
        // speakPrompt("Entering Road Assist Mode.");
        // speakPrompt("Hold your camera upright");
        // speakPrompt("Let's embark on your journey");
        if (apiResponse) {
          setApiResponse("");
        }
        temp.current=true;
        break;
      }
    }

    for (let i = 0; i < date.length; i++) {
      const item = date[i];
      if (text.includes(item)) {
        setVersion("time");
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: "Fetching the today's date",
            user: "AI",
          },
        ]);
        const currDate=showDate();
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: `Today is ${currDate}`,
            user: "AI",
          },
        ]);
        speakPrompt(`Today is ${currDate}`);
        if (apiResponse) {
          setApiResponse("");
        }
        temp.current=true;
        break;
      }
    }

    for (let i = 0; i < time.length; i++) {
      const item = time[i];
      if (text.includes(item)) {
        setVersion("time");
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: "Fetching the current time",
            user: "AI",
          },
        ]);
        const currTime=showTime();
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: `Current time is ${currTime}`,
            user: "AI",
          },
        ]);
        speakPrompt(`Current time is ${currTime}`);
        if (apiResponse) {
          setApiResponse("");
        }
        temp.current=true;
        break;
      }
    }

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
        speakPrompt("Entering Road Assist Mode.");
        speakPrompt("Hold your camera upright");
        speakPrompt("Let's embark on your journey");
        if (apiResponse) {
          setApiResponse("");
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
        setVersion("faceRecognition");
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Entering Face Recognition mode.Face your camera towards the person.", user: "AI" },
        ]);
        speakPrompt("Entering Face Recognition mode.");
        speakPrompt("Face your camera towards the person.");
        if (apiResponse) {
          setApiResponse("");
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
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: `Sending an alert message to your nearest hospital`,
            user: "AI",
          },
        ]);
        speakPrompt(`Sending an alert message to your nearest hospital`);
        temp.current=true;
        break;
      }
    }

    for (let i = 0; i < currency.length; i++) {
      const item = currency[i];
      if (text.includes(item)) {
        setVersion("currency");
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Face your camera towards the note", user: "AI" },
        ]);
        speakPrompt("Face your camera towards the note");
        if (apiResponse) {
          setApiResponse("");
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
            text: "Hello, I'm SightX, your reliable companion in the world of sightless navigation. With a simple click of the button, I am here to empower you with a host of life-enhancing features.",
            user: "AI",
          },
        ]);
        await speakPrompt(
          "Hello, I'm SightX, your reliable companion in the world of sightless navigation. With a simple click of the button, I am here to empower you with a host of life-enhancing features."
        );
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: "As you step outside, I become your vigilant guide, alerting you to approaching vehicles, cyclists, and pedestrians. With clear, reassuring voice commands, I ensure your safe passage on the road.",
            user: "AI",
          },
        ]);
        await speakPrompt(
          "As you step outside, I become your vigilant guide, alerting you to approaching vehicles, cyclists, and pedestrians. With clear, reassuring voice commands, I ensure your safe passage on the road."
        );
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: "Need assistance with currency recognition? Just ask, and I'll swiftly scan and read aloud the values of your banknotes, making financial transactions a breeze.",
            user: "AI",
          },
        ]);
        await speakPrompt(
          "Need assistance with currency recognition? Just ask, and I'll swiftly scan and read aloud the values of your banknotes, making financial transactions a breeze."
        );
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: "Curious about your current whereabouts? At your command, I can provide you with your precise location, so you always know where you are.",
            user: "AI",
          },
        ]);
        await speakPrompt(
          "Curious about your current whereabouts? At your command, I can provide you with your precise location, so you always know where you are."
        );
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: "Recognizing familiar faces and names is my specialty. I'll help you identify your loved ones by reading their names aloud, fostering deeper connections.",
            user: "AI",
          },
        ]);
        await speakPrompt(
          "Recognizing familiar faces and names is my specialty. I'll help you identify your loved ones by reading their names aloud, fostering deeper connections."
        );
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: "In times of distress, a simple 'Help me' is all it takes. I'll immediately dispatch an SMS alert to the nearest hospital, sharing your exact coordinates and address, ensuring help arrives when you need it most.",
            user: "AI",
          },
        ]);
        await speakPrompt(
          "In times of distress, a simple 'Help me' is all it takes. I'll immediately dispatch an SMS alert to the nearest hospital, sharing your exact coordinates and address, ensuring help arrives when you need it most."
        );
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: "With SightX, your independence and confidence are just a voice command away.",
            user: "AI",
          },
        ]);
        await speakPrompt(
          "With SightX, your independence and confidence are just a voice command away."
        );
        temp.current=true;
        break;
      }
    }

    if (text.includes("stop")) {
      stopVidRecording();
      setVersion(null);
    }

    if (!temp.current) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "I can't understand",
          user: "AI",
        },
      ]);
      speakPrompt(
        "I can't understand",
        "Microsoft Mark - English (United States)"
      );
    }
  };

  const speakPrompt = (text) => {
    return new Promise((resolve) => {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = resolve;
      synth.speak(utterance);
    });
  };

  const handleClick = async () => {
    // setClicked(true);
    if(road.current){
      stopVidRecording();
      setVersion(null);
      setStart("Start");
      road.current=false;
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: `Road assist mode has ended`, user: "AI" },
      ]);
      speakPrompt("Road assist mode has ended");
    } else {
    setShow(true);
    // animateVoicePrompt(prompt1);
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: prompt1, user: "AI" },
    ]);
    await speakPrompt(prompt1);
    startRecording();
    setTimeout(() => {
      stopRecording();
      voiceNav(voiceText.current);
      console.log(version);
      // animateVoicePrompt(text);
    }, 4000);
  }
  };

  const handleLocationData = (data) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: `Your Current location is ${data}`, user: "AI" },
    ]);
    speakPrompt(`Your Current location is ${data}`);
  };

  const handleWeatherData = async (data) => {
    console.log("weather data",data);
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: `The temperature is ${Math.round(data["main"]["temp"] - 273)}°C`, user: "AI" },
    ]);
    await speakPrompt(`The temperature is ${Math.round(data["main"]["temp"] - 273)}°C`);
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: `The humidity is ${data["main"]["humidity"]}`, user: "AI" },
    ]);
    await speakPrompt(`The humidity is ${data["main"]["humidity"]}`);
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: `There is ${weatherData["clouds"]["all"]} chance of rain`, user: "AI" },
    ]);
    await speakPrompt(`There is ${weatherData["clouds"]["all"]} chance of rain`);
  };


  const handleFaceData = (data) => {
    const text = JSON.stringify(data);
    console.log(text.length);
    if (text.length > 4) {
      speakPrompt(`${data}`);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: `${data}`, user: "AI" },
      ]);
    } else {
      speakPrompt(`This person cannot be recognized.`);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: `This person cannot be recognized.`, user: "AI" },
      ]);
    }
    stopVidRecording();
    setVersion(null);
  };

  const handleYoloData = async (data) => {
    if (data.length > 2) {
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
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: `${data}`, user: "AI" },
      ]);
      speakPrompt(`${data}`);
    } else {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: `Please hold the note properly`, user: "AI" },
      ]);
      speakPrompt(`Please hold the note properly`);
    }
  };

  useEffect(() => {
    try {
      speakPrompt(intro);
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
        {version === "currency" ? (
          <Currency onDataReceived={handleCurrencyData} />
        ) : version === "roadAssist" ? (
          <CameraRecorder onDataReceived={handleYoloData} />
        ) : version === "location" ? (
          <div>
            <div id="gif">
            <video id="gifvd" autoPlay loop muted>
                <source src={vid} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <CurrentLocation onDataReceived={handleLocationData} />
          </div> ): version === "weather" ? (
          <div>
            <div id="gif">
            <video id="gifvd" autoPlay loop muted>
                <source src={vid} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <Weather onDataReceived={handleWeatherData} />
          </div>
          )
         : version === "faceRecognition" ? (
          <FaceRecognition onDataReceived={handleFaceData} />
        ) : (
          <div>
            <div id="gif">
            <video id="gifvd" autoPlay loop muted>
                <source src={vid} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        )}
        {/* heading */}
        {/* <div id="logo">
          <img src={logo} id="lg-img" alt="" />
        </div> */}
        {!show ? (
          <div ref={scrollDiv} className="conv" id="welcome">
            <h2>
              AI : <span>{intro}</span>
            </h2>
          </div>
        ) : (
          ({
            /* Conversetion section */
          },
          (
            <div ref={scrollDiv} className="conv">
              <Chat messages={messages} />
            </div>
          ))
        )}
        {/* Button */}
        <div className="hm-btn">
          <div id="hm-btn-s" onClick={handleClick}>
            Click Here to {start}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;