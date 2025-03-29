import React, { useState } from "react";
import { firebaseManager } from "../configuration/firebase";

function Login({ onSignIn }) {
  console.log("Login component rendered"); // Debugging line
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle unified sign-in/sign-up
  const handleSignInOrSignUp = async (e) => {
    e.preventDefault();
    console.log("Sign In/Sign Up button clicked");
    console.log("Email:", email);
    console.log("Password:", password);
    try {
      await firebaseManager.signInOrSignUp(email, password);
      const user = firebaseManager.auth.currentUser; // Access currentUser via firebaseManager
      console.log("Sign In/Sign Up successful, user:", user);
      onSignIn(user); // Notify parent component of successful sign-in
    } catch (error) {
      console.error("Error during Sign In/Sign Up:", error.message);
      alert(error.message);
    }
  };

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    console.log("Google Sign In button clicked");
    try {
      await firebaseManager.signInWithGoogle();
      const user = firebaseManager.auth.currentUser; // Access currentUser via firebaseManager
      console.log("Google Sign In successful, user:", user);
      onSignIn(user); // Notify parent component of successful sign-in
    } catch (error) {
      console.error("Error during Google Sign In:", error.message);
      alert(error.message);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        padding: "20px",
        backgroundColor: "#1e1e1e", // Dark background
        color: "#e0e0e0", // Light text color
        borderRadius: "10px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
        minWidth: "300px",
        maxWidth: "400px",
        width: "auto",
        textAlign: "center",
        boxSizing: "border-box",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>Sign In / Sign Up</h2>
      <form onSubmit={handleSignInOrSignUp}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            console.log("Email input changed:", e.target.value);
            setEmail(e.target.value);
          }}
          required
          style={{
            padding: "10px",
            width: "100%",
            marginBottom: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            backgroundColor: "#333", // Dark input background
            color: "#e0e0e0", // Light input text
            boxSizing: "border-box",
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            console.log("Password input changed:", e.target.value);
            setPassword(e.target.value);
          }}
          required
          style={{
            padding: "10px",
            width: "100%",
            marginBottom: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            backgroundColor: "#333", // Dark input background
            color: "#e0e0e0", // Light input text
            boxSizing: "border-box",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          Sign In / Sign Up
        </button>
      </form>

      <button
        onClick={handleGoogleSignIn}
        style={{
          marginTop: "10px",
          padding: "10px",
          backgroundColor: "#4285f4",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          width: "100%",
        }}
      >
        Sign In with Google
      </button>
      </div>
    );
}

export default Login;