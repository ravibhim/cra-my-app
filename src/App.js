import { useState } from "react";

import './App.css';

function App() {
  const [activeWindowTrackerIntervalId, setActiveWindowTrackerIntervalId] = useState(null);
  const [permissionIntervalId, setPermissionIntervalId] = useState(null);

  const handleStartTracking = async () => {

/* Code to get accessibility permission and handle errors */
    try {
      const init_output = await window?.electronDW?.activeWindowWrapper();
			console.log(init_output);
    } catch (err) {
      console.log("Error in getting active window");
      console.log(err);
      // Permission request triggered.
      // Dont know how much time the user will take to grant permission. So checking frequently
      const intervalId = setInterval(async () => {
        const acc_perm = window?.electronDW?.getAuthStatus('accessibility');
        console.log(acc_perm);
        if(acc_perm === 'authorized') {
          console.log("Clearing Interval ID: " + permissionIntervalId);
          // Bug: permissionIntervalId is stale (null) - Stale Closure issue.
          clearInterval(permissionIntervalId);
        }
      }, 1000);
      console.log("Interval ID: " + intervalId);
      setPermissionIntervalId(intervalId);
    }


    const acc_perm = window?.electronDW?.getAuthStatus('accessibility');
    console.log(acc_perm);

/* CPU hogging block in Ravi Intel MBP */
    if(acc_perm === 'authorized') {
      const intervalId = setInterval(async () => {
        const output = await window?.electronDW?.activeWindowWrapper();
        console.log(output);
      }, 1000);
      setActiveWindowTrackerIntervalId(intervalId);
    } else {
      console.log("Accessibility permissions not given. Cannot track user activity.");
    }

    //window?.electronDW?.askAppleScriptChromeTab();

  };

  const handleStopTracking = () => {
    if (activeWindowTrackerIntervalId) {
      clearInterval(activeWindowTrackerIntervalId);
    }
  };

  return (
    <div className="App" style={{ height: "97vh" }}>
          <div>
            <p>Electron - Hello World</p>
            <button onClick={handleStartTracking}>Start tracking</button>
            <button onClick={handleStopTracking}>Stop tracking </button>
          </div>
    </div>
  );

}

export default App;
