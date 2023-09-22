import React, { useEffect, useState } from 'react'
import { useMyContext } from '../Context';

export default function Weather(props) {
    const [weatherData,setWeatherData]=useState(null);
    const {getLocation,apiBody,location}=useMyContext();
    const styles={
        color:'white',
        display:'flex',
        flexDirection:'column',
        gap:'10px'
    };
    const sendData=()=>{
        // console.log("Location:",location);
        if(weatherData){
        props.onDataReceived(weatherData);
        }
      }
    const fetchWeather = async () => {
        try {
          await getLocation();
    
          console.log("Weather: ", apiBody.current);
    
          if (apiBody) {
            let latitude = apiBody.current.lat + " ";
            latitude=latitude.trim();
            let longitude = apiBody.current.long + " ";
            longitude=longitude.trim();
            const response = await fetch("http://127.0.0.1:8000/weather", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ latitude, longitude}),
            });
    
            const data = await response.json();
            console.log(JSON.stringify(data));
            setWeatherData(data);
          } else {
            console.error("Location is null.");
          }
        } catch (error) {
          console.error("Error:", error);
        }
      };

      useEffect(()=>{
        // getLocation();
        // while (!location) {
        //   getLocation();
        // }
        fetchWeather();
        if(location && weatherData){
            sendData();
        }
      },[])
  return (
    <>
    {/* <div style={{       
        color:'white',
        display:'flex',
        flexDirection:'column',
        gap:'10px',
        marginTop:'20px'}} >
        <h3 style={{color:'white'}}>Weather</h3>
        {!weatherData?
        <p style={{color:'white'}}>Fetching Weather Data</p>:
        <div style={styles}>
            <p style={{ color: 'white' }}>Temperature: {Math.round(weatherData["main"]["temp"] - 273)}°C</p>
            <p style={{color:'white'}}>Humidity:{weatherData["main"]["humidity"]}</p>
            <p style={{color:'white'}}>{weatherData["clouds"]["all"]}% chance of Rain</p>
        </div>}
    </div> */}
    </>
  )
}
