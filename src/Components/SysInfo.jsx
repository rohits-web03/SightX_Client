import React, { useState, useEffect } from 'react';
import platform from 'react-platform-js';

const SystemInfo = () => {
  const [systemInfo, setSystemInfo] = useState({
    os: '',
    osVersion:'',
    browser: '',
    browserVersion:'',
    deviceType: '',
    engine: '',
    engineVersion: '',
    cpu: '',
  });

  useEffect(() => {
    const updateSystemInfo = () => {
      setSystemInfo({
        os: platform.OS,
        osVersion:platform.OSVersion,
        browser: platform.Browser,
        browserVersion:platform.BrowserVersion,
        deviceType: platform.DeviceVendor,
        engine: platform.Engine,
        engineVersion: platform.EngineVersion,
        cpu: platform.CPU,
      });
    };

    updateSystemInfo();

    window.addEventListener('resize', updateSystemInfo);

    return () => {
      window.removeEventListener('resize', updateSystemInfo);
    };
  }, []);

  const borderAnimation = `
    border: 1px solid black;
    animation: border-animation 1s linear infinite;

    @keyframes border-animation {
      from {
        border-color: transparent;
      }
      to {
        border-color: black;
      }
    }
  `;
  return (
    <div style={{
        display:'flex',
        justifyContent:'flex-end',
        alignItems:'center',
        height:'100%',
    }}>
    <div
      style={{
        width: '20%',
        height: '60%',
        backgroundColor: 'black',
        border: '1px solid white',
        borderRadius: '5px',
        padding: '10px',
        textAlign: 'left',
        animation: borderAnimation,
        
      }}
    >
      <h3 style={{color:'white',display:'block'}}>System Information</h3>
      <ul style={{
        display:'flex',
        flexDirection:'column',
        height:'100%'
      }}>
        <li  style={{color:'white'}}>
          OS: {systemInfo.os} ({systemInfo.osVersion})
        </li>
        <li style={{color:'white'}}>Browser: {systemInfo.browser} ({systemInfo.browserVersion})</li>
        <li style={{color:'white'}}>Engine: {systemInfo.engine} ({systemInfo.engineVersion})</li>
        <li style={{color:'white'}}>CPU: {systemInfo.cpu}</li>
      </ul>
    </div>
    </div>
  );
};

export default SystemInfo;
