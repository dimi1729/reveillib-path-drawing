import React, { useState, useEffect } from 'react';
import ImageComponent from './components/image_selector';
// import CPPCodeEditor from './components/codeblocks';

// Firebase Seperate File Test ==> NOT WORKING
// going to try making a context container for firebase and any other global state
// import FirestoreSeperateFileTest from './components/rtfb_test';

import Login from "./components/login.jsx";
import { firebaseManager } from "./configuration/firebase";

function App() {
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = firebaseManager.onAuthStateChange((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe(); // Cleanup subscription
  }, []);

  fetch('/api/test')
    .then(response => response.json())
    .then(data => setMessage(data.message));

return (
  <div>
    <ImageComponent />
    {/* <CPPCodeEditor /> */}

    {/* Account Info Box (Bottom-Left Corner) */}
      {user && (
        <div
          style={{
          position: "absolute",
          bottom: "20px",
          left: "20px",
          padding: "10px",
          backgroundColor: "#1e1e1e", // Slightly lighter dark background
          color: "#e0e0e0",
          borderRadius: "5px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
          maxWidth: "200px",
          textAlign: "center",
          }}
        >
          {user.photoURL && (
          <img
            src={user.photoURL}
            alt="Profile"
            style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            marginBottom: "10px",
            border: "2px solid #fff",
            }}
          />
          )}
          <p style={{ margin: "5px 0", fontSize: "14px" }}>
          Welcome, {user.displayName || user.email}
          </p>
          <button
          onClick={() => firebaseManager.logOut()} // Log out the user
          style={{
            padding: "5px 10px",
            backgroundColor: "#ff4d4d",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "12px",
          }}
          >
          Sign Out
          </button>
        </div>
        )}

      {/* Login Component */}
    {!user && <Login onSignIn={(user) => setUser(user)} />}
  </div>
);
}

export default App;
