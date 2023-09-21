import React from 'react';
import { useMyContext } from '../Context';

function Navbar(props) {
  const randomColor = () => {
    const {voiceNav}=useMyContext();
    const min = 100;
    const max = 255;
    const r = Math.floor(Math.random() * (max - min + 1)) + min;
    const g = Math.floor(Math.random() * (max - min + 1)) + min;
    const b = Math.floor(Math.random() * (max - min + 1)) + min;
    return `rgb(${r},${g},${b})`;
  };

  const hoverColor = randomColor();

  const handleClick = (operation) => {
    return () => {
      props.triggerFn(operation);
    };
  };

  return (
    <div>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500&display=swap');

          * {
            font-family: 'Orbitron', sans-serif;
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            list-style-type: none;
            font-weight: 400;
            transition-duration: .5s;
            color: black;
          }

          body {
            background-color: #222;
          }

          .logo {
            float: left;
            margin-left: 5%;
            line-height: 50px;
            font-size: 2em;
          }

          nav {
            border-radius: 0 0 50px 0;
            box-shadow: 0 0 25px 10px rgba(0, 0, 0, .4);
            overflow: hidden;
            border-bottom: 2px solid ${hoverColor};
            box-shadow: 0 0 20px rgba(${hoverColor}, .5);
          }

          {/* nav:hover {
            border-bottom: 2px solid ${hoverColor};
            box-shadow: 0 0 20px rgba(${hoverColor}, .5);
          } */}

          nav li a {
            color: ${hoverColor};
            text-shadow: 0 0 10px rgba(${hoverColor}, .8);
          }

          ul {
            text-align: center;
            height: 50px;
            background: linear-gradient(to top, rgba(255, 255, 255, .025), rgb(0, 0, 0, .4));
            display: flex; /* Use Flexbox to evenly space the list items */
            justify-content: space-between; /* Distribute items equally */
            align-items: center; /* Vertically center items */
            margin-left:30px;
            margin-right:30px;
            margin-bottom:20px;
          }

          li {
            display: inline-block;
          }

          li:not(:first-child) {
            padding: 0 2%;
          }

          li:hover a {
            position: relative;
            color: rgba(255, 255, 255, .9);
          }

          a {
            text-decoration: none;
            line-height: 50px;
            text-transform: uppercase;
            padding: 5px 15px;
          }

          /* Apply hover styles to all li elements */
          li:hover a,
          /* Apply hover styles to the "Home" link */
          li:first-child:hover a {
            border: 2px 2px solid ${hoverColor};
            background: rgba(${hoverColor}, .25);
            box-shadow: 0 0 5px 1px ${hoverColor};
            border-bottom: 5px solid ${hoverColor};
            color:${hoverColor} ;
            margin-left: 5px;
            margin-right: 5px;
          }
        `}
      </style>

      <nav>
        <ul>
          <li onClick={handleClick("home")}><a href="#">Home</a></li>
          <li onClick={handleClick("road")}><a href="#">Road Assist</a></li>
          <li onClick={handleClick("currency")}><a href="#">Currency</a></li>
          <li onClick={handleClick("location")}><a href="#">Location</a></li>
          <li onClick={handleClick("face")}><a href="#">Face</a></li>
          <li onClick={handleClick("ambulance")}><a href="#">Contact</a></li>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;